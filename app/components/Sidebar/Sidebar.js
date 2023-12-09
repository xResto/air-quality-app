
'use client';
import ChartComponent from '../ChartComponent';
import AQIranking from '../AQIRanking/AQIranking';
import Loading from '../Loading';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useMainContext } from '../../store/MainContext';
import { Tooltip } from '@nextui-org/react';
import FavoriteStations from '../FavoriteStations/FavoriteStations';
import Skeleton from '../Skeleton';
import Raport from '../Raport';
import WindComponent from './WeatherComponent';
import CloseButtonMobile from './CloseButtonMobile';
import Credits from '../Credits';
import Link from 'next/link';

const Sidebar = ({
  clickedStationID,
  sensorIDsData,
  sensorData,
  AQI,
  stations,
  thisStation,
  // weatherData,
  raport,
}) => {
  const [AQItxt, setAQItxt] = useState('');
  const [airImage, setAirImage] = useState('');
  const [AQITextColor, setAQITextColor] = useState('text-white');
  const [isStationAddedToFavorites, setIsStationAddedToFavorites] =
    useState(null);
  const {
    isGoogleMapsLoaded,
    bookmark,
    isLoading,
    setBookmark,
    setIsLoading,
    setCoordinate,
    setZoom,
    isRaportActive,
    setIsRaportActive,
    isSidebarOpen,
    setIsSidebarOpen,
  } = useMainContext();

  const [aqiBackgroundClass, setAqiBackgroundClass] = useState('');

  const searchParams = useSearchParams();

  useEffect(() => {
    setIsLoading(false);

    if (typeof window !== 'undefined') {
      const storedFavs = localStorage.getItem('favStations');
      if (storedFavs) {
        const favStations = JSON.parse(storedFavs);
        const isFavorite = favStations.some(
          (station) => station.id === clickedStationID
        );
        setIsStationAddedToFavorites(isFavorite);
      }
    }
  }, [clickedStationID, AQI]);

  useEffect(() => {
    if (searchParams.get('stationID') && !searchParams.get('sensorID')) {
      setBookmark('station');
    }
  }, [searchParams, setBookmark]);

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
      setIsSidebarOpen(false);
    }
  };

  const AQIcolorPalette = {
    '-1': 'bg-[#808080]',
    0: 'bg-[#108404]',
    1: 'bg-[#18cc04]',
    2: 'bg-[#f4f804]',
    3: 'bg-[#ff7c04]',
    4: 'bg-[#e00404]',
    5: 'bg-[#98046c]',
  };

  useEffect(() => {
    const stationEntry = AQI.find((entry) => entry.id === +clickedStationID);
    let clickedStationAQI;
    if (stationEntry) {
      clickedStationAQI = stationEntry.stIndexLevel.id;
    }

    if (clickedStationAQI !== null) {
      const imgHelper = 'aqi-image-';
      const helperTxt = 'jakość powietrza';

      setAqiBackgroundClass(
        AQIcolorPalette[clickedStationAQI] || 'bg-transparent'
      );

      setAQITextColor(
        clickedStationAQI === 0 ||
          clickedStationAQI === 4 ||
          clickedStationAQI === 5
          ? 'text-white'
          : 'text-black'
      );

      switch (clickedStationAQI) {
        case -1:
          setAQItxt('Brak indeksu');
          setAirImage(`${imgHelper}-1.svg`);
          break;
        case 0:
          setAQItxt(`Bardzo dobra ${helperTxt}`);
          setAirImage(`${imgHelper}0.svg`);
          break;
        case 1:
          setAQItxt(`Dobra ${helperTxt}`);
          setAirImage(`${imgHelper}1.svg`);
          break;
        case 2:
          setAQItxt(`Umiarkowana ${helperTxt}`);
          setAirImage(`${imgHelper}2.svg`);
          break;
        case 3:
          setAQItxt(`Niezadowalająca ${helperTxt}`);
          setAirImage(`${imgHelper}3.svg`);
          break;
        case 4:
          setAQItxt(`Zła ${helperTxt}`);
          setAirImage(`${imgHelper}4.svg`);
          break;
        case 5:
          setAQItxt(`Bardzo zła ${helperTxt}`);
          setAirImage(`${imgHelper}5.svg`);
          break;
      }
    }
  }, [clickedStationID]);

  const addStationToFavorites = () => {
    let favStations = JSON.parse(localStorage.getItem('favStations')) || [];
    const stationIndex = favStations.findIndex(
      (favStation) => favStation.id === clickedStationID
    );

    if (stationIndex > -1) {
      favStations.splice(stationIndex, 1);
      setIsStationAddedToFavorites(false);
    } else {
      favStations.push({
        id: clickedStationID,
        stationName: thisStation.stationName,
      });
      setIsStationAddedToFavorites(true);
    }

    if (favStations.length === 0) {
      localStorage.removeItem('favStations');
    } else {
      localStorage.setItem('favStations', JSON.stringify(favStations));
    }
  };

  const getLatestSensorValues = () => {
    setIsLoading(false);
    return (
      <>
        <div className='text-xs mb-3'>
          Źródło danych:&nbsp;
          <Link
            href='https://powietrze.gios.gov.pl/pjp/home'
            target='_blank'
            className='font-bold text-blue3'
          >
            GIOŚ
          </Link>
        </div>
        <section className='flex justify-between'>
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
              }
            })}
          </ul>
        </section>
        <span className='border border-blue2 mt-1 mb-2'></span>
        {/* <WindComponent weatherData={weatherData} /> */}
        <button
          className='border mt-2 border-blue2 self-center py-1 px-4 rounded-2xl text-center font-semibold text-base text-white hover:bg-blue2 transition-all'
          onClick={() => {
            setBookmark('raport');
            setIsRaportActive(true);
          }}
        >
          Generuj Raport Zanieczyszczeń
        </button>
        <ChartComponent sensorData={sensorData} />
      </>
    );
  };

  return (
    <>
      <div
        className={`relative flex h-screen sm:overflow-y-auto sm:overflow-x-hidden sm:border-r-[1px] sm:border-blue2 text-white ${
          isRaportActive
            ? 'w-full sm:w-96 lg:w-[34rem] xl:w-[40rem] 2xl:w-[50rem]'
            : 'sm:w-80 md:w-96 lg:w-[28rem] xl:w-[34rem]'
        }  ${isSidebarOpen ? 'block' : 'hidden sm:flex'} }`}
      >
        <div
          className={`flex flex-col ${
            isRaportActive ? 'w-full' : 'w-full sm:w-80 md:w-full'
          } py-2 p-4 sm:text-sm lg:text-base`}
        >
          {isLoading && <Loading />}
          {bookmark === 'ranking' && !isGoogleMapsLoaded && <Skeleton />}
          {bookmark === 'ranking' && isGoogleMapsLoaded && !isLoading && (
            <AQIranking AQI={AQI} stations={stations} />
          )}
          {bookmark === 'favorites' && !isLoading && (
            <FavoriteStations AQI={AQI} />
          )}
          {bookmark === 'credits' && !isLoading && <Credits />}
          {bookmark === 'raport' && !isLoading && (
            <Raport
              raport={raport}
              sensorIDsData={sensorIDsData}
              stationName={thisStation.stationName}
            />
          )}
          {!isLoading && bookmark === 'station' && sensorData && (
            <>
              <CloseButtonMobile />
              <Image
                src={airImage}
                alt='Zdjęcie odzwierciedlające jakość powietrza'
                width={230}
                height={230}
                className='self-center'
                priority={true}
              />
              <div
                className={`self-center py-1 px-3 rounded-2xl text-center font-semibold text-base lg:text-lg ${AQITextColor} ${aqiBackgroundClass}`}
              >
                {AQItxt}
              </div>
              <div className='flex items-center justify-evenly mt-2 mb-2'>
                <Tooltip
                  content='Zlokalizuj stację na mapie'
                  showArrow={false}
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
                    width={32}
                    height={32}
                    className='hover:cursor-pointer transform hover:scale-110 transition-transform'
                    onClick={handleZoomOnStation}
                  />
                </Tooltip>
                <span className='text-center'>{thisStation.stationName}</span>
                <Tooltip
                  content={
                    isStationAddedToFavorites
                      ? 'Usuń z ulubionych'
                      : 'Dodaj do ulubionych'
                  }
                  showArrow={false}
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
                  <div className='group'>
                    {isStationAddedToFavorites ? (
                      <svg
                        xmlnsDc='http://purl.org/dc/elements/1.1/'
                        xmlnsCc='http://creativecommons.org/ns#'
                        xmlnsRdf='http://www.w3.org/1999/02/22-rdf-syntax-ns#'
                        xmlnsSvg='http://www.w3.org/2000/svg'
                        xmlns='http://www.w3.org/2000/svg'
                        xmlnsSodipodi='http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd'
                        xmlnsInkscape='http://www.inkscape.org/namespaces/inkscape'
                        version='1.1'
                        x='0px'
                        y='0px'
                        viewBox='0 0 100 100'
                        fill='#dc2626'
                        xmlSpace='preserve'
                        className='w-8 h-8 sm:hover:fill-[#808080] sm:active:fill-red-500 sm:focus:fill-red-500 sm:hover:stroke-[#808080] sm:hover:cursor-pointer transform sm:hover:scale-110 transition-all'
                        onClick={addStationToFavorites}
                      >
                        <path d='M 30,13 C 16.4602,13 8,23.94921 8,37.437501 8,58.448443 32.72039,79.898651 50,87.000001 67.27961,79.898651 92,58.448443 92,37.437501 92,23.94921 83.5398,13 70,13 61.92302,13 55,18.000001 50,24.000001 45,18.000001 38.076977,13 30,13 z' />
                      </svg>
                    ) : (
                      <svg
                        xmlnsDc='http://purl.org/dc/elements/1.1/'
                        xmlnsCc='http://creativecommons.org/ns#'
                        xmlnsRdf='http://www.w3.org/1999/02/22-rdf-syntax-ns#'
                        xmlnsSvg='http://www.w3.org/2000/svg'
                        xmlns='http://www.w3.org/2000/svg'
                        xmlnsSodipodi='http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd'
                        xmlnsInkscape='http://www.inkscape.org/namespaces/inkscape'
                        version='1.1'
                        x='0px'
                        y='0px'
                        viewBox='0 0 100 100'
                        fill='#38A3A5'
                        stroke='#38A3A5'
                        strokeWidth='3'
                        xmlSpace='preserve'
                        className='w-8 h-8 sm:hover:fill-red-500 sm:active:fill-red-500 sm:hover:stroke-red-600 sm:hover:cursor-pointer transform sm:hover:scale-110 transition-all'
                        onClick={addStationToFavorites}
                      >
                        <path d='M 30,12 C 22.960544,12 17.141327,14.870392 13.15625,19.5 9.1711726,24.129608 7,30.484279 7,37.4375 7,48.335154 13.337583,59.138127 21.78125,68.125 30.224917,77.111873 40.812845,84.315995 49.625,87.9375 a 1.0001,1.0001 0 0 0 0.75,0 C 59.187155,84.315995 69.775083,77.111873 78.21875,68.125 86.662417,59.138127 93,48.335154 93,37.4375 93,30.484279 90.828827,24.129608 86.84375,19.5 82.858673,14.870392 77.039456,12 70,12 61.903947,12 55.058072,16.798266 50,22.5625 44.941928,16.798265 38.09605,12 30,12 z m 0,2 c 7.664281,0 14.33446,4.763852 19.21875,10.625 a 1.0001,1.0001 0 0 0 1.5625,0 C 55.66554,18.763852 62.335716,14 70,14 76.500344,14 81.682527,16.59543 85.3125,20.8125 88.942473,25.02957 91,30.90243 91,37.4375 91,47.550788 84.98643,57.983696 76.75,66.75 68.630113,75.392263 58.401501,82.344364 50,85.875 41.598499,82.344364 31.369887,75.392263 23.25,66.75 15.01357,57.983696 9,47.550788 9,37.4375 9,30.90243 11.057527,25.02957 14.6875,20.8125 18.317473,16.59543 23.499656,14 30,14 z' />
                      </svg>
                    )}
                  </div>
                </Tooltip>
              </div>
              <span className='border border-blue2 mb-2'></span>

              {sensorData && getLatestSensorValues()}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
