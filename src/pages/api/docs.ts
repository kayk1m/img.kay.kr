import { NextApiBuilder } from '@src/backend/api-wrapper';

/**
 * ==========================
 * ========= ERROR ==========
 * ==========================
 */

/**
 * ==========================
 * ======== COMMON  =========
 * ==========================
 */

/**
 * @apiDefine DefaultError
 * @apiError (Error Response) {String} name Name of the error
 * @apiError (Error Response) {String} code Error code
 *
 * @apiUse InternalServerError
 */

/**
 * @apiDefine InternalServerError
 * @apiErrorExample InternalServerError
 * HTTP/2 500 INTERNAL_SERVER_ERROR
 * {
 *     "name": "InternalServerError",
 *     "code": "CE000"
 * }
 */

/**
 * @apiDefine MethodNotAllowed
 * @apiErrorExample MethodNotAllowed
 * HTTP/2 405 METHOD_NOT_ALLOWED
 * {
 *     "name": "MethodNotAllowed",
 *     "code": "CE001"
 * }
 */

/**
 * @apiDefine ValidationError
 * @apiErrorExample ValidationError
 * HTTP/2 400 BAD_REQUEST
 * {
 *     "name": "ValidationError",
 *     "code": "CE002"
 * }
 */

/**
 * ==========================
 * ========= AUTH  ==========
 * ==========================
 */

/**
 * @apiDefine InvalidToken
 * @apiErrorExample InvalidToken
 * HTTP/2 401 UNAUTHORIZED
 * {
 *     "name": "InvalidToken",
 *     "code": "AE001"
 * }
 */

/**
 * @apiDefine TokenExpired
 * @apiErrorExample TokenExpired
 * HTTP/2 401 UNAUTHORIZED
 * {
 *     "name": "TokenExpired",
 *     "code": "AE002"
 * }
 */

/**
 * ==========================
 * ========== 3XX  ==========
 * ==========================
 */

/**
 * @apiDefine NotModified
 * @apiErrorExample NotModified
 * HTTP/2 304 Not Modified
 */

export default new NextApiBuilder(() => {}).build();
