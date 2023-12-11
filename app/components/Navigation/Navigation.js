'use client';
import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useMainContext } from '../../store/MainContext';
import { deleteQueryString } from '../../utils/queryString';
import NavigationButton from './NavigationButton';
import ClosestStationIcon from './ClosestStationIcon';

const Navigation = ({ stations, AQI }) => {
  const {
    setBookmark,
    setIsMarkerSelected,
    setSelectedStationID,
    setSelectedPollutants,
    setIsRaportActive,
    setIsMobileRankingOpen,
    setIsSidebarOpen,
    isSidebarOpen,
  } = useMainContext();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div
      className={`flex sm:flex-col sm:justify-start justify-around sm:h-full w-full sm:w-14 lg:w-20 border-t-1 sm:border-r-1 border-blue2 sm:static sm:border-0 bg-blue0 ${
        isSidebarOpen ? '' : ''
      }`}
    >
      {/* Desktop ranking icon */}
      <NavigationButton
        content='Ranking jakości powietrza'
        bookmarkName='ranking'
        iconSrc='rank.svg'
        iconAlt='Ikonka podium'
      />

      {/* Mobile ranking icon */}
      <div
        className='w-full h-16 sm:h-20 flex sm:hidden justify-center content-center p-2 lg:p-4 hover:bg-blue0v2 hover:cursor-pointer transition-colors'
        onClick={() => {
          deleteQueryString(
            ['stationID', 'stationAQI', 'sensorID', 'dateFrom', 'dateTo'],
            router,
            pathname,
            searchParams
          );
          setBookmark('ranking');
          setIsMarkerSelected(false);
          setSelectedStationID(null);
          setSelectedPollutants([]);
          setIsRaportActive(false);
          setIsSidebarOpen(true);
          setIsMobileRankingOpen(true);
        }}
      >
        <Image
          src='rank.svg'
          alt='Ikonka podium'
          width={50}
          height={50}
          onMouseOver={() => {}}
          className='w-auto h-auto'
        />
      </div>

      {/* Find closest station icon */}
      <ClosestStationIcon stations={stations} AQI={AQI} />

      {/* Favorite stations */}
      <NavigationButton
        content='Ulubione stacje'
        bookmarkName='favorites'
        iconSrc='fav.svg'
        iconAlt='Ikonka pinezki lokalizacji z sercem'
      />

      {/* Info */}
      <NavigationButton
        content='Informacje'
        bookmarkName='info'
        iconSrc='info.svg'
        iconAlt='Ikonka informacji'
      />

      {/* Credits */}
      <NavigationButton
        content='Credits'
        bookmarkName='credits'
        iconSrc='credits.svg'
        iconAlt='Ikonka medalu'
      />
    </div>
  );
};

export default Navigation;
