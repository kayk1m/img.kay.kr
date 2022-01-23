import { StatusCodes } from 'http-status-codes';

import TH from '@src/backend/test-helper';

import { NextApiBuilder, type ApiWrapper } from '.';

import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

const mockHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const hello = req.query.hello || 'world';
  res.status(StatusCodes.OK).json({ hello });
};

const mockWrapper: ApiWrapper = (handler: NextApiHandler) => {
  const wrapped = async (req: NextApiRequest, res: NextApiResponse) => {
    req.query.hello = 'changed!';

    await handler(req, res);
  };

  return wrapped;
};

describe('NextApiBuilder', () => {
  it('Api wrapper should works well', async () => {
    const apiBuilder = new NextApiBuilder(mockHandler);
    const wrappedApiBuilder = new NextApiBuilder(mockHandler).add(mockWrapper);

    expect(apiBuilder.wrappers.length).toBe(1);
    expect(wrappedApiBuilder.wrappers.length).toBe(2);

    const apiHandler = apiBuilder.build();
    const wrappedApiHandler = wrappedApiBuilder.build();

    const { statusCode: statusCode1, jsonData: jsonData1 } = await TH.testApiHandler<{
      hello: string;
    }>(apiHandler);
    const { statusCode: statusCode2, jsonData: jsonData2 } = await TH.testApiHandler<{
      hello: string;
    }>(wrappedApiHandler);

    expect(statusCode1).toBe(StatusCodes.OK);
    expect(statusCode2).toBe(StatusCodes.OK);
    expect(jsonData1?.hello).toEqual('world');
    expect(jsonData2?.hello).toEqual('changed!');
  });

  it('Should not add duplicated wrappers', async () => {
    const apiBuilder = new NextApiBuilder(mockHandler).add(mockWrapper).add(mockWrapper);

    expect(apiBuilder.add(mockWrapper)).toStrictEqual(apiBuilder);
  });
});
