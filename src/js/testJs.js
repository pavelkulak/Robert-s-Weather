'use strict';
import { content, control__refresh_BG, control__change_language, control__name_language, control__hidden_list_languages, control__hidden_element_language, control__hidden_element_language_name, control__change_temperature, control__type_temperature, control__faringate, control__celsius, control__serch_bar, control__search_city_input, control__search_city_icon, control__search_city_button, today_weather__city, today_weather__country, today_weather__today_date, today_weather__today_time, today_weather__num_temperature_today, today_weather__weather_icon, today_weather__weather_condition, today_weather__perceived_temperature_num, today_weather__wind_speed_num, today_weather__humidity_num, tomorrowDayEl, afterTomorrowDayEl, thirdDayEl, map__latitude_name, map__longitude_name, map__latitude, map__longitude } from "./dom.js"

const API_KEY = "4e88cbe360a5181d59fb73d2bee0c230";

control__serch_bar.addEventListener("submit", async function(e) {
    e.preventDefault()

    const city = control__search_city_input.value

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


    today_weather__city.innerText = data.name
    today_weather__country.innerText = countryName

    // Меняю язык у названия города
    // changeLanguageCityName()


    today_weather__today_date.innerText = `${formattedDate[0]} ${formattedDate[2]} ${formattedDate[1]}`
        today_weather__today_time.innerText = formattedDate[3] 

        today_weather__num_temperature_today.innerText = Math.floor(data.main.temp)

        today_weather__weather_condition.innerText = data.weather[0].description

        today_weather__perceived_temperature_num.innerText = Math.floor(data.main.feels_like)

        today_weather__wind_speed_num.innerText = data.wind.speed

        today_weather__humidity_num.innerText = data.main.humidity


        today_weather__weather_icon.src = iconUrl;
        today_weather__weather_icon.alt = data.weather[0].description;


        window.localStorage.setItem("latitude", data.coord.lat)
        window.localStorage.setItem("longitude", data.coord.lon)
    
}

function displayError(error) {

}


function changeLanguageCityName() {
    // Меняю язык у названия города
    console.log(today_weather__city.innerText);
    fetch(`http://localhost:3000/geonames?city=${today_weather__city.innerText}&lang=${window.localStorage.getItem("language").toLowerCase()}`)
    .then(response => response.json())
    .then(dataCity => {
        today_weather__city.innerText = dataCity.geonames[0].name
    }) 
    .catch(error => console.error("Ошибка:", error));
}


