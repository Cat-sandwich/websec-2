import { useEffect, useState } from 'react';
import './RouteSearch.css';

function RouteSearch({ stations }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [fromSuggestions, setFromSuggestions] = useState(false);
  const [toSuggestions, setToSuggestions] = useState(false);

  const [matchedFrom, setMatchedFrom] = useState([]);
  const [matchedTo, setMatchedTo] = useState([]);


  useEffect(() => {
    const filtered = stations.filter(s =>
      s.title.toLowerCase().includes(from.toLowerCase())
    );
    setMatchedFrom(filtered.slice(0, 5));
  }, [from, stations]);

  useEffect(() => {
    const filtered = stations.filter(s =>
      s.title.toLowerCase().includes(to.toLowerCase())
    );
    setMatchedTo(filtered.slice(0, 5));
  }, [to, stations]);

  const handleSearch = async () => {
    if (!from || !to) return;

    const fromCode = stations.find(s => s.title === from)?.code;
    const toCode = stations.find(s => s.title === to)?.code;

    if (!fromCode || !toCode) {
      alert('Выберите станции из списка');
      return;
    }

    setLoading(true);
    setRoutes([]);

    try {
      const res = await fetch(`http://localhost:3001/api/routes?from=${fromCode}&to=${toCode}`);
      const data = await res.json();
      setRoutes(data.segments || []);
    } catch (err) {
      console.error('Ошибка при загрузке маршрута:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="route-search">
      <h3>Расписание поездов между двумя станциями</h3>

    <div className="search-row">
    <div className="autocomplete-wrapper">
        <h3>Откуда:</h3>
        <input
        type="text"
        value={from}
        onChange={(e) => {
            setFrom(e.target.value);
            setFromSuggestions(true);
        }}
        onBlur={() => setTimeout(() => setFromSuggestions(false), 200)}
        onFocus={() => from && setFromSuggestions(true)}
        />
        {fromSuggestions && matchedFrom.length > 0 && (
        <ul className="suggestions-list">
            {matchedFrom.map((s, i) => (
            <li key={i} onClick={() => {
                setFrom(s.title);
                setFromSuggestions(false);
            }}>
                {s.title} — {s.region}
            </li>
            ))}
        </ul>
        )}
    </div>

    <div className="autocomplete-wrapper">
        <h3>Куда:</h3>
        <input
        type="text"
        value={to}
        onChange={(e) => {
            setTo(e.target.value);
            setToSuggestions(true);
        }}
        onBlur={() => setTimeout(() => setToSuggestions(false), 200)}
        onFocus={() => to && setToSuggestions(true)}
        />
        {toSuggestions && matchedTo.length > 0 && (
        <ul className="suggestions-list">
            {matchedTo.map((s, i) => (
            <li key={i} onClick={() => {
                setTo(s.title);
                setToSuggestions(false);
            }}>
                {s.title} — {s.region}
            </li>
            ))}
        </ul>
        )}
    </div>

  <button className="search-btn" onClick={handleSearch}>Найти</button>
</div>

      {loading && <p>Загрузка...</p>}
      
      {!loading && routes.length === 0 && (
        <div className="no-data">Расписание не найдено</div>
        )}
      {routes.length > 0 && (
        <div className="route-results">
          <h3>Расписание поездов</h3>
          <table>
            <thead>
              <tr>
                <th>Отправление</th>
                <th>Прибытие</th>
                <th>Номер</th>
                <th>Название</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((r, i) => (
                <tr key={i}>
                  <td>{r.departure?.slice(0, 5)}</td>
                  <td>{r.arrival?.slice(0, 5)}</td>
                  <td>{r.thread?.number}</td>
                  <td>{r.thread?.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RouteSearch;
