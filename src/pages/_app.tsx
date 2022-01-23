import '@assets/main.css';
import 'nprogress/nprogress.css';

import { DefaultSeo } from 'next-seo';
import useNProgress from 'next-use-nprogress';
import Script from 'next/script';

import { CommonLayout } from '@src/frontend/components/layout';
import { Modal, Notification } from '@src/frontend/components/ui';
import { useModal } from '@src/frontend/hooks/use-modal';
import { useNoti } from '@src/frontend/hooks/use-noti';

import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  useNProgress({
    minimum: 0.3,
    easing: 'ease',
    speed: 500,
    showSpinner: false,
  });

  const { modal, closeModal } = useModal();
  const { noti, closeNoti } = useNoti();

  return (
    <>
      <Script src="/js/redirectIE.js" strategy="beforeInteractive" />
      <DefaultSeo
        title="NextJS App"
        description="This page has been created by the template for full-stack nextjs application made by Coxwave"
        openGraph={{
          type: 'website',
          title: 'NextJS App',
          description:
            'This page has been created by the template for full-stack nextjs application made by Coxwave',
          images: [
            {
              url: '/assets/open_graph.jpg',
              width: 1200,
              height: 630,
              alt: 'NextJS Template',
            },
          ],
        }}
        additionalLinkTags={[
          {
            rel: 'icon',
            href: '/assets/favicon.ico',
          },
          {
            rel: 'icon',
            type: 'image/png',
            sizes: '16x16',
            href: '/assets/favicon-16x16.png',
          },
          {
            rel: 'icon',
            type: 'image/png',
            sizes: '32x32',
            href: '/assets/favicon-32x32.png',
          },
          {
            rel: 'apple-touch-icon',
            href: '/assets/apple-touch-icon.png',
            sizes: '180x180',
          },
          {
            rel: 'manifest',
            href: '/assets/site.webmanifest',
          },
        ]}
      />
      <CommonLayout>
        <Component {...pageProps} />
      </CommonLayout>

      <Modal {...modal} close={closeModal} />
      <Notification {...noti} close={closeNoti} />
    </>
  );
}
