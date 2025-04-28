'use strict';

import {
    content,
    controlDomElements,
    todayWeatherDomElements,
    threeDaysArr,
    weatherThreeDaysDomElements,
    mapDomElements,
} from './dom.js';
import { fetchApiKey } from './jobAPI.js';
import { refreshBG, getApiBG } from "./changeBG.js"


function initDefaultLocalStorage() {
    // Устанавливаем шкалу температуры по умолчанию, если её нет в localStorage
    if (!window.localStorage.getItem('curTypeTemp')) {
        window.localStorage.setItem('curTypeTemp', 'metric'); // шкала Цельсия
    }
    if (!window.localStorage.getItem('curTypeTempName')) {
        window.localStorage.setItem('curTypeTempName', '°C');
    }

    // Устанавливаем язык по умолчанию, если её нет в localStorage
    if (!window.localStorage.getItem('language')) {
        window.localStorage.setItem('language', 'EN');
    }
}

initDefaultLocalStorage()

const weatherAPIUrl = 'https://api.openweathermap.org/data/2.5';

controlDomElements.serchBar.addEventListener('submit', (e) => handleForm(e));
async function handleForm(e) {
    e.preventDefault();
    const city = controlDomElements.searchCityInput.value.trim();
    await loadCityWeather(city);   
}

async function loadCityWeather(city) {
    if (!city) {
        return displayError('Пожалуйста, введите город');
    }

    try {
        const [todayWeather, forecast] = await getWeatherData(
            'en',
            'metric',
            city
        );
        hideErrorMessage();

        displayWeatherInfo(todayWeather, 'en', 'metric');
        controlDomElements.searchCityInput.value = '';

        const dailyForecasts = forecast.list.filter((entry) =>
            entry.dt_txt.includes('12:00:00')
        );
        window.localStorage.setItem('tempOtherDays', JSON.stringify([]));

        threeDaysArr.forEach((day, i) =>
            displayThreeDaysWeather(dailyForecasts[i + 1], i, 'en')
        );
        window.localStorage.setItem('city', todayWeather.name); // Сохраняем новый город в localStorage

        refreshBG();        // Переключение на следующее изображение (если что-то есть)
        await getApiBG(true); // Загружаем картинки под новый город
    } catch (error) {
        displayError('Не удалось найти данные по введённому городу.');
    }
    console.log("todayWeatherDomElements.perceivedTemperatureNum: ", todayWeatherDomElements.perceivedTemperatureNum);
}


async function getWeatherData(curLangue, typeTemp = 'metric', city) {
    const API_KEY = await fetchApiKey();
    const url = `${weatherAPIUrl}/weather?q=${city}&appid=${API_KEY}&units=${typeTemp}&lang=${curLangue}`;
    const urlFromThreeDays = `${weatherAPIUrl}/forecast?q=${city}&appid=${API_KEY}&units=${typeTemp}&lang=${curLangue}`;
    const [response, responseFromThreeDays] = await Promise.all([
        fetch(url),
        fetch(urlFromThreeDays),
    ]);

    if (!response.ok || !responseFromThreeDays.ok) {
        throw new Error('Could not fetch weather data');
    }

    const [dataResponseToday, dataResponseThreeDay] = await Promise.all([
        response.json(),
        responseFromThreeDays.json(),
    ]);

    return [dataResponseToday, dataResponseThreeDay];
}

function hideErrorMessage() {
    const el = controlDomElements.serchBar.querySelector(
        '.control__ErrorMessage'
    );
    if (el) {
        controlDomElements.searchCityInput.classList.remove(
            'control__search-city-input_error'
        );
        el.remove();
    }
}

function displayWeatherInfo(data, curLangue) {
    console.log('DISPLAY WEATHER INFO DATA:', data);
    const countryCode = data.sys.country;
    const countryName = new Intl.DisplayNames([curLangue], {
        type: 'region',
    }).of(countryCode);


    // Форматируем дату и время
    const [weekday, day, month, time] = formatDate(data.timezone, curLangue);

    todayWeatherDomElements.city.innerText = data.name;
    todayWeatherDomElements.country.innerText = countryName;

    window.localStorage.setItem("city", data.name)

    // Временно закомментировал вызов функции. Потом надо будет вернуть!!!!!!!
    // changeLanguageCityName()

    todayWeatherDomElements.todayDate.innerText = `${weekday} ${month} ${day}`;
    todayWeatherDomElements.todayTime.innerText = time;

    todayWeatherDomElements.weatherCondition.innerText =
        data.weather[0].description;

    todayWeatherDomElements.windSpeedNum.innerText = data.wind.speed;

    todayWeatherDomElements.humidityNum.innerText = data.main.humidity;

    // Получаем код иконки и заменяю у сегодняшней погоды
    const iconCode = data.weather[0].icon;
    todayWeatherDomElements.weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // Ссылка на иконку
    todayWeatherDomElements.weatherIcon.alt = data.weather[0].description;

    // Создаю переменные под температуру в Цельсиях, записываю её в локалСторэдж и вписываю в html в нужном типе температуры (зависит от того, какой тип температуры сейчас выьран на странице)
    const tempToday = convertUnitTemp(data.main.temp);
    const tempfeelsLike = convertUnitTemp(data.main.feels_like);

    window.localStorage.setItem('tempTodayC', data.main.temp);
    window.localStorage.setItem('tempfeelsLikeC', data.main.feels_like);

    console.log("tempToday: ", tempToday);
    console.log("tempfeelsLike: ", tempfeelsLike);
    console.log("todayWeatherDomElements.perceivedTemperatureNum: ", todayWeatherDomElements.perceivedTemperatureNum);

    todayWeatherDomElements.numTemperatureToday.innerText = tempToday;
    todayWeatherDomElements.perceivedTemperatureNum.innerText = tempfeelsLike;

    // Устанавливаю координаты и запускаю показ карты
    window.localStorage.setItem('latitude', data.coord.lat);
    window.localStorage.setItem('longitude', data.coord.lon);

    initMap(
        window.localStorage.getItem('latitude'),
        window.localStorage.getItem('longitude')
    );
    console.log("todayWeatherDomElements.perceivedTemperatureNum: ", todayWeatherDomElements.perceivedTemperatureNum);
}

