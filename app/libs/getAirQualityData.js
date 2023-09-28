export const getAllStations = async () => {
  const res = await fetch(
    'https://api.gios.gov.pl/pjp-api/rest/station/findAll',
    {
      cache: 'no-store',
    }
  );
  const stations = await res.json();

  return stations;
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
  const aqi = [];

  for (const stationId of stationsId) {
    const res = await fetch(
      `https://api.gios.gov.pl/pjp-api/rest/aqindex/getIndex/${stationId}`,
      {
        cache: 'no-store',
      }
    );
    const data = await res.json();
    aqi.push(data);
  }

  return aqi;

  // const apiRequests = stationsId.map(async (stationId) => {
  //   const res = await fetch(
  //     `https://api.gios.gov.pl/pjp-api/rest/aqindex/getIndex/${stationId}`,
  //     {
  //       cache: 'no-store',
  //     }
  //   );

  //   const data = await res.json();

  //   return data;
  // });

  // const aqi = await Promise.all(apiRequests);

  // return aqi;
};
