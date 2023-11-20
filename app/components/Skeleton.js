import React from 'react';

const Skeleton = () => {
  return [...Array(20)].map((item, index) => (
    <ul key={index} className='animate-pulse'>
      <li
        className={`h-12 flex flex-col p-1 mb-1 rounded-2xl bg-slate-700`}
      ></li>
    </ul>
  ));
};

export default Skeleton;
