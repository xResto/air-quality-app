import Image from 'next/image';
import React from 'react';

const Loading = () => {
  return (
    <>
      <div className='flex bg-blue0 w-full h-full justify-center z-1000'>
        <Image
          src={'loading-animation.svg'}
          alt='Obrazek przedstawiający animację ładowania na laptopie'
          width={400}
          height={400}
          className='self-center'
        />
      </div>
    </>
  );
};

export default Loading;
