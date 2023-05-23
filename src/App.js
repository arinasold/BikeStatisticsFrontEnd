import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Journeys from './components/journeys';
import Stations from './components/stations';
import SingleStation from './components/singleStation';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';

function App() {
  return (
    <div>
      
      <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
        <Typography variant='h6' marginRight="20px">
          Helsinki City Bikes
          </Typography>
          <Stack spacing={2} direction="row">
          <Button color='primary' component={Link} to="/journeys" variant="contained">
              Journeys
            </Button>
            <Button component={Link} to="/stations" variant="contained">
              Stations
            </Button>
            </Stack>
        </Toolbar>
        </AppBar>
        <Routes>
          <Route path="/" element={<Journeys />} />
          <Route path="/journeys" element={<Journeys />} />
          <Route path="/stations" element={<Stations />} />
          <Route path="/stations/:id" element={<SingleStation />} />
        </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
