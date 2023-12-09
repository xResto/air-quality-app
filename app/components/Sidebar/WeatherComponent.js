import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const WindComponent = ({ weatherData }) => {
  return (
    <>
      <div className='text-xs mb-2'>
        Źródło danych pogodowych:&nbsp;
        <Link
          href='https://openweathermap.org'
          target='_blank'
          className='font-bold text-blue3'
        >
          OpenWeather
        </Link>
      </div>
      <div className='weather-container flex justify-center items-center gap-6 sm:gap-2 md:gap-4 lg:gap-6 text-sm sm:text-xs lg:text-sm'>
        <div className='flex flex-col items-center'>
          <span>Temperatura</span>
          <div>
            <span className='text-base sm:text-sm md:text-base font-semibold'>
              {weatherData.main.temp.toFixed(1)}
            </span>
            <span className='font-extralight'> &deg;C</span>
          </div>
        </div>
        <div className='flex flex-col items-center'>
          <span>Wilgotność</span>
          <div>
            <span className='text-base sm:text-sm md:text-base  font-semibold'>
              {weatherData.main.humidity}
            </span>
            <span className='font-extralight'> %</span>
          </div>
        </div>
        <div className='flex flex-col items-center'>
          <span>Ciśnienie</span>
          <div>
            <span className='text-base sm:text-sm md:text-base  font-semibold'>
              {weatherData.main.pressure}
            </span>
            <span className='font-extralight'> hPa</span>
          </div>
        </div>
        <div className='flex gap-2'>
          <div className='flex flex-col items-center'>
            <span>Wiatr</span>
            <span>
              <span className='text-base sm:text-sm md:text-base  font-semibold'>
                {(weatherData.wind.speed * 3).toFixed()}
              </span>
              <span className='font-extralight'> km/h</span>
            </span>
          </div>
          <Image
            src='wind-arrow.svg'
            alt='Strzałka wskazująca kierunek wiatru'
            width={22}
            height={22}
            className='mt-1'
            style={{ transform: `rotate(${weatherData.wind.deg}deg)` }}
          />
        </div>
      </div>
    </>
  );
};

export default WindComponent;
