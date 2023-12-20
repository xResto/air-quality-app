'use client';

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
import { useMainContext } from '../store/MainContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const HistoricalDataChart = ({ raport, sensorIDsData, setIsRaportLoading }) => {
  const {
    selectedPollutant,
    selectedDateFrom,
    setSelectedDateFrom,
    selectedDateTo,
    setSelectedDateTo,
  } = useMainContext();

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

    const range = colorRanges[key];
    const colorIndex = range.findIndex((r) => value <= r);

    return colorPalette[colorIndex] || '#98046c';
  };

  const countAirQualityCategories = (raport, pollutantCode) => {
    setIsRaportLoading(false);
    const totalEntries = raport.length;

    const pollutantRanges = {
      PM10: [20, 50, 80, 110, 150],
      'PM2.5': [13, 35, 55, 75, 110],
      O3: [70, 120, 150, 180, 240],
      NO2: [40, 100, 150, 230, 400],
      SO2: [50, 100, 200, 350, 500],
    };

    const categories = {
      veryGood: { count: 0, percentage: 0 },
      good: { count: 0, percentage: 0 },
      moderate: { count: 0, percentage: 0 },
      poor: { count: 0, percentage: 0 },
      bad: { count: 0, percentage: 0 },
      veryBad: { count: 0, percentage: 0 },
    };

    raport.forEach((entry) => {
      const value = entry['Wartość'];
      const range = pollutantRanges[pollutantCode];
      let category = range.findIndex((r) => value <= r);
      category = category !== -1 ? category : 5;

      if (category >= 0 && category < 6) {
        const categoryName = Object.keys(categories)[category];
        categories[categoryName].count += 1;
      }
    });

    Object.keys(categories).forEach((category) => {
      categories[category].percentage = (
        (categories[category].count / totalEntries) *100
        ).toFixed();
    });

    return categories;
  };

  const data = countAirQualityCategories(raport, selectedPollutant);

  const processData = (raport) => {
    if (!raport) {
      return null;
    }

    const stationCode = raport[0]['Kod stanowiska'];
    const pollutantCode = getPollutantCode(stationCode);

    const maxSensorValue = Math.max(raport.map((entry) => entry['Wartość']));
    const backgroundColor = raport.map((entry) =>
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
      labels: raport.map((entry) => entry.Data),
      datasets: [
        {
          label: pollutantCode,
          data: raport.map((entry) => entry['Wartość']),
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

  const chartData = processData(raport);

  return (
    <div>
      <Bar
        data={chartData}
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
              text: chartData.datasets[0].label,
            },
          },
        }}
      />
      <div className='flex justify-between text-xs mb-4'>
        <p>{chartData.formattedDates.latestDate}</p>
        <p>{chartData.formattedDates.oldestDate}</p>
      </div>
      {chartData.datasets[0].label !== 'C6H6' &&
        chartData.datasets[0].label !== 'CO' && (
          <ul className='flex flex-col justify-start items-start text-center'>
            <li>
              <span className='text-[#108404]'>Bardzo dobra:</span>{' '}
              {data.veryGood.count} ({data.veryGood.percentage}%)
            </li>
            <li>
              <span className='text-[#18cc04]'>Dobra:</span> {data.good.count} (
              {data.good.percentage}%)
            </li>
            <li>
              <span className='text-[#f4f804]'>Umiarkowana:</span>{' '}
              {data.moderate.count} ({data.moderate.percentage}%)
            </li>
            <li>
              <span className='text-[#ff7c04]'>Niezadowalająca:</span>{' '}
              {data.poor.count} ({data.poor.percentage}%)
            </li>
            <li>
              <span className='text-[#e00404]'>Zła:</span> {data.bad.count} (
              {data.bad.percentage}%)
            </li>
            <li>
              <span className='text-[#98046c]'>Bardzo zła:</span>{' '}
              {data.veryBad.count} ({data.veryBad.percentage}%)
            </li>
          </ul>
        )}
    </div>
  );
};

export default HistoricalDataChart;
