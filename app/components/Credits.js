import React from 'react';
import Link from 'next/link';
import CloseButtonMobile from './Sidebar/CloseButtonMobile';

const Credits = () => {
  const helperTxt = 'jakość powietrza';

  return (
    <>
      <div className='flex gap-1 mb-2'>
        <CloseButtonMobile />
        <div className='flex flex-grow justify-center text-2xl font-semibold text-center'>
          Credits
        </div>
        <div className='h-8 w-8 sm:hidden'></div>
      </div>
      <span className='border border-blue2 mb-2 block'></span>
      <ul className='flex flex-col gap-3 text-sm sm:text-base'>
        <li>
          "Bardzo dobra {helperTxt}"&nbsp;
          <Link
            href='https://www.freepik.com/free-vector/flying-kite-concept-illustration_13416085.htm'
            target='_blank'
            className='font-bold text-blue3'
          >
            Image by storyset
          </Link>
          &nbsp;on Freepik
        </li>
        <li>
          "Dobra {helperTxt}"&nbsp;
          <Link
            href='https://www.freepik.com/free-vector/rollers-concept-illustration_14562397.htm'
            target='_blank'
            className='font-bold text-blue3'
          >
            Image by storyset
          </Link>
          &nbsp;on Freepik
        </li>
        <li>
          "Umiarkwana {helperTxt}"&nbsp;
          <Link
            href='https://www.freepik.com/free-vector/sao-paulo-concept-illustration_13717686.htm'
            target='_blank'
            className='font-bold text-blue3'
          >
            Image by storyset
          </Link>
          &nbsp;on Freepik
        </li>
        <li>
          "Niezadowalająca {helperTxt}"&nbsp;
          <Link
            href='https://www.freepik.com/free-vector/life-city-concept-illustration_23672969.htm'
            target='_blank'
            className='font-bold text-blue3'
          >
            Image by storyset
          </Link>
          &nbsp;on Freepik
        </li>
        <li>
          "Zła {helperTxt}"&nbsp;
          <Link
            href='https://www.freepik.com/free-vector/ffp2-face-mask-concept-illustration_13106801.htm'
            target='_blank'
            className='font-bold text-blue3'
          >
            Image by storyset
          </Link>
          &nbsp;on Freepik
        </li>
        <li>
          "Bardzo zła {helperTxt}"&nbsp;
          <Link
            href='https://www.freepik.com/free-vector/air-pollution-concept-illustration_15924805.htm'
            target='_blank'
            className='font-bold text-blue3'
          >
            Image by storyset
          </Link>
          &nbsp;on Freepik
        </li>
        <li>
          Loading&nbsp;
          <Link
            href='https://www.freepik.com/free-vector/fast-loading-concept-illustration_6184228.htm'
            target='_blank'
            className='font-bold text-blue3'
          >
            Image by storyset
          </Link>
          &nbsp;on Freepik
        </li>
        <li>
          Rank icon by DTDesign from&nbsp;
          <Link
            href='https://thenounproject.com/icon/rank-2533816/'
            target='_blank'
            className='font-bold text-blue3'
          >
            Noun Project
          </Link>
          &nbsp;(CC BY 3.0)
        </li>
        <li>
          Location marker icon by Muhammad Nur Auliady Pamungkas from&nbsp;
          <Link
            href='https://thenounproject.com/icon/location-6287301/'
            target='_blank'
            className='font-bold text-blue3'
          >
            Noun Project
          </Link>
          &nbsp;(CC BY 3.0)
        </li>
        <li>
          Location marker with heart icon by Athok from&nbsp;
          <Link
            href='https://thenounproject.com/icon/pin-4530450/'
            target='_blank'
            className='font-bold text-blue3'
          >
            Noun Project
          </Link>
          &nbsp;(CC BY 3.0)
        </li>
        <li>
          Credits icon by Erik Bagossy from&nbsp;
          <Link
            href='https://thenounproject.com/icon/thank-you-5677188/'
            target='_blank'
            className='font-bold text-blue3'
          >
            Noun Project
          </Link>
          &nbsp;(CC BY 3.0)
        </li>
        <li>
          Location on the map icon by Ahmad Roaayala from&nbsp;
          <Link
            href='https://thenounproject.com/icon/location-on-map-5789846/'
            target='_blank'
            className='font-bold text-blue3'
          >
            Noun Project
          </Link>
          &nbsp;(CC BY 3.0)
        </li>
        <li>
          Heart icon by creative outlet from&nbsp;
          <Link
            href='https://thenounproject.com/icon/heart-554864/'
            target='_blank'
            className='font-bold text-blue3'
          >
            Noun Project
          </Link>
          &nbsp;(CC BY 3.0)
        </li>
        <li>
          Filled heart icon by creative outlet from&nbsp;
          <Link
            href='https://thenounproject.com/icon/heart-699747/'
            target='_blank'
            className='font-bold text-blue3'
          >
            Noun Project
          </Link>
          &nbsp;(CC BY 3.0)
        </li>
        <li>
          Arrow icon by Berkah Icon from&nbsp;
          <Link
            href='https://thenounproject.com/icon/wind-arrow-2296267/'
            target='_blank'
            className='font-bold text-blue3'
          >
            Noun Project
          </Link>
          &nbsp;(CC BY 3.0)
        </li>
        <li>
          X icon by Alice Design from&nbsp;
          <Link
            href='https://thenounproject.com/icon/x-1890844/'
            target='_blank'
            className='font-bold text-blue3'
          >
            Noun Project
          </Link>
          &nbsp;(CC BY 3.0)
        </li>
      </ul>
    </>
  );
};

export default Credits;
