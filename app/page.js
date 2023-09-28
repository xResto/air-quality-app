import Map from './components/Map';
import {
  getAllStations,
  getAqiData,
  getStationsId,
} from './libs/getAirQualityData';

export default async function Page() {
  const stations = await getAllStations();
  const stationsId = getStationsId(stations);
  const AQI = await getAqiData(stationsId);

  return (
    <div className='bg-slate-800 h-full'>
      <Map stations={stations} AQI={AQI} />
    </div>
  );
}
