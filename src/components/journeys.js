import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { format } from 'date-fns';

export default function Journeys() {
  const [journeys, setJourneys] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 25;

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

  const columnDefs = [
    {
      headerName: 'Departure Date',
      field: 'journey.departureDate',
      sortable: true,
      filter: true,
      floatingFilter: true,
      width: 200,
      valueFormatter: ({ value }) => {
        const departureDate = value;
        return departureDate ? format(new Date(departureDate), 'MM/dd/yyyy k:mm') : '';
      }
    },
    {
      headerName: 'Return Date',
      field: 'journey.returnDate',
      sortable: true,
      filter: true,
      floatingFilter: true,
      width: 200,
      valueFormatter: ({ value }) => {
        const returnDate = value;
        return returnDate ? format(new Date(returnDate), 'MM/dd/yyyy k:mm') : '';
      }
    },
    {
      headerName: 'Departure Station',
      field: 'departureStationName',
      sortable: true,
      filter: true,
      floatingFilter: true,
      width: 200
    },
    {
      headerName: 'Return Station',
      field: 'returnStationName',
      sortable: true,
      filter: true,
      floatingFilter: true,
      width: 200
    },
    {
      headerName: 'Distance',
      field: 'journey.distance',
      sortable: true,
      filter: true,
      floatingFilter: true,
      width: 200
    },
    {
      headerName: 'Duration',
      field: 'journey.duration',
      sortable: true,
      filter: true,
      floatingFilter: true,
      width: 150
    }
  ];
  
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="ag-theme-material" style={{ height: 600, width: '100%', margin: 'auto' }}>
          <AgGridReact rowData={journeys} columnDefs={columnDefs} />
        </div>
      )}
      <div>
        <button onClick={handlePreviousPage} disabled={currentPage === 0}>
          Previous Page
        </button>
        <span>
          Page {currentPage + 1} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
          Next Page
        </button>
      </div>
    </div>
  );
}
