'use client';

import { useState, useCallback } from 'react';
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

  // const onMarkerClick = (stationID) => {
  //   const current = new URLSearchParams(searchParams);
  //   current.set('stationID', stationID);

  //   const query = current ? `?${current}` : '';
  //   router.push(`${pathname}${query}`);
  // };

  const createQueryString = useCallback(
    (name1, value1, name2, value2) => {
      const params = new URLSearchParams(searchParams);
      params.set(name1, value1);
      params.set(name2, value2);

      return params.toString();
    },
    [searchParams]
  );

  // const onDelete = (stationID) => {
  //   const current = new URLSearchParams(searchParams);
  //   current.delete('stationID');

  //   const query = current ? `?${current}` : '';
  //   router.push(`${pathname}${query}`);
  // };

  const mapContainerStyle = {
    width: '100vw',
    height: '100vh',
  };

  const getMarkerIcon = (stationID) => {
    const thisStation = props.AQI.find((station) => station.id === stationID);

    // if (thisStation && thisStation.stIndexLevel) {
    //   const stationAqiID = thisStation.stIndexLevel.id + '.png';
    //   return stationAqiID;
    // }

    // return '-1.png';

    let icon = '-1.png'; // Default icon if stationAqiID is not found
    let stationAQI = '-1'; // Default value if stationAqiID is not found

    if (thisStation && thisStation.stIndexLevel) {
      stationAQI = thisStation.stIndexLevel.id;
      icon = stationAQI + '.png';
    }

    return {
      icon,
      stationAQI,
    };
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
          {props.stations.map((station) => {
            const { icon, stationAQI } = getMarkerIcon(station.id);
            return (
              <MarkerF
                position={{ lat: +station.gegrLat, lng: +station.gegrLon }}
                key={station.id}
                icon={icon}
                onClick={() => {
                  const queryString = createQueryString(
                    'stationID',
                    station.id,
                    'stationAQI',
                    stationAQI
                  );
                  router.push(pathname + '?' + queryString, {
                    scroll: false,
                  });
                }}
              />
            );
          })}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default Map;
