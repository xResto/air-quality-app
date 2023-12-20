'use client';
import React, { useState, useEffect } from 'react';
import { createRaportQueryString } from '../utils/queryString';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useMainContext } from '../store/MainContext';
import {
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  ListItemText,
  OutlinedInput,
} from '@mui/material';
import styled from '@emotion/styled';
import {
  DatePicker,
  LocalizationProvider,
  PickersLayout,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { deleteQueryString } from '../utils/queryString';
import HistoricalDataChart from './HistoricalDataChart';
import Loading from './Loading';
import { set } from 'date-fns';

// Select
const StyledSelect = styled(Select)({
  backgroundColor: '#001C30',
  color: 'white',
  '& .MuiSvgIcon-root': {
    color: 'white', // Dropdown arrow color
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#38A3A5', // Border color
    borderWidth: '2px',
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#176B87', // New border color on hover
  },
});
const StyledMenuItem = styled(MenuItem)({
  color: 'white',
  backgroundColor: '#176B87',
});
const StyledInputLabel = styled(InputLabel)({
  color: 'white',
  '&.Mui-focused': {
    color: 'white', // Maintain white color even when focused
  },
});
const MenuProps = {
  PaperProps: {
    sx: {
      backgroundColor: '#004b63',
      '& .MuiMenu-list': {
        padding: '0',
      },
    },
  },
};

// Date Picker
const StyledPickersLayout = styled(PickersLayout)({
  '.MuiDateCalendar-root': {
    color: 'black',
    borderWidth: '2px',
    borderColor: '#38A3A5',
    backgroundColor: '#64CCC5',
  },
});

const Raport = ({ raport, sensorIDsData, stationName }) => {
  const {
    selectedPollutant,
    setSelectedPollutant,
    setBookmark,
    setIsRaportActive,
    selectedDateFrom,
    setSelectedDateFrom,
    selectedDateTo,
    setSelectedDateTo,
  } = useMainContext();

  const [isRaportLoading, setIsRaportLoading] = useState(false);
  const [displayedSelectedPollutant, setDisplayedSelectedPollutant] =
    useState();
  const [inaproppriateDateRange, setInaproppriateDateRange] = useState(false);
  const [raportErorr, setRaportError] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const formatDate = (date, isEndDate = false) => {
    if (!date) return null;
    const timeSuffix = isEndDate ? ' 23:00' : ' 00:00';
    return (
      date.toLocaleDateString('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }) + timeSuffix
    );
  };
  useEffect(() => {
    if (raport === 'error') {
      setRaportError(true);
      setIsRaportLoading(false);
    } else if (raport.length > 0) {
      setRaportError(false);
      setIsRaportLoading(false);
    }
  }, [raport]);

  useEffect(() => {
    const dateDifference = Math.abs(
      (selectedDateTo - selectedDateFrom) / (24 * 60 * 60 * 1000)
    );

    if (dateDifference > 40) {
      setInaproppriateDateRange(true);
      return;
    }

    setInaproppriateDateRange(false);
  }, [selectedDateTo, selectedDateFrom]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setDisplayedSelectedPollutant(value);
  };

  const handleDateFromChange = (newDate) => {
    setSelectedDateFrom(newDate);
  };

  const handleDateToChange = (newDate) => {
    setSelectedDateTo(newDate);
  };

  const loadRaportHandler = () => {
    if (raport === 'error') {
      setIsRaportLoading(false);
    } else {
      setIsRaportLoading(true);
    }

    const selectedSensor = sensorIDsData.find(
      (sensor) => sensor.param.paramCode === displayedSelectedPollutant
    );
    const selectedSensorID = selectedSensor.id;
    setSelectedPollutant(selectedSensor.param.paramCode);

    const formattedDateFrom = formatDate(selectedDateFrom);
    const formattedDateTo = formatDate(selectedDateTo, true);

    const queryString = createRaportQueryString(
      selectedSensorID,
      formattedDateFrom,
      formattedDateTo,
      searchParams
    );

    router.push(`${pathname}?${queryString}`, {
      scroll: false,
    });
  };

  return (
    <div>
      <div className='flex items-center text-center mb-3'>
        <div className='hidden sm:block h-10 w-10'></div>
        <Image
          src='close.svg'
          width={50}
          height={50}
          alt='Ikonka X'
          className='sm:hidden block h-10 w-10 hover:cursor-pointer hover:bg-blue0v2 rounded-[50%] transform hover:scale-110 transition-transform'
          onClick={() => {
            setBookmark('station');
            deleteQueryString(
              ['sensorID', 'dateFrom', 'dateTo'],
              router,
              pathname,
              searchParams
            );
            setIsRaportActive(false);
          }}
        />
        <div className='text-xl font-semibold flex-grow'>{stationName}</div>
        <Image
          src='close.svg'
          width={50}
          height={50}
          alt='Ikonka X'
          className='hidden sm:block h-10 w-10 hover:cursor-pointer hover:bg-blue0v2 rounded-[50%] transform hover:scale-110 transition-transform'
          onClick={() => {
            setBookmark('station');
            deleteQueryString(
              ['sensorID', 'dateFrom', 'dateTo'],
              router,
              pathname,
              searchParams
            );
            setIsRaportActive(false);
          }}
        />
        <div className='sm:hidden block h-10 w-10'></div>
      </div>

      <div className='flex flex-col gap-4 justify-center'>
        <FormControl required>
          <StyledInputLabel id='demo-simple-select-label'>
            Wybierz zanieczyszczenie
          </StyledInputLabel>
          <StyledSelect
            labelId='demo-simple-select-label'
            id='demo-simple-checkbox'
            value={displayedSelectedPollutant}
            onChange={handleChange}
            input={<OutlinedInput label='Wybierz zanieczyszczenia' />}
            MenuProps={MenuProps}
          >
            {sensorIDsData.map((sensor) => (
              <StyledMenuItem key={sensor.id} value={sensor.param.paramCode}>
                <ListItemText primary={sensor.param.paramCode} />
              </StyledMenuItem>
            ))}
          </StyledSelect>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label='Wybierz datę początkową'
            value={selectedDateFrom}
            onChange={handleDateFromChange}
            slots={{
              layout: StyledPickersLayout,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#38A3A5', // Default border color
                  borderWidth: '2px',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#176B87', // Border color when focused
                },
              },
              '& .MuiInputBase-input': {
                color: 'white', // Text color inside the input
              },
              '& .MuiInputLabel-root': {
                color: 'white', // Label color
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'white', // Label color when focused
              },
            }}
          />
          <DatePicker
            label='Wybierz datę końcową'
            value={selectedDateTo}
            onChange={handleDateToChange}
            slots={{
              layout: StyledPickersLayout,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#38A3A5', // Default border color
                  borderWidth: '2px',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#176B87', // Border color when focused
                },
              },
              '& .MuiInputBase-input': {
                color: 'white', // Text color inside the input
              },
              '& .MuiInputLabel-root': {
                color: 'white', // Label color
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'white', // Label color when focused
              },
            }}
          />
        </LocalizationProvider>
        <button
          className={`border mt-2 border-blue2 self-center py-1 px-4 rounded-2xl text-center font-semibold text-base text-white transition-all ${
            !displayedSelectedPollutant ||
            !selectedDateFrom ||
            !selectedDateTo ||
            inaproppriateDateRange
              ? 'opacity-50'
              : 'hover:bg-blue2 cursor-pointer'
          }`}
          onClick={loadRaportHandler}
          disabled={
            !displayedSelectedPollutant ||
            !selectedDateFrom ||
            !selectedDateTo ||
            inaproppriateDateRange
          }
        >
          Generuj raport
        </button>
        {raport.length > 0 &&
          raport !== 'error' &&
          !inaproppriateDateRange &&
          !raportErorr &&
          !isRaportLoading && (
            <HistoricalDataChart
              raport={raport}
              sensorIDsData={sensorIDsData}
              setIsRaportLoading={setIsRaportLoading}
            />
          )}
        {raport === 'error' &&
          !inaproppriateDateRange &&
          raportErorr &&
          !isRaportLoading && (
            <p>{`Przepraszamy, nie można zwrócić danych dla ${selectedPollutant}. Zbyt wiele zapytań w jednostce czasu. Spróbuj ponownie za chwilę.`}</p>
          )}
        {inaproppriateDateRange &&
          selectedDateFrom &&
          selectedDateTo &&
          !isRaportLoading && (
            <div className='text-red-500 text-sm'>
              Proszę ograniczyć wybór do maksymalnie 40 dni.
            </div>
          )}
        {isRaportLoading && <Loading />}
      </div>
    </div>
  );
};

export default Raport;
