import { XIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import Pica from 'pica';
import { useRef, useState } from 'react';

import { Button, DragDropBox, ResponsiveTabs } from '$src/frontend/components/ui';
import formatBytes from '$src/utils/format-bytes';

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
  { label: 'max', value: 1 },
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
  options: { resolution: Resolution; quality: Quality; extension: Extension },
) {
  const { resolution, quality, extension } = options;
  const isLossy = extension !== 'png';

  const nameWithoutExt = name.includes('.') ? name.split('.').slice(0, -1).join('.') : name;
  const qualityLevel = qualities.find(({ value }) => value === quality)!.label;

  return (
    [nameWithoutExt, `${resolution}p`, isLossy && qualityLevel]
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
};

export default function IndexPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const downloadButtonRef = useRef<HTMLAnchorElement>(null);

  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);
  const [resolution, setResolution] = useState<Resolution>(720);
  const [quality, setQuality] = useState<Quality>(0.7);
  const [extension, setExtension] = useState<Extension>('jpeg');

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
    setResolution(720);
  };

  const handleFileSelect = (file: File) => {
    setLoading(true);
    const blobUrl = URL.createObjectURL(file);

    const image = new Image();
    image.onload = () => {
      setSelectedImage({
        name: file.name,
        blobUrl,
        width: image.naturalWidth,
        height: image.naturalHeight,
        size: file.size,
        file,
      });
      setLoading(false);
    };
    image.src = blobUrl;
  };

  const handleClickDownload = () => {
    if (!selectedImage) return;

    const image = new Image();
    image.onload = () => {
      if (!canvasRef.current) return;

      const pica = Pica();
      pica
        .resize(image, canvasRef.current)
        .then((elem) => pica.toBlob(elem, `image/${extension}`, quality))
        .then((blob) => {
          if (downloadButtonRef.current) {
            const convertedBlobUrl = URL.createObjectURL(blob);
            downloadButtonRef.current.href = convertedBlobUrl;
            downloadButtonRef.current.download = buildFilename(selectedImage.name, {
              resolution,
              quality,
              extension,
            });

            downloadButtonRef.current.click();
            URL.revokeObjectURL(convertedBlobUrl);
          }
        });
    };
    image.src = selectedImage.blobUrl;
  };

  return (
    <div className="px-4 py-6 max-w-screen-sm mx-auto">
      <h1 className="text-center font-bold font-mono text-2xl">Kay&apos;s Image Converter</h1>
      {!selectedImage ? (
        <DragDropBox
          className="mt-4 "
          onFileSelect={(file) => {
            handleFileSelect(file);
          }}
          loading={loading}
        />
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
            <div className="space-y-4">
              {/* Resolutions */}
              <div>
                <label>Resolution</label>
                <ResponsiveTabs
                  className="mt-2"
                  tabs={resTabs}
                  state={resolution}
                  setState={setResolution}
                />
              </div>

              {/* Extensions */}
              <div>
                <label>Format (Extension)</label>
                <ResponsiveTabs
                  className="mt-2"
                  tabs={extensions}
                  state={extension}
                  setState={setExtension}
                />
              </div>

              {/* Qualities */}
              <div>
                <label>Quality</label>
                <ResponsiveTabs
                  className={clsx('mt-2', { hidden: extension === 'png' })}
                  tabs={qualities}
                  state={quality}
                  setState={setQuality}
                />
              </div>
            </div>

            {/* Download Button */}
            <div className="mt-4">
              <Button color="blue" onClick={handleClickDownload}>
                Download
              </Button>
              <a ref={downloadButtonRef} className="hidden" />
            </div>
          </div>

          <canvas
            ref={canvasRef}
            className="hidden"
            {...calcSize({ ...selectedImage, resolution })}
          />
        </div>
      )}
    </div>
  );
}
