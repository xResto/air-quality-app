import React from 'react';
import { useMainContext } from '@/app/store/MainContext';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { createQueryString, deleteQueryString } from '@/app/utils/queryString';
import haversineDistance from 'haversine-distance';
import NavigationTooltip from './NavigationTooltip';
import Image from 'next/image';

const ClosestStationIcon = ({ stations, AQI }) => {
  const {
    userClosestStation,
    setBookmark,
    setIsLoading,
    setIsMarkerSelected,
    setSelectedStationID,
    setSelectedPollutants,
    setIsRaportActive,
    setIsSidebarOpen,
    setUserClosestStation,
  } = useMainContext();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const userLocationHandler = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const userCoordinates = { latitude, longitude };

      // Haversine distance
      let coordinateHaversineDistances = [];
      let minHaversineDistance = Number.MAX_VALUE;
      let idx = null;
      let stationID = null;
      let stationAQI = '-1';

      if (latitude !== 0 && longitude !== 0) {
        stations.forEach((station, index) => {
          const a = {
            latitude: station.gegrLat,
            longitude: station.gegrLon,
          };
          const distance = haversineDistance(a, userCoordinates);
          coordinateHaversineDistances.push(distance);

          if (distance < minHaversineDistance) {
            minHaversineDistance = distance;
            idx = index;
          }
        });

        stationID = stations[idx].id;

        const thisStation = AQI.find(
          (aqiStation) => aqiStation.id === stationID
        );
        if (thisStation && thisStation.stIndexLevel) {
          stationAQI = thisStation.stIndexLevel.id;
        }
        if (searchParams.get('stationID') !== stationID.toString()) {
          setIsLoading(true);
          setBookmark('station');
          setIsMarkerSelected(true);
          setSelectedStationID(stationID);
          setSelectedPollutants([]);
          setIsRaportActive(false);
          setIsSidebarOpen(true);

          deleteQueryString(
            ['sensorID', 'dateFrom', 'dateTo'],
            router,
            pathname,
            searchParams
          );
          const queryString = createQueryString(
            'stationID',
            stationID,
            searchParams
          );
          router.push(`${pathname}?${queryString}`, {
            scroll: false,
          });
        } else {
          setIsLoading(false);
          setUserClosestStation(stationID);
          console.log(userClosestStation);
        }
      }
    });
  };
  return (
    <NavigationTooltip content='Zlokalizuj najbliższą stację'>
      <div
        className='w-full h-16 sm:h-20 flex justify-center content-center p-2 lg:p-4 hover:bg-blue0v2 hover:cursor-pointer transition-colors'
        onClick={userLocationHandler}
      >
        <Image
          src='user-location.svg'
          alt='Ikonka pinezki lokalizacji'
          width={44}
          height={44}
          className='w-auto h-auto'
        />
      </div>
    </NavigationTooltip>
  );
};

export default ClosestStationIcon;
