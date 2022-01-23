import ky from 'ky';

export const fetcher = ky.extend({
  hooks: {
    afterResponse: [
      async (_req, _opt, res) => {
        if (!res.ok) {
          const contentType = res.headers.get('Content-Type');
          if (!contentType || contentType.indexOf('application/json') === -1)
            throw await res.text();
          throw await res.json();
        }
      },
    ],
  },
});
