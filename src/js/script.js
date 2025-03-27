'use strict';
const API_KEY = "4e88cbe360a5181d59fb73d2bee0c230";
const city = "Moscow";
const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ru`;

fetch(url)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    console.log(`Температура в ${data.sys.country} ${data.name}: ${data.main.temp}°C`);
  })
  .catch(error => console.error("Ошибка:", error));