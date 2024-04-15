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
          Ulubione stacje
        </div>
        <div className='h-8 w-8 sm:hidden'></div>
      </div>
      <span className='border border-blue2 mb-2 block'></span>
      <div className='text-center'>
        {favStations.length > 0 ? (
          ''
        ) : (
          <p>
            Brak ulubionych stacji. Wybierz stację i dodaj ją do ulubionych za
            pomocą ikonki serca.
            <svg
              xmlnsdc='http://purl.org/dc/elements/1.1/'
              xmlnscc='http://creativecommons.org/ns#'
              xmlnsrdf='http://www.w3.org/1999/02/22-rdf-syntax-ns#'
              xmlnssvg='http://www.w3.org/2000/svg'
              xmlns='http://www.w3.org/2000/svg'
              xmlnssodipodi='http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd'
              xmlnsinkscape='http://www.inkscape.org/namespaces/inkscape'
              version='1.1'
              x='0px'
              y='0px'
              viewBox='0 0 100 100'
              fill='#38A3A5'
              stroke='#38A3A5'
              strokeWidth='3'
              xmlSpace='preserve'
              className='w-10 h-10 inline-block pl-1'
            >
              <path d='M 30,12 C 22.960544,12 17.141327,14.870392 13.15625,19.5 9.1711726,24.129608 7,30.484279 7,37.4375 7,48.335154 13.337583,59.138127 21.78125,68.125 30.224917,77.111873 40.812845,84.315995 49.625,87.9375 a 1.0001,1.0001 0 0 0 0.75,0 C 59.187155,84.315995 69.775083,77.111873 78.21875,68.125 86.662417,59.138127 93,48.335154 93,37.4375 93,30.484279 90.828827,24.129608 86.84375,19.5 82.858673,14.870392 77.039456,12 70,12 61.903947,12 55.058072,16.798266 50,22.5625 44.941928,16.798265 38.09605,12 30,12 z m 0,2 c 7.664281,0 14.33446,4.763852 19.21875,10.625 a 1.0001,1.0001 0 0 0 1.5625,0 C 55.66554,18.763852 62.335716,14 70,14 76.500344,14 81.682527,16.59543 85.3125,20.8125 88.942473,25.02957 91,30.90243 91,37.4375 91,47.550788 84.98643,57.983696 76.75,66.75 68.630113,75.392263 58.401501,82.344364 50,85.875 41.598499,82.344364 31.369887,75.392263 23.25,66.75 15.01357,57.983696 9,47.550788 9,37.4375 9,30.90243 11.057527,25.02957 14.6875,20.8125 18.317473,16.59543 23.499656,14 30,14 z' />
            </svg>
          </p>
        )}
      </div>
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
