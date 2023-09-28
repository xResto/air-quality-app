// import React from 'react';
// import GetSensorData from './getSensorData';

// const getSensorsParams = async (stationsId) => {
//   const sensorsParams = [];
//   for (const stationId of stationsId) {
//     const res = await fetch(
//       `https://api.gios.gov.pl/pjp-api/rest/station/sensors/${stationId}`
//     );
//     const data = await res.json();
//     sensorsParams.push(data);
//   }

//   return sensorsParams;
// };

// const GetSensors = async (props) => {
//   const sensorsParams = await getSensorsParams(props.stationsId);

//   // const allIds = [];

//   // for (const arr in sensorsParams) {
//   //   // console.log(sensorsParams[arr]);
//   //   for (const obj in innerArray) {
//   //     allIds.push(obj.id);
//   //   }
//   // }

//   const allIds = sensorsParams.flatMap(innerArray => innerArray.map(obj => obj.id));

//   // console.log(allIds);

//   return <div>
//     <GetSensorData sensors={allIds} />
//     </div>;
// };

// export default GetSensors;
