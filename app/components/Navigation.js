'use client';
import React, { useCallback, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useArrowFlagContext } from '../store/arrowFlagContext';
import haversineDistance from 'haversine-distance';
import { Tooltip } from '@nextui-org/react';

const Navigation = ({ stations, AQI }) => {
  const {
    userClosestStation,
    setBookmark,
    setIsLoading,
    setUserClosestStation,
  } = useArrowFlagContext();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name1, value1, name2, value2) => {
      const params = new URLSearchParams(searchParams);
      params.set(name1, value1); // stationID
      params.set(name2, value2); // stationAQI

      return params.toString();
    },
    [searchParams]
  );

  const deleteQueryString = useCallback(
    (name1, name2) => {
      const params = new URLSearchParams(searchParams);
      params.delete(name1);
      params.delete(name2);

      const path = typeof pathname === 'function' ? pathname() : pathname;

      router.replace(`${path}?${params.toString()}`, undefined, {
        shallow: true,
      });
    },
    [searchParams, router, pathname]
  );

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
          setBookmark('stacja');
          const queryString = createQueryString(
            'stationID',
            stationID,
            'stationAQI',
            stationAQI
          );
          router.push(pathname + '?' + queryString, {
            scroll: false,
          });
        } else {
          setIsLoading(false);
          setUserClosestStation(stationID);
          console.log(userClosestStation);
        }
      }

      // if (userClosestStation === stations[idx].id) {
      //   return;
      // } else {
      //   setUserClosestStation(stations[idx].id);
      //   setIsLoading(true);
      //   console.log('eeeeeeeeee', userClosestStation);
      // }
      // setBookmark('stacja');
      // setCoordinate({
      //   lat: +stations[idx].gegrLat,
      //   lng: +stations[idx].gegrLon,
      // });
      // setZoom(11);
      // const queryString = createQueryString(
      //   'stationID',
      //   stationID,
      //   'stationAQI',
      //   stationAQI
      // );
      // router.push(pathname + '?' + queryString, {
      //   scroll: false,
      // });

      // if (searchParams.get('stationID') !== stationID.toString()) {
      //   setIsLoading(true);
      //   setBookmark('stacja');
      //   const queryString = createQueryString(
      //     'stationID',
      //     stationID,
      //     'stationAQI',
      //     stationAQI
      //   );
      //   router.push(pathname + '?' + queryString, {
      //     scroll: false,
      //   });
      // }
    });
  };

  return (
    <div className='flex flex-col items-center h-full flex-shrink-0 sm:w-14 lg:w-20 border-r-[1px] border-blue2'>
      <Tooltip
        content='Ranking jakości powietrza'
        showArrow={true}
        placement='right'
        offset={-12}
        delay={0}
        closeDelay={0}
        classNames={{
          content: [
            'py-2 px-4',
            'text-black rounded-2xl bg-blue3 font-medium text-xs',
          ],
        }}
      >
        <div
          className='w-full h-20 hover:bg-blue0v2 hover:cursor-pointer flex justify-center content-center p-2 lg:p-4'
          onClick={() => {
            setBookmark('ranking');
            deleteQueryString('stationID', 'stationAQI');
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
      </Tooltip>
      <Tooltip
        content='Zlokalizuj najbliższą stację'
        showArrow={true}
        placement='right'
        offset={-12}
        delay={0}
        closeDelay={0}
        classNames={{
          content: [
            'py-2 px-4',
            'text-black rounded-2xl bg-blue3 font-medium text-xs',
          ],
        }}
      >
        <div
          className='w-full h-20 hover:bg-blue0v2 hover:cursor-pointer flex justify-center content-center p-2 lg:p-4'
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
      </Tooltip>
      <Tooltip
        content='Wyszukaj miejscowość'
        showArrow={true}
        placement='right'
        offset={-12}
        delay={0}
        closeDelay={0}
        classNames={{
          content: [
            'py-2 px-4',
            'text-black rounded-2xl bg-blue3 font-medium text-xs',
          ],
        }}
      >
        <div className='w-full h-20 hover:bg-blue0v2 hover:cursor-pointer flex justify-center content-center p-2 lg:p-4'>
          <Image
            src='searching.svg'
            alt='Ikonka lupy'
            width={50}
            height={50}
            className='w-auto h-auto'
            onClick={() => {
              setBookmark('searching');
            }}
          />
        </div>
      </Tooltip>
    </div>
  );
};

export default Navigation;
