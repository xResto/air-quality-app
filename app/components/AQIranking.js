'use client';

import React from 'react';
import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useArrowFlagContext } from './store/arrowFlagContext';
import Image from 'next/image';

const AQIranking = ({ AQI, stations }) => {
  const { arrowFlag, setArrowFlag } = useArrowFlagContext();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name1, value1, name2, value2) => {
      const params = new URLSearchParams(searchParams);
      params.set(name1, value1);
      params.set(name2, value2);

      return params.toString();
    },
    [searchParams]
  );

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
        entry.stIndexLevel.id === 2 ? 'text-black' : 'text-white';

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
          className={`flex flex-col items-center text-center p-1 mb-1 rounded-2xl ${AQIcolor} hover:cursor-pointer`}
          onClick={() => {
            const queryString = createQueryString(
              'stationID',
              entry.id,
              'stationAQI',
              entry.stIndexLevel.id
            );
            router.push(pathname + '?' + queryString, {
              scroll: false,
            });
            setArrowFlag(true);
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
    <>
      <div className='flex'>
        <Image src='rank.svg' width={75} height={75} />
        <div className='flex justify-center text-2xl font-semibold text-center'>
          Ranking jakości powietrza
        </div>
      </div>
      <ul>{rank()}</ul>
    </>
  );
};

export default AQIranking;
