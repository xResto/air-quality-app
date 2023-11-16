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

export default async function Page({ searchParams }) {
  // Map
  const { stations, stationsID } = await getAllStations();
  const AQI = await getAqiData(stationsID);

  Sidebar;
  const clickedStationID = searchParams?.stationID ?? '';
  const clickedStationAQI = searchParams?.stationAQI ?? '';

  const sensorIDS = await getSensorID(clickedStationID);
  const sensorData = await getSensorData(sensorIDS);

  return (
    <div className='bg-blue0 flex h-full'>
      <Navigation
        stations={stations}
        AQI={AQI}
      />
      <Sidebar
        clickedStationID={clickedStationID}
        clickedStationAQI={clickedStationAQI}
        sensorData={sensorData}
        AQI={AQI}
        stations={stations}
      />
      <MapComponent
        stations={stations}
        AQI={AQI}
        clickedStationID={clickedStationID}
      />
    </div>
  );
}
