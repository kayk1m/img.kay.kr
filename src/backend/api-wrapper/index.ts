import { errorHandler } from '@src/backend/api-wrapper/error-handler';

import type { NextApiHandler } from 'next';

export type ApiWrapper = (handler: NextApiHandler) => NextApiHandler;

export class NextApiBuilder {
  handler: NextApiHandler;
  wrappers: ApiWrapper[];

  constructor(handler: NextApiHandler) {
    this.handler = handler;
    this.wrappers = [errorHandler];
  }

  add(wp: ApiWrapper) {
    if (!this.wrappers.includes(wp)) {
      this.wrappers.push(wp);
    }

    return this;
  }

  build(): NextApiHandler {
    let handler = this.handler;

    for (const c of this.wrappers.reverse()) {
      handler = c(handler);
    }

    return handler;
  }
}
