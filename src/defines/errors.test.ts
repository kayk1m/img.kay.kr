import { ApiError, ERRORS } from './errors';

describe('class ApiError', () => {
  it('Basic error creation', () => {
    Object.entries(ERRORS).forEach(([key, value]) => {
      const error = new ApiError(key as never);

      expect(ApiError.isApiError(error)).toBe(true);
      expect(error.toJson()).toStrictEqual({ name: value.name, code: value.code });
      expect(error.toJson(true)).toStrictEqual({
        name: value.name,
        code: value.code,
        message: value.message,
      });
      expect(error.statusCode).toBe(value.statusCode);
    });
  });

  it('Error creation with custom message or statusCode', () => {
    const defaultError = new ApiError('INTERNAL_SERVER_ERROR');
    const customMessageError = new ApiError('INTERNAL_SERVER_ERROR', 'foo');
    const customStatusError = new ApiError('INTERNAL_SERVER_ERROR', undefined, 501);

    expect(customMessageError.message).not.toEqual(defaultError.message);
    expect(customMessageError.statusCode).toEqual(defaultError.statusCode);
    expect(customStatusError.message).toEqual(defaultError.message);
    expect(customStatusError.statusCode).toEqual(501);
  });

  it('Should use default message if created with empty string message', () => {
    const defaultError = new ApiError('INTERNAL_SERVER_ERROR');
    const shouldDefaultError = new ApiError('INTERNAL_SERVER_ERROR', '');

    expect(shouldDefaultError).toStrictEqual(defaultError);
  });
});
