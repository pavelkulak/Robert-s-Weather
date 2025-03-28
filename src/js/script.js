'use strict';
import {today_weather__city, today_weather__country, today_weather__today_date, today_weather__today_time, today_weather__num_temperature_today, today_weather__weather_icon, today_weather__weather_condition, today_weather__perceived_temperature_num, today_weather__wind_speed_num, today_weather__humidity_num} from "./dom.js"

const API_KEY = "4e88cbe360a5181d59fb73d2bee0c230";
let city = "Minsk";
if (!window.localStorage.getItem("city")) {
  city = "Minsk";
  window.localStorage.setItem("city", "Minsk")
} else {
  city = window.localStorage.getItem("city");
}


let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ru`;

function getWeather(newCity, curLangue) {
  city = newCity
  window.localStorage.setItem("city", newCity)
  url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=curLangue`;

  fetch(url)
  .then(response => response.json())
  .then(data => {
    const countryCode = data.sys.country;
    const countryName = new Intl.DisplayNames([curLangue], { type: "region" }).of(countryCode);

    // Получаем смещение часового пояса
    const timezoneOffset = data.timezone; // В секундах
    const localTime = new Date(Date.now() + timezoneOffset * 1000);

    // Форматируем дату и время
    const options = { 
      weekday: "short", // "Thu" → "Чт" (если ru)
      day: "numeric", 
      month: "long", // "March" → "Март"
      hour: "2-digit", 
      minute: "2-digit", 
      hour12: false, // Для 24-часового формата
      timeZone: "UTC"
    };
    const formattedDate = localTime.toLocaleDateString(curLangue, options).split(" ");
    formattedDate.splice(3, 1)  // удаляем из массива "at"
    formattedDate[0] = formattedDate[0].replace(",", "")  // Удаляем запятую после названия недели


    const date = new Date().toLocaleDateString("en-US", options);
    date.replace(" ", ", ")

    // Получаем код иконки
    const iconCode = data.weather[0].icon; 
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // Ссылка на иконку


    today_weather__city.innerText = city
    today_weather__country.innerText = countryName

    today_weather__today_date.innerText = `${formattedDate[0]} ${formattedDate[2]} ${formattedDate[1]}`
    today_weather__today_time.innerText = formattedDate[3] 

    console.log(data.main.temp);
    today_weather__num_temperature_today.innerText = Math.floor(data.main.temp)

    today_weather__weather_condition.innerText = data.weather[0].description

    today_weather__perceived_temperature_num.innerText = Math.floor(data.main.feels_like)

    today_weather__wind_speed_num.innerText = data.wind.speed

    today_weather__humidity_num.innerText = data.main.humidity


    today_weather__weather_icon.src = iconUrl;
    today_weather__weather_icon.alt = data.weather[0].description;

    console.log(data);
    // console.log(`Температура в ${data.sys.country} ${data.name}: ${data.main.temp}°C`);

  })
  .catch(error => console.error("Ошибка:", error));
}

getWeather(city, "en")
// getWeather("minsk", "en")
// getWeather("moscow", "ru")
// getWeather("mekka", "ru")



