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
          next: { revalidate: 300 },
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
        next: { revalidate: 900 },
      }
    );

    const data = await res.json();

    const sensorsID = data.map((data) => data.id);

    return sensorsID;
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
        data.values.forEach(entry => {
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
    return order.indexOf(a.key) - order.indexOf(b.key);
  });

  return sensorData;
};
