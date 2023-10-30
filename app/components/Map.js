'use client';

import { useState } from 'react';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

function Map(props) {
  const [coordinate, setCoordinate] = useState({
    lat: 52.077195,
    lng: 17.674482,
  });
  const [zoom, setZoom] = useState(7);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onMarkerClick = (stationId) => {
    const current = new URLSearchParams(searchParams);
    current.set('stationId', stationId);

    const query = current ? `?${current}` : '';
    router.push(`${pathname}${query}`);
  };

  const onDelete = (stationId) => {
    const current = new URLSearchParams(searchParams);
    current.delete('stationId');

    const query = current ? `?${current}` : '';
    router.push(`${pathname}${query}`);
  };

  const mapContainerStyle = {
    width: '100vw',
    height: '100vh',
  };

  const getMarkerIcon = (stationId) => {
    const thisStation = props.AQI.find((station) => station.id === stationId);

    if (thisStation && thisStation.stIndexLevel) {
      const stationAqiId = thisStation.stIndexLevel.id + '.png';
      return stationAqiId;
    }

    return '-1.png';
  };

  return (
    <div>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_API_KEY}
        mapIds={['38f2ffead1e9ae5d']}
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
            zoomControl: false,
          }}
        >
          {props.stations.map((station) => (
            <MarkerF
              position={{ lat: +station.gegrLat, lng: +station.gegrLon }}
              key={station.id}
              icon={getMarkerIcon(station.id)}
              onClick={() => {
                onMarkerClick(station.id);
              }}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default Map;
