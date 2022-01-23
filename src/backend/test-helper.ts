import {
  createRequest,
  createResponse,
  type MockRequest,
  type MockResponse,
  type RequestOptions,
} from 'node-mocks-http';

import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

class TestHelper {
  static async testApiHandler<T = any>(
    handler: NextApiHandler,
    requestOptions: RequestOptions = {},
  ): Promise<{
    req: MockRequest<NextApiRequest>;
    res: MockResponse<NextApiResponse>;
    statusCode: number;
    jsonData?: T;
  }> {
    const req = createRequest(requestOptions);
    const res = createResponse<NextApiResponse<T>>();

    await handler(req, res);

    return {
      req,
      res,
      statusCode: res._getStatusCode(),
      jsonData:
        res.getHeader('Content-Type') === 'application/json'
          ? (res._getJSONData() as T)
          : undefined,
    };
  }
}

export default TestHelper;
