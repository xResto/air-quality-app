import { Navigation } from './components/Navigation';
import Map from './components/Map';
import {
  getAllStations,
  getAqiData,
  getSensorID,
  getSensorData,
} from './lib/getAirQualityData';

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

  // Navigation
  const clickedStationID = searchParams?.stationID ?? '';
  const clickedStationAQI = searchParams?.stationAQI ?? '';
  const sensorIDS = await getSensorID(clickedStationID);
  const sensorData = await getSensorData(sensorIDS);

  return (
    <div className='bg-blue0 h-full flex'>
      <Navigation
        clickedStationID={clickedStationID}
        clickedStationAQI={clickedStationAQI}
        sensorData={sensorData}
        AQI={AQI}
        stations={stations}
      />
      <Map stations={stations} AQI={AQI} />
    </div>
  );
}
