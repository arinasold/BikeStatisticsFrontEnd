import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import Link from '@mui/material/Link';
import { Box, CircularProgress, Pagination } from '@mui/material';

import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

export default function Stations() {
  const [stations, setStations] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [sortField, setSortField] = useState('name,asc'); // Default sort field
  const pageSize = 10;
  const abortControllerRef = React.useRef(null);

  const getStations = (page, sort) => {
    setIsLoading(true);

     // Cancel previous request if it exists
     if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const sortParam = sort ? `&sort=${sort}` : ''; // Include sort parameter if provided
    fetch(`https://city-bike-helsinki.herokuapp.com/api/stations?page=${page}&pageSize=${pageSize}${sortParam}`,
     {
      signal: abortController.signal
    })
      .then(response => response.json())
      .then(data => {
        setStations(data.content);
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
    getStations(currentPage, sortField);
    return () => {
      // Clean up by canceling any ongoing request when the component unmounts
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [currentPage, sortField]);

  const columnDefs = [
    {
      headerName: "Station's name",
      field: 'name',
      width: 350,
      cellRendererFramework: ({ value, data }) => (
        <Link underline="none" href={`/stations/${data.id}`}>{value}</Link>
      ),
    },
  ];

  const handlePageChange = (event, page) => {
    setCurrentPage(page - 1);
  };

  const handleSortChange = (event) => {
    const sortValue = event.target.value;
    setSortField(sortValue);
    setCurrentPage(0); // Reset the page to the first page when sorting changes
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>


                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="demo-select-small-label">Sort by</InputLabel>
                  <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={sortField}
                      label="Sort by"
                      onChange={handleSortChange}
                    >
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="name,asc">Name (Ascending)</MenuItem>
                            <MenuItem value="name,desc">Name (Descending)</MenuItem>


                  </Select>
                </FormControl>

      <div className="ag-theme-material" style={{ height: 550, width: 350, margin: 'auto', position: 'relative' }}>
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
        <AgGridReact rowData={stations} columnDefs={columnDefs} />
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
