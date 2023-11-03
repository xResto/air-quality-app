'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export const Navigation = ({ clickedStationAQI, sensorData }) => {
  const [AQItxt, setAQItxt] = useState();

  useEffect(() => {
    let AQItxt = '';
    if (clickedStationAQI === '-1') {
      return (AQItxt = 'Brak indeksu');
    } else if (clickedStationAQI !== null) {
      switch (clickedStationAQI) {
        case '0':
          setAQItxt('Bardzo dobra');
          break;
        case '1':
          setAQItxt('Dobra')
          break;
        case '2':
          setAQItxt('Umiarkowana')
          break;
        case '3':
          setAQItxt('Dostateczna')
          break;
        case '4':
          setAQItxt('Zła')
          break;
        case '5':
          setAQItxt('Bardzo zła')
          break;
        default:
          'Brak indeksu';
        }
    }
  
    // return cleanUp = () => {
      
    // }
  }, [AQItxt]);
  // const AQIChecker = () => {
  //   let AQItxt = '';
  //   if (clickedStationAQI === '-1') {
  //     return (AQItxt = 'Brak indeksu');
  //   } else if (clickedStationAQI !== null) {
  //     switch (clickedStationAQI) {
  //       case '0':
  //         AQItxt = 'Bardzo dobra';
  //         break;
  //       case '1':
  //         AQItxt = 'Dobra';
  //         break;
  //       case '2':
  //         AQItxt = 'Umiarkowana';
  //         break;
  //       case '3':
  //         AQItxt = 'Dostateczna';
  //         break;
  //       case '4':
  //         AQItxt = 'Zła';
  //         break;
  //       case '5':
  //         AQItxt = 'Bardzo zła';
  //         break;
  //       default:
  //         'Brak indeksu';
  //         return `${AQItxt} jakość powietrza`;
  //     }
  //   }
  // };

  const order = ['PM10', 'PM2.5', 'PM1', 'NO2', 'O3', 'SO2', 'CO', 'C6H6'];

  const getLatestSensorValues = (sensorData) => {
    if (sensorData) {
      sensorData.sort((a, b) => {
        return order.indexOf(a.key) - order.indexOf(b.key);
      });

      return sensorData.map((sensor) => {
        const key = sensor.key;
        let latestNonNullValue = null;
        let latestDate = null;

        for (let i = 0; i < sensor.values.length; i++) {
          const { date, value } = sensor.values[i];
          if (value) {
            latestNonNullValue = value.toFixed(1);
            latestDate = date;
            break;
          }
        }

        const supHandler = (key) => {
          if (key === 'NO2' || key === 'SO2') {
            return (
              <>
                {key.slice(0, -1)}
                <sub>2</sub>
              </>
            );
          } else if (key === 'C6H6') {
            return (
              <>
                C<sub>6</sub>H<sub>6</sub>
              </>
            );
          } else {
            return key;
          }
        };

        if (latestNonNullValue) {
          return (
            <ul className='text-xl'>
              <li key={key}>
                {/* <p>Pomiar z godziny: {latestDate.slice(-8, -3)}</p> */}
                <div className='mb-1'>
                  {supHandler(key)}:{' '}
                  <div className='inline font-bold text-2xl'>
                    {latestNonNullValue}
                  </div>{' '}
                  &#181;g/m
                  <sup>3</sup>
                </div>
              </li>
            </ul>
          );
        } else {
          return (
            <div key={key}>
              <p>No data found.</p>
            </div>
          );
        }
      });
    }

    return null;
  };

  return (
    <div className='absolute z-10 md:w-48 lg:w-96 h-full text-base bg-blue0 border-r-2 border-blue2 rounded-r-3xl text-white'>
      <div className='flex flex-col p-4'>
        {sensorData && (
          <Image
            src='skipping-rope.svg'
            width={250}
            height={250}
            alt='AirQualityImage'
            className='self-center'
          />
        )}
        {/* {clickedStationAQI === 'Brak indeksu' && (
          <p className='mb-4 self-center'>{clickedStationAQI}</p>
        )} */}

        {/* {clickedStationAQI !== null && clickedStationAQI !== 'Brak indeksu' && ( */}
        <p className='mb-4 self-center'>{AQItxt}</p>
        {/* )} */}
        {sensorData && (
          <div className='border-[1px] border-solid border-blue2 mb-2'></div>
        )}
        {getLatestSensorValues(sensorData)}
      </div>
    </div>
  );
};
