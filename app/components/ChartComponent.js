import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const ChartComponent = ({ sensorData }) => {
  // const [filteredSensorData, setFilteredSensorData] = useState([]);

  // const options = {
  //   responsive: true,
  //   scales: {
  //     x: {
  //       display: false,
  //       title: {
  //          display: true,
  //          text: 'days'
  //       }
  //     },
  //   },
  // };

  const filteredSensorData = sensorData.filter(
    (sensor) =>
      sensor.key !== 'CO' &&
      sensor.key !== 'C6H6' &&
      sensor.values.length !== 0 &&
      sensor.values.value !== null
  );

  const getDataset = filteredSensorData.map((sensor) => {
    const key = sensor.key;
    let colorRanges = [];

    const nonNullValues = sensor.values
      .map((entry) => entry.value)
      .filter((value) => value !== null);

    const maxSensorValue =
      nonNullValues.length > 0 ? Math.max(...nonNullValues) : 0;

    switch (key) {
      case 'PM10':
        colorRanges = [20, 50, 80, 110, 150, maxSensorValue + 1];
        break;
      case 'PM2.5':
        colorRanges = [13, 35, 55, 75, 110, maxSensorValue + 1];
        break;
      case 'O3':
        colorRanges = [70, 120, 150, 180, 240, maxSensorValue + 1];
        break;
      case 'NO2':
        colorRanges = [40, 100, 150, 230, 400, maxSensorValue + 1];
        break;
      case 'SO2':
        colorRanges = [50, 100, 200, 350, 500, maxSensorValue + 1];
        break;
      default:
        colorRanges = [];
    }

    const colorPalette = [
      '#108404',
      '#18cc04',
      '#f4f804',
      '#ff7c04',
      '#e00404',
      '#98046c',
    ];

    const nonNullSensorDataValues = sensor.values.filter(
      (entry) => entry.value !== null
    );

    const color = nonNullSensorDataValues.map((entry) => {
      const colorIndex = colorRanges.findIndex((range) => entry.value <= range);
      return colorPalette[colorIndex];
    });

    const data = {
      labels: nonNullSensorDataValues.map((entry) => entry.date),
      datasets: [
        {
          data: nonNullSensorDataValues.map((entry) => entry.value),
          backgroundColor: color,
        },
      ],
    };

    // Labels
    const latestDate = `Dziś ${nonNullSensorDataValues[0].date.slice(-8, -3)}`;
    const middleDate = nonNullSensorDataValues[
      Math.floor(nonNullSensorDataValues.length / 2)
    ].date
      .slice(-14, -3)
      .replace('-', '.');
    const oldestDate = nonNullSensorDataValues[
      nonNullSensorDataValues.length - 1
    ].date
      .slice(-14, -3)
      .replace('-', '.');

    return { key, data, latestDate, middleDate, oldestDate };
  });
  const dataset = getDataset;

  return (
    <section>
      {dataset.map((data, index) => (
        <>
          {/* <div>{data.key}</div> */}
          <Bar
            key={index}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: data.key,
                },
              },
              scales: {
                x: {
                  display: false,
                },
                // y: {
                //   title: {
                //     display: true,
                //     text: data.key,
                //   },
                // },
              },
            }}
            data={data.data}
          />
          <div className='flex justify-between text-xs'>
            <p>{data.latestDate}</p>
            <p>{data.middleDate}</p>
            <p>{data.oldestDate}</p>
          </div>
        </>
      ))}
    </section>
  );
};

// <div className='flex justify-between text-xs'>
//         <p>{latestDate}</p>
//         <p>{middleDate}</p>
//         <p>{oldestDate}</p>
//      </div>
// Colors
// const getChart = (sensorData) => {
//   if (sensorData.length === 0) return null;

//   return sensorData.map((sensor) => {
//     if (
//       sensor.values.length === 0 ||
//       sensor.key === 'CO' ||
//       sensor.key === 'C6H6'
//     )
//       return null;

//     const colorData = (sensor) => {
//       const maxSensorValue = Math.max(
//         ...sensor.values.map((entry) => entry.value)
//       );

//       // const PM10colorRanges = [20, 50, 80, 110, 150, maxSensorValue + 1];
//       // const PM2_5colorRanges = [13, 35, 55, 75, 110, maxSensorValue + 1];
//       // const O3colorRanges = [70, 120, 150, 180, 240, maxSensorValue + 1];
//       // const NO2colorRanges = [40, 100, 150, 230, 400, maxSensorValue + 1];
//       // const SO2colorRanges = [50, 100, 200, 350, 500, maxSensorValue + 1];

//       switch (sensor.key) {
//         case 'PM10':
//           // setColorRanges(...PM10colorRanges);
//           setColorRanges([20, 50, 80, 110, 150, maxSensorValue + 1]);
//           break;
//         case 'PM2.5':
//           // setColorRanges(...PM2_5colorRanges);
//           setColorRanges([13, 35, 55, 75, 110, maxSensorValue + 1]);
//           break;
//         case 'O3':
//           // setColorRanges(...O3colorRanges);
//           setColorRanges([70, 120, 150, 180, 240, maxSensorValue + 1]);
//           break;
//         case 'NO2':
//           // setColorRanges(...NO2colorRanges);
//           setColorRanges([40, 100, 150, 230, 400, maxSensorValue + 1]);
//           break;
//         case 'SO2':
//           // setColorRanges(...SO2colorRanges);
//           setColorRanges([50, 100, 200, 350, 500, maxSensorValue + 1]);
//           break;
//       }

//       const colorPalette = [
//         '#108404',
//         '#18cc04',
//         '#f4f804',
//         '#ff7c04',
//         '#e00404',
//         '#98046c',
//       ];

