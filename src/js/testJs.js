'use strict';

import {content, controlDomElements, todayWeatherDomElements, weatherThreeDaysDomElements, mapDomElements} from "./dom.js"

const API_KEY = import.meta.env.VITE_API_KEY;

controlDomElements.serchBar.addEventListener("submit", async function(e) {
    e.preventDefault()

    const city = controlDomElements.searchCityInput.value

    if (city) {
        try {
            const weatherData = await getWeatherData("en", "metric", city)
            displayWeatherInfo(weatherData, "en", "metric", city)
        }
        catch (error) {
            console.log(error);
            displayError(error)
        }
    }
    else {
        displayError("Please enter a city")
    }
})

async function getWeatherData(curLangue, typeTemp = "metric", city2) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city2}&appid=${API_KEY}&units=${typeTemp}&lang=${curLangue}`;
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error("Could not fetch weather data")
    }
    return await response.json()
}

function displayWeatherInfo(data, curLangue, typeTemp = "metric", city2) {
    console.log(data);
    // const { name: city, 
    //         main: {temp, humidity},
    //         weather: [{description, id}] } = data

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


    todayWeatherDomElements.city.innerText = data.name
    todayWeatherDomElements.country.innerText = countryName

    // Меняю язык у названия города
    // changeLanguageCityName()


    todayWeatherDomElements.todayDate.innerText = `${formattedDate[0]} ${formattedDate[2]} ${formattedDate[1]}`
        todayWeatherDomElements.todayTime.innerText = formattedDate[3] 

        todayWeatherDomElements.numTemperatureToday.innerText = Math.floor(data.main.temp)

        todayWeatherDomElements.weatherCondition.innerText = data.weather[0].description

        todayWeatherDomElements.perceivedTemperatureNum.innerText = Math.floor(data.main.feels_like)

        todayWeatherDomElements.windSpeedNum.innerText = data.wind.speed

        todayWeatherDomElements.humidityNum.innerText = data.main.humidity


        todayWeatherDomElements.weatherIcon.src = iconUrl;
        todayWeatherDomElements.weatherIcon.alt = data.weather[0].description;


        window.localStorage.setItem("latitude", data.coord.lat)
        window.localStorage.setItem("longitude", data.coord.lon)
    
}

function displayError(error) {

}


function changeLanguageCityName() {
    // Меняю язык у названия города
    console.log(todayWeatherDomElements.city.innerText);
    fetch(`http://localhost:3000/geonames?city=${todayWeatherDomElements.city.innerText}&lang=${window.localStorage.getItem("language").toLowerCase()}`)
    .then(response => response.json())
    .then(dataCity => {
        todayWeatherDomElements.city.innerText = dataCity.geonames[0].name
    }) 
    .catch(error => console.error("Ошибка:", error));
}


