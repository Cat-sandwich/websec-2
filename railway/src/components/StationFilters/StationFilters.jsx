import { useState } from 'react';
import './StationFilters.css';

function StationFilters({ search, region, setSearch, setRegion, regions, stations }) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const matchedStations = stations
    .filter(st => st.title.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 3);

  const handleSelect = (stationTitle) => {
    setSearch(stationTitle);
    setShowSuggestions(false);
  };

  return (
    <div className="station-filters">
      <h3>Информация о станциях России</h3>

      <div className="search-row">
        <div className="autocomplete-wrapper">
          <h3>Поиск станции:</h3>
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

        <div className="region-filter-wrapper">
          <h3>Фильтр по области:</h3>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="styled-select"
            >
              {regions.map((r, i) => (
                <option key={i} value={r}>{r}</option>
              ))}
            </select>
            {region && (
              <button className="clear-button" onClick={() => setRegion('')}>×</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StationFilters;
