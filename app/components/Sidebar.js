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
import { Tooltip } from '@nextui-org/react';
import FavoriteStations from './FavoriteStations';
import Skeleton from './Skeleton';

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
    isGoogleMapsLoaded,
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

  const handleZoomOnStation = () => {
    if (thisStation) {
      setCoordinate((prev) => ({
        lat:
          +thisStation.gegrLat !== prev.lat
            ? +thisStation.gegrLat
            : prev.lat + 0.000001,
        lng:
          +thisStation.gegrLon !== prev.lng
            ? +thisStation.gegrLon
            : prev.lng + 0.000001,
      }));
      setZoom(11);
    }
  };

  const addStationToFavorites = () => {
    
  }

  useEffect(() => {
    if (searchParams.get('stationID') && searchParams.get('stationAQI')) {
      setBookmark('station');
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
                  <span>
                    {key.slice(0, -1)}
                    <sub>2</sub>
                  </span>
                );
              } else if (key === 'C6H6') {
                return (
                  <span>
                    C<sub>6</sub>H<sub>6</sub>
                  </span>
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

  // let storageArr = JSON.parse(localStorage.getItem('stationID')) || [];
  // storageArr.push(stationId);
  // localStorage.setItem('stationID', JSON.stringify(storageArr));
  // console.log(localStorage.getItem('stationID'));

  return (
    <>
      <div className='flex md:w-80 lg:w-96 h-[100vh] border-r-[1px] border-blue2 text-white'>
        <div className='flex flex-col md:w-80 lg:w-96 py-2 p-4 overflow-y-scroll sm:text-sm lg:text-base'>
          {isLoading && <Loading />}
          {bookmark === 'ranking' && !isGoogleMapsLoaded && <Skeleton />}
          {bookmark === 'ranking' && isGoogleMapsLoaded && !isLoading && (
            <AQIranking AQI={AQI} stations={stations} />
          )}
          {bookmark === 'favorites' && !isLoading && <FavoriteStations />}
          {bookmark === 'searching' && !isLoading && <Searching />}
          {!isLoading && bookmark === 'station' && sensorData && (
            <>
              <Image
                src={airImage}
                alt='Zdjęcie odzwierciedlające jakość powietrza'
                width={280}
                height={280}
                className='self-center'
              />
              <div
                className={`self-center py-1 px-3 rounded-2xl text-center font-semibold text-base lg:text-lg ${AQITextColor} ${aqiBackgroundClass}`}
              >
                {AQItxt}
              </div>
              <div className='flex items-center justify-evenly mt-2 mb-2'>
                <Tooltip
                  content='Zlokalizuj stację na mapie'
                  showArrow={true}
                  placement='top'
                  offset={0}
                  delay={0}
                  closeDelay={0}
                  classNames={{
                    content: [
                      'py-1 px-2',
                      'text-black rounded-2xl bg-blue3 font-medium text-xs',
                    ],
                  }}
                >
                  <Image
                    src={'location-on-the-map.svg'}
                    alt='Pinezka lokalizacji na mapie'
                    width={30}
                    height={30}
                    className='hover:cursor-pointer'
                    onClick={handleZoomOnStation}
                  />
                </Tooltip>
                <span className='text-center'>{thisStation.stationName}</span>
                <Tooltip
                  content='Dodaj stację do ulubionych'
                  showArrow={true}
                  placement='top'
                  offset={0}
                  delay={0}
                  closeDelay={0}
                  classNames={{
                    content: [
                      'py-1 px-2',
                      'text-black rounded-2xl bg-blue3 font-medium text-xs',
                    ],
                  }}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    xmlnsXlink='http://www.w3.org/1999/xlink'
                    version='1.1'
                    x='0px'
                    y='0px'
                    viewBox='0 0 109 109'
                    enable-background='new 0 0 109 109'
                    xmlSpace='preserve'
                    width='30'
                    height='30'
                    fill='#38A3A5'
                    className='hover:fill-red-500 hover:cursor-pointer'
                    onClick={addStationToFavorites}
                  >
                    <path d='M54.561,93.792c-4.116,0-7.909-1.883-10.416-5.168L19.1,58.252c-0.142-0.167-0.298-0.355-0.453-0.55  l-0.192-0.231c-0.08-0.096-0.151-0.197-0.214-0.302c-3.311-4.369-5.059-9.557-5.059-15.023c0-13.75,11.187-24.938,24.937-24.938  c6.07,0,11.77,2.144,16.3,6.085c4.528-3.941,10.229-6.085,16.299-6.085c13.75,0,24.937,11.187,24.937,24.938  c0,5.631-1.84,10.944-5.325,15.378c-0.043,0.065-0.09,0.128-0.14,0.19l-0.127,0.157c-0.001,0.001-0.068,0.083-0.069,0.085  l-0.151,0.182L64.951,88.651C62.502,91.892,58.694,93.792,54.561,93.792z M22.492,54.506l0.041,0.05  c0.154,0.193,0.277,0.341,0.405,0.492l25.097,30.433c0.022,0.027,0.044,0.054,0.065,0.082c1.552,2.052,3.908,3.229,6.461,3.229  c2.553,0,4.907-1.177,6.459-3.229l24.994-30.641l0.027,0.019c0.024-0.044,0.049-0.087,0.076-0.129l-0.007-0.006l0.051-0.062  c0.038-0.055,0.077-0.109,0.119-0.162c2.861-3.575,4.373-7.875,4.373-12.436c0-10.994-8.943-19.938-19.937-19.938  c-5.523,0-10.667,2.225-14.481,6.264c-0.944,1-2.689,1-3.635,0c-3.816-4.039-8.959-6.264-14.482-6.264  c-10.993,0-19.937,8.944-19.937,19.938c0,4.447,1.45,8.666,4.194,12.199C22.417,54.397,22.456,54.451,22.492,54.506z M86.274,42.218  c0-8.779-7.142-15.921-15.921-15.921c-1.381,0-2.5,1.119-2.5,2.5s1.119,2.5,2.5,2.5c6.022,0,10.921,4.899,10.921,10.921  c0,1.381,1.119,2.5,2.5,2.5S86.274,43.599,86.274,42.218z M81.563,47.67c-1.697,0-3.074,1.377-3.074,3.074  c0,1.698,1.377,3.076,3.074,3.076s3.076-1.378,3.076-3.076C84.639,49.047,83.26,47.67,81.563,47.67z' />
                  </svg>
                </Tooltip>
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
