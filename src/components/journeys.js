import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { format } from 'date-fns';
import { Box, CircularProgress, Pagination } from '@mui/material';

export default function Journeys() {
  const [journeys, setJourneys] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 10;

  const getJourneys = (page) => {
    setIsLoading(true);
    fetch(`https://city-bike-helsinki.herokuapp.com/api/journeys?page=${page}&pageSize=${pageSize}`)
      .then(response => response.json())
      .then(data => {
        setJourneys(data.content);
        setCurrentPage(data.number);
        setTotalPages(data.totalPages);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  };
  
  useEffect(() => {
    getJourneys(currentPage);
  }, [currentPage]);

  const formatDistance = (distance) => {
    const distanceInKm = distance / 1000; // Convert meters to kilometers
    return `${distanceInKm.toFixed(2)} km`;
  };

  const formatDuration = (duration) => {
    const durationInMinutes = duration / 60; // Convert seconds to minutes
    return `${durationInMinutes.toFixed(0)} min`;
  };

  const columnDefs = [
    {
      headerName: 'Departure Date',
      field: 'journey.departureDate',
      width: 200,
      valueFormatter: ({ value }) => {
        const departureDate = value;
        return departureDate ? format(new Date(departureDate), 'MM/dd/yyyy k:mm') : '';
      }
    },
    {
      headerName: 'Return Date',
      field: 'journey.returnDate',
      width: 200,
      valueFormatter: ({ value }) => {
        const returnDate = value;
        return returnDate ? format(new Date(returnDate), 'MM/dd/yyyy k:mm') : '';
      }
    },
    {
      headerName: 'Departure Station',
      field: 'departureStationName',
      width: 200
    },
    {
      headerName: 'Return Station',
      field: 'returnStationName',
      width: 200
    },
    {
      headerName: 'Distance',
      field: 'journey.distance',
      width: 200,
      valueFormatter: ({ value }) => formatDistance(value)
    },
    {
      headerName: 'Duration',
      field: 'journey.duration',
      width: 150,
      valueFormatter: ({ value }) => formatDuration(value)
    }
  ];
  
  const handlePageChange = (event, page) => {
    setCurrentPage(page - 1);
  };
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="ag-theme-material" style={{ height: 600, width: 1200, margin: 'auto', position: 'relative' }}>
        {isLoading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              zIndex: 1
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <AgGridReact rowData={journeys} columnDefs={columnDefs} />
      </div>
      <Pagination
        count={totalPages}
        page={currentPage + 1}
        onChange={handlePageChange}
        style={{ marginTop: '1rem' }}
      />
    </div>
  );
}
