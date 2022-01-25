import { XIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import { useState } from 'react';
import Cropper from 'react-easy-crop';

import { SizeInputGroup } from '$src/frontend/components/custom';
import {
  Button,
  DragDropBox,
  Fade,
  ResponsiveTabs,
  Tabs,
  Toggle,
} from '$src/frontend/components/ui';
import { useNoti } from '$src/frontend/hooks/use-noti';
import formatBytes from '$src/utils/format-bytes';
import {
  getCroppedCanvas,
  canvasToObjectURL,
  createImage,
  downloadImage,
  resizeImage,
} from '$src/utils/image';

const resolutions = [
  { label: '360p', value: 360 },
  { label: '480p', value: 480 },
  { label: '720p', value: 720 },
  { label: '1080p', value: 1080 },
  { label: '1440p', value: 1440 },
] as const;

const qualities = [
  { label: 'low', value: 0.3 },
  { label: 'normal', value: 0.5 },
  { label: 'high', value: 0.7 },
  // { label: 'max', value: 1 },
] as const;

const extensions = [
  { label: 'webp', value: 'webp' },
  { label: 'jpeg', value: 'jpeg' },
  { label: 'png', value: 'png' },
] as const;

type Resolution = typeof resolutions[number]['value'];
type Quality = typeof qualities[number]['value'];
type Extension = typeof extensions[number]['value'];

function calcSize({
  resolution,
  width,
  height,
}: {
  resolution: number;
  width: number;
  height: number;
}) {
  if (width > height) {
    return { width: (resolution * width) / height, height: resolution };
  }

  return { width: resolution, height: (resolution * height) / width };
}

function buildFilename(
  name: string,
  options: {
    custom?: { width: number; height: number };
    resolution: Resolution;
    quality: Quality;
    extension: Extension;
  },
) {
  const { custom, resolution, quality, extension } = options;
  const isLossy = extension !== 'png';

  const nameWithoutExt = name.includes('.') ? name.split('.').slice(0, -1).join('.') : name;
  const qualityLevel = qualities.find(({ value }) => value === quality)!.label;

  return (
    [
      nameWithoutExt,
      custom ? `${custom.width.toFixed(0)}x${custom.height.toFixed(0)}` : `${resolution}p`,
      isLossy && qualityLevel,
    ]
      .filter((value) => !!value)
      .join('-') + `.${extension}`
  );
}

type SelectedImage = {
  name: string;
  blobUrl: string;
  width: number;
  height: number;
  size: number;
  file: File;
  image: HTMLImageElement;
};

export default function IndexPage() {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);
  const [resolution, setResolution] = useState<Resolution>(720);
  const [quality, setQuality] = useState<Quality>(0.5);
  const [extension, setExtension] = useState<Extension>('jpeg');
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [customResolution, setCustomResolution] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [customResolutionFlag, setCustomResolutionFlag] = useState(false);

  // states for `react-easy-cropper`
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  // const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [cropSize, setCropSize] = useState({ width: 720, height: 720 });
  const [croppedCanvas, setCroppedCanvas] = useState<HTMLCanvasElement | null>(null);

  // notifications
  const { showAlert } = useNoti();

  const resTabs = selectedImage
    ? resolutions.filter(
        ({ value }) => value <= Math.min(selectedImage.width, selectedImage.height),
      )
    : [];

  const initialize = () => {
    setLoading(false);
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage.blobUrl);
      setSelectedImage(null);
    }
    setAspectRatio(null);
    setCustomResolution(null);
    setCustomResolutionFlag(false);
    setCrop({ x: 0, y: 0 });
    // setRotation(0);
    setZoom(1);
    setCropSize({ width: 720, height: 720 });
    if (croppedCanvas) croppedCanvas.remove();
    setCroppedCanvas(null);
  };

  const handleFileSelect = (file: File) => {
    setLoading(true);
    const blobUrl = URL.createObjectURL(file);

    createImage(blobUrl)
      .then((image) => {
        setSelectedImage({
          name: file.name,
          blobUrl,
          width: image.naturalWidth,
          height: image.naturalHeight,
          size: file.size,
          file,
          image,
        });
        setCustomResolution(
          calcSize({ resolution, width: image.naturalWidth, height: image.naturalHeight }),
        );
      })
      .catch(showAlert)
      .finally(() => setLoading(false));
  };

  const handleClickDownload = () => {
    if (!selectedImage) return;

    const inputElem = aspectRatio !== null && croppedCanvas ? croppedCanvas : selectedImage.image;
    const targetSize =
      aspectRatio !== null
        ? cropSize
        : customResolutionFlag && customResolution
        ? customResolution
        : calcSize({ ...selectedImage, resolution });

    const targetFilename = buildFilename('created-by-img.kay.kr', {
      custom:
        aspectRatio !== null
          ? cropSize
          : customResolutionFlag && customResolution
          ? customResolution
          : undefined,
      resolution,
      quality,
      extension,
    });

    resizeImage(inputElem, targetSize)
      .then((canvas) => canvasToObjectURL(canvas, { mimeType: `image/${extension}`, quality }))
      .then((blobUrl) => {
        downloadImage(blobUrl, targetFilename);

        URL.revokeObjectURL(blobUrl);
      })
      .catch(showAlert);
  };

  const handleCropSize = (size: number) => {
    if (!aspectRatio) return;

    const longSide = aspectRatio > 1 ? size * aspectRatio : size / aspectRatio;

    if (aspectRatio > 1) {
      setCropSize({ width: longSide, height: size });
    } else {
      setCropSize({ width: size, height: longSide });
    }
  };

  return (
    <div className="px-4 py-6 max-w-screen-sm mx-auto">
      <h1 className="text-center font-bold font-mono text-2xl">Kay&apos;s Image Resizer</h1>
      {!selectedImage ? (
        <DragDropBox className="mt-4 " onFileSelect={handleFileSelect} loading={loading} />
      ) : (
        <div className="mt-4">
          <div className="lg:grid grid-cols-2 gap-4">
            <div className="relative group">
              <img
                className="rounded-lg shadow-lg w-full h-auto"
                alt={selectedImage.name}
                src={selectedImage.blobUrl}
                width={selectedImage.width}
                height={selectedImage.height}
                draggable={false}
              />
              <button
                className="lg:hidden lg:group-hover:block absolute -top-1 -right-1 bg-gray-100 border shadow-lg rounded-full"
                onClick={initialize}
              >
                <XIcon className="text-gray-700 w-6 h-6" />
              </button>
            </div>
            <div className="mt-4 lg:mt-0 text-sm lg:flex flex-col lg:justify-end">
              <p className="text-gray-600">{selectedImage.name}</p>
              <p className="mt-2">
                {selectedImage.width} x {selectedImage.height} px
              </p>
              <p>{formatBytes(selectedImage.size)}</p>
              <Button className="hidden lg:block mt-6" full color="white" onClick={initialize}>
                Clear
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <Toggle
              label="Custom Aspect Ratio (Crop)"
              description="You can custom your desired aspect ratio by enabling this option."
              enabled={aspectRatio !== null}
              onChange={(enabled) => {
                if (enabled) setAspectRatio(1);
                else setAspectRatio(null);
              }}
            />

            <Fade show={aspectRatio !== null} className="mt-4">
              <Tabs
                tabs={[
                  { label: '1 / 1', value: 1 },
                  { label: '4 / 3', value: 4 / 3 },
                  { label: '3 / 4', value: 3 / 4 },
                ]}
                state={aspectRatio}
                setState={(aspect) => {
                  setAspectRatio(aspect);
                  if (aspect) {
                    setCropSize({ width: 720 * aspect, height: 720 });
                  } else {
                    setCropSize({ width: 720, height: 720 });
                  }
                }}
              />
              <div className="mt-4 relative w-full h-96">
                <Cropper
                  image={selectedImage.blobUrl}
                  crop={crop}
                  // rotation={rotation}
                  zoom={zoom}
                  onCropChange={setCrop}
                  // onRotationChange={setRotation}
                  onZoomChange={setZoom}
                  aspect={aspectRatio ?? undefined}
                  onCropComplete={(_croppedArea, croppedAreaPixels) => {
                    const canvas = getCroppedCanvas(selectedImage.image, croppedAreaPixels);

                    setCroppedCanvas(canvas);
                  }}
                />
              </div>
            </Fade>

            {/* Resolutions */}
            <div className="mt-4">
              {aspectRatio === null ? (
                <>
                  <div className="flex items-end justify-between">
                    <label>Resolution</label>

                    <Toggle
                      className="space-x-2"
                      label="Custom"
                      enabled={customResolutionFlag}
                      onChange={setCustomResolutionFlag}
                    />
                  </div>
                  <ResponsiveTabs
                    className="mt-2"
                    tabs={resTabs}
                    state={resolution}
                    setState={(resolution) => {
                      setResolution(resolution);
                      setCustomResolution(calcSize({ resolution, ...selectedImage }));
                    }}
                    disabled={customResolutionFlag}
                  />
                  {customResolution && (
                    <Fade show={customResolutionFlag} className="mt-4">
                      <SizeInputGroup
                        size={customResolution}
                        onChange={setCustomResolution}
                        aspect={selectedImage.width / selectedImage.height}
                      />
                    </Fade>
                  )}
                </>
              ) : (
                <>
                  <div className="flex flex-wrap space-x-2">
                    {resTabs.map(({ label, value }) => (
                      <Button
                        className="inline-flex"
                        key={label}
                        color="white"
                        size="sm"
                        onClick={() => handleCropSize(value)}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                  <SizeInputGroup
                    className="mt-2"
                    size={cropSize}
                    onChange={setCropSize}
                    aspect={aspectRatio}
                  />
                </>
              )}
            </div>
          </div>

          <div className="mt-6">
            <div className="space-y-4">
              {/* Extensions */}
              <div>
                <label>Format (Extension)</label>
                <Tabs
                  className="mt-2"
                  tabs={extensions}
                  state={extension}
                  setState={setExtension}
                />
              </div>

              {/* Qualities */}
              <div className={clsx({ hidden: extension === 'png' })}>
                <label>Quality</label>
                <Tabs className="mt-2" tabs={qualities} state={quality} setState={setQuality} />
              </div>
            </div>

            {/* Download Button */}
            <div className="mt-4">
              <Button color="blue" onClick={handleClickDownload}>
                Download
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
