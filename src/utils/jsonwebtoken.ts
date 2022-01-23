import jwt from 'jsonwebtoken';

import { ApiError } from '@src/defines/errors';
import { JWT_SECRET } from '@src/utils/env';

const JWT_ALGORITHM = 'ES512';

interface SignTokenOption {
  expiresIn?: string | number;
}
export const signToken = (payload: object, options?: SignTokenOption) => {
  return jwt.sign(payload, JWT_SECRET, { algorithm: JWT_ALGORITHM, ...options });
};

interface VerifyTokenOption {
  ignoreExpired?: boolean;
}
export const verifyToken = <T extends object = any>(
  token: string,
  options?: VerifyTokenOption,
): T => {
  try {
    return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload as T;
  } catch (err) {
    if ((err as Error).name === 'TokenExpiredError') {
      if (options?.ignoreExpired) {
        return jwt.decode(token) as jwt.JwtPayload as T;
      }

      throw new ApiError('TOKEN_EXPIRED', 'Your AccessToken has been expired.');
    }

    throw new ApiError('INVALID_TOKEN');
  }
};

export const renewToken = (token: string): string => {
  const payload = verifyToken(token, { ignoreExpired: true });
  return signToken(payload);
};
