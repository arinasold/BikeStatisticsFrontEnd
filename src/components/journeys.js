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
  const [sortField, setSortField] = useState('');
  const pageSize = 10;
  const abortControllerRef = React.useRef(null);



  const getJourneys = (page, sort) => {
    setIsLoading(true);

    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const sortParam = sort ? `&sort=${sort}` : '';
    fetch(`https://city-bike-helsinki.herokuapp.com/api/journeys?page=${page}&pageSize=${pageSize}${sortParam}`, 
        {
          signal: abortController.signal
        })

      .then(response => response.json())
      .then(data => {
        setJourneys(data.content);
        setCurrentPage(data.number);
        setTotalPages(data.totalPages);
        setIsLoading(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getJourneys(currentPage, sortField);
    return () => {
      // Clean up by canceling any ongoing request when the component unmounts
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [currentPage, sortField]);

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
        return returnDate ? format(new Date(returnDate), 'dd/MM/yyyy k:mm') : '';
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
    getJourneys(page - 1, sortField); // Pass the current page and sort value to getJourneys
  };

  const handleSortChange = (event) => {
    const sortValue = event.target.value;
    setSortField(sortValue);
    setCurrentPage(0); // Reset the page to the first page when sorting changes
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ marginBottom: '1rem' }}>
    Sort by:
    <select value={sortField} onChange={handleSortChange}>
          <option value="">None</option>
          <option value="departureDate,asc">Departure Date (Ascending)</option>
          <option value="departureDate,desc">Departure Date (Descending)</option>
          <option value="returnDate,asc">Return Date (Ascending)</option>
          <option value="returnDate,desc">Return Date (Descending)</option>
          <option value="departureStation,asc">Departure Station (Ascending)</option>
          <option value="departureStation,desc">Departure Station (Descending)</option>
          <option value="returnStation,asc">Return Station (Ascending)</option>
          <option value="returnStation,desc">Return Station (Descending)</option>
          <option value="distance,asc">Distance (Ascending)</option>
          <option value="distance,desc">Distance (Descending)</option>
          <option value="duration,asc">Duration (Ascending)</option>
          <option value="duration,desc">Duration (Descending)</option>

        </select>
      </div>
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
