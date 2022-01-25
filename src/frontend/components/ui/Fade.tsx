import { Transition } from '@headlessui/react';

import type { ReactNode } from 'react';

interface Props {
  className?: string;
  children: ReactNode;
  show: boolean;
  appear?: boolean;
}

export default function Fade({ className, children, show, appear }: Props) {
  return (
    <Transition
      show={show}
      appear={appear}
      className={className}
      enter="transition-opacity ease-out duration-200"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity ease-out duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      {children}
    </Transition>
  );
}
