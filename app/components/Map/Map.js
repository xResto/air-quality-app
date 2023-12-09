'use client';
import { useCallback, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMainContext } from '../../store/MainContext';
import { createQueryString, deleteQueryString } from '@/app/utils/queryString';
import Image from 'next/image';
import Loading from '../Loading';
import AQILegend from './AQILegend';
import MobileReturnButton from './MobileReturnButton';

const mapOptions = {
  mapTypeControl: false,
  fullscreenControl: false,
  streetViewControl: false,
};

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

function MapComponent({ stations, AQI }) {
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
  } = useMainContext();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  useEffect(() => {
    if (coordinate.lat === 52.077 && coordinate.lng === 19) {
      setZoom(getZoomLevel());
    }
  }, [coordinate]);

  const getMarkerIcon = (stationID) => {
    const thisStation = AQI.find((station) => station.id === stationID);

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
    (stationID) => {
      if (
        searchParams.get('stationID') !== stationID.toString() &&
        userClosestStation !== stationID.toString()
      ) {
        setIsLoading(true);
        setIsMarkerSelected(true);
        setSelectedStationID(stationID);
        setBookmark('station');
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
      }
    },
    [searchParams, userClosestStation, setIsLoading, router, pathname]
  );

  const baseZIndex = 100;

  const getMarkerZIndex = (stationID) => {
    return stationID === selectedStationID ? 1000 : baseZIndex; // Increase z-index for selected marker
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
              options={mapOptions}
              onZoomChanged={handleZoomChange}
            >
              {stations.map((station) => {
                const { icon } = getMarkerIcon(station.id);
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
                      handleMarkerClick(station.id);
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

              <MobileReturnButton />

              <AQILegend />
            </Map>
          )}
        </APIProvider>
      </div>
    </>
  );
}

export default MapComponent;
