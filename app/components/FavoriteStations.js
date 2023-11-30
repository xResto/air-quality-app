import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { createQueryString } from '../utils/queryString';
import { useArrowFlagContext } from '../store/arrowFlagContext';

const FavoriteStation = ({ index, station, stationAQI }) => {
  const {
    setIsMarkerSelected,
    setSelectedStationID,
    setBookmark,
    setIsLoading,
  } = useArrowFlagContext();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [stationCity, stationAddress] = station.stationName.split(',');

  let AQITextColor =
    stationAQI.id === 0 || stationAQI.id === 4 || stationAQI.id === 5
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

  switch (+stationAQI.id) {
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

  return (
    <div key={index}>
      <li
        className={`flex flex-col items-center text-center p-1 mb-1 rounded-2xl ${AQIcolor} hover:cursor-pointer transform hover:scale-[1.035] transition-transform`}
        href={`/${station.id}`}
        onClick={() => {
          const queryString = createQueryString(
            'stationID',
            station.id,
            'stationAQI',
            stationAQI.id,
            searchParams
          );
          router.push(pathname + '?' + queryString, {
            scroll: false,
          });
          setIsLoading(true);
          setIsMarkerSelected(true);
          setSelectedStationID(+station.id);
          setBookmark('stacja');
        }}
      >
        <div className={`${AQITextColor}`}>
          {stationCity}
          <span className='font-light'>{stationAddress}</span>
        </div>
        <div className={`font-semibold ${AQITextColor}`}>{AQItxt}</div>
      </li>
    </div>
  );
};

const FavoriteStations = ({ AQI }) => {
  let favStations = JSON.parse(localStorage.getItem('favStations')) || [];

  return (
    <>
      <div className='flex justify-center text-2xl font-semibold text-center mb-2'>
        {favStations.length ? 'Ulubione stacje' : 'Brak ulubionych stacji'}
      </div>
      <ul>
        {favStations.length > 0 &&
          favStations.map((station, index) => {
            const { stIndexLevel } = AQI.find(
              (entry) => entry.id === +station.id
            );
            return (
              <FavoriteStation
                index={index}
                station={station}
                stationAQI={stIndexLevel}
              />
            );
          })}
      </ul>
    </>
  );
};

export default FavoriteStations;
