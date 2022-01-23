import type { NextApiRequest, NextApiResponse } from 'next';

declare module 'node-mocks-http' {
  function createRequest<T extends NextApiRequest = NextApiRequest>(
    options?: RequestOptions,
  ): MockRequest<T>;

  function createResponse<T extends NextApiResponse = NextApiResponse>(
    options?: ResponseOptions,
  ): MockResponse<T>;
}
