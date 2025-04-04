'use strict';

import {content, controlDomElements, todayWeatherDomElements, threeDaysArr, weatherThreeDaysDomElements, mapDomElements} from "./dom.js"
import { fetchApiKey } from "./jobAPI.js"




window.localStorage.clear
// Временно по умолчанию
window.localStorage.setItem("language", "RU")





controlDomElements.serchBar.addEventListener("submit", (e) => handleForm(e))
async function handleForm(e) {
    e.preventDefault()
    const city = controlDomElements.searchCityInput.value
    if (city.trim().length > 0) {
        try {
            const weatherData = await getWeatherData("en", "metric", city)

            hideErrorMessage()

            displayWeatherInfo(weatherData[0], "en", "metric", city)

            controlDomElements.searchCityInput.value = ""

            // Фильтруем прогноз на 12:00 по местному времени и выводим данные по 3 дням
            const dailyForecasts = weatherData[1].list.filter(entry => entry.dt_txt.includes("12:00:00"));

            threeDaysArr.forEach(function (day, index) {
                displayThreeDaysWeather(dailyForecasts[index+1], index, "en")
            })
        }
        catch (error) {
            displayError("Не удалось найти данные по введённому городу. Возможно допущена ошибка при вводе.")
        }
    }
    else {
        displayError("Пожалуйста, введите город")
    }
}



async function getWeatherData(curLangue, typeTemp = "metric", city) {
    const API_KEY = await fetchApiKey();
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${typeTemp}&lang=${curLangue}`;
    const urlFromFreeDays = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${typeTemp}&lang=${curLangue}`;
    const [response, responseFromThreeDays] = await Promise.all([
        fetch(url),
        fetch(urlFromFreeDays)
    ]);

    if (!response.ok || !responseFromThreeDays.ok) {
        throw new Error("Could not fetch weather data");
    }

    const [dataResponseToday, dataResponseThreeDay] = await Promise.all([
        response.json(),
        responseFromThreeDays.json()
    ]);

    return [dataResponseToday, dataResponseThreeDay];
}

function hideErrorMessage() {
    if (controlDomElements.serchBar.querySelector(".control__ErrorMessage")) {
        controlDomElements.searchCityInput.classList.remove("control__search-city-input_error")
        controlDomElements.serchBar.querySelector(".control__ErrorMessage").remove()
    }
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

    // Временно закомментировал вызов функции. Потом надо будет вернуть!!!!!!!
    // changeLanguageCityName()


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

    return formattedDate
}

 
// Вызов функции временно закомментирован. Потом верну!!!!
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



function displayError(error) {
    // Если ранее уже была выдана ошибка, то только меняю текст в html поле. Иначе создаю новый
    if (controlDomElements.serchBar.querySelector(".control__ErrorMessage")) {
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



function displayThreeDaysWeather(curDayData, num, curLangue) {
    // Функция для форматирования даты
    function formatDay(dt_txt, lang) {
        const date = new Date(dt_txt);
        return date.toLocaleDateString(lang, { weekday: "short" }); // Выводит "Tue", "Wed" и т. д.
    }

    // Данные на выбранный день
    const nameDay = formatDay(curDayData.dt_txt, curLangue);
    const temp = Math.round(curDayData.main.temp);
    const weatherIcon = `https://openweathermap.org/img/wn/${curDayData.weather[0].icon}@2x.png`;


    // Выводим данные в HTML
    threeDaysArr[num].querySelector(".day__day-week").innerText = nameDay
    threeDaysArr[num].querySelector(".day__num-temperature").innerText = temp
    threeDaysArr[num].querySelector(".day__weather-icon").src = weatherIcon
}   



// Вводим город по умолчанию (пока что временно так)
controlDomElements.searchCityInput.value = "Moscow"
controlDomElements.searchCityButton.click()