import { XIcon } from '@heroicons/react/outline';
import Pica from 'pica';
import { useRef, useState } from 'react';

import { Button, DragDropBox } from '$src/frontend/components/ui';
import formatBytes from '$src/utils/format-bytes';

type SelectedImage = {
  name: string;
  blobUrl: string;
  width: number;
  height: number;
  size: number;
  file: File;
};

function calcSize({ width, height }: { width: number; height: number }) {
  if (width < height) {
    return { width: (720 * width) / height, height: 720 };
  }

  return { width: 720, height: (720 * height) / width };
}

export default function IndexPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const downloadButtonRef = useRef<HTMLAnchorElement>(null);

  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);

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
        .resize(image, canvasRef.current, {})
        .then((elem) => pica.toBlob(elem, 'image/png', 2))
        .then((blob) => {
          if (downloadButtonRef.current) {
            const convertedBlobUrl = URL.createObjectURL(blob);
            downloadButtonRef.current.href = convertedBlobUrl;
            downloadButtonRef.current.download = `converted_${selectedImage.name}`;

            downloadButtonRef.current.click();
            URL.revokeObjectURL(convertedBlobUrl);
          }
        });
    };
    image.src = selectedImage.blobUrl;
  };

  return (
    <div className="px-4 py-6 max-w-screen-lg mx-auto">
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
                className="hidden group-hover:block absolute -top-1 -right-1 bg-gray-100 border shadow-lg rounded-full"
                onClick={() => setSelectedImage(null)}
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
              <Button
                className="hidden lg:block mt-6"
                full
                color="white"
                onClick={() => setSelectedImage(null)}
              >
                Clear
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <Button color="blue" onClick={handleClickDownload}>
              Download
            </Button>
            <a ref={downloadButtonRef} className="hidden" />
          </div>

          <canvas ref={canvasRef} className="hidden" {...calcSize(selectedImage)} />
        </div>
      )}
    </div>
  );
}
