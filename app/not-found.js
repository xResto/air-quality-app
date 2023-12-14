import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const NotFound = () => {
  return (
    <div className='flex flex-col gap-4 justify-center items-center bg-blue0 w-full h-full text-white'>
      <h1 className='text-5xl text-center'>Nie znaleziono strony</h1>
      <Link
        href='/'
        className='border mt-2 border-blue2 self-center py-1 px-4 rounded-2xl text-center font-semibold text-lg text-white hover:bg-blue2 transition-all'
      >
        Powróć do strony głównej
      </Link>
      <div className='flex justify-center'>
        <Image
          src={'not-found.svg'}
          alt='Obrazek przedstawiający mężczyznę załamanaego z powodu nie znalezienia strony (błąd 404)'
          width={400}
          height={400}
          className='self-center'
        />
      </div>
    </div>
  );
};

export default NotFound;
