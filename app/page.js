// import dynamic from 'next/dynamic';
// const Sidebar = dynamic(() => import('./components/Sidebar'), { ssr: false });
import React from 'react';
import Sidebar from './components/Sidebar';
import Navigation from './components/Navigation';
import {
  getAllStations,
  getAqiData,
  getSensorID,
  getSensorData,
} from './lib/getAirQualityData';
import MapComponent from './components/Map';

// export const dynamic = 'force-dynamic';

// export async function generateStaticParams() {
//   const res = await fetch(
//     'https://api.gios.gov.pl/pjp-api/rest/station/findAll'
//   );

//   const stations = await res.json();

//   return stations.map((station) => ({
//     stations: stations,
//     id: station.id,
//   }));
// }

export default async function Page({ searchParams }) {
  // Map
  const { stations, stationsID } = await getAllStations();
  const AQI = await getAqiData(stationsID);

  // Sidebar
  const clickedStationID = searchParams?.stationID ?? '';
  const clickedStationAQI = searchParams?.stationAQI ?? '';

  const sensorIDS = await getSensorID(clickedStationID);
  const sensorData = await getSensorData(sensorIDS);

  return (
    <div className='bg-blue0 flex h-full'>
      <Navigation stations={stations} AQI={AQI} />
      <Sidebar
        clickedStationID={clickedStationID}
        clickedStationAQI={clickedStationAQI}
        sensorData={sensorData}
        AQI={AQI}
        stations={stations}
      />
      <MapComponent stations={stations} AQI={AQI} />
    </div>
  );
}
