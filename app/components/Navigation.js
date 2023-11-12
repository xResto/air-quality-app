'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import ChartComponent from './ChartComponent';
import AQIranking from './AQIranking';
import { useArrowFlagContext } from './store/arrowFlagContext';

export const Navigation = ({
  clickedStationID,
  clickedStationAQI,
  sensorData,
  AQI,
  stations,
}) => {
  const [AQItxt, setAQItxt] = useState('');
  const [airImage, setAirImage] = useState('');
  const [AQITextColor, setAQITextColor] = useState('text-white');
  const { arrowFlag, setArrowFlag } = useArrowFlagContext();

  console.log(arrowFlag);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const stationName = stations.find(
    (station) => station.id == clickedStationID
  );

  useEffect(() => {
    if (searchParams.get('stationID') && searchParams.get('stationAQI')) {
      setArrowFlag(true);
    } else {
      setArrowFlag(false);
    }
  }, [searchParams, setArrowFlag]);

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

  const AQIcolorPalette = {
    '-1': 'bg-[#808080]',
    0: 'bg-[#108404]',
    1: 'bg-[#18cc04]',
    2: 'bg-[#f4f804]',
    3: 'bg-[#ff7c04]',
    4: 'bg-[#e00404]',
    5: 'bg-[#98046c]',
  };

  const aqiBackgroundClass =
    AQIcolorPalette[clickedStationAQI] || 'bg-transparent';

  useEffect(() => {
    if (clickedStationAQI !== null) {
      const imgHelper = 'aqi-image-';
      const helperTxt = 'jakość powietrza';

      setAQITextColor(clickedStationAQI === '2' ? 'text-black' : 'text-white');

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
          setAQItxt(`Niezadowalająca ${helperTxt}`);
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
  }, [clickedStationID]);

  const getLatestSensorValues = (sensorData) => {
    if (sensorData) {
      return (
        <ul className='text-xl'>
          {sensorData.map((sensor, index) => {
            const key = sensor.key;
            let latestNonNullValue = null;
            let latestDate = null;

            for (let i = 0; i < sensor.values.length; i++) {
              const { date, value } = sensor.values[i];
              if (value) {
                const latestNumber = value.toFixed(1).slice(-1);
                latestNonNullValue =
                  latestNumber === 0 ? value.toFixed() : value.toFixed(1);
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
                <li key={index}>
                  <p className='text-xs font-extralight flex self-end'>
                    {/* Pomiar z godz.: {formatDate(latestDate)} */}
                    Pomiar z godz.: {latestDate.slice(-8, -3)}
                  </p>
                  <div key={latestNonNullValue.indexOf()} className='mb-1'>
                    {supHandler(key)}:{' '}
                    <div className='inline font-bold text-2xl'>
                      {latestNonNullValue}
                    </div>{' '}
                    &#181;g/m
                    <sup>3</sup>
                  </div>
                </li>
              );
            } else {
              return;
              // (
              //   <div key={key}>
              //     <p>No data found.</p>
              //   </div>
              // );
            }
          })}
        </ul>
      );
    }
    return null;
  };

  return (
    <>
      <div className='flex flex-col md:w-80 lg:w-96 h-[100vh] text-base border-r-[1px] border-blue2 text-white'>
        {arrowFlag && sensorData && (
          <Image
            src='arrow-left.svg'
            width={60}
            height={60}
            className='absolute hover:cursor-pointer'
            onMouseOver={() => {}}
            onClick={() => {
              setArrowFlag(false);
              deleteQueryString('stationID', 'stationAQI');
            }}
          />
        )}
        <div className='flex flex-col py-2 p-4 overflow-y-scroll md:w-80 lg:w-96'>
          {!arrowFlag && <AQIranking AQI={AQI} stations={stations} />}
          {sensorData && (
            <>
              <Image
                src={airImage}
                width={280}
                height={280}
                alt='AirQualityImage'
                className='self-center'
              />
              <div
                className={`self-center py-1 px-3 rounded-2xl font-semibold text- text-lg ${AQITextColor} ${aqiBackgroundClass}`}
              >
                {AQItxt}
              </div>
              <div className='text-base font-bold text-center mt-2 mb-2'>
                {stationName.stationName}
              </div>
              <div className='border border-solid border-blue2 mb-2'></div>
            </>
          )}
          {getLatestSensorValues(sensorData)}

          {sensorData && <ChartComponent sensorData={sensorData} />}
        </div>
      </div>
    </>
  );
};
