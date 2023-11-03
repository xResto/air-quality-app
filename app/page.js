import { Navigation } from './components/Navigation';
import Map from './components/Map';
import {
  getAllStations,
  getAqiData,
  getSensorID,
  getStationsID,
  getSensorData,
  getSingleStationAQI,
} from './lib/getAirQualityData';

export const dynamic = 'force-dynamic';

export default async function Page({ searchParams }) {
  // Map
  const stations = await getAllStations();
  const stationsID = getStationsID(stations);
  const AQI = await getAqiData(stationsID);

  // Navigation
  const clickedStationID = searchParams?.stationID ?? '';
  const clickedStationAQI = searchParams?.stationAQI ?? '';

  const sensorIDs = await getSensorID(clickedStationID);

  const sensorData = await getSensorData(sensorIDs);

  const order = ['PM10', 'PM2.5', 'PM1', 'NO2', 'O3', 'SO2', 'CO', 'C6H6'];

  return (
    <div className='bg-slate-800 h-full'>
      <Navigation
        clickedStationAQI={clickedStationAQI}
        sensorData={sensorData}
        // sensorIDs={sensorIDs}
      />
      <Map stations={stations} AQI={AQI} />
    </div>
  );
}
