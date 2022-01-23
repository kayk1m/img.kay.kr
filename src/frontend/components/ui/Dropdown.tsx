import { Menu, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { Fragment, ReactNode } from 'react';

interface DropdownItem {
  icon?: ReactNode;
  label: string;
  onClick: () => void;
}

interface DropdownProps {
  button: ReactNode;
  dropdownItems: DropdownItem[];
}

export default function Dropdown({ button, dropdownItems }: DropdownProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <>
          <div>
            <Menu.Button className="rounded-md">{button}</Menu.Button>
          </div>
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Menu.Items
              static
              className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-10"
            >
              {dropdownItems.map(({ icon, label, onClick }, idx) => (
                <Menu.Item key={`dropdownItem-${idx}-${label}`}>
                  {({ active }) => (
                    <button
                      className={clsx(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'w-full flex items-center px-4 py-2 text-sm',
                      )}
                      onClick={onClick}
                    >
                      {icon}
                      <span className={clsx({ 'ml-3': icon !== undefined })}>{label}</span>
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}
