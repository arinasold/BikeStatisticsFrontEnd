import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    useNavigate
} from "react-router-dom"; 
import './App.css';
import Journeys from './components/journeys';
import Stations from './components/stations';


function App() {
  return (
    <div className="App">
            <BrowserRouter>
        <Link to="/journeys">Journeys</Link>{' '}
        <Link to="/stations">Stations</Link>{' '}
        <Routes>
         <Route exact path="/" element={<Journeys />} />
          <Route exact path="/journeys" element={<Journeys />} />
          <Route path="/stations" element={<Stations />} />
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
