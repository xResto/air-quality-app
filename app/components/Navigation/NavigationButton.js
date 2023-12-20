'use client';
import React from 'react';
import NavigationTooltip from './NavigationTooltip';
import Image from 'next/image';
import { deleteQueryString } from '@/app/utils/queryString';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMainContext } from '@/app/store/MainContext';

const NavigationButton = ({ content, bookmarkName, iconSrc, iconAlt }) => {
  const {
    setBookmark,
    setIsMarkerSelected,
    setSelectedStationID,
    setSelectedPollutant,
    setIsRaportActive,
    setIsSidebarOpen,
    setIsLoading,
  } = useMainContext();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <NavigationTooltip content={content}>
      <div
        className={`${
          bookmarkName === 'ranking' ? 'hidden sm:flex' : 'flex'
        } w-full h-16 sm:h-20 justify-center content-center p-2 lg:p-4 hover:bg-blue0v2 hover:cursor-pointer transition-colors`}
        onClick={() => {
          deleteQueryString(
            ['stationID', 'stationAQI', 'sensorID', 'dateFrom', 'dateTo'],
            router,
            pathname,
            searchParams
          );
          setBookmark(bookmarkName);
          setIsLoading(false);
          setIsMarkerSelected(false);
          setSelectedStationID(null);
          setSelectedPollutant('');
          setIsRaportActive(false);
          bookmarkName === 'ranking'
            ? setIsSidebarOpen(false)
            : setIsSidebarOpen(true);
        }}
      >
        <Image
          src={iconSrc}
          alt={iconAlt}
          width={50}
          height={50}
          className='w-auto h-auto'
        />
      </div>
    </NavigationTooltip>
  );
};

export default NavigationButton;
