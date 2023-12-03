'use client';
import React from 'react';
import MapComponent from './Map';
import Navigation from './Navigation';
import Sidebar from './Sidebar';
import { useArrowFlagContext } from '../store/arrowFlagContext';

const Display = ({
  clickedStationID,
  clickedStationAQI,
  sensorData,
  AQI,
  stations,
  thisStation,
  raport,
  sensorIDsData,
}) => {
  const { isSidebarOpen } = useArrowFlagContext();
  return (
    <div className='bg-blue0 sm:flex sm:h-full'>
      <div className='hidden sm:block'>
        <Navigation stations={stations} AQI={AQI} />
      </div>
      <div className='sm:block hidden'>
        <Sidebar
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
      </div>
      <div className='flex flex-col flex-grow h-[100svh]'>
        <div className={`sm:hidden overflow-auto ${isSidebarOpen ? '' : 'hidden'}`}>
          <Sidebar
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
        </div>
        <MapComponent
          stations={stations}
          AQI={AQI}
          clickedStationID={clickedStationID}
        />
        <div className='sm:hidden '>
          <Navigation stations={stations} AQI={AQI} />
        </div>
      </div>
    </div>
  );
};

export default Display;
