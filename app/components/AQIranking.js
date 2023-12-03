'use client';
import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useArrowFlagContext } from '../store/arrowFlagContext';
import { createQueryString } from '../utils/queryString';
import { deleteQueryString } from '../utils/queryString';

const AQIranking = ({ AQI, stations }) => {
  const {
    setBookmark,
    setIsLoading,
    setIsMarkerSelected,
    setSelectedStationID,
    setIsSidebarOpen,
    setIsRaportActive,
    isMobileRankingOpen,
    setIsMobileRankingOpen,
  } = useArrowFlagContext();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sortAQI = AQI.filter((entry) => {
    return entry.stIndexLevel != null;
  }).sort((a, b) => {
    return b.stIndexLevel.id - a.stIndexLevel.id;
  });

  const rank = () => {
    return sortAQI.map((entry, index) => {
      const idx = stations.findIndex((station) => station.id === entry.id);
      const station = stations[idx];

      let AQITextColor =
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
          key={index}
          className={`flex flex-col items-center text-center p-1 mb-1 rounded-2xl ${AQIcolor} hover:cursor-pointer transform hover:scale-[1.035] transition-transform`}
          href={`/${entry.id}`}
          onClick={() => {
            const queryString = createQueryString(
              'stationID',
              entry.id,
              'stationAQI',
              entry.stIndexLevel.id,
              searchParams
            );
            router.push(pathname + '?' + queryString, {
              scroll: false,
            });
            setIsLoading(true);
            setIsMarkerSelected(true);
            setSelectedStationID(entry.id);
            setBookmark('station');
          }}
        >
          <div className={`${AQITextColor}`}>
            {stationCity}
            <span className='font-light'>{stationAddress}</span>
          </div>
          <div className={`font-semibold ${AQITextColor}`}>{AQItxt}</div>
        </li>
      );
    });
  };

  return (
    <div className={`${isMobileRankingOpen ? 'block' : 'hidden sm:block'}`}>
      <div className='flex justify-center text-2xl font-semibold text-center mb-2'>
        Ranking jakości powietrza
      </div>
      <button
        className='sm:hidden absolute top-2 right-5'
        onClick={() => {
          deleteQueryString(
            ['stationID', 'stationAQI', 'sensorID', 'dateFrom', 'dateTo'],
            router,
            pathname,
            searchParams
          );
          setIsMobileRankingOpen(false);
          setIsSidebarOpen(false);
          setIsMarkerSelected(false);
          setSelectedStationID(null);
          setIsRaportActive(false);
          setBookmark('ranking');
        }}
      >
        X
      </button>
      <span className='border border-blue2 mb-2 block'></span>
      <ul>{rank()}</ul>
    </div>
  );
};

export default AQIranking;
