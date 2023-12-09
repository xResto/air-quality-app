import React from 'react';
import {
  getAllStations,
  getAqiData,
  getSensorID,
  getSensorData,
  generateRaport,
} from './lib/getAirQualityData';
import { getWeatherData } from './lib/getWeatherData';
import Display from './components/Display';

// export const dynamic = 'force-dynamic';

export default async function Page({ searchParams }) {
  // Map
  const { stations, stationsID } = await getAllStations();
  const AQI = await getAqiData(stationsID);

  // Sidebar
  const clickedStationID = searchParams?.stationID ?? '';

  const thisStation = clickedStationID
    ? stations.find((station) => station.id == clickedStationID)
    : null;

  const { sensorIDsData, sensorIDs } =
    (await getSensorID(clickedStationID)) || {};
  const sensorData = await getSensorData(sensorIDs);

  // WindData
  // const weatherData = thisStation
  //   ? await getWeatherData(thisStation.gegrLat, thisStation.gegrLon)
  //   : null;

  // Raport
  const sensorQueryID = searchParams?.sensorID ?? '';
  const dateFrom = searchParams?.dateFrom ?? '';
  const dateTo = searchParams?.dateTo ?? '';

  const raport = await generateRaport(sensorQueryID, dateFrom, dateTo);

  return (
    <Display
      clickedStationID={clickedStationID}
      sensorData={sensorData}
      AQI={AQI}
      stations={stations}
      thisStation={thisStation}
      // weatherData={weatherData}
      raport={raport}
      sensorIDsData={sensorIDsData}
    />
  );
}
