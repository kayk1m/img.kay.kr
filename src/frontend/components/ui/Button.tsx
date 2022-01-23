import clsx from 'clsx';

import type { Props, __ } from '@src/types';
import { forwardRefWithAs } from '@src/utils/forward-ref-with-as';

import type { ElementType, Ref } from 'react';

const DEFAULT_BUTTON_TAG = 'button' as const;

const colorClasses = {
  blue: 'bg-blue-400 hover:bg-blue-500 border-transparent',
  red: 'bg-red-400 hover:bg-red-500 focus-visible:ring-red-500 border-transparent',
  white: 'bg-white hover:bg-gray-50 border-gray-300',
};

interface OurButtonProps {
  color?: keyof typeof colorClasses;
  full?: boolean;
  size?: 'sm' | 'base' | 'lg';
}

type ButtonPropsWeControl = __;

const ButtonWithRef = forwardRefWithAs(function Button<
  TTag extends ElementType = typeof DEFAULT_BUTTON_TAG,
>(props: Props<TTag, ButtonPropsWeControl> & OurButtonProps, ref: Ref<HTMLButtonElement>) {
  const {
    color = 'blue',
    full = false,
    size = 'base',
    className,
    as: Component = DEFAULT_BUTTON_TAG,
    children,
    ...rest
  } = props;

  const propsWeControl = { ref };
  const passthroughProps = rest;

  return (
    <Component
      className={clsx(
        className,
        'px-4 py-2 inline-flex items-center border shadow-sm rounded-md font-semibold',
        {
          'text-sm': size === 'sm',
          'text-base': size === 'base',
          'text-lg': size === 'lg',
          'justify-center w-full px-1.5 py-2': full,
        },
        colorClasses[color],
        {
          'text-white disabled:text-gray-50 disabled:bg-gray-400 disabled:opacity-70 disabled:cursor-default':
            color !== 'white',
        },
      )}
      {...passthroughProps}
      {...propsWeControl}
    >
      {children}
    </Component>
  );
});

export default ButtonWithRef;
