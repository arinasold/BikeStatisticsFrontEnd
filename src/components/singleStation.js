import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Paper, List, ListItem } from '@mui/material';
import { CircularProgress } from '@mui/material';

export default function SingleStation() {
  const { id } = useParams();
  const [stationData, setStationData] = useState(null);

  useEffect(() => {
    fetch(`https://city-bike-helsinki.herokuapp.com/api/stations/${id}`)
      .then(response => response.json())
      .then(data => setStationData(data))
      .catch(error => console.error(error));
  }, [id]);

  if (!stationData) {
    return <CircularProgress />;
  }

  const formatDistance = (distance) => {
    const distanceInKm = distance / 1000; // Convert meters to kilometers
    return `${distanceInKm.toFixed(2)} km`;
  };

  const formatDuration = (duration) => {
    const durationInMinutes = duration / 60; // Convert seconds to minutes
    return `${durationInMinutes.toFixed(0)} min`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ maxWidth: '600px' }}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h4" component="h2" align='center' color={'blue'}>{stationData.name}</Typography>
          <Typography variant="body1" component="p">Total number of journeys starting from the station: {stationData.departureJourneysCount}</Typography>
          <Typography variant="body1" component="p">Total number of journeys ending at the station: {stationData.returnJourneysCount}</Typography>
          <Typography variant="body1" component="p">Average distance of a journey starting from the station: {formatDistance(stationData.averageDistanceOfDepartureJourneys)}</Typography>
          <Typography variant="body1" component="p">Average distance of a journey ending at the station: {formatDistance(stationData.averageDistanceOfReturnJourneys)}</Typography>
          <div style={{align: 'center', marginTop: '10px'}}>
          <Typography variant="h5" component="h3" align='center'>Top 5 most popular return stations from the {stationData.name}</Typography>
          <List >
            {stationData.top5PopularReturnStations.map(station => (
              <ListItem key={station} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="body1" >{station}</Typography>
              </ListItem>
            ))}
          </List>
          </div>
          <Typography variant="h5" component="h3" align='center'>Top 5 most popular departure stations at the {stationData.name}</Typography>
          <List >
            {stationData.top5PopularDepartureStations.map(station => (
              <ListItem key={station} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="body1">{station}</Typography>
              </ListItem>
            ))}
          </List>
        </Paper>
      </div>
    </div>
  );
}
