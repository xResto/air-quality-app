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

// export const getAllStations = async () => {
//   try {
//     const res = await fetch('/api/stations');
//     if (!res.ok) {
//       throw new Error(`HTTP error! Status: ${res.status}`);
//     }
//     const data = await res.json();

//     return data.data;
//   } catch (error) {
//     console.error('Error in getAllStations:', error);
//     return null;
//   }
// };

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

export const generateRaport = async (sensorIDString, dateFrom, dateTo) => {
  try {
    if (!sensorIDString || sensorIDString.length === 0) {
      return '';
    }

    const sensorIDs = sensorIDString.split(',');

    const fetchDataFromSensor = async (sensorID) => {
      let allData = [];
      let page = 0;
      let totalPages;

      do {
        const res = await fetch(
          `https://api.gios.gov.pl/pjp-api/v1/rest/archivalData/getDataBySensor/${sensorID}?size=500&dateFrom=${dateFrom}&dateTo=${dateTo}&page=${page}`,
          { cache: 'no-store' }
        );
        const data = await res.json();

        if (data.error_code) {
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

    const reports = await Promise.all(
      sensorIDs.map((sensorID) => fetchDataFromSensor(sensorID))
    );
    return reports;
  } catch (error) {
    console.error('Error fetching reports:', error);
    return [];
  }
};
