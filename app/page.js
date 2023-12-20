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

export default async function Page({ searchParams }) {
  // Map
  const { stations, stationsID } = await getAllStations();
  const AQI = await getAqiData(stationsID);

  // Sidebar
  const clickedStationID = searchParams?.stationID ?? '';

  const thisStation = clickedStationID
    ? stations.find((station) => station.id == clickedStationID)
    : null;

  const sensorIDResult = await getSensorID(clickedStationID);
  const { sensorIDsData, sensorIDs } = sensorIDResult || {};
  const sensorData = await getSensorData(sensorIDs);

  //  WeatherData
  const weatherData = thisStation
    ? await getWeatherData(thisStation.gegrLat, thisStation.gegrLon)
    : null;

  const [resolvedSensorData, resolvedWeatherData] = await Promise.all([
    sensorData,
    weatherData,
  ]);

  // Raport
  const sensorQueryID = searchParams?.sensorID ?? '';
  const dateFrom = searchParams?.dateFrom ?? '';
  const dateTo = searchParams?.dateTo ?? '';

  const raport = await generateRaport(sensorQueryID, dateFrom, dateTo);

  return (
    <Display
      clickedStationID={clickedStationID}
      sensorData={resolvedSensorData}
      AQI={AQI}
      stations={stations}
      thisStation={thisStation}
      weatherData={resolvedWeatherData}
      raport={raport}
      sensorIDsData={sensorIDsData}
    />
  );
}
