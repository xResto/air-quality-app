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
