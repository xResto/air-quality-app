'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ChartComponent from './ChartComponent';

export const Navigation = ({ clickedStationAQI, sensorData }) => {
  const [AQItxt, setAQItxt] = useState('');
  const [airImage, setAirImage] = useState('');

  useEffect(() => {
    const imgHelper = 'aqi-image-';
    if (clickedStationAQI !== null) {
      const helperTxt = 'jakość powietrza';

      switch (clickedStationAQI) {
        case '-1':
          setAQItxt('Brak indeksu');
          setAirImage(`${imgHelper}-1.svg`);
          break;
        case '0':
          setAQItxt(`Bardzo dobra ${helperTxt}`);
          setAirImage(`${imgHelper}0.svg`);
          break;
        case '1':
          setAQItxt(`Dobra ${helperTxt}`);
          setAirImage(`${imgHelper}1.svg`);
          break;
        case '2':
          setAQItxt(`Umiarkowana ${helperTxt}`);
          setAirImage(`${imgHelper}2.svg`);
          break;
        case '3':
          setAQItxt(`Dostateczna ${helperTxt}`);
          setAirImage(`${imgHelper}3.svg`);
          break;
        case '4':
          setAQItxt(`Zła ${helperTxt}`);
          setAirImage(`${imgHelper}4.svg`);
          break;
        case '5':
          setAQItxt(`Bardzo zła ${helperTxt}`);
          setAirImage(`${imgHelper}5.svg`);
          break;
      }
    }

    // return cleanUp = () => {

    // }
  }, [clickedStationAQI]);

  // const order = ['PM10', 'PM2.5', 'PM1', 'NO2', 'O3', 'SO2', 'CO', 'C6H6'];

  const getLatestSensorValues = (sensorData) => {
    if (sensorData) {
      // sensorData.sort((a, b) => {
      //   return order.indexOf(a.key) - order.indexOf(b.key);
      // });

      return sensorData.map((sensor) => {
        const key = sensor.key;
        let latestNonNullValue = null;
        let latestDate = null;

        for (let i = 0; i < sensor.values.length; i++) {
          const { date, value } = sensor.values[i];
          if (value) {
            const lastNumber = value.toFixed(1).slice(-1);
            latestNonNullValue =
              lastNumber == 0 ? value.toFixed() : value.toFixed(1);
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
                <p className='text-sm'>Pomiar z godziny: {latestDate.slice(-8, -3)}</p>
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
          return;
          // (
          //   <div key={key}>
          //     <p>No data found.</p>
          //   </div>
          // );
        }
      });
    }

    return null;
  };

  return (
    <div className='absolute z-10 md:w-48 lg:w-96 h-full text-lg bg-blue0 border-r-2 border-blue2 text-white overflow-y-scroll'>
      <div className='flex flex-col p-4'>
        {sensorData && (
          <Image
            src={airImage}
            width={300}
            height={300}
            alt='AirQualityImage'
            className='self-center'
          />
        )}
        <p className='mb-4 self-center'>{AQItxt}</p>
        {sensorData && (
          <div className='border-[1px] border-solid border-blue2 mb-2'></div>
        )}
        {getLatestSensorValues(sensorData)}

        {/* Charts */}
        {sensorData && <ChartComponent sensorData={sensorData} />}
      </div>
    </div>
  );
};
