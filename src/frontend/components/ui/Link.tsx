import NextLink, { type LinkProps } from 'next/link';

import type { Expand, PropsOf } from '@src/types';

type Props = Expand<Omit<PropsOf<'a'>, 'href'> & Pick<LinkProps, 'href'>>;

export default function Link({ href, children, ...props }: Props) {
  return (
    <NextLink href={href}>
      <a {...props}>{children}</a>
    </NextLink>
  );
}
