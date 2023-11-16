'use client';
import Loading from './Loading';
import { useState, useCallback } from 'react';
import { LoadScript, GoogleMap, MarkerF } from '@react-google-maps/api';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useArrowFlagContext } from '../store/arrowFlagContext';

function MapComponent(props) {
  const mapContainerStyle = {
    width: '100%',
    height: '100%',
  };
  const {
    coordinate,
    zoom,
    userClosestStation,
    setCoordinate,
    setZoom,
    setIsLoading,
  } = useArrowFlagContext();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mapInstance, setMapInstance] = useState(null);

  const colorPalette = [
    'bg-[#108404]',
    'bg-[#18cc04]',
    'bg-[#f4f804]',
    'bg-[#ff7c04]',
    'bg-[#e00404]',
    'bg-[#98046c]',
  ];

  const createQueryString = useCallback(
    (name1, value1, name2, value2) => {
      const params = new URLSearchParams(searchParams);
      params.set(name1, value1); // stationID
      params.set(name2, value2); // stationAQI

      return params.toString();
    },
    [searchParams]
  );

  const handleLoad = (map) => {
    setMapInstance(map);
  };

  const handleZoomChange = () => {
    if (mapInstance) {
      const newZoom = mapInstance.getZoom();
      const currentCenter = mapInstance.getCenter();
      setZoom(newZoom);
      setCoordinate({
        lat: currentCenter.lat(),
        lng: currentCenter.lng(),
      });
    }
  };

  const getMarkerIcon = (stationID) => {
    const thisStation = props.AQI.find((station) => station.id === stationID);

    let icon = '-1.png'; // default icon
    let stationAQI = '-1'; // default AQI

    if (thisStation && thisStation.stIndexLevel) {
      stationAQI = thisStation.stIndexLevel.id;
      icon = stationAQI + '.png'; // icon based on AQI
    }

    return {
      icon,
      stationAQI,
    };
  };

  // function debounce(func, wait) {
  //   let timeout;

  //   return function executedFunction(...args) {
  //     const later = () => {
  //       clearTimeout(timeout);
  //       func(...args);
  //     };

  //     clearTimeout(timeout);
  //     timeout = setTimeout(later, wait);
  //   };
  // }

  // const handleMarkerClick = useCallback(
  //   debounce((stationId, stationAQI) => {
  //     if (
  //       searchParams.get('stationID') === stationId.toString() ||
  //       userClosestStation === stationId.toString()
  //     ) {
  //       return;
  //     } else {
  //       setIsLoading(true);
  //       setBookmark('stacja');
  //       const queryString = createQueryString(
  //         'stationID',
  //         stationId,
  //         'stationAQI',
  //         stationAQI
  //       );
  //       router.push(`${pathname}?${queryString}`, {
  //         scroll: false,
  //       });
  //     }
  //   }, 300),
  //   [
  //     setIsLoading,
  //     setBookmark,
  //     searchParams,
  //     userClosestStation,
  //     router,
  //     pathname,
  //     createQueryString,
  //   ]
  // );
  

  const handleMarkerClick = useCallback(
    (stationId, stationAQI) => {
      if (
        searchParams.get('stationID') !== stationId.toString() &&
        userClosestStation !== stationId.toString()
      ) {
        setIsLoading(true);
        const queryString = createQueryString(
          'stationID',
          stationId,
          'stationAQI',
          stationAQI
        );
        router.push(`${pathname}?${queryString}`, {
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
    ]
  );

  return (
    <div className='relative h-full w-full'>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_API_KEY}
        mapIds={['38f2ffead1e9ae5d']}
        loadingElement={<Loading />}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={coordinate}
          zoom={zoom}
          options={{
            mapId: '38f2ffead1e9ae5d',
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
            zoomControl: true,
          }}
          onLoad={handleLoad}
          onZoomChanged={handleZoomChange}
        >
          {props.stations.map((station) => {
            const { icon, stationAQI } = getMarkerIcon(station.id);
            return (
              <MarkerF
                position={{ lat: +station.gegrLat, lng: +station.gegrLon }}
                key={station.id}
                icon={icon}
                onClick={() => handleMarkerClick(station.id, stationAQI)}
              />
            );
          })}
        </GoogleMap>
        <div className='absolute z-20 flex bottom-6 right-20 text-white text-xs font-medium'>
          <span className='absolute left-0 transform -translate-y-full'>
            Bdb
          </span>
          <span className={`${colorPalette[0]} w-8 h-1.5`}></span>
          <span className={`${colorPalette[1]} w-8 h-1.5`}></span>
          <span className={`${colorPalette[2]} w-8 h-1.5`}></span>
          <span className={`${colorPalette[3]} w-8 h-1.5`}></span>
          <span className={`${colorPalette[4]} w-8 h-1.5`}></span>
          <span className={`${colorPalette[5]} w-8 h-1.5`}></span>
          <span className='absolute right-0 transform -translate-y-full'>
            Zła
          </span>
        </div>
      </LoadScript>
    </div>
  );
}

export default MapComponent;
