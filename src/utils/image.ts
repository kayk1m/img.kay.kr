import Pica, { PicaResizeOptions } from 'pica';

import { isBrowser } from './env';

import type { Area } from 'react-easy-crop/types';

export function createImage(src: string): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = src;
  });
}

export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(
  width: number,
  height: number,
  rotation: number,
): { width: number; height: number } {
  const rotRad = degToRad(rotation);

  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

export function getCroppedCanvas(
  image: HTMLImageElement,
  pixelCrop: Area,
  rotation = 0,
  flip = { horizontal: false, vertical: false },
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Check Browser');

  const rotRad = degToRad(rotation);

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(image.width, image.height, rotation);

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // draw rotated image
  ctx.drawImage(image, 0, 0);

  // croppedAreaPixels values are bounding box relative
  // extract the cropped image using these values
  const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // paste generated rotate image at the top left corner
  ctx.putImageData(data, 0, 0);

  // As a canvas
  return canvas;
}

type CanvasToObjectURLOption = {
  mimeType?: 'image/webp' | 'image/jpeg' | 'image/png';
  quality?: number;
};
export async function canvasToObjectURL(
  canvas: HTMLCanvasElement,
  options?: CanvasToObjectURLOption,
): Promise<string> {
  const mimeType = options?.mimeType ?? 'image/jpeg';
  const quality = options?.quality ?? 0.7;

  const pica = Pica();

  const blob = await pica.toBlob(canvas, mimeType, quality);

  return URL.createObjectURL(blob);
}

type ResizeImageOption = {
  width: number;
  height: number;
} & Omit<PicaResizeOptions, 'quality'>;
export async function resizeImage(
  inputElem: HTMLImageElement | HTMLCanvasElement,
  options: ResizeImageOption,
): Promise<HTMLCanvasElement> {
  const { width, height } = options;

  const pica = Pica();

  const canvas = document.createElement('canvas');

  canvas.width = width;
  canvas.height = height;

  return pica.resize(inputElem, canvas);
}

export function downloadImage(src: string, filename: string): void {
  if (!isBrowser()) {
    return console.error('Ensure you are trying to download within a browser.');
  }

  const downloadButton = document.createElement('a');
  downloadButton.href = src;
  downloadButton.download = filename;
  downloadButton.click();

  downloadButton.remove();
}
