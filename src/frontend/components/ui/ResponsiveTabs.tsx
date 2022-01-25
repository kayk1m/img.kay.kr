import type { MaybePromise, MaybeReadonly } from '$src/types';

import Tabs from './Tabs';

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
        <Tabs tabs={tabs} state={state} setState={setState} disabled={disabled} />
      </div>
    </div>
  );
}
