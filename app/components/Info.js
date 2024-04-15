import React from 'react';
import Image from 'next/image';
import CloseButtonMobile from './Sidebar/CloseButtonMobile';

const Info = () => {
  return (
    <>
      <div className='flex gap-1 mb-2'>
        <CloseButtonMobile />
        <div className='flex flex-grow justify-center items-center text-xl sm:text-2xl font-semibold text-center'>
          Informacje
        </div>
        <div className='h-8 w-8 sm:hidden'></div>
      </div>
      <span className='border border-blue2 mb-2 block'></span>
      <div className='flex justify-center'>
        <Image
          src='/info1.jpg'
          width={500}
          height={500}
          alt='Tabela prezentująca zakresy poszczególnych progów indeksu jakości powietrza dla PM10, PM2.5, O3, NO2, SO2'
        />
      </div>
    </>
  );
};

export default Info;
