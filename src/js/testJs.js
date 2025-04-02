'use strict';

import {content, controlDomElements, todayWeatherDomElements, weatherThreeDaysDomElements, mapDomElements} from "./dom.js"
import { fetchApiKey } from "./jobAPI.js"




window.localStorage.clear
// Временно по умолчанию
window.localStorage.setItem("language", "RU")

controlDomElements.serchBar.addEventListener("submit", async function(e) {
    e.preventDefault()

    const city = controlDomElements.searchCityInput.value
    console.log(city);
    console.log(city.trim().length);
    if (city.trim().length != 0) {
        try {
            const weatherData = await getWeatherData("en", "metric", city)
            if (controlDomElements.serchBar.children.length === 3) {
                controlDomElements.searchCityInput.classList.remove("control__search-city-input_error")
                controlDomElements.serchBar.querySelector(".control__ErrorMessage").remove()
            }
            displayWeatherInfo(weatherData, "en", "metric", city)
        }
        catch (error) {
            displayError(error)
        }
    }
    else {
        displayError("Please enter a city")
    }
})

async function getWeatherData(curLangue, typeTemp = "metric", city2) {
    const API_KEY = await fetchApiKey();
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city2}&appid=${API_KEY}&units=${typeTemp}&lang=${curLangue}`;
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error("Could not fetch weather data")
    }
    return await response.json()
}

function displayWeatherInfo(data, curLangue) {
    console.log(data);

    const countryCode = data.sys.country;
    const countryName = new Intl.DisplayNames([curLangue], { type: "region" }).of(countryCode);


    // Форматируем дату и время
    const curDate = getDate(data.timezone, curLangue)

    // Получаем код иконки
    const iconCode = data.weather[0].icon; 
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // Ссылка на иконку


    todayWeatherDomElements.city.innerText = data.name
    todayWeatherDomElements.country.innerText = countryName

    // Меняю язык у названия города
    changeLanguageCityName()


    todayWeatherDomElements.todayDate.innerText = `${curDate[0]} ${curDate[2]} ${curDate[1]}`
        todayWeatherDomElements.todayTime.innerText = curDate[3] 

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


function getDate(timezoneOffset, curLangue) {
    // Получаем смещение часового пояса
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


    // Данные 2 строчки возможно не нужны   ?????
    const date = new Date().toLocaleDateString("en-US", options);
    date.replace(" ", ", ")

    return formattedDate
}


// Функция для отображения ошибки ввода города
function displayError(error) {
    // Если ранее уже была выдана ошибка, то только меняю текст в html поле. Иначе создаю новый
    if (controlDomElements.serchBar.children.length === 3) {
        controlDomElements.serchBar.querySelector(".control__ErrorMessage").innerText = error
    }
    else {
        controlDomElements.searchCityInput.classList.add("control__search-city-input_error")
        const htmlErrorMessage = document.createElement("p")
        htmlErrorMessage.textContent = error
        htmlErrorMessage.classList.add("control__ErrorMessage")
        controlDomElements.serchBar.appendChild(htmlErrorMessage)
    }
}


 
function changeLanguageCityName() {
    // Меняю язык у названия города
    console.log(todayWeatherDomElements.city.innerText);

    fetch(`https://cors-proxy-server-0jmy.onrender.com/geonames?city=${todayWeatherDomElements.city.innerText}&lang=${window.localStorage.getItem("language").toLowerCase()}`)
    .then(response => response.json())
    .then(dataCity => {
        // Проверка на наличие данных в geonames
        if (dataCity && dataCity.geonames && Array.isArray(dataCity.geonames) && dataCity.geonames.length > 0) {
            todayWeatherDomElements.city.innerText = dataCity.geonames[0].name;
        } else {
            console.error("Ошибка: geonames не содержит данных", dataCity);
        }
    })
    .catch(error => console.error("Ошибка:", error));
}
