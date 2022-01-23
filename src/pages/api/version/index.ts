import { NextApiBuilder } from '@src/backend/api-wrapper';

import type { NextApiRequest, NextApiResponse } from 'next';

export const API_VERSION = '0.1.0';

/**
 *
 * @api {get} /api/version  Get API version
 * @apiName GetApiVersion
 * @apiGroup General
 * @apiVersion  0.1.0
 *
 *
 * @apiSuccess (200) {String} apiVersion api server version
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/2 200 OK
 * {
 *     "apiVersion": "0.1.0"
 * }
 */
const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    return res.json({ apiVersion: API_VERSION });
  }
};

export default new NextApiBuilder(handler).build();
