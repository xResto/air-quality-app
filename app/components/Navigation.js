'use client';
import React, { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useArrowFlagContext } from '../store/arrowFlagContext';

const Navigation = () => {
  const { arrowFlag, setArrowFlag } = useArrowFlagContext();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const deleteQueryString = useCallback(
    (name1, name2) => {
      const params = new URLSearchParams(searchParams);
      params.delete(name1);
      params.delete(name2);

      const path = typeof pathname === 'function' ? pathname() : pathname;

      router.replace(`${path}?${params.toString()}`, undefined, {
        shallow: true,
      });
    },
    [searchParams, router, pathname]
  );

  return (
    <div className='flex flex-col items-center h-full flex-shrink-0 sm:w-14 lg:w-20 border-r-[1px] border-blue2'>
      <Image
        src='rank.svg'
        alt='Platform'
        width={50}
        height={50}
        className='hover:cursor-pointer'
        onMouseOver={() => {}}
        onClick={() => {
          setArrowFlag(false);
          deleteQueryString('stationID', 'stationAQI');
        }}
      />
    </div>
  );
};

export default Navigation;
