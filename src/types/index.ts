import type { ComponentProps, ElementType, ReactNode } from 'react';

// A unique placeholder we can use as a default. This is nice because we can use this instead of
// defaulting to null / never / ... and possibly collide with actual data.
// Ideally we use a unique symbol here.
const __ = 'E0FJAY-O4K63-UUS4-1ES94JNB-65KHI2MX5HKB' as const;
export type __ = typeof __;

export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

export type PropsOf<TTag = any> = TTag extends ElementType ? ComponentProps<TTag> : never;

type PropsWeControl = 'as' | 'children' | 'refName' | 'className';

// Resolve the props of the component, but ensure to omit certain props that we control
type CleanProps<TTag, TOmitableProps extends keyof any = __> = TOmitableProps extends __
  ? Omit<PropsOf<TTag>, PropsWeControl>
  : Omit<PropsOf<TTag>, TOmitableProps | PropsWeControl>;

// Add certain props that we control
type OurProps<TTag> = {
  as?: TTag;
  children?: ReactNode;
  refName?: string;
};

// Conditionally override the `className`.
// if and only if the PropsOf<TTag> already define `className`.
// This will allow us to have a TS error on as={Fragment}
type ClassNameOverride<TTag> = PropsOf<TTag> extends { className?: any }
  ? { className?: string }
  : {};

// Provide clean TypeScript props, which exposes some of our custom API's.
export type Props<TTag, TOmitableProps extends keyof any = __> = CleanProps<TTag, TOmitableProps> &
  OurProps<TTag> &
  ClassNameOverride<TTag>;

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = T | U extends __
  ? never
  : T extends __
  ? U
  : U extends __
  ? T
  : T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;

type Unpacked<T> = T extends (infer U)[] ? U : T;
