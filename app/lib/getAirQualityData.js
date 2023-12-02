export const getAllStations = async () => {
  try {
    const res = await fetch(
      'https://api.gios.gov.pl/pjp-api/rest/station/findAll',
      {
        next: { revalidate: 21600 },
      }
    );
    const stations = await res.json();

    const stationsID = stations.map((station) => station.id);

    return { stations, stationsID };
  } catch (error) {
    return null;
  }
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
    } catch (error) {
      return null;
    }
  });

  const aqi = await Promise.all(aqiRequests);

  return aqi;
};

export const getSensorID = async (stationID) => {
  if (!stationID) return null;

  try {
    const res = await fetch(
      `https://api.gios.gov.pl/pjp-api/rest/station/sensors/${stationID}`,
      {
        next: { revalidate: 21600 },
      }
    );

    const sensorIDsData = await res.json();

    const sensorIDs = sensorIDsData.map((data) => data.id);

    return { sensorIDsData, sensorIDs };
  } catch (error) {
    return null;
  }
};

export const getSensorData = async (sensorIDs) => {
  if (!sensorIDs) return null;

  const reformatDateString = (dateStr) => {
    const dateTimeParts = dateStr.split(' ');
    const dateParts = dateTimeParts[0].split('-');
    const timePart = dateTimeParts[1];

    const reformattedDate = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;

    return `${reformattedDate} ${timePart}`;
  };

  const sensorDataRequests = sensorIDs.map(async (sensorID) => {
    try {
      const res = await fetch(
        `https://api.gios.gov.pl/pjp-api/rest/data/getData/${sensorID}`,
        {
          cache: 'no-store',
          // next: { revalidate: 300 },
        }
      );

      const data = await res.json();

      if (data && data.values) {
        data.values.forEach((entry) => {
          if (entry.date) {
            entry.date = reformatDateString(entry.date);
          }
        });
      }

      return data;
    } catch (error) {
      return null;
    }
  });

  const sensorData = await Promise.all(sensorDataRequests);

  const order = ['PM10', 'PM2.5', 'O3', 'NO2', 'SO2', 'C6H6', 'CO'];

  sensorData.sort((a, b) => {
    if (!a || !b) return null;
    return order.indexOf(a.key) - order.indexOf(b.key);
  });

  return sensorData;
};

// export const generateRaport = async (sensorIDString, dateFrom, dateTo) => {
//   try {
//     // Check if sensorIDString is valid and not empty
//     if (!sensorIDString || sensorIDString.length === 0) {
//       console.error("Invalid or empty sensorIDString");
//       return [];
//     }

//     // Split the sensorID string into an array of IDs
//     const sensorIDs = sensorIDString.split(',');

//     // If there's only one sensorID, handle it directly
//     if (sensorIDs.length === 1) {
//       const res = await fetch(
//         `https://api.gios.gov.pl/pjp-api/v1/rest/archivalData/getDataBySensor/${sensorIDs[0]}?size=500&dateFrom=${dateFrom}&dateTo=${dateTo}`,
//         { cache: 'no-store' }
//       );
//       const data = await res.json();
//       return [data['Lista archiwalnych wyników pomiarów']]; // Return as an array for consistency
//     }

//     // Handle multiple sensorIDs
//     const reports = await Promise.all(
//       sensorIDs.map(async (sensorID) => {
//         const res = await fetch(
//           `https://api.gios.gov.pl/pjp-api/v1/rest/archivalData/getDataBySensor/${sensorID}?size=500&dateFrom=${dateFrom}&dateTo=${dateTo}`,
//           { cache: 'no-store' }
//         );
//         const data = await res.json();
//         return data['Lista archiwalnych wyników pomiarów'];
//       })
//     );
//     return reports;
//   } catch (error) {
//     console.error("Error fetching reports:", error);
//     return [];
//   }
// };

export const generateRaport = async (sensorIDString, dateFrom, dateTo) => {
  try {
    // Check if sensorIDString is valid and not empty
    if (!sensorIDString || sensorIDString.length === 0) {
      return '';
    }

    // Split the sensorID string into an array of IDs
    const sensorIDs = sensorIDString.split(',');

    // Function to fetch data from a single sensor with pagination handling
    const fetchDataFromSensor = async (sensorID) => {
      let allData = [];
      let page = 0;
      let totalPages;

      do {
        const res = await fetch(
          `https://api.gios.gov.pl/pjp-api/v1/rest/archivalData/getDataBySensor/${sensorID}?size=500&dateFrom=${dateFrom}&dateTo=${dateTo}&page=${page}`
          // { cache: 'no-store' }
        );
        const data = await res.json();

        if (data.error_code) {
          // allData = data.error_result;
          console.log('error za szybko');
        }
        if (!data.error_code) {
          allData = allData.concat(data['Lista archiwalnych wyników pomiarów']);
          totalPages = data.totalPages;
        }

        page++;
      } while (page < totalPages);

      return allData;
    };

    // Handle multiple sensorIDs
    const reports = await Promise.all(
      sensorIDs.map((sensorID) => fetchDataFromSensor(sensorID))
    );
    return reports;
  } catch (error) {
    console.error('Error fetching reports:', error);
    return [];
  }
};
