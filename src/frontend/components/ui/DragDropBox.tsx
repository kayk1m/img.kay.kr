import clsx from 'clsx';
import { DragEvent, useState } from 'react';

import { ApiError } from '$src/defines/errors';
import { Loading } from '$src/frontend/components/core';
import { useId } from '$src/frontend/hooks/use-id';
import { useNoti } from '$src/frontend/hooks/use-noti';
import type { MaybePromise } from '$src/types';

const VALID_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];

interface Props {
  className?: string;
  onFileSelect: (file: File) => MaybePromise<void>;
  onError?: (error: Error) => MaybePromise<void>;
  loading?: boolean;
}

export default function DragDropBox({ className, onFileSelect, onError, loading }: Props) {
  const [hoverFlag, setHoverFlag] = useState(false);

  const { showAlert, showNoti } = useNoti();

  const id = `drag-drop-${useId()}`;

  const handleFile = (file: File) => {
    if (loading) return;
    if (!VALID_FILE_TYPES.includes(file.type)) {
      if (onError) return onError(new Error(`Invalid file type: ${file.type ?? 'Unknown'}`));
      return showNoti({ variant: 'alert', title: `Invalid file type: ${file.type ?? 'Unknown'}` });
    }

    onFileSelect(file);
  };

  const handlers = {
    onDragOver: (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
      setHoverFlag(true);
    },
    onDragLeave: (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (e.target !== e.currentTarget) return;
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
      setHoverFlag(false);
    },
    onDrop: (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (loading) return;
      if (e.target !== e.currentTarget) return;

      try {
        const droppedFile = e.dataTransfer.files[0];

        handleFile(droppedFile);
      } catch (err) {
        if (ApiError.isApiError(err)) {
          if (onError) onError(err);
          else showAlert(err);
        }

        console.error(JSON.stringify(err));
      } finally {
        setHoverFlag(false);
      }
    },
  };

  return (
    <div
      className={clsx(
        className,
        'flex justify-center items-center px-6 py-3 h-36 border-2 border-dashed rounded-md transition-colors',
        hoverFlag ? 'border-gray-500' : 'border-gray-300',
      )}
      {...handlers}
    >
      {loading ? (
        <Loading />
      ) : hoverFlag ? (
        <p className="font-medium text-gray-700 pointer-events-none">drop a file here</p>
      ) : (
        <div className="space-y-1 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor={id}
              className="relative cursor-pointer rounded-md font-medium text-blue-800 hover:text-blue-600 focus-within:outline-none"
            >
              <span>Choose an image</span>
              <input
                id={id}
                name="file-upload"
                type="file"
                className="sr-only"
                accept=".jpg, .jpeg, .png .webp"
                disabled={loading}
                onChange={(e) => {
                  if (!e.target.files || !e.target.files[0]) return;
                  handleFile(e.target.files[0]);
                }}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, JPEG, WEBP in any size</p>
        </div>
      )}
    </div>
  );
}
