import React from 'react';

const backgroundColorPalette = [
  'bg-[#108404]',
  'bg-[#18cc04]',
  'bg-[#f4f804]',
  'bg-[#ff7c04]',
  'bg-[#e00404]',
  'bg-[#98046c]',
];

const AQILegend = () => {
  return (
    <div className='absolute z-1000 flex bottom-7 right-16 md:right-20 text-white text-xs font-medium'>
      <span className='absolute left-0 transform -translate-y-full'>Bdb</span>
      {backgroundColorPalette.map((color, index) => (
        <span key={index} className={`${color} w-6 md:w-8 h-1.5`}></span>
      ))}
      <span className='absolute right-0 transform -translate-y-full'>Zła</span>
    </div>
  );
};

export default AQILegend;
