import { Dialog, Transition } from '@headlessui/react';
import { CheckIcon, ExclamationIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import { Fragment, useRef } from 'react';

export interface ModalProps {
  show: boolean;
  variant?: 'default' | 'alert';
  title: string;
  content: string;
  close: () => void;
  cancelButton?: {
    label: string;
    onClick?: () => void | Promise<void>;
  };
  actionButton: {
    label: string;
    onClick: () => void | Promise<void>;
  };
}

export default function Modal({
  show,
  variant = 'default',
  title,
  content,
  close,
  cancelButton = { label: 'Cancel' },
  actionButton,
}: ModalProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        open={show}
        onClose={() => {}}
      >
        <div className="flex items-center justify-center min-h-screen pt-32 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div
                className={clsx({
                  'sm:flex sm:items-start': variant === 'alert',
                })}
              >
                <div
                  className={clsx(
                    'mx-auto flex items-center justify-center h-12 w-12 rounded-full',
                    {
                      'bg-green-100': variant === 'default',
                      'flex-shrink-0 bg-red-100 sm:mx-0 sm:h-10 sm:w-10': variant === 'alert',
                    },
                  )}
                >
                  {/* <!-- Heroicon name: outline/check --> */}
                  {variant === 'default' && <CheckIcon className="h-6 w-6 text-green-600" />}
                  {variant === 'alert' && <ExclamationIcon className="h-6 w-6 text-red-600" />}
                </div>
                <div
                  className={clsx('mt-3 text-center', {
                    'sm:mt-5': variant === 'default',
                    'sm:mt-0 sm:ml-4 sm:text-left': variant === 'alert',
                  })}
                >
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                    {title}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{content}</p>
                  </div>
                </div>
              </div>
              <div
                className={clsx('mt-5', {
                  'sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense':
                    variant === 'default',
                  'sm:mt-4 sm:flex sm:flex-row-reverse': variant === 'alert',
                })}
              >
                <button
                  type="button"
                  className={clsx(
                    'w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:text-sm',
                    {
                      'bg-blue-400 hover:bg-lightBlue-500 sm:col-start-2': variant === 'default',
                      'bg-red-600 hover:bg-red-700 focus-visible:ring-red-500 sm:ml-3 sm:w-auto':
                        variant === 'alert',
                    },
                  )}
                  onClick={async () => {
                    await actionButton.onClick();
                    close();
                  }}
                >
                  {actionButton.label}
                </button>
                {cancelButton && (
                  <button
                    type="button"
                    className={clsx(
                      'mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:text-sm',
                      {
                        'sm:col-start-1': variant === 'default',
                        'sm:w-auto': variant === 'alert',
                      },
                    )}
                    onClick={async () => {
                      if (cancelButton?.onClick) await cancelButton.onClick();
                      close();
                    }}
                  >
                    {cancelButton.label}
                  </button>
                )}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
