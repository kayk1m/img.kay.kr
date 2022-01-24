import TagManager, { type TagManagerArgs } from 'react-gtm-module';

const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
if (!gtmId) throw new Error('Missing NEXT_PUBLIC_GTM_ID in environment variables.');

export const GTM = {
  initialize: (options?: Omit<TagManagerArgs, 'gtmId'>) => {
    TagManager.initialize({ gtmId, ...options });
  },
  dataLayer: TagManager.dataLayer,
};
