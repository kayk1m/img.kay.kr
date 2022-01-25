import { Switch } from '@headlessui/react';
import clsx from 'clsx';

import type { MaybePromise } from '$src/types';

interface Props {
  className?: string;
  label: string;
  description?: string;
  enabled: boolean;
  onChange: (enabled: boolean) => MaybePromise<void>;
}
export default function Toggle({ className, label, description, enabled, onChange }: Props) {
  return (
    <Switch.Group as="div" className={clsx(className, 'flex items-center justify-between')}>
      <span className="flex-grow flex flex-col">
        {label && (
          <Switch.Label as="span" className="text-sm font-medium text-gray-900" passive>
            {label}
          </Switch.Label>
        )}
        {description && (
          <Switch.Description as="span" className="text-sm text-gray-500">
            {description}
          </Switch.Description>
        )}
      </span>
      <Switch
        checked={enabled}
        onChange={onChange}
        className={clsx(
          enabled ? 'bg-blue-600' : 'bg-gray-200',
          'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
        )}
      >
        <span
          aria-hidden="true"
          className={clsx(
            enabled ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
          )}
        />
      </Switch>
    </Switch.Group>
  );
}
