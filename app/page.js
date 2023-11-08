import { Navigation } from './components/Navigation';
import Map from './components/Map';
import {
  getAllStations,
  getAqiData,
  getSensorID,
  getSensorData,
} from './lib/getAirQualityData';

export const dynamic = 'force-dynamic';

export default async function Page({ searchParams }) {
  // Map
  const { stations, stationsID } = await getAllStations();
  const AQI = await getAqiData(stationsID);

  // Navigation
  const clickedStationID = searchParams?.stationID ?? '';
  const clickedStationAQI = searchParams?.stationAQI ?? '';
  const sensorIDs = await getSensorID(clickedStationID);
  const sensorData = await getSensorData(sensorIDs);

  return (
    <div className='bg-slate-800 h-full w-full'>
      <Navigation
        clickedStationAQI={clickedStationAQI}
        sensorData={sensorData}
      />
      <Map stations={stations} AQI={AQI} />
    </div>
  );
}
