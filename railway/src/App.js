import { useEffect, useState } from 'react';
import './App.css';
import StationFilters from './components/StationFilters/StationFilters';
import StationList from './components/StationList/StationList';
import RouteSearch from './components/RouteSearch/RouteSearch';

function App() {
  const [stations, setStations] = useState([]);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [selectedStation, setSelectedStation] = useState(null);
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/stations')
      .then(res => res.json())
      .then(data => setStations(data.stations || []));
  }, []);

  const regions = [...new Set(stations.map(s => s.region))].sort();

  const filteredStations = stations.filter(st =>
    st.title.toLowerCase().includes(search.toLowerCase()) &&
    st.region.toLowerCase().includes(region.toLowerCase())
  );

  const handleStationClick = async (station) => {
    setSelectedStation(station);
    try {
      const res = await fetch(`http://localhost:3001/api/schedule?station=${station.code}`);
      
      const data = await res.json();
      setSchedule(data.schedule || []);
    } catch (err) {
      console.error('Ошибка при загрузке расписания', err);
      setSchedule([]);
    }
  };

  return (
    <div className="container">
      <div className="panel">
        <StationFilters
          search={search}
          region={region}
          setSearch={setSearch}
          setRegion={setRegion}
          regions={regions}
          stations={stations} 
        />
  
        <StationList
          stations={filteredStations}
          onStationClick={handleStationClick} 
        />
  
        {selectedStation && (
          <div className="schedule-panel">
            <div className="schedule-header">
              <h3>Расписание для станции: {selectedStation.title}</h3>
              <button className="clear-button" onClick={() => {
                setSelectedStation(null);
                setSchedule([]);
              }}>×</button>
            </div>
            {schedule.length === 0 ? (
               <div className="no-data">Нет данных</div>
            ) : (
              <ul>
                {schedule.map((s, i) => {
                  
                  return<li key={i}>
                    <div><strong>Номер рейса:</strong> {s.thread.number}</div>
                    <div>{s.departure || '???'} → {s.thread?.title}</div> 
                  </li>
                })}
              </ul>
            )}
          </div>
        )}
      </div>
  
      <div className="panel">
      <RouteSearch stations={stations} />
      </div>
    </div>
  );
}

export default App;