//       const colors = sensor.values.map((entry) => {
//         const colorIndex = colorRanges.findIndex(
//           (range) => entry.value <= range
//         );
//         return colorPalette[colorIndex];
//       });
//       return colors;
//     };
//   })

// // Labels
// const getDateLabels = () => {
//   const latestDate = `Dziś ${nonNullSensorDataValues[0].date.slice(
//     -8,
//     -3
//   )}`;
//   const middleDate = nonNullSensorDataValues[
//     Math.floor(nonNullSensorDataValues.length / 2)
//   ].date
//     .slice(-14, -3)
//     .replace('-', '.');
//   const oldestDate = nonNullSensorDataValues[
//     nonNullSensorDataValues.length - 1
//   ].date
//     .slice(-14, -3)
//     .replace('-', '.');
//   return { latestDate, middleDate, oldestDate };
// };

//   return (
//     {/* {getChart(sensorData)} */}
//   <div className='flex justify-between text-xs'>
//   <p>{latestDate}</p>
//   <p>{middleDate}</p>
//   <p>{oldestDate}</p>
// </div>
//   )

export default ChartComponent;

// // sensorData.map((sensor) => {
// //   if (
// //     !sensorData ||
// //     !sensorData[i].values ||
// //     sensorData[i].values.length === 0 ||
// //     sensorData[i].key === 'CO' ||
// //     sensorData[i].key === 'C6H6'
// //   )
// //     return null;

// //   const maxSensorValue = Math.max(
// //     ...sensorData[i].values.map((entry) => entry.value)
// //   );

// //   const PM10colorRanges = [20, 50, 80, 110, 150, maxSensorValue + 1];
// //   const PM2_5colorRanges = [13, 35, 55, 75, 110, maxSensorValue + 1];
// //   const O3colorRanges = [70, 120, 150, 180, 240, maxSensorValue + 1];
// //   const NO2colorRanges = [40, 100, 150, 230, 400, maxSensorValue + 1];
// //   const SO2colorRanges = [50, 100, 200, 350, 500, maxSensorValue + 1];

// //   const order = ['PM10', 'PM2.5', 'NO2', 'O3', 'SO2', 'CO', 'C6H6'];

// //   switch (sensorData[i].key) {
// //     case 'PM10':
// //       setColorRanges(...PM10colorRanges);
// //       break;
// //     case 'PM2.5':
// //       setColorRanges(...PM2_5colorRanges);
// //       break;
// //     case 'O3':
// //       setColorRanges(...O3colorRanges);
// //       break;
// //     case 'NO2':
// //       setColorRanges(...NO2colorRanges);
// //       break;
// //     case 'SO2':
// //       setColorRanges(...SO2colorRanges);
// //       break;
// //   }

// //   const colorPalette = [
// //     '#108404',
// //     '#18cc04',
// //     '#f4f804',
// //     '#ff7c04',
// //     '#e00404',
// //     '#98046c',
// //   ];

// //   const colors = sensorData.values.map((entry) => {
// //     const colorIndex = colorRanges.findIndex(
// //       (range) => entry.value <= range
// //     );
// //     return colorPalette[colorIndex];
// //   });
// //   return colors;
// // });

// import React from 'react';
// import { Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
// } from 'chart.js';

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

// const ChartComponent = ({ sensorData }) => {
//   const options = {
//     responsive: true,
//     scales: {
//       x: {
//         display: false,
//       },
//     },
//   };

//   const generateDatasets = () => {
//     const validKeys = ['PM10', 'PM2.5', 'O3', 'NO2', 'SO2'];
//     const colorPalette = [
//       '#108404',
//       '#18cc04',
//       '#f4f804',
//       '#ff7c04',
//       '#e00404',
//       '#98046c',
//     ]

//     return sensorData
//       .filter((sensor) => validKeys.includes(sensor.key) && sensor.key !== 'CO' && sensor.key !== 'C6H6')
//       .map((sensor, index) => {
//         const colorRanges = getColorRanges(sensor.key);
//         const color = colorPalette[index % colorPalette.length];

//         return {
//           label: sensor.key,
//           data: sensor.values.map((entry) => entry.value),
//           backgroundColor: sensor.values.map((entry) => getColorForValue(entry.value, colorRanges, colorPalette)),
//         };
//       });
//   };

//   const getColorRanges = (key) => {
//     switch (key) {
//       case 'PM10':
//         return [20, 50, 80, 110, 150];
//       case 'PM2.5':
//         return [13, 35, 55, 75, 110];
//       case 'O3':
//         return [70, 120, 150, 180, 240];
//       case 'NO2':
//         return [40, 100, 150, 230, 400];
//       case 'SO2':
//         return [50, 100, 200, 350, 500];
//       default:
//         return [];
//     }
//   };

//   const getColorForValue = (value, colorRanges, colorPalette) => {
//     const colorIndex = colorRanges.findIndex((range) => value <= range);
//     return colorPalette[colorIndex >= 0 ? colorIndex : colorPalette.length - 1];
//   };

//   const datasets = generateDatasets();

//   if (datasets.length === 0) {
//     // No valid data to display, render a message or fallback UI
//     return <div>No valid data to display.</div>;
//   }

//   return (
//     <section>
//       {datasets.map((dataset, index) => (
//         <div key={index}>
//           <h3>{dataset.label} Chart</h3>
//           <Bar options={options} data={{ labels: sensorData[0].values.map((entry) => entry.date), datasets: [dataset] }} />
//         </div>
//       ))}
//     </section>
//   );
// };

// export default ChartComponent;
