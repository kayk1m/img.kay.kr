import Lottie from 'lottie-react';

import spinner from '@assets/spinner.json';

export default function Loading() {
  return (
    <div className="flex w-full h-full absolute inset-0 justify-center items-center">
      <Lottie animationData={spinner} className="w-80 h-80" />
    </div>
  );
}
