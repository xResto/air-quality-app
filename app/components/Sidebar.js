// components/Sidebar.js
'use client';
import ChartComponent from './ChartComponent';
import AQIranking from './AQIranking';
import Searching from './Searching';
import Loading from './Loading';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useArrowFlagContext } from '../store/arrowFlagContext';

const Sidebar = ({
  clickedStationID,
  clickedStationAQI,
  sensorData,
  AQI,
  stations,
}) => {
  const [AQItxt, setAQItxt] = useState('');
  const [airImage, setAirImage] = useState('');
  const [AQITextColor, setAQITextColor] = useState('text-white');
  const {
    bookmark,
    isLoading,
    setBookmark,
    setIsLoading,
    setCoordinate,
    setZoom,
  } = useArrowFlagContext();

  useEffect(() => {
    setIsLoading(false);
  }, [clickedStationID]);

  // const router = useRouter();
  // const pathname = usePathname();
  const searchParams = useSearchParams();

  const thisStation = stations.find(
    (station) => station.id == clickedStationID
  );

  const handleMapCenterChange = () => {
    if (thisStation) {
      setCoordinate({
        lat: +thisStation.gegrLat,
        lng: +thisStation.gegrLon,
      });
      setZoom(11);
    }
  };

  useEffect(() => {
    if (searchParams.get('stationID') && searchParams.get('stationAQI')) {
      setBookmark('stacja');
    } else {
      setBookmark('ranking');
    }
  }, [searchParams, setBookmark]);

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

      setAQITextColor(
        clickedStationAQI === '0' ||
          clickedStationAQI === '4' ||
          clickedStationAQI === '5'
          ? 'text-white'
          : 'text-black'
      );

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
      setIsLoading(false);
      return (
        <ul>
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

            const valuesArray = sensor.values.map((entry) => entry.value);
            const maxSensorValue =
              valuesArray.length > 0 ? Math.max(...valuesArray) : 0;
            let colorRanges = [];
            switch (key) {
              case 'PM10':
                colorRanges = [20, 50, 80, 110, 150, maxSensorValue + 1];
                break;
              case 'PM2.5':
                colorRanges = [13, 35, 55, 75, 110, maxSensorValue + 1];
                break;
              case 'O3':
                colorRanges = [70, 120, 150, 180, 240, maxSensorValue + 1];
                break;
              case 'NO2':
                colorRanges = [40, 100, 150, 230, 400, maxSensorValue + 1];
                break;
              case 'SO2':
                colorRanges = [50, 100, 200, 350, 500, maxSensorValue + 1];
                break;
              default:
                colorRanges = [];
            }

            const colorPalette = [
              '#108404',
              '#18cc04',
              '#f4f804',
              '#ff7c04',
              '#e00404',
              '#98046c',
            ];
            const colorIndex = colorRanges.findIndex(
              (range) => latestNonNullValue <= range
            );
            const color = colorPalette[colorIndex];

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
                <li key={index} className='text-xl'>
                  <div className='flex justify-between'>
                    <div>
                      <p className='text-xs font-extralight'>
                        Pomiar z godz.: {latestDate.slice(-8, -3)}
                      </p>

                      <div
                        key={latestNonNullValue.indexOf()}
                        className='flex items-center mb-1'
                      >
                        <div>{supHandler(key)}:&nbsp;</div>
                        <div
                          className='font-bold text-2xl'
                          style={{ color: color }}
                        >
                          {latestNonNullValue}
                        </div>
                        <span> &nbsp;&#181;g/m</span>
                        <sup>3</sup>
                      </div>
                    </div>
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
      <div className='flex md:w-80 lg:w-96 h-[100vh] border-r-[1px] border-blue2 text-white'>
        <div className='flex flex-col md:w-80 lg:w-96 py-2 p-4 overflow-y-scroll sm:text-sm lg:text-base'>
          {isLoading && <Loading />}
          {bookmark === 'ranking' && !isLoading && (
            <AQIranking AQI={AQI} stations={stations} />
          )}
          {bookmark === 'searching' && <Searching />}
          {!isLoading && bookmark === 'stacja' && sensorData && (
            <>
              <Image
                src={airImage}
                alt='Zdjęcie odzwierciedlające jakość powietrza'
                width={280}
                height={280}
                className='self-center'
              />
              <div
                className={`self-center py-1 px-3 rounded-2xl text-center font-semibold md:text-base lg:text-lg ${AQITextColor} ${aqiBackgroundClass}`}
              >
                {AQItxt}
              </div>
              <div className='flex items-center justify-center mt-2 mb-2'>
                <Image
                  src={'location-on-the-map.svg'}
                  alt='Pinezka lokalizacji na mapie'
                  width={30}
                  height={30}
                  className='hover:cursor-pointer'
                  onClick={handleMapCenterChange}
                />
                <span>{thisStation.stationName}</span>
              </div>
              <span className='border border-blue2 mb-3'></span>

              {getLatestSensorValues(sensorData)}
              <ChartComponent sensorData={sensorData} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
