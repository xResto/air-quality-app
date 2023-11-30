import React from 'react';
import Sidebar from './components/Sidebar';
import Navigation from './components/Navigation';
import MapComponent from './components/Map';
import {
  getAllStations,
  getAqiData,
  getSensorID,
  getSensorData,
  generateRaport,
} from './lib/getAirQualityData';
import { getWindData } from './lib/getWindData';

// export const dynamic = 'force-dynamic';

export default async function Page({ searchParams }) {
  // Map
  const { stations, stationsID } = await getAllStations();
  const AQI = await getAqiData(stationsID);

  // Sidebar
  const clickedStationID = searchParams?.stationID ?? '';
  const clickedStationAQI = searchParams?.stationAQI ?? '';
  const thisStation = clickedStationID
    ? stations.find((station) => station.id == clickedStationID)
    : null;

  const { sensorIDsData, sensorIDs } =
    (await getSensorID(clickedStationID)) || {};
  const sensorData = await getSensorData(sensorIDs);
  const windData = thisStation
    ? await getWindData(thisStation.gegrLat, thisStation.gegrLon)
    : null;

  // Raport
  const sensorQueryID = searchParams?.sensorID ?? '';
  const dateFrom = searchParams?.dateFrom ?? '';
  const dateTo = searchParams?.dateTo ?? '';

  const raport = await generateRaport(sensorQueryID, dateFrom, dateTo);
  console.log(raport);

  return (
    <div className='bg-blue0 flex h-full'>
      <Navigation stations={stations} AQI={AQI} />
      <Sidebar
        clickedStationID={clickedStationID}
        clickedStationAQI={clickedStationAQI}
        sensorData={sensorData}
        AQI={AQI}
        stations={stations}
        thisStation={thisStation}
        windData={windData}
        raport={raport}
        sensorIDsData={sensorIDsData}
      />
      <MapComponent
        stations={stations}
        AQI={AQI}
        clickedStationID={clickedStationID}
      />
    </div>
  );
}
