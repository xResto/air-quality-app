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

const HistoricalDataChart = ({
  raport,
  sensorIDsData,
  selectedDateFrom,
  selectedDateTo,
}) => {
  const getPollutantCode = (stationCode) => {
    const sensor = sensorIDsData.find((s) =>
      stationCode.includes(s.param.paramCode)
    );
    return sensor ? sensor.param.paramCode : '';
  };

  const determineColor = (value, key, maxSensorValue) => {
    if (key === 'C6H6' || key === 'CO') {
      return '#38A3A5';
    }

    const colorRanges = {
      PM10: [20, 50, 80, 110, 150, maxSensorValue + 1],
      'PM2.5': [13, 35, 55, 75, 110, maxSensorValue + 1],
      O3: [70, 120, 150, 180, 240, maxSensorValue + 1],
      NO2: [40, 100, 150, 230, 400, maxSensorValue + 1],
      SO2: [50, 100, 200, 350, 500, maxSensorValue + 1],
    };
    const colorPalette = [
      '#108404',
      '#18cc04',
      '#f4f804',
      '#ff7c04',
      '#e00404',
      '#98046c',
    ];

    const range = colorRanges[key] || [maxSensorValue + 1];
    const colorIndex = range.findIndex((r) => value <= r);
    return colorPalette[colorIndex] || '#888484';
  };

  // const countAirQualityCategories = (sensorData) => {
  //   const categories = {
  //     veryGood: 0,
  //     good: 0,
  //     moderate: 0,
  //     poor: 0,
  //     bad: 0,
  //     veryBad: 0,
  //   };

  //   sensorData.forEach((entry) => {
  //     const value = entry['Wartość'];
  //     if (value < 20) {
  //       categories.veryGood += 1;
  //     } else if (value >= 20 && value < 50) {
  //       categories.good += 1;
  //     } else if (value >= 50 && value < 80) {
  //       categories.moderate += 1;
  //     } else if (value >= 80 && value < 110) {
  //       categories.poor += 1;
  //     } else if (value >= 110 && value < 150) {
  //       categories.bad += 1;
  //     } else if (value >= 150) {
  //       categories.veryBad += 1;
  //     }
  //   });

  //   return categories;
  // };

  const processData = (sensorData) => {
    if (!Array.isArray(sensorData) || sensorData.length === 0) {
      return null;
    }

    const stationCode = sensorData[0]['Kod stanowiska'];
    const pollutantCode = getPollutantCode(stationCode);

    const maxSensorValue = Math.max(
      ...sensorData.map((entry) => entry['Wartość'])
    );
    const backgroundColor = sensorData.map((entry) =>
      determineColor(entry['Wartość'], pollutantCode, maxSensorValue)
    );

    const formatDateForComparison = (date, isEndDate = false) => {
      const timeSuffix = isEndDate ? ' 23:00' : ' 00:00';
      return (
        date.toLocaleDateString('en-CA', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }) + timeSuffix
      );
    };

    const formatDateForDisplay = (dateStr) => {
      const [date, time] = dateStr.split(' ');
      const [year, month, day] = date.split('-');
      return `${day}.${month}.${year}, ${time}`;
    };

    const fromDateString = formatDateForComparison(selectedDateFrom);
    const toDateString = formatDateForComparison(selectedDateTo, true);

    const chartData = {
      labels: sensorData.map((entry) => entry.Data),
      datasets: [
        {
          label: pollutantCode,
          data: sensorData.map((entry) => entry['Wartość']),
          backgroundColor: backgroundColor,
        },
      ],
      formattedDates: {
        latestDate: formatDateForDisplay(fromDateString),
        oldestDate: formatDateForDisplay(toDateString),
      },
    };

    return chartData;
  };

  return (
    <div>
      {raport.map((sensorData, index) => {
        const data = processData(sensorData);
        return (
          <div key={index}>
            <Bar
              data={data}
              options={{
                responsive: true,
                scales: {
                  x: {
                    display: false,
                  },
                  y: {
                    beginAtZero: true,
                  },
                },
                plugins: {
                  legend: {
                    display: true,
                  },
                  title: {
                    display: true,
                    text: data.datasets[0].label,
                  },
                },
              }}
            />
            <div className='flex justify-between text-xs mb-4'>
              <p>{data.formattedDates.latestDate}</p>
              <p>{data.formattedDates.oldestDate}</p>
            </div>
            <ul>
              <li>Bardzo dobra: {data.airQualityCounts.veryGood}</li>
              <li>Dobra: {data.airQualityCounts.good}</li>
              <li>Umiarkowana: {data.airQualityCounts.moderate}</li>
              <li>Niezadowalająca: {data.airQualityCounts.poor}</li>
              <li>Zła: {data.airQualityCounts.bad}</li>
              <li>Bardzo zła: {data.airQualityCounts.veryBad}</li>
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default HistoricalDataChart;
