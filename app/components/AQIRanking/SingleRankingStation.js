'use client';
import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMainContext } from '../../store/MainContext';
import { createQueryString } from '../../utils/queryString';

const SingleRankingStation = ({ entry, station }) => {
  const {
    setBookmark,
    setIsLoading,
    setIsMarkerSelected,
    setSelectedStationID,
    setIsSidebarOpen,
  } = useMainContext();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const AQITextColor =
    entry.stIndexLevel.id === 0 ||
    entry.stIndexLevel.id === 4 ||
    entry.stIndexLevel.id === 5
      ? 'text-white'
      : 'text-black';

  const AQIcolorPalette = [
    'bg-[#108404]',
    'bg-[#18cc04]',
    'bg-[#f4f804]',
    'bg-[#ff7c04]',
    'bg-[#e00404]',
    'bg-[#98046c]',
  ];

  let AQIcolor = 'bg-[#808080]';
  let AQItxt = '';
  const helperTxt = 'jakość powietrza';

  switch (entry.stIndexLevel.id) {
    case -1:
      AQItxt = 'Brak indeksu';
      AQIcolor = 'bg-[#808080]';
      break;
    case 0:
      AQItxt = `Bardzo dobra ${helperTxt}`;
      AQIcolor = AQIcolorPalette[0];
      break;
    case 1:
      AQItxt = `Dobra ${helperTxt}`;
      AQIcolor = AQIcolorPalette[1];
      break;
    case 2:
      AQItxt = `Umiarkowana ${helperTxt}`;
      AQIcolor = AQIcolorPalette[2];
      break;
    case 3:
      AQItxt = `Niezadowalająca ${helperTxt}`;
      AQIcolor = AQIcolorPalette[3];
      break;
    case 4:
      AQItxt = `Zła ${helperTxt}`;
      AQIcolor = AQIcolorPalette[4];
      break;
    case 5:
      AQItxt = `Bardzo zła ${helperTxt}`;
      AQIcolor = AQIcolorPalette[5];
      break;
  }

  const [stationCity, stationAddress] = station.stationName.split(',');

  return (
    <li
      className={`flex flex-col items-center text-center text-base p-1 mb-1 rounded-2xl ${AQIcolor} hover:cursor-pointer transform hover:scale-[1.035] transition-transform`}
      onClick={() => {
        const queryString = createQueryString(
          'stationID',
          entry.id,
          searchParams
        );
        router.push(`${pathname}?${queryString}`);
        setIsLoading(true);
        setIsMarkerSelected(true);
        setSelectedStationID(entry.id);
        setBookmark('station');
        setIsSidebarOpen(true);
      }}
    >
      <div className={`${AQITextColor}`}>
        {stationCity}
        <span className='font-light'>{stationAddress}</span>
      </div>
      <div className={`font-semibold ${AQITextColor}`}>{AQItxt}</div>
    </li>
  );
};

export default SingleRankingStation;
