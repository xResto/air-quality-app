'use client';
import React from 'react';
import { useMainContext } from '@/app/store/MainContext';

const MobileReturnButton = () => {
  const { selectedStationID, setIsSidebarOpen } = useMainContext();
  return (
    <>
      {selectedStationID && (
        <button
          className='sm:hidden absolute top-1 left-1 z-1000 bg-blue1 text-white text-sm font-medium px-2 py-1 rounded-md cursor-pointer'
          onClick={() => setIsSidebarOpen(true)}
        >
          Powrót
        </button>
      )}
    </>
  );
};

export default MobileReturnButton;
