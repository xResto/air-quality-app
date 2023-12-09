export const createQueryString = (name1, value1, searchParams) => {
  const params = new URLSearchParams(searchParams);
  params.set(name1, value1);

  return params.toString();
};

export const deleteQueryString = (
  namesToDelete,
  router,
  pathname,
  searchParams
) => {
  const params = new URLSearchParams(searchParams);

  namesToDelete.forEach((name) => {
    params.delete(name);
  });

  const path = typeof pathname === 'function' ? pathname() : pathname;
  router.replace(`${path}?${params.toString()}`, undefined, { shallow: true });
};

export const createRaportQueryString = (
  sensorIDs,
  dateFrom,
  dateTo,
  existingSearchParams
) => {
  const params = new URLSearchParams(existingSearchParams);

  params.delete('sensorID');

  if (sensorIDs.length > 0) {
    const sensorIDString = sensorIDs.join(',');
    params.set('sensorID', sensorIDString);
  } else {
    params.set('sensorID', sensorIDs);
  }

  if (dateFrom) {
    params.set('dateFrom', dateFrom);
  }
  if (dateTo) {
    params.set('dateTo', dateTo);
  }

  return params.toString();
};
