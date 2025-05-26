'use strict';

import {
    controlDomElements,
    todayWeatherDomElements,
    upcomingForecastDays,
} from './dom.js';
import { fetchApiKey } from './getAPI_Key.js';
import { getApiBG } from './changeBG.js';
import { hideErrorMessage, displayError, showErrorOverlay } from './errors.js';
import { initMap } from './map.js';
import { formatDate } from './utils.js';
import {
    addItemToLocalStorageArray,
    setToLocalStorage,
    getFromLocalStorage,
} from './localStorage.js';

function initDefaultLocalStorage() {
    // Устанавливаем шкалу температуры по умолчанию, если её нет в localStorage
    if (!getFromLocalStorage('currentTypeTemperature')) {
        setToLocalStorage('currentTypeTemperature', 'metric'); // шкала Цельсия
    }
    if (!getFromLocalStorage('currentTypeTemperatureName')) {
        setToLocalStorage('currentTypeTemperatureName', '°C');
    }

    // Устанавливаем язык по умолчанию, если её нет в localStorage
    if (!getFromLocalStorage('language')) {
        setToLocalStorage('language', 'EN');
    }
}

initDefaultLocalStorage();

const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';

controlDomElements.searchBar.addEventListener('submit', (e) => handleForm(e));
async function handleForm(e) {
    e.preventDefault();
    const city = controlDomElements.searchCityInput.value.trim();
    await loadCityWeather(city);
}

async function loadCityWeather(city) {
    if (!city) return displayError('Пожалуйста, введите город');

    try {
        const [todayWeather, forecast] = await getWeatherData(
            'en',
            'metric',
            city
        );

        if (
            !todayWeather ||
            !forecast ||
            !forecast.list ||
            !Array.isArray(forecast.list) ||
            !todayWeather.main
        ) {
            return displayError(
                'Не удалось найти данные по введённому городу.'
            );
        }

        hideErrorMessage();
        displayWeatherInfo(todayWeather, 'en');
        controlDomElements.searchCityInput.value = '';

        const dailyForecasts = forecast.list.filter((entry) =>
            entry.dt_txt.includes('12:00:00')
        );

        if (dailyForecasts.length < 4) return showErrorOverlay();

        setToLocalStorage('tempOtherDays', JSON.stringify([]));

        upcomingForecastDays.forEach((day, i) => {
            if (dailyForecasts[i + 1]) {
                displayUpcomingForecastDays(dailyForecasts[i + 1], i, 'en');
            } else {
                showErrorOverlay();
            }
        });

        setToLocalStorage('city', todayWeather.name); // Сохраняем новый город в localStorage
        await getApiBG(true); // Загружаем картинки под новый город
    } catch (error) {
        displayError('Не удалось найти данные по введённому городу.');
    }
}

async function getWeatherData(curLangue, typeTemp = 'metric', city) {
    const API_KEY = await fetchApiKey();

    const [weatherRes, forecastRes] = await Promise.all([
        fetch(
            `${WEATHER_API_URL}/weather?q=${city}&appid=${API_KEY}&units=${typeTemp}&lang=${curLangue}`
        ),
        fetch(
            `${WEATHER_API_URL}/forecast?q=${city}&appid=${API_KEY}&units=${typeTemp}&lang=${curLangue}`
        ),
    ]);

    if (!weatherRes.ok || !forecastRes.ok) {
        throw new Error('Could not fetch weather data');
    }

    const [todayData, forecastData] = await Promise.all([
        weatherRes.json(),
        forecastRes.json(),
    ]);

    if (!todayData || !forecastData) {
        showErrorOverlay();
        throw new Error('Некорректные данные от API');
    }

    return [todayData, forecastData];
}

