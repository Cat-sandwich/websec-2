const express = require('express');
const axios = require('axios');
const cors = require('cors');
const API_KEY = "26dfc285-edb1-4d3e-a43c-476cb595e869"

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/api/stations', async (req, res) => {
    try {
      const response = await axios.get('https://api.rasp.yandex.net/v3.0/stations_list/', {
        params: {
          apikey: API_KEY,
          format: 'json',
          lang: 'ru_RU'
        },
        timeout: 70000
      });
  
      const allCountries = response.data?.countries || [];
  
      const russianStations = [];

        allCountries.forEach(country => {
        if (country.title.toLowerCase() !== 'россия') return;

        country.regions?.forEach(region => {
            region.settlements?.forEach(settlement => {
            settlement.stations?.forEach(station => {
                if (
                (station.transport_type === 'train' || station.transport_type === 'suburban')
                ) {
                russianStations.push({
                    title: station.title,
                    code: station.codes.yandex_code,
                    esr_code: station.codes?.esr_code,
                    transport_type: station.transport_type,
                    settlement: settlement.title,
                    region: region.title,
                    longitude: station.longitude,
                    latitude: station.latitude,
                    station_type: station.station_type
                });
                }
            });
            });
        });
        });
  
      res.json({ stations: russianStations });
  
    } catch (error) {
      console.error('Ошибка при запросе к Яндексу:', error.message);
      res.status(500).json({ error: 'Ошибка на сервере', message: error.message });
    }
  });

  app.get('/api/schedule', async (req, res) => {
    const stationCode = req.query.station;
  
    if (!stationCode) {
      return res.status(400).json({ error: 'Не указан код станции (station)' });
    }
  
    try {
      const response = await axios.get('https://api.rasp.yandex.net/v3.0/schedule/', {
        params: {
          apikey: API_KEY,
          station: stationCode,
          transport_types: 'train,suburban',
          format: 'json',
          lang: 'ru_RU'
        },
        timeout: 15000
      });
      res.json(response.data);
    } catch (error) {
      console.error('Ошибка при получении расписания:', error.message);
      res.status(500).json({ error: 'Ошибка при получении расписания', message: error.message });
    }
  });
  

  app.get('/api/routes', async (req, res) => {
    const { from, to } = req.query;
  
    if (!from || !to) {
      return res.status(400).json({ error: 'Не указаны обе станции (from и to)' });
    }
  
    try {
      const response = await axios.get('https://api.rasp.yandex.net/v3.0/search/', {
        params: {
          apikey: API_KEY,
          from,
          to,
          format: 'json',
          lang: 'ru_RU'
        },
        timeout: 150000
      });
      console.log(response.data)
      res.json(response.data);
    } catch (error) {
      console.error('Ошибка при получении маршрута:', error.message);
      res.status(500).json({ error: 'Ошибка при получении маршрута', message: error.message });
    }
  });  

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
