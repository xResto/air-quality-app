import Image from 'next/image';
import React from 'react';

const Loading = () => {
  return (
    <>
      <div className='flex bg-blue0 w-full h-full justify-center'>
        <Image
          src={'loading-animation.svg'}
          width={400}
          height={400}
          className='self-center'
        />
      </div>
    </>
  );
};

export default Loading;