function displayWeatherInfo(data, curLangue) {
    const countryCode = data.sys.country;
    const countryName = new Intl.DisplayNames([curLangue], {
        type: 'region',
    }).of(countryCode);

    // Форматируем дату и время
    const [weekday, day, month, time] = formatDate(data.timezone, curLangue);

    todayWeatherDomElements.city.innerText = data.name;
    todayWeatherDomElements.country.innerText = countryName;
    todayWeatherDomElements.todayDate.innerText = `${weekday} ${month} ${day}`;
    todayWeatherDomElements.todayTime.innerText = time;
    todayWeatherDomElements.weatherCondition.innerText =
        data.weather[0].description;
    todayWeatherDomElements.windSpeedNum.innerText = data.wind.speed;
    todayWeatherDomElements.humidityNum.innerText = data.main.humidity;

    const { name, sys, main, wind, weather, coord } = data;
    console.log(data);
    console.log(name, sys, main, wind, weather, coord);
    console.log(data.name, data.datasysm, data.main, data.wind);
    console.log('waw');

    setToLocalStorage('city', data.name);

    // Временно закомментировал вызов функции. Потом надо будет вернуть!!!!!!!
    // changeLanguageCityName()

    // Получаем код иконки и заменяю у сегодняшней погоды
    const iconCode = data.weather[0].icon;
    todayWeatherDomElements.weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // Ссылка на иконку
    todayWeatherDomElements.weatherIcon.alt = data.weather[0].description;
    todayWeatherDomElements.weatherIcon.removeAttribute('style');

    // Создаю переменные под температуру в Цельсиях, записываю её в локалСторэдж и вписываю в html в нужном типе температуры (зависит от того, какой тип температуры сейчас выьран на странице)
    const tempToday = convertUnitTemp(data.main.temp);
    const tempfeelsLike = convertUnitTemp(data.main.feels_like);

    setToLocalStorage('tempTodayC', data.main.temp);
    setToLocalStorage('tempfeelsLikeC', data.main.feels_like);

    todayWeatherDomElements.numTemperatureToday.innerText = tempToday;
    todayWeatherDomElements.perceivedTemperatureNum.innerText = tempfeelsLike;

    // Устанавливаю координаты и запускаю показ карты
    setToLocalStorage('latitude', data.coord.lat);
    setToLocalStorage('longitude', data.coord.lon);

    initMap(getFromLocalStorage('latitude'), getFromLocalStorage('longitude'));
}

// Вызов функции временно закомментирован. Потом верну!!!!
function changeLanguageCityName() {
    // Меняю язык у названия города
    console.log(todayWeatherDomElements.city.innerText);

    fetch(
        `https://cors-proxy-server-0jmy.onrender.com/geonames?city=${todayWeatherDomElements.city.innerText}&lang=${getFromLocalStorage('language').toLowerCase()}`
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
                showErrorOverlay();
            }
        })
        .catch((error) => console.error('Ошибка:', error));
}

function displayUpcomingForecastDays(curDayData, index, curLangue) {
    // Данные на выбранный день
    const dayName = new Date(curDayData.dt_txt).toLocaleDateString(curLangue, {
        weekday: 'short',
    });
    const temp = convertUnitTemp(curDayData.main.temp);
    const weatherIcon = `https://openweathermap.org/img/wn/${curDayData.weather[0].icon}@2x.png`;

    addItemToLocalStorageArray('tempOtherDays', curDayData.main.temp);

    // Выводим данные в HTML
    const el = upcomingForecastDays[index];
    el.querySelector('.day__day-week').innerText = dayName;
    el.querySelector('.day__num-temperature').innerText = temp;
    const iconDay = el.querySelector('.day__weather-icon');
    iconDay.src = weatherIcon;
    iconDay.removeAttribute('style');
}

// Функция для конвертации температуры в другой тип. (Либо возвращения этого же числа)
function convertUnitTemp(temp) {
    const currentTypeTemperature = getFromLocalStorage('currentTypeTemperature');
    if (currentTypeTemperature === 'metric') return Math.round(temp);
    if (currentTypeTemperature === 'imperial') return Math.round((temp * 9) / 5 + 32);
}

// Применяем функции к выбранному ранее городу при запуске страницы
const defaultCity = getFromLocalStorage('city') || 'Moscow';
loadCityWeather(defaultCity);

export {
    convertUnitTemp,
    addItemToLocalStorageArray,
    setToLocalStorage,
    getFromLocalStorage,
};
