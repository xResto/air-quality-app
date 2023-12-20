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
  console.log('Deleting Query String:', namesToDelete);
  const params = new URLSearchParams(searchParams);

  namesToDelete.forEach((name) => {
    params.delete(name);
  });
  console.log('Updated Params:', params.toString());

  router.replace(`${pathname}?${params.toString()}`);
};

export const createRaportQueryString = (
  sensorID,
  dateFrom,
  dateTo,
  existingSearchParams
) => {
  const params = new URLSearchParams(existingSearchParams);

  params.delete('sensorID');

  if (sensorID) {
    params.set('sensorID', sensorID);
  }

  if (dateFrom) {
    params.set('dateFrom', dateFrom);
  }

  if (dateTo) {
    params.set('dateTo', dateTo);
  }

  return params.toString();
};
