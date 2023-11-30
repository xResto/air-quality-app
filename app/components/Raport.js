'use client';
import React, { useEffect, useState } from 'react';
import { createRaportQueryString } from '../utils/queryString';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useArrowFlagContext } from '../store/arrowFlagContext';
import {
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  ListItemText,
  OutlinedInput,
  Checkbox,
  TextField,
  createTheme,
} from '@mui/material';
import styled from '@emotion/styled';
import {
  DatePicker,
  DesktopDatePicker,
  LocalizationProvider,
  PickersLayout,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { deleteQueryString } from '../utils/queryString';
import HistoricalDataChart from './HistoricalDataChart';

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
const StyledCheckbox = styled(Checkbox)({
  color: '#001C30',
  '&.Mui-checked': {
    color: '#00101c',
  },
});

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
  const [selectedDateFrom, setSelectedDateFrom] = useState(null);
  const [selectedDateTo, setSelectedDateTo] = useState(null);
  const {
    selectedPollutants,
    setSelectedPollutants,
    setBookmark,
    setIsRaportActive,
  } = useArrowFlagContext();

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

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedPollutants(typeof value === 'string' ? value.split(',') : value);
  };

  const handleDateFromChange = (newDate) => {
    setSelectedDateFrom(newDate);
  };

  const handleDateToChange = (newDate) => {
    setSelectedDateTo(newDate);
  };

  const selectedSensorIDs = sensorIDsData
    .filter((sensor) => selectedPollutants.includes(sensor.param.paramCode))
    .map((sensor) => sensor.id);

  const loadRaportHandler = () => {
    const selectedSensorIDs = sensorIDsData
      .filter((sensor) => selectedPollutants.includes(sensor.param.paramCode))
      .map((sensor) => sensor.id);

    const formattedDateFrom = formatDate(selectedDateFrom);
    const formattedDateTo = formatDate(selectedDateTo, true);

    const queryString = createRaportQueryString(
      selectedSensorIDs,
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
      <div className='flex text-center mb-2'>
        <div className='text-xl font-semibold flex-grow'>{stationName}</div>
        <button
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
        >
          X
        </button>
      </div>

      <div className='flex flex-col gap-4 justify-center'>
        <FormControl required>
          <StyledInputLabel id='demo-multiple-checkbox-label'>
            Wybierz zanieczyszczenia
          </StyledInputLabel>
          <StyledSelect
            labelId='demo-multiple-checkbox-label'
            id='demo-multiple-checkbox'
            multiple
            value={selectedPollutants}
            onChange={handleChange}
            input={<OutlinedInput label='Wybierz zanieczyszczenia' />}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={MenuProps}
          >
            {sensorIDsData.map((sensor) => (
              <StyledMenuItem key={sensor.id} value={sensor.param.paramCode}>
                <StyledCheckbox
                  checked={
                    selectedPollutants.indexOf(sensor.param.paramCode) > -1
                  }
                />
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
                // backgroundColor: '#001C30',
                // color: 'white',
                '& fieldset': {
                  borderColor: '#38A3A5', // Default border color
                  borderWidth: '2px',
                },
                // '&:hover fieldset': {
                //   borderColor: '#176B87', // Border color on hover
                // },
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
                // backgroundColor: '#001C30',
                // color: 'white',
                '& fieldset': {
                  borderColor: '#38A3A5', // Default border color
                  borderWidth: '2px',
                },
                // '&:hover fieldset': {
                //   borderColor: '#176B87', // Border color on hover
                // },
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
          className='border mt-2 border-blue2 self-center py-1 px-4 rounded-2xl text-center font-semibold text-base text-white hover:bg-blue2 transition-all'
          onClick={loadRaportHandler}
        >
          Generuj Raport
        </button>
        {raport && (
          <HistoricalDataChart
            raport={raport}
            sensorIDsData={sensorIDsData}
            selectedDateFrom={selectedDateFrom}
            selectedDateTo={selectedDateTo}
          />
        )}
      </div>
    </div>
  );
};

export default Raport;
