'use client';

import React, { createContext, useContext, useState } from 'react';

const ArrowFlagContext = createContext(null);

export default function ArrowFlagContextProvider({ children }) {
  const [coordinate, setCoordinate] = useState({
    lat: 52.077,
    lng: 18.8,
  });
  const [zoom, setZoom] = useState(7);
  const [bookmark, setBookmark] = useState('ranking');
  const [isLoading, setIsLoading] = useState(false);
  const [userClosestStation, setUserClosestStation] = useState(null);
  const [isMarkerSelected, setIsMarkerSelected] = useState(false);
  const [selectedStationID, setSelectedStationID] = useState(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  return (
    <ArrowFlagContext.Provider
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
        isGoogleMapsLoaded,
        setIsGoogleMapsLoaded,
      }}
    >
      {children}
    </ArrowFlagContext.Provider>
  );
}

export function useArrowFlagContext() {
  const context = useContext(ArrowFlagContext);

  if (context === undefined) {
    throw new Error(
      'useArrowFlag must be used within a ArrowFlagContextProvider'
    );
  }

  return context;
}