function formatDate(timezoneOffset, curLangue) {
    // Получаем смещение часового пояса
    const localTime = new Date(Date.now() + timezoneOffset * 1000);

    // Форматируем дату и время
    const options = {
        weekday: 'short', // "Thu" → "Чт" (если ru)
        day: 'numeric',
        month: 'long', // "March" → "Март"
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // Для 24-часового формата
        timeZone: 'UTC',
    };
    return localTime
        .toLocaleDateString(curLangue, options)
        .replace(',', '') // убираем запятую
        .replace(' at', '') // убираем "at" если есть
        .split(' '); // возвращаем массив в нужном виде
}

// Вызов функции временно закомментирован. Потом верну!!!!
function changeLanguageCityName() {
    // Меняю язык у названия города
    console.log(todayWeatherDomElements.city.innerText);

    fetch(
        `https://cors-proxy-server-0jmy.onrender.com/geonames?city=${todayWeatherDomElements.city.innerText}&lang=${window.localStorage.getItem('language').toLowerCase()}`
    )
        .then((response) => response.json())
        .then((dataCity) => {
            // Проверка на наличие данных в geonames
            if (
                dataCity &&
                dataCity.geonames &&
                Array.isArray(dataCity.geonames) &&
                dataCity.geonames.length > 0
            ) {
                todayWeatherDomElements.city.innerText =
                    dataCity.geonames[0].name;
            } else {
                console.error('Ошибка: geonames не содержит данных', dataCity);
            }
        })
        .catch((error) => console.error('Ошибка:', error));
}

function displayThreeDaysWeather(curDayData, index, curLangue) {
    // Данные на выбранный день
    const dayName = new Date(curDayData.dt_txt).toLocaleDateString(curLangue, {
        weekday: 'short',
    });
    console.log('curDayData.main.temp: ', curDayData.main.temp);
    const temp = convertUnitTemp(curDayData.main.temp);
    const weatherIcon = `https://openweathermap.org/img/wn/${curDayData.weather[0].icon}@2x.png`;

    addItemToLocalStorageArray('tempOtherDays', curDayData.main.temp);

    // Выводим данные в HTML
    const el = threeDaysArr[index];
    el.querySelector('.day__day-week').innerText = dayName;
    el.querySelector('.day__num-temperature').innerText = temp;
    el.querySelector('.day__weather-icon').src = weatherIcon;
}

// Функция для конвертации температуры в другой тип. (Либо возвращения этого же числа)
function convertUnitTemp(temp) {
    console.log("curTypeTemp: ", window.localStorage.getItem('curTypeTemp'));
    const curTypeTemp = window.localStorage.getItem('curTypeTemp');
    if (curTypeTemp === 'metric') {
        return Math.round(temp);
    } else if (curTypeTemp === 'imperial') {
        return Math.round((temp * 9) / 5 + 32);
    }
}

function addItemToLocalStorageArray(key, item) {
    const arr = JSON.parse(localStorage.getItem(key)) || [];
    arr.push(item);
    localStorage.setItem(key, JSON.stringify(arr));
}

function displayError(error) {
    const existing = controlDomElements.serchBar.querySelector(
        '.control__ErrorMessage'
    );
    // Если ранее уже была выдана ошибка, то только меняю текст в html поле. Иначе создаю новый
    if (existing) {
        existing.innerText = error;
    } else {
        controlDomElements.searchCityInput.classList.add(
            'control__search-city-input_error'
        );
        const htmlErrorMessage = document.createElement('p');
        htmlErrorMessage.textContent = error;
        htmlErrorMessage.classList.add('control__ErrorMessage');
        controlDomElements.serchBar.appendChild(htmlErrorMessage);
    }
}

let map;
function initMap(lat, lon) {
    // Удаляем старую карту, если она уже существует
    if (map) {
        map.remove(); // Удаляем старую карту, чтобы избежать наложений
    }

    // Создаём карту и устанавливаем координаты
    map = L.map('map').setView([lat, lon], 10);

    // Добавляем слой карты CartoDB с локализацией
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CartoDB</a>',
    }).addTo(map);

    // Добавляем метку города
    L.marker([lat, lon]).addTo(map).bindPopup('Выбранный город').openPopup();

    // Преобразуем координаты в формат градусов, минут, секунд. Затем вписываем их в HTML
    mapDomElements.latitude.innerText = convertToDMS(lat);
    mapDomElements.longitude.innerText = convertToDMS(lon);
}

// Функция для преобразования координат в формат градусов, минут, секунд
function convertToDMS(coord) {
    const degrees = Math.floor(coord); // Целые градусы
    const minutesFloat = (coord - degrees) * 60; // Остаток, умноженный на 60
    const minutes = Math.floor(minutesFloat); // Целые минуты
    const seconds = Math.round((minutesFloat - minutes) * 60); // Оставшиеся секунды

    return `${degrees}°${minutes}'${seconds}"`; // Форматируем строку
}

// Применяем функции к выбранному ранее городу при запуске страницы 
const defaultCity = window.localStorage.getItem('city') || 'Moscow';
loadCityWeather(defaultCity);

export { convertUnitTemp, addItemToLocalStorageArray };
