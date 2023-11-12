'use client';

import { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useArrowFlagContext } from './store/arrowFlagContext';
import Image from 'next/image';

function Map(props) {
  const [zoom, setZoom] = useState(7);
  const [coordinate, setCoordinate] = useState({
    lat: 52.077,
    lng: 19.1,
  });
  const mapContainerStyle = {
    width: '100%',
    height: '100%',
  };
  const { arrowFlag, setArrowFlag } = useArrowFlagContext();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name1, value1, name2, value2) => {
      const params = new URLSearchParams(searchParams);
      params.set(name1, value1); // stationID
      params.set(name2, value2); // stationAQI

      return params.toString();
    },
    [searchParams]
  );

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

  return (
    <main className='w-full'>
      <div className='h-full'>
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_API_KEY}
          mapIds={['38f2ffead1e9ae5d']}
          loadingElement={
            <div className='h-full w-full flex bg-blue0 justify-center'>
              <Image
                src={'loading-animation.svg'}
                width={400}
                height={400}
                className='self-center'
              />
            </div>
          }
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
                    setArrowFlag(true);
                  }}
                />
              );
            })}
          </GoogleMap>
        </LoadScript>
      </div>
    </main>
  );
}

export default Map;
