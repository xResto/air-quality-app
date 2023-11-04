export const getAllStations = async () => {
  try {
    const res = await fetch(
      'https://api.gios.gov.pl/pjp-api/rest/station/findAll',
      {
        next: { revalidate: 43200 },
      }
    );
    const stations = await res.json();

    return stations;
  } catch (reason) {
    return null;
  }
};

export const getStationsID = (stations) => {
  const stationsID = stations.map((station) => station.id);

  return stationsID;
};

export const getAqiData = async (stationsID) => {
  if (!stationsID) return null;

  const aqiRequests = stationsID.map(async (stationID) => {
    if (!stationID) return null;

    try {
      const res = await fetch(
        `https://api.gios.gov.pl/pjp-api/rest/aqindex/getIndex/${stationID}`,
        {
          next: { revalidate: 900 },
        }
      );

      const data = await res.json();

      return data;
    } catch (reason) {
      return null;
    }
  });

  const aqi = await Promise.all(aqiRequests);

  return aqi;
};

// export const getSingleStationAQI = async (stationID) => {
//   if (!stationID) return null;

//   try {
//     const res = await fetch(
//       `https://api.gios.gov.pl/pjp-api/rest/aqindex/getIndex/${stationID}`,
//       {
//         cache: 'no-store',
//       }
//     );

//     const data = await res.json();

//     const singleStationAqiID = data.stIndexLevel.indexLevelName;

//     return singleStationAqiID;
//   } catch (reason) {
//     return null;
//   }
// };

export const getSensorID = async (stationID) => {
  if (!stationID) return null;

  try {
    const res = await fetch(
      `https://api.gios.gov.pl/pjp-api/rest/station/sensors/${stationID}`,
      {
        next: { revalidate: 900 },
      }
    );

    const data = await res.json();

    const sensorsID = data.map((data) => data.id);

    return sensorsID;
  } catch (reason) {
    return null;
  }
};

export const getSensorData = async (sensorIDs) => {
  if (!sensorIDs) return null;

  const sensorDataRequests = sensorIDs.map(async (sensorID) => {
    try {
      const res = await fetch(
        `https://api.gios.gov.pl/pjp-api/rest/data/getData/${sensorID}`,
        {
          next: { revalidate: 60 },
        }
      );

      const data = await res.json();

      return data;
    } catch (reason) {
      return null;
    }
  });

  const sensorData = await Promise.all(sensorDataRequests);

  return sensorData;
};
