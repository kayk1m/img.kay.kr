import clsx from 'clsx';

import { useId } from '$src/frontend/hooks/use-id';
import type { MaybePromise } from '$src/types';

type PxSize = {
  width: number;
  height: number;
};

interface Props {
  className?: string;
  size: PxSize;
  onChange: (newSize: PxSize) => MaybePromise<void>;
  aspect?: number;
}

export default function SizeInputGroup({ className, size, onChange, aspect }: Props) {
  const idSuffix = useId();

  const aspectRatio = aspect ?? size.width / size.height;

  return (
    <div className={clsx(className, 'flex items-center space-x-4')}>
      <div>
        <label htmlFor={`width-${idSuffix}`} className="sr-only">
          Width
        </label>
        <input
          type="number"
          name="width"
          id={`width-${idSuffix}`}
          className="shadow-sm block w-24 sm:text-sm border-gray-300 rounded-md"
          value={size.width.toFixed(0).toString()}
          onChange={(e) => {
            const newWidth = Number(e.target.value);
            const newHeight = newWidth / aspectRatio;

            onChange({ width: newWidth, height: newHeight });
          }}
        />
      </div>
      <span aria-hidden className="text-sm font-medium text-gray-500">
        X
      </span>
      <div>
        <label htmlFor="height" className="sr-only">
          Height
        </label>
        <input
          type="number"
          name="height"
          id="height"
          className="shadow-sm block w-24 sm:text-sm border-gray-300 rounded-md"
          value={size.height.toFixed(0).toString()}
          onChange={(e) => {
            const newHeight = Number(e.target.value);
            const newWidth = newHeight * aspectRatio;

            onChange({ width: newWidth, height: newHeight });
          }}
        />
      </div>
    </div>
  );
}
