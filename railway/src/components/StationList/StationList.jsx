import { useState, useRef } from 'react';
import './StationList.css';

const stationTypeMap = {
  station: 'станция',
  platform: 'платформа',
  stop: 'остановочный пункт',
  checkpoint: 'блок-пост',
  post: 'пост',
  crossing: 'разъезд',
  overtaking_point: 'обгонный пункт',
  train_station: 'вокзал',
  airport: 'аэропорт',
  bus_station: 'автовокзал',
  bus_stop: 'автобусная остановка',
  unknown: 'неизвестно',
  port: 'порт',
  port_point: 'пункт порта',
  wharf: 'пристань',
  river_port: 'речной вокзал',
  marine_station: 'морской вокзал',
};

function StationList({ stations, onStationClick }) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; 
  const scrollRef = useRef(null);


  const totalPages = Math.ceil(stations.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentStations = stations.slice(startIndex, startIndex + pageSize);

  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  return (
    <>
      
      <div className="station-list">
      <h3>Список станций</h3>
        <table>
          <thead>
            <tr>
              <th>Название</th>
              <th>Тип станции</th>
              <th>Область</th>
              <th></th>
            </tr>
          </thead>
        </table>

        <div className="scrollable-table-body" ref={scrollRef}>
          <table>
            <tbody>
              {currentStations.map((s, i) => (
                <tr key={i}>
                  <td>{s.title}</td>
                  <td>{stationTypeMap[s.station_type] || s.station_type}</td>
                  <td>{s.region}</td>
                  <td>
                    <button className="icon-button" onClick={() => onStationClick(s)} title="Показать расписание">
                      📅
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {stations.length > pageSize && (
          <div className="pagination">
            <button onClick={handlePrev} disabled={currentPage === 1}>Назад</button>
            <span>Страница {currentPage} из {totalPages}</span>
            <button onClick={handleNext} disabled={currentPage === totalPages}>Вперёд</button>
          </div>
        )}
      </div>
    </>
  );
}

export default StationList;
