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
  // const stationsId = [];

  // for (const station of stations) {
  //   stationsId.push(station.id);
  // }
  const stationsID = stations.map((station) => station.id);

  return stationsID;
};

export const getAqiData = async (stationsID) => {
  // const aqi = [];

  // for (const stationId of stationsId) {
  //   const res = await fetch(
  //     `https://api.gios.gov.pl/pjp-api/rest/aqindex/getIndex/${stationId}`,
  //     {
  //       cache: 'no-store',
  //     }
  //   );
  //   const data = await res.json();
  //   aqi.push(data);
  // }

  // return aqi;
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

export const getSingleStationAQI = async (stationID) => {
  if (!stationID) return null;

  try {
    const res = await fetch(
      `https://api.gios.gov.pl/pjp-api/rest/aqindex/getIndex/${stationID}`,
      {
        cache: 'no-store',
      }
    );

    const data = await res.json();

    const singleStationAqiID = data.stIndexLevel.indexLevelName;

    return singleStationAqiID;
  } catch (reason) {
    return null;
  }
};

export const getSensorID = async (stationID) => {
  if (!stationID) return null;

  try {
    const res = await fetch(
      `https://api.gios.gov.pl/pjp-api/rest/station/sensors/${stationID}`,
      {
        cache: 'no-store',
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
          cache: 'no-store',
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

// const sortSensorData = (sensorData) => {
//   const order = ['PM10', 'PM2.5', 'PM1', 'NO2', 'O3', 'SO2', 'CO', 'C6H6'];

//   if (sensorData) {
//     return sensorData.map((sensor) => {
//       const key = sensor.key;
//       let latestNonNullValue = null;
//       let latestDate = null;

//       for (let i = 0; i < sensor.values.length; i++) {
//         const { date, value } = sensor.values[i];
//         if (value) {
//           latestNonNullValue = value.toFixed(1);
//           latestDate = date;
//           break;
//         }
//       }
//     });
//   }

//   return null;
// };
