import clsx from 'clsx';

import type { MaybePromise, MaybeReadonly } from '$src/types';

type Tab<T> = { label: string; value: T };

type Props<T> = {
  className?: string;
  tabs: MaybeReadonly<Tab<T>[]>;
  state: T;
  setState: (newState: T) => MaybePromise<void>;
  disabled?: boolean;
  fallbackTab?: Tab<T>;
};

export default function ResponsiveTabs<T>({
  className,
  tabs,
  state,
  setState,
  disabled,
  fallbackTab,
}: Props<T>) {
  return (
    <div className={className}>
      <div className="sm:hidden">
        <label htmlFor="resolution" className="sr-only">
          Select a target resolution
        </label>
        <select
          id="resolution"
          name="resolution"
          className="block w-full focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
          value={tabs.find(({ value }) => value === state)?.label ?? (fallbackTab ?? tabs[0]).label}
          disabled={disabled}
          onChange={(e) => {
            setState(
              tabs.find(({ label }) => e.target.value === label)?.value ??
                (fallbackTab ?? tabs[0]).value,
            );
          }}
        >
          {tabs.map((tab) => (
            <option key={tab.label}>{tab.label}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <nav
          className="relative z-0 rounded-lg shadow flex divide-x divide-gray-200"
          aria-label="Tabs"
        >
          {tabs.map((tab, tabIdx) => (
            <button
              key={tab.label}
              className={clsx(
                state === tab.value ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700',
                tabIdx === 0 ? 'rounded-l-lg' : '',
                tabIdx === tabs.length - 1 ? 'rounded-r-lg' : '',
                'group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-sm font-medium text-center hover:bg-gray-50 disabled:bg-gray-50 focus:z-10',
              )}
              aria-current={state === tab.value ? 'page' : undefined}
              onClick={() => setState(tab.value)}
              disabled={disabled}
            >
              <span>{tab.label}</span>
              <span
                aria-hidden="true"
                className={clsx(
                  state === tab.value ? 'bg-blue-500' : 'bg-transparent',
                  'absolute inset-x-0 bottom-0 h-0.5 group-disabled:bg-transparent',
                )}
              />
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
