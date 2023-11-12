'use client';

import React, { createContext, useContext, useState } from 'react';

const ArrowFlagContext = createContext(null);

export default function ArrowFlagContextProvider({ children }) {
  const [arrowFlag, setArrowFlag] = useState(false);

  return (
    <ArrowFlagContext.Provider value={{ arrowFlag, setArrowFlag }}>
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
