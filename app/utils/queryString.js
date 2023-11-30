export const createQueryString = (
  name1,
  value1,
  name2,
  value2,
  searchParams
) => {
  const params = new URLSearchParams(searchParams);
  params.set(name1, value1);
  params.set(name2, value2);

  return params.toString();
};

// export const deleteQueryString = (
//   name1,
//   name2,
//   router,
//   pathname,
//   searchParams
// ) => {
//   const params = new URLSearchParams(searchParams);
//   params.delete(name1);
//   params.delete(name2);

//   const path = typeof pathname === 'function' ? pathname() : pathname;

//   router.replace(`${path}?${params.toString()}`, undefined, {
//     shallow: true,
//   });
// };

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

// export const createRaportQueryString = (sensorID, dayNumber) => {
//   const params = new URLSearchParams();
//   params.set('sensorID', sensorID);
//   params.set('dayNumber', dayNumber);

//   return params.toString();
// };

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
