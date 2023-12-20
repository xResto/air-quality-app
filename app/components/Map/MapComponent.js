'use client';
import 'leaflet/dist/leaflet.css';
import { useCallback, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMainContext } from '../../store/MainContext';
import Loading from '../Loading';
import AQILegend from './AQILegend';
import MobileReturnButton from './MobileReturnButton';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';

const getZoomLevel = () => {
  if (window.innerWidth <= 1350) {
    return 6;
  } else {
    return 7;
  }
};

const ManageMap = () => {
  const { zoom, coordinate, findClosest, setFindClosest, setIsMapLoaded } =
    useMainContext();
  const map = useMap();

  useEffect(() => {
    map.setZoom(getZoomLevel());
    map.getPane('mapPane').style.zIndex = 0;
    map.zoomControl.setPosition('bottomright');
  }, []);

  useEffect(() => {
    map.whenReady(() => {
      setIsMapLoaded(true);
    });
  }, [map, setIsMapLoaded]);

  useEffect(() => {
    if (findClosest) {
      map.setView(coordinate, zoom);
    }

    return () => {
      setFindClosest(false);
    };
  }, [findClosest]);
};

function MapComponent({ stations, AQI }) {
  const {
    isMapLoaded,
    coordinate,
    zoom,
    userClosestStation,
    selectedStationID,
    setZoom,
    setBookmark,
    setIsLoading,
    setIsMarkerSelected,
    setSelectedStationID,
    setSelectedPollutant,
    setIsRaportActive,
    isSidebarOpen,
    setIsSidebarOpen,
  } = useMainContext();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (coordinate.lat === 52.077 && coordinate.lng === 19) {
      setZoom(getZoomLevel());
    }
  }, [coordinate]);

  const getMarkerIcon = (stationID) => {
    const thisStation = AQI.find((station) => station.id === stationID);

    let iconUrl = '/-1.png'; // default icon
    let stationAQI = '-1'; // default AQI

    if (thisStation && thisStation.stIndexLevel) {
      stationAQI = thisStation.stIndexLevel.id;
      iconUrl = `/${stationAQI}.png`; // icon based on AQI
    }

    return {
      iconUrl,
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
        setSelectedPollutant('');
        setIsRaportActive(false);
        setIsSidebarOpen(true);

        const params = new URLSearchParams(searchParams);
        params.delete('sensorID');
        params.delete('dateFrom');
        params.delete('dateTo');
        params.set('stationID', stationID);
        router.push(`${pathname}?${params.toString()}`);
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
        {!isMapLoaded && <Loading />}
        {/* Leaflet Map */}
        <MapContainer
          center={coordinate}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
        >
          <ManageMap />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" >OpenStreetMap</a>'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            pane='tilePane'
          />
          <TileLayer
            attribution='&copy; <a href="https://www.jawg.io/en/" target="_blank" >Jawg</a>'
            url='https://tile.jawg.io/20b4afd8-2f74-4dd0-bc22-66a52407f145/{z}/{x}/{y}{r}.png?access-token=U8ZR6EnoiaBQV1oYgsbh8ANiPRF06HU8WcL2r0YP6xCJ0xTzDCrvdqKyUnbxPz6A'
          />

          {/* Markers */}
          {stations.map((station) => {
            const { iconUrl } = getMarkerIcon(station.id);
            const zIndex = getMarkerZIndex(station.id);
            const markerStyles =
              station.id === selectedStationID
                ? 'rounded-[50%] border-[3px] border-white box-border z-100'
                : '';

            return (
              <Marker
                position={[+station.gegrLat, +station.gegrLon]}
                icon={
                  new L.Icon({
                    iconUrl: iconUrl,
                    className: markerStyles,
                  })
                }
                zIndexOffset={zIndex}
                eventHandlers={{
                  click: () => handleMarkerClick(station.id),
                }}
                key={station.id}
              />
            );
          })}

          <MobileReturnButton />
          <AQILegend />
        </MapContainer>
      </div>
    </>
  );
}

export default MapComponent;
