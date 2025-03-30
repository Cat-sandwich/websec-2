import { useState } from 'react';
import './StationFilters.css'; 

function StationFilters({ search, region, setSearch, setRegion, regions, stations }) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const matchedStations = stations
    .filter(st => st.title.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 5);

  const handleSelect = (stationTitle) => {
    setSearch(stationTitle);
    setShowSuggestions(false);
  };

  return (
    <>
      <h3>Поиск станции по названию:</h3>
      <div className="autocomplete-wrapper">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowSuggestions(true);
          }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onFocus={() => search && setShowSuggestions(true)}
        />
        {showSuggestions && matchedStations.length > 0 && (
          <ul className="suggestions-list">
            {matchedStations.map((s, i) => (
              <li key={i} onClick={() => handleSelect(s.title)}>
                {s.title} — {s.region}
              </li>
            ))}
          </ul>
        )}
      </div>

      <h3>Фильтр станций по области:</h3>
      <div className="region-filter-wrapper">
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="styled-select"
        >
          <option value="">Все области</option>
          {regions.map((r, i) => (
            <option key={i} value={r}>{r}</option>
          ))}
        </select>
        {region && (
          <button className="clear-button" onClick={() => setRegion('')}>×</button>
        )}
      </div>
    </>
  );
}

export default StationFilters;
