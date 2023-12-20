'use client';

import React, { createContext, useContext, useState } from 'react';

const MainContext = createContext(null);

export default function MainContextProvider({ children }) {
  const [coordinate, setCoordinate] = useState({
    lat: 52.077,
    lng: 19,
  });
  const [zoom, setZoom] = useState(7);
  const [bookmark, setBookmark] = useState('ranking');
  const [isLoading, setIsLoading] = useState(false);
  const [userClosestStation, setUserClosestStation] = useState(null);
  const [isMarkerSelected, setIsMarkerSelected] = useState(false);
  const [selectedStationID, setSelectedStationID] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedPollutant, setSelectedPollutant] = useState([]);
  const [isRaportActive, setIsRaportActive] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileRankingOpen, setIsMobileRankingOpen] = useState(false);
  const [selectedDateFrom, setSelectedDateFrom] = useState(null);
  const [selectedDateTo, setSelectedDateTo] = useState(null);
  const [findClosest, setFindClosest] = useState(false);

  return (
    <MainContext.Provider
      value={{
        bookmark,
        setBookmark,
        coordinate,
        setCoordinate,
        zoom,
        setZoom,
        isLoading,
        setIsLoading,
        userClosestStation,
        setUserClosestStation,
        isMarkerSelected,
        setIsMarkerSelected,
        selectedStationID,
        setSelectedStationID,
        isMapLoaded,
        setIsMapLoaded,
        selectedPollutant,
        setSelectedPollutant,
        isRaportActive,
        setIsRaportActive,
        isSidebarOpen,
        setIsSidebarOpen,
        isMobileRankingOpen,
        setIsMobileRankingOpen,
        selectedDateFrom,
        setSelectedDateFrom,
        selectedDateTo,
        setSelectedDateTo,
        findClosest,
        setFindClosest,
      }}
    >
      {children}
    </MainContext.Provider>
  );
}

export function useMainContext() {
  const context = useContext(MainContext);

  if (context === undefined) {
    throw new Error('useArrowFlag must be used within a MainContextProvider');
  }

  return context;
}
