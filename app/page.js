import { Navigation } from './components/Navigation';
import Map from './components/Map';
import {
  getAllStations,
  getAqiData,
  getSensorId,
  getStationsId,
  getSensorData,
  getSingleStationAQI,
} from './libs/getAirQualityData';

export const dynamic = 'force-dynamic';

export default async function Page({ searchParams }) {
  // Map
  const stations = await getAllStations();
  const stationsId = getStationsId(stations);
  const AQI = await getAqiData(stationsId);

  // Navigation
  const clickedStationId = searchParams?.stationId ?? '';
  const sensorIds = await getSensorId(clickedStationId);
  const sensorData = await getSensorData(sensorIds);
  const singleStationAQI = await getSingleStationAQI(clickedStationId);

  const order = ['PM10', 'PM2.5', 'PM1', 'NO2', 'O3', 'SO2', 'CO', 'C6H6'];

  return (
    <div className='bg-slate-800 h-full'>
      <Navigation
        sensorData={sensorData}
        sensorIds={sensorIds}
        singleStationAQI={singleStationAQI}
      />
      <Map stations={stations} AQI={AQI} />
    </div>
  );
}
