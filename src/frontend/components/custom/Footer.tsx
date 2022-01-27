import { Dialog, Transition } from '@headlessui/react';
import { MailIcon, XIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import NextImage from 'next/image';
import { Fragment, useState } from 'react';

import qrKakaoImage from 'images/created-by-img.kay-480x480-low.webp';
import nerdsLabImage from 'images/nerds-lab.png';

import GithubLogo from '$src/frontend/components/vector/GithubLogo';
import TextLogo from '$src/frontend/components/vector/TextLogo';
import { isDesktop } from '$src/utils/bowser';

interface Props {
  className?: string;
}

const nerdInfos = [
  {
    name: 'Kay Kim',
    label: 'Developer',
    email: 'kimjh@bawi.org',
    github: 'https://github.com/kayk1m',
  },
  {
    name: '김종식',
    label: 'Developer',
    email: 'kjsik11@gmail.com',
    github: 'https://github.com/kjsik11',
  },
  {
    name: '조민현',
    label: 'Designer',
    email: 'condiment444@gmail.com',
  },
];

const BUY_ME_A_COFFEE = 'https://www.buymeacoffee.com/kayk1m';
const KAKAO_PAY = 'https://qr.kakaopay.com/Ej8FIuyhv';

export default function Footer({ className }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  const showKakaoModal = () => setModalOpen(true);

  const closeModal = () => setModalOpen(false);

  return (
    <>
      <footer className={clsx(className, 'py-16 bg-gray-50 px-4')}>
        <div className="lg:grid max-w-5xl grid-cols-2 mx-auto">
          <section className="px-8 flex lg:flex-col justify-center lg:justify-start items-center lg:space-y-6">
            <NextImage src={nerdsLabImage} width={320} height={180} loading="eager" />
            <TextLogo className="h-[120px]" />
          </section>
          <section className="my-16 lg:my-0 max-w-xs mx-auto">
            <p className="max-w-[360px] sm:max-w-[400px] mx-auto">
              <b>2NerdsLab</b> seeks to create services that are fun or helpful to the world.
            </p>
            <ul className="space-y-8 mt-8 flex flex-col">
              {nerdInfos.map((info, idx) => (
                <li key={`nerdinfo-${idx}`}>
                  <p className="flex items-center space-x-2">
                    <a
                      className="text-gray-700 hover:opacity-80"
                      target="_blank"
                      href={`mailto:${info.email}`}
                      rel="noreferrer noopener"
                    >
                      <MailIcon className="h-4 w-4" />
                    </a>
                    {info.github && (
                      <a
                        className="text-gray-700 hover:opacity-80"
                        target="_blank"
                        href={info.github}
                        rel="noreferrer noopener"
                      >
                        <GithubLogo className="h-4 w-4" />
                      </a>
                    )}
                    <span className="font-bold">{info.name}</span>
                    <span className="text-xs text-gray-400">{info.label}</span>
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-8 space-y-2">
              <a
                href={BUY_ME_A_COFFEE}
                className="bg-black hover:opacity-80 py-2 flex justify-center rounded-lg text-white space-x-2 w-[240px]"
                target="_blank"
                rel="noreferrer noopener"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 25 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.62995 3.008C5.8048 2.70189 6.05746 2.44744 6.36232 2.27042C6.66719 2.09341 7.01342 2.00011 7.36595 2H17.634C17.9865 2.00011 18.3327 2.09341 18.6376 2.27042C18.9424 2.44744 19.1951 2.70189 19.37 3.008L20.513 5.008C21.161 6.142 20.562 7.511 19.423 7.895C19.428 7.977 19.4269 8.059 19.4209 8.142L18.5639 20.142C18.528 20.6466 18.3022 21.1188 17.9321 21.4636C17.5619 21.8083 17.0748 22 16.569 22H8.42995C7.92409 22 7.43702 21.8083 7.06684 21.4636C6.69665 21.1188 6.47087 20.6466 6.43495 20.142L5.57795 8.142C5.57192 8.0598 5.57092 7.97732 5.57495 7.895C4.43695 7.511 3.83795 6.142 4.48495 5.008L5.62895 3.008H5.62995ZM7.57395 8L7.78795 11H17.212L17.426 8H7.57395ZM8.21695 17L8.43095 20H16.569L16.783 17H8.21695ZM18.777 6L17.634 4H7.36595L6.22295 6H18.777Z"
                    fill="white"
                  />
                </svg>
                <p>Buy me a coffee</p>
              </a>
              <button
                className="bg-[#fee500] hover:opacity-80 py-2 flex justify-center items-center rounded-lg space-x-2 w-[240px]"
                onClick={() => {
                  if (isDesktop()) showKakaoModal();
                  else window.open(KAKAO_PAY, '_blank');
                }}
              >
                <svg
                  width="31"
                  height="10"
                  viewBox="0 0 31 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.00004 0.0307159C6.99431 0.0307159 7.91391 0.220019 8.75883 0.598625C9.60376 0.97723 10.2717 1.49205 10.7627 2.1431C11.2537 2.79414 11.4992 3.50427 11.4992 4.2735C11.4992 5.04274 11.2537 5.75387 10.7627 6.40692C10.2717 7.05996 9.60478 7.57579 8.7619 7.95439C7.91902 8.333 6.9984 8.5223 6.00004 8.5223C5.68498 8.5223 5.35969 8.50027 5.02418 8.4562C3.56755 9.44578 2.79218 9.94658 2.69807 9.9586C2.65306 9.97463 2.6101 9.97262 2.56919 9.95259C2.55282 9.94057 2.54054 9.92455 2.53236 9.90452C2.52418 9.88448 2.52009 9.86645 2.52009 9.85043V9.82639C2.54464 9.67014 2.73081 9.0191 3.0786 7.87326C2.28891 7.48865 1.66186 6.97883 1.19746 6.34382C0.733056 5.7088 0.500854 5.0187 0.500854 4.2735C0.500854 3.50427 0.746354 2.79414 1.23735 2.1431C1.72835 1.49205 2.39631 0.97723 3.24124 0.598625C4.08617 0.220019 5.00576 0.0307159 6.00004 0.0307159Z"
                    fill="black"
                  />
                  <g clipPath="url(#clip0_5_37)">
                    <path
                      d="M13.2893 9.11928H14.7493V7.41928L14.7093 6.49928C15.1393 6.88928 15.6093 7.10928 16.0993 7.10928C17.3293 7.10928 18.4793 5.99928 18.4793 4.07928C18.4793 2.35928 17.6593 1.22928 16.2793 1.22928C15.6793 1.22928 15.0993 1.54928 14.6293 1.94928H14.5893L14.4893 1.36928H13.2893V9.11928ZM15.7693 5.89928C15.4693 5.89928 15.1093 5.78928 14.7493 5.47928V3.01928C15.1393 2.62928 15.4793 2.43928 15.8593 2.43928C16.6293 2.43928 16.9693 3.02928 16.9693 4.09928C16.9693 5.31928 16.4493 5.89928 15.7693 5.89928ZM20.9681 7.10928C21.6081 7.10928 22.1681 6.78928 22.6581 6.36928H22.6881L22.7981 6.96928H23.9981V3.69928C23.9981 2.07928 23.2681 1.22928 21.8481 1.22928C20.9681 1.22928 20.1681 1.55928 19.5081 1.96928L20.0381 2.93928C20.5581 2.63928 21.0581 2.40928 21.5781 2.40928C22.2681 2.40928 22.5081 2.82928 22.5281 3.37928C20.2781 3.61928 19.3081 4.24928 19.3081 5.44928C19.3081 6.39928 19.9681 7.10928 20.9681 7.10928ZM21.4481 5.95928C21.0181 5.95928 20.7081 5.76928 20.7081 5.32928C20.7081 4.82928 21.1681 4.45928 22.5281 4.27928V5.40928C22.1781 5.75928 21.8681 5.95928 21.4481 5.95928ZM25.9863 9.21928C27.2363 9.21928 27.8363 8.45928 28.3263 7.13928L30.3163 1.36928H28.9063L28.1363 3.96928C28.0063 4.48928 27.8663 5.02928 27.7363 5.54928H27.6863C27.5263 5.00928 27.3863 4.46928 27.2163 3.96928L26.3263 1.36928H24.8463L27.0263 6.86928L26.9263 7.19928C26.7663 7.68928 26.4463 8.04928 25.8763 8.04928C25.7463 8.04928 25.5863 8.00928 25.4863 7.97928L25.2163 9.10928C25.4363 9.17928 25.6563 9.21928 25.9863 9.21928Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_5_37">
                      <rect
                        width="18"
                        height="9"
                        fill="white"
                        transform="translate(12.4993 0.969284)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <p className="font-bold">카카오페이로 후원하기</p>
              </button>
            </div>
          </section>
        </div>
      </footer>
      <Transition appear show={modalOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeModal}>
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-800/20 backdrop-blur-sm" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="flex justify-between">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Support <b>2NerdsLab</b> via KakaoPay
                  </Dialog.Title>

                  <button onClick={closeModal} className="hover:opacity-70">
                    <XIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Help us making awesome things!</p>
                </div>

                <div className="block">
                  <NextImage src={qrKakaoImage} width={300} height={300} layout="responsive" />
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
