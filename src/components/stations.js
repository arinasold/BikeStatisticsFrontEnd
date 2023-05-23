import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import Link from '@mui/material/Link';
import { Box, CircularProgress, Pagination } from '@mui/material';

export default function Stations() {
  const [stations, setStations] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 10;

  const getStations = (page) => {
    setIsLoading(true);
    fetch(`https://city-bike-helsinki.herokuapp.com/api/stations?page=${page}&pageSize=${pageSize}`)
      .then(response => response.json())
      .then(data => {
        setStations(data.content);
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
    getStations(currentPage);
  }, [currentPage]);

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="ag-theme-material" style={{ height: 600, width: 350, margin: 'auto', position: 'relative' }}>
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
