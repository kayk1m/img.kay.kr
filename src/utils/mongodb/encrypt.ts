import HashIds from 'hashids';
import { ObjectId } from 'mongodb';

import { HASHIDS_KEY } from '@src/utils/env';

const hashIds = new HashIds(HASHIDS_KEY);

export function encodeId(id: ObjectId): string {
  return hashIds.encodeHex(String(id));
}

export function decodeId(hashed: string): ObjectId {
  return new ObjectId(hashIds.decodeHex(hashed));
}

type InputDocument = { _id?: ObjectId };
type OutputDocument = { Id: string };

export function encodeDocuments<U extends OutputDocument>(inputs: InputDocument[]): U[] {
  return inputs.map(encodeDocument) as U[];
}

export function encodeDocument<U extends OutputDocument>(input: InputDocument): U {
  return __encodeDocument(input) as U;
}

function __encodeDocument(input: any): any {
  if (input === null) {
    return input;
  }

  if (input instanceof ObjectId) {
    return encodeId(input);
  }

  if (Array.isArray(input)) {
    return input.map(__encodeDocument);
  }

  if (isValidDate(input)) {
    return input;
  }

  // TODO: need enhance
  if (typeof input === 'object') {
    return Object.fromEntries(
      Object.entries(input).map(([k, v]) => {
        if (k.endsWith('_ids')) {
          k = k.slice(0, -4) + 'Ids';
        } else if (k.endsWith('_id')) {
          k = k.slice(0, -3) + 'Id';
        }

        v = __encodeDocument(v);
        return [k, v];
      }),
    );
  }

  return input;
}

function isValidDate(date: Date) {
  return date && Object.prototype.toString.call(date) === '[object Date]';
}
