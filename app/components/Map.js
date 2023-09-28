'use client';

import React from 'react';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';

function Map(props) {
  const mapContainerStyle = {
    width: '90%',
    height: '90vh',
  };

  const coordinate = {
    lat: 52.104195825919156,
    lng: 19.58610303704296,
  };

  const getMarkerIcon = (stationId) => {
    const thisStation = props.AQI.find(
      (station) => station.id === stationId
    );

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
          options={{ mapId: '38f2ffead1e9ae5d' }}
          zoom={7}
        >
          {props.stations.map((station) => (
            <MarkerF
              position={{ lat: +station.gegrLat, lng: +station.gegrLon }}
              key={station.id}
              icon={getMarkerIcon(station.id)}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default Map;
