'use client';
import { useCallback, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useArrowFlagContext } from '../store/arrowFlagContext';
import Image from 'next/image';
import Loading from './Loading';
import { createQueryString } from '../utils/queryString';
import { deleteQueryString } from '../utils/queryString';

function MapComponent(props) {
  const {
    isGoogleMapsLoaded,
    coordinate,
    zoom,
    userClosestStation,
    selectedStationID,
    setCoordinate,
    setZoom,
    setBookmark,
    setIsLoading,
    setIsMarkerSelected,
    setSelectedStationID,
    setIsGoogleMapsLoaded,
    setSelectedPollutants,
    setIsRaportActive,
    isSidebarOpen,
    setIsSidebarOpen,
  } = useArrowFlagContext();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getZoomLevel = () => {
    if (window.innerWidth <= 640) {
      return 6.35;
    } else if (window.innerWidth <= 680) {
      return 5.2;
    } else if (window.innerWidth <= 720) {
      return 5.4;
    } else if (window.innerWidth <= 850) {
      return 5.6;
    } else if (window.innerWidth <= 920) {
      return 5.85;
    } else if (window.innerWidth <= 1100) {
      return 6.1;
    } else if (window.innerWidth <= 1200) {
      return 6.35;
    } else if (window.innerWidth <= 1350) {
      return 6.5;
    } else if (window.innerWidth <= 1400) {
      return 6.6;
    } else if (window.innerWidth <= 1500) {
      return 6.8;
    } else {
      return 6.9;
    }
  };

  useEffect(() => {
    if (coordinate.lat === 52.077 && coordinate.lng === 19) {
      setZoom(getZoomLevel());
    }
  }, [coordinate]);

  const colorPalette = [
    'bg-[#108404]',
    'bg-[#18cc04]',
    'bg-[#f4f804]',
    'bg-[#ff7c04]',
    'bg-[#e00404]',
    'bg-[#98046c]',
  ];

  const handleLoad = () => {
    setIsGoogleMapsLoaded(true);
  };

  const handleZoomChange = (e) => {
    let newZoom = e.detail.zoom;
    let currentCenter = e.detail.center;
    setZoom(newZoom);
    setCoordinate({
      lat: currentCenter.lat,
      lng: currentCenter.lng,
    });
  };

  const getMarkerIcon = (stationID) => {
    const thisStation = props.AQI.find((station) => station.id === stationID);

    let icon = '/-1.png'; // default icon
    let stationAQI = '-1'; // default AQI

    if (thisStation && thisStation.stIndexLevel) {
      stationAQI = thisStation.stIndexLevel.id;
      icon = `/${stationAQI}.png`; // icon based on AQI
    }

    return {
      icon,
      stationAQI,
    };
  };

  const handleMarkerClick = useCallback(
    (stationId, stationAQI) => {
      if (
        searchParams.get('stationID') !== stationId.toString() &&
        userClosestStation !== stationId.toString()
      ) {
        setIsLoading(true);
        setIsMarkerSelected(true);
        setSelectedStationID(stationId);
        setBookmark('station');
        setSelectedPollutants([]);
        setIsRaportActive(false);
        setIsSidebarOpen(true);

        const params = new URLSearchParams(searchParams);
        ['sensorID', 'dateFrom', 'dateTo'].forEach((param) =>
          params.delete(param)
        );

        // deleteQueryString(
        //   ['sensorID', 'dateFrom', 'dateTo'],
        //   router,
        //   pathname,
        //   searchParams
        // );
        params.set('stationID', stationId);
        params.set('stationAQI', stationAQI);
        router.push(`${pathname}?${params.toString()}`, {
          scroll: false,
        });
      } else {
        setIsLoading(false);
      }
    },
    [
      searchParams,
      userClosestStation,
      setIsLoading,
      router,
      pathname,
      createQueryString,
      deleteQueryString,
    ]
  );

  const baseZIndex = 100;

  const getMarkerZIndex = (stationId) => {
    return stationId === selectedStationID ? 1000 : baseZIndex; // Increase z-index for selected marker
  };

  return (
    <>
      <div
        className={`relative h-full w-full ${
          isSidebarOpen ? 'hidden sm:block' : 'block'
        }`}
      >
        {!isGoogleMapsLoaded && <Loading />}
        <APIProvider
          apiKey={process.env.NEXT_PUBLIC_API_KEY}
          onLoad={handleLoad}
        >
          {isGoogleMapsLoaded && (
            <Map
              zoom={zoom}
              center={coordinate}
              mapId={process.env.NEXT_PUBLIC_MAP_ID}
              options={{
                mapTypeControl: false,
                fullscreenControl: false,
                streetViewControl: false,
              }}
              onZoomChanged={handleZoomChange}
            >
              {props.stations.map((station) => {
                const { icon, stationAQI } = getMarkerIcon(station.id);
                const zIndex = getMarkerZIndex(station.id);
                const markerStyles =
                  station.id === selectedStationID
                    ? 'rounded-[50%] border-[3px] border-white box-border relative top-[3px] z-100'
                    : '';
                return (
                  <AdvancedMarker
                    position={{
                      lat: +station.gegrLat,
                      lng: +station.gegrLon,
                    }}
                    key={station.id}
                    icon={icon}
                    zIndex={zIndex}
                    onClick={() => {
                      handleMarkerClick(station.id, stationAQI);
                    }}
                  >
                    <div className={markerStyles}>
                      <Image
                        src={icon}
                        alt='Koło z kolorem odzwierciedlającym jakość powietrza'
                        width={16}
                        height={16}
                      />
                    </div>
                  </AdvancedMarker>
                );
              })}
              <div className='absolute z-20 flex bottom-7 right-16 md:right-20 text-white text-xs font-medium'>
                <span className='absolute left-0 transform -translate-y-full'>
                  Bdb
                </span>
                <span className={`${colorPalette[0]} w-6 md:w-8 h-1.5`}></span>
                <span className={`${colorPalette[1]} w-6 md:w-8 h-1.5`}></span>
                <span className={`${colorPalette[2]} w-6 md:w-8 h-1.5`}></span>
                <span className={`${colorPalette[3]} w-6 md:w-8 h-1.5`}></span>
                <span className={`${colorPalette[4]} w-6 md:w-8 h-1.5`}></span>
                <span className={`${colorPalette[5]} w-6 md:w-8 h-1.5`}></span>
                <span className='absolute right-0 transform -translate-y-full'>
                  Zła
                </span>
              </div>
            </Map>
          )}
        </APIProvider>
      </div>
    </>
  );
}

export default MapComponent;
