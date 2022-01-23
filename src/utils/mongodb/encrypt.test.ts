import { ObjectId } from 'bson';

import type { EncodeId } from '@src/types';
import { decodeId, encodeDocument, encodeDocuments, encodeId } from '@src/utils/mongodb/encrypt';

describe('encrypt document', () => {
  it('test encodeId()', () => {
    // given
    const id = new ObjectId('ffffffffffffffffffffffff');
    const expected = '2KoAnowbOPcAbv5baxg2';

    // when
    const result = encodeId(id);

    // expect
    expect(result).toBe(expected);
  });

  it('test decodeId()', () => {
    // given
    const id = '2KoAnowbOPcAbv5baxg2';
    const expected = new ObjectId('ffffffffffffffffffffffff');

    // when
    const result = decodeId(id);

    //expect
    expect(result).toStrictEqual(expected);
  });

  it('test encodeDocument: Document', () => {
    // given
    type Input = { _id: ObjectId; username: string };
    const user: Input = {
      _id: new ObjectId('ffffffffffffffffffffffff'),
      username: 'foo',
    };

    // when
    type Output = EncodeId<Input>;
    const result = encodeDocument<Output>(user);

    // expect
    expect(result).toStrictEqual({
      Id: '2KoAnowbOPcAbv5baxg2',
      username: 'foo',
    });
  });

  it('test encodeDocument: Array<Document>', () => {
    // given
    type Input = { _id: ObjectId; username: string };
    const users: Array<Input> = [
      {
        _id: new ObjectId('ffffffffffffffffffffffff'),
        username: 'foo',
      },
      {
        _id: new ObjectId('000000000000000000000000'),
        username: 'bar',
      },
    ];

    // when
    type Output = EncodeId<Input>;
    const result = encodeDocuments<Output>(users);

    // expect
    expect(result).toStrictEqual([
      {
        Id: '2KoAnowbOPcAbv5baxg2',
        username: 'foo',
      },
      {
        Id: '8B2aGOaeb9iElQnGQr9e',
        username: 'bar',
      },
    ]);
    expect(result[0].Id).toBe('2KoAnowbOPcAbv5baxg2'); // type conversion check
    expect(result[1].Id).toBe('8B2aGOaeb9iElQnGQr9e'); // type conversion check
  });

  it('test encodeDocument: {key: Document}', () => {
    // given
    type Input = {
      _id: ObjectId;
      username: string;
      item: {
        _id: ObjectId;
        itemname: string;
      };
    };
    const input = {
      _id: new ObjectId('ffffffffffffffffffffffff'),
      username: 'foo',
      item: {
        _id: new ObjectId('000000000000000000000000'),
        name: 'icecream',
      },
    };

    // when
    type Output = EncodeId<Input>;
    const result = encodeDocument<Output>(input);

    // expect
    expect(result).toStrictEqual({
      Id: '2KoAnowbOPcAbv5baxg2',
      username: 'foo',
      item: {
        Id: '8B2aGOaeb9iElQnGQr9e',
        name: 'icecream',
      },
    });

    expect(result.Id).toBe('2KoAnowbOPcAbv5baxg2'); // type conversion check
    expect(result.item.Id).toBe('8B2aGOaeb9iElQnGQr9e'); // type conversion check
  });
});
