'use client';
import React from 'react';
import { useMainContext } from '../../store/MainContext';
import CloseButtonMobile from '../Sidebar/CloseButtonMobile';
import SingleRankingStation from './SingleRankingStation';

const AQIranking = ({ AQI, stations }) => {
  const { isMobileRankingOpen } = useMainContext();

  const sortedAQI = AQI.filter((entry) => entry.stIndexLevel !== null).sort(
    (a, b) => b.stIndexLevel.id - a.stIndexLevel.id
  );

  return (
    <div className={`${isMobileRankingOpen ? 'block' : 'hidden sm:block'}`}>
      <div className='flex gap-1 mb-2'>
        <CloseButtonMobile />
        <div className='flex flex-grow justify-center items-center text-xl sm:text-2xl font-semibold text-center'>
          Ranking jakości powietrza
        </div>
        <div className='h-8 w-8 sm:hidden'></div>
      </div>
      <span className='border border-blue2 mb-2 block'></span>
      <ul>
        {sortedAQI.map((entry) => {
          const station = stations.find((s) => s.id === entry.id);
          return (
            <SingleRankingStation
              key={entry.id}
              entry={entry}
              station={station}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default AQIranking;
