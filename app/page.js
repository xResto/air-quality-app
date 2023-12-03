import React from 'react';
import {
  getAllStations,
  getAqiData,
  getSensorID,
  getSensorData,
  generateRaport,
} from './lib/getAirQualityData';
import { getWindData } from './lib/getWindData';
import Display from './components/Display';

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
  // const windData = thisStation
  //   ? await getWindData(thisStation.gegrLat, thisStation.gegrLon)
  //   : null;

  // Raport
  const sensorQueryID = searchParams?.sensorID ?? '';
  const dateFrom = searchParams?.dateFrom ?? '';
  const dateTo = searchParams?.dateTo ?? '';

  const raport = await generateRaport(sensorQueryID, dateFrom, dateTo);
  console.log(raport);

  return (
    // <div className='bg-blue0 sm:flex sm:h-full'>
    //   <div className='hidden sm:block'>
    //     <Navigation stations={stations} AQI={AQI} />
    //   </div>
    //   <Sidebar
    //     clickedStationID={clickedStationID}
    //     clickedStationAQI={clickedStationAQI}
    //     sensorData={sensorData}
    //     AQI={AQI}
    //     stations={stations}
    //     thisStation={thisStation}
    //     // windData={windData}
    //     raport={raport}
    //     sensorIDsData={sensorIDsData}
    //   />
    //   <div className='flex flex-col sm:flex-grow h-screen'>
    //     <MapComponent
    //       stations={stations}
    //       AQI={AQI}
    //       clickedStationID={clickedStationID}
    //     />
    //     <div className='sm:hidden'>
    //       <Navigation stations={stations} AQI={AQI} />
    //     </div>
    //   </div>
    // </div>
    <Display
      clickedStationID={clickedStationID}
      clickedStationAQI={clickedStationAQI}
      sensorData={sensorData}
      AQI={AQI}
      stations={stations}
      thisStation={thisStation}
      // windData={windData}
      raport={raport}
      sensorIDsData={sensorIDsData}
    />
  );
}
