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

export const getStationsId = (stations) => {
  // const stationsId = [];

  // for (const station of stations) {
  //   stationsId.push(station.id);
  // }
  const stationsId = stations.map((station) => station.id);

  return stationsId;
};

export const getAqiData = async (stationsId) => {
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
  if (!stationsId) return null;

  const aqiRequests = stationsId.map(async (stationId) => {
    if (!stationId) return null;

    try {
      const res = await fetch(
        `https://api.gios.gov.pl/pjp-api/rest/aqindex/getIndex/${stationId}`,
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

export const getSingleStationAQI = async (stationId) => {
  if (!stationId) return null;

  try {
    const res = await fetch(
      `https://api.gios.gov.pl/pjp-api/rest/aqindex/getIndex/${stationId}`,
      {
        cache: 'no-store',
      }
    );

    const data = await res.json();

    const singleStationAqiId = data.stIndexLevel.indexLevelName;

    return singleStationAqiId;
  } catch (reason) {
    return null;
  }
};

export const getSensorId = async (stationId) => {
  if (!stationId) return null;

  try {
    const res = await fetch(
      `https://api.gios.gov.pl/pjp-api/rest/station/sensors/${stationId}`,
      {
        cache: 'no-store',
      }
    );

    const data = await res.json();

    const sensorsId = data.map((data) => data.id);

    return sensorsId;
  } catch (reason) {
    return null;
  }
};

export const getSensorData = async (sensorIds) => {
  if (!sensorIds) return null;

  const sensorDataRequests = sensorIds.map(async (sensorId) => {
    try {
      const res = await fetch(
        `https://api.gios.gov.pl/pjp-api/rest/data/getData/${sensorId}`,
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
