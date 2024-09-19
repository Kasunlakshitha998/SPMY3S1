import React, { useState, useMemo } from 'react';
import { XIcon } from '@heroicons/react/outline';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import moment from 'moment';
import { Box, Button, ButtonGroup } from '@mui/material';
import fileDownload from 'js-file-download'; // For file download

const FavoriteReport = ({ isOpen, onClose, favorite }) => {
  const [timePeriod, setTimePeriod] = useState('daily'); // 'daily', 'weekly', 'monthly'

  // Group favorites based on the selected time period
  const groupedFavorites = useMemo(() => {
    const grouped = {};

    favorite.forEach((item) => {
      const date = moment(item.createdAt);
      let key;

      if (timePeriod === 'daily') {
        key = date.format('YYYY-MM-DD');
      } else if (timePeriod === 'weekly') {
        key = date.startOf('week').format('YYYY-[W]WW'); // Week number
      } else if (timePeriod === 'monthly') {
        key = date.format('YYYY-MM');
      }

      if (!grouped[key]) {
        grouped[key] = 0;
      }
      grouped[key] += 1;
    });

    return Object.keys(grouped).map((key) => ({
      time: key,
      count: grouped[key],
    }));
  }, [favorite, timePeriod]);

  // Function to download the report as CSV
  const downloadReport = () => {
    // Convert groupedFavorites to CSV string
    const csvContent = [
      ['Time Period', 'Count'],
      ...groupedFavorites.map((item) => [item.time, item.count]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    // Download the CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    fileDownload(blob, `favorite_report_${timePeriod}.csv`);
  };

  // Early return if the modal isn't open
  if (!isOpen || !favorite) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-2/4 p-6 space-y-4">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition duration-300"
          onClick={onClose}
        >
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Favorite Report
        </h2>

        {/* Time Period Buttons */}
        <Box display="flex" justifyContent="center" my={2}>
          <ButtonGroup variant="contained">
            <Button
              onClick={() => setTimePeriod('daily')}
              color={timePeriod === 'daily' ? 'primary' : 'default'}
            >
              Daily
            </Button>
            <Button
              onClick={() => setTimePeriod('weekly')}
              color={timePeriod === 'weekly' ? 'primary' : 'default'}
            >
              Weekly
            </Button>
            <Button
              onClick={() => setTimePeriod('monthly')}
              color={timePeriod === 'monthly' ? 'primary' : 'default'}
            >
              Monthly
            </Button>
          </ButtonGroup>
        </Box>

        {/* Bar Chart */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={groupedFavorites}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>

        {/* Download Report Button */}
        <Box display="flex" justifyContent="center" my={4}>
          <Button variant="contained" color="primary" onClick={downloadReport}>
            Download Report as CSV
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default FavoriteReport;
