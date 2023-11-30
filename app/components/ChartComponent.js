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
  const filteredSensorData = sensorData.filter(
    (sensor) =>
      sensor.key !== 'CO' && sensor.key !== 'C6H6' && sensor.values.length !== 0
  );

  const getDataset = filteredSensorData.map((sensor) => {
    const key = sensor.key;
    let colorRanges = [];

    const valuesArray = sensor.values.map((entry) => entry.value);
    const nullFlags = sensor.values.map((entry) => entry.value === null);
    const maxSensorValue =
      valuesArray.length > 0 ? Math.max(...valuesArray) : 0;

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

    const color = sensor.values.map((entry) => {
      const colorIndex = colorRanges.findIndex((range) => entry.value <= range);
      return entry.value != null ? colorPalette[colorIndex] : '#888484';
    });

    const data = {
      labels: sensor.values.map((entry) => entry.date),
      datasets: [
        {
          data: sensor.values.map((entry) =>
            entry.value != null ? entry.value : 0.07 * maxSensorValue
          ),
          backgroundColor: color,
        },
      ],
    };

    const reformatNonNullSensorDataValue = (index) => {
      const [date, time] = sensor.values[index].date.split(' ');
      const [day, month] = date.split('.');
      return `${day}.${month}, ${time.slice(0, -3)}`;
    };

    const latestDate = `Dziś, ${sensor.values[0].date.slice(-8, -3)}`;
    const middleDateIndex = Math.floor(sensor.values.length / 2);
    const middleDate = reformatNonNullSensorDataValue(middleDateIndex);
    const oldestDate = reformatNonNullSensorDataValue(sensor.values.length - 1);
    return {
      key,
      data,
      latestDate,
      middleDate,
      oldestDate,
      valuesArray,
      nullFlags,
    };
  });

  const dataset = getDataset;

  return (
    <section>
      {dataset.map((data, index) => (
        <div key={index}>
          <Bar
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: data.key,
                },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      if (data.nullFlags[context.dataIndex]) {
                        return 'Brak pomiaru';
                      }
                    },
                  },
                },
              },
              scales: {
                x: {
                  display: false,
                },
              },
            }}
            data={data.data}
          />
          <div className='flex justify-between text-xs'>
            <p>{data.latestDate}</p>
            <p>{data.middleDate}</p>
            <p>{data.oldestDate}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ChartComponent;

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

// const ChartComponent = ({ sensorData, isRaport = false }) => {
//   const determineColor = (value, maxSensorValue, key) => {
//     const colorPalette = [
//       '#108404',
//       '#18cc04',
//       '#f4f804',
//       '#ff7c04',
//       '#e00404',
//       '#98046c',
//     ];
//     let colorRanges;

//     switch (key) {
//       case 'PM10':
//         colorRanges = [20, 50, 80, 110, 150, maxSensorValue + 1];
//         break;
//       case 'PM2.5':
//         colorRanges = [13, 35, 55, 75, 110, maxSensorValue + 1];
//         break;
//       case 'O3':
//         colorRanges = [70, 120, 150, 180, 240, maxSensorValue + 1];
//         break;
//       case 'NO2':
//         colorRanges = [40, 100, 150, 230, 400, maxSensorValue + 1];
//         break;
//       case 'SO2':
//         colorRanges = [50, 100, 200, 350, 500, maxSensorValue + 1];
//         break;
//       default:
//         colorRanges = [maxSensorValue + 1]; // Default range
//     }

//     const colorIndex = colorRanges.findIndex((range) => value <= range);
//     return colorPalette[colorIndex] || '#888484'; // Default color if none is found
//   };

//   const getFormattedDates = (labels) => {
//     const latestDate = `Today, ${labels[0].slice(-5)}`;
//     const middleIndex = Math.floor(labels.length / 2);
//     const middleDate = labels[middleIndex].slice(0, 10); // Format as needed
//     const oldestDate = labels[labels.length - 1].slice(0, 10); // Format as needed

//     return { latestDate, middleDate, oldestDate };
//   };

//   const processData = (sensor) => {
//     const key = isRaport
//       ? sensor[0]['Kod stanowiska'].split('-')[1]
//       : sensor.key;
//     const values = isRaport
//       ? sensor.map((entry) => entry['Wartość'])
//       : sensor.values.map((entry) => entry.value);
//     const labels = isRaport
//       ? sensor.map((entry) => entry.Data)
//       : sensor.values.map((entry) => entry.date);
//     const maxSensorValue = Math.max(...values, 0);

//     const backgroundColor = values.map((value) =>
//       determineColor(value, maxSensorValue, key)
//     );

//     const { latestDate, middleDate, oldestDate } = getFormattedDates(labels);

//     return {
//       labels,
//       datasets: [{
//         label: key,
//         data: values,
//         backgroundColor,
//       }],
//       formattedDates: { latestDate, middleDate, oldestDate } // Add formatted dates to your processed data
//     };
//   };

//   return (
//     <section>
//       {sensorData.map((data, index) => {
//         const processedData = processData(data);

//         return (
//           <div key={index}>
//             <Bar
//               options={{
//                 responsive: true,
//                 plugins: {
//                   title: {
//                     display: true,
//                     text: isRaport ? data[0]['Nazwa stacji'] : data.key,
//                   },
//                   tooltip: {
//                     callbacks: {
//                       label: (context) => `${context.dataset.label}: ${context.parsed.y}`
//                     }
//                   }
//                 },
//                 scales: {
//                   x: {
//                     display: false, // Enable this to show all x-axis labels
//                   },
//                   y: {
//                     display: true,
//                   }
//                 }
//               }}
//               data={processedData}
//             />
//              <div className='flex justify-between text-xs'>
//               {/* Use the formattedDates from processedData */}
//               <p>{processedData.formattedDates.latestDate}</p>
//               <p>{processedData.formattedDates.middleDate}</p>
//               <p>{processedData.formattedDates.oldestDate}</p>
//             </div>
//           </div>
//         );
//       })}
//     </section>
//   );
// };

// export default ChartComponent;
