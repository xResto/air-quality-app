import React from 'react';
import CloseButtonMobile from '../Sidebar/CloseButtonMobile';
import SingleFavoriteStation from './SingleFavoriteStation';

const FavoriteStations = ({ AQI }) => {
  let favStations = JSON.parse(localStorage.getItem('favStations')) || [];

  return (
    <>
      <div className='flex gap-1 mb-2'>
        <CloseButtonMobile />
        <div className='flex flex-grow justify-center text-2xl font-semibold text-center'>
          {favStations.length ? 'Ulubione stacje' : 'Brak ulubionych stacji'}
        </div>
        <div className='h-8 w-8 sm:hidden'></div>
      </div>
      <span className='border border-blue2 mb-2 block'></span>
      <ul>
        {favStations.length > 0 &&
          favStations.map((station, index) => {
            const entry = AQI.find((entry) => entry.id === +station.id);

            if (entry) {
              const { stIndexLevel } = entry;
              return (
                <SingleFavoriteStation
                  key={index}
                  station={station}
                  stationAQI={stIndexLevel}
                />
              );
            }
            return null;
          })}
      </ul>
    </>
  );
};

export default FavoriteStations;
