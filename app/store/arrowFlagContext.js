'use client';

import React, { createContext, useContext, useState } from 'react';

const ArrowFlagContext = createContext(null);

export default function ArrowFlagContextProvider({ children }) {
  const [arrowFlag, setArrowFlag] = useState(false);
  const [coordinate, setCoordinate] = useState({
    lat: 52.077,
    lng: 19.1,
  });
  const [zoom, setZoom] = useState(7);

  return (
    <ArrowFlagContext.Provider
      value={{
        arrowFlag,
        setArrowFlag,
        coordinate,
        setCoordinate,
        zoom,
        setZoom,
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
