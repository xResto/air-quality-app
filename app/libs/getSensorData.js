// import React from 'react';

// const getSensorData = async (sensors) => {
//   const sensorsData = [];

//   for (const sensor of sensors) {
//     const res = await fetch(
//       `https://api.gios.gov.pl/pjp-api/rest/data/getData/${sensor}`
//     );
//     const data = await res.json();
//     sensorsData.push(data);
//   }
//   return sensorsData;
// };

// const GetSensorData = async (props) => {
//   const sensorsData = await getSensorData(props.sensors);
// //   for (const sensorValue of sensorsData) {
// //     console.log(sensorValue.values);
// //   }

//   return <div>GetSensorData</div>;
// };

// export default GetSensorData;
