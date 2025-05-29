'use strict';

import {
    controlDomElements,
    todayWeatherDomElements,
    upcomingForecastDays,
} from './dom.js';
import { fetchApiKey } from './getAPI_Key.js';
import { getApiBG } from './changeBG.js';
import { hideErrorMessage, displayError, showErrorOverlay, validateWeatherData,
} from './errors.js';
import { initMap } from './map.js';
import { formatDate, convertUnitTemp } from './utils.js';
import { addItemToLocalStorageArray, setToLocalStorage, getFromLocalStorage,
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

controlDomElements.searchBar.addEventListener('submit', (e) =>
    handleSearchForm(e)
);
async function handleSearchForm(e) {
    e.preventDefault();
    const city = controlDomElements.searchCityInput.value.trim();
    await loadCityWeather({ city, isInitialLoad: false, isCityChanged: true });
}

function clearCityData() {
    hideErrorMessage();
    controlDomElements.searchCityInput.value = '';
    setToLocalStorage('tempOtherDays', JSON.stringify([]));
}

async function loadCityWeather({
    city,
    isInitialLoad = false,
    isCityChanged = false,
}) {
    if (!city) return displayError('Пожалуйста, введите город');

    try {
        const [todayWeather, forecast] = await getWeatherData({
            language: 'en',
            units: 'metric',
            city,
        });

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

        displayWeatherInfo(todayWeather, 'en');

        // Отфильтровываем погодные данные следующих дней по единому времени - 12ч дня
        const dailyForecasts = forecast?.list.filter((entry) =>
            entry.dt_txt.includes('12:00:00')
        );

        if (dailyForecasts.length < 4) return showErrorOverlay();

        upcomingForecastDays.forEach((day, i) => {
            if (dailyForecasts[i + 1]) {
                displayUpcomingForecastDays(dailyForecasts[i + 1], i, 'en');
            } else {
                showErrorOverlay();
            }
        });

        clearCityData(); // Очищаем некоторые данные

        setToLocalStorage('city', todayWeather.name); // Сохраняем новый город в localStorage
        await getApiBG({ isInitialLoad, isCityChanged }); // Загружаем картинки под новый город
    } catch (error) {
        displayError('Не удалось найти данные по введённому городу.');
    }
}

async function getWeatherData({ curLangue, typeTemp = 'metric', city }) {
    const api_key = await fetchApiKey();

    const [weatherRes, forecastRes] = await Promise.all([
        fetch(
            `${WEATHER_API_URL}/weather?q=${city}&appid=${api_key}&units=${typeTemp}&lang=${curLangue}`
        ),
        fetch(
            `${WEATHER_API_URL}/forecast?q=${city}&appid=${api_key}&units=${typeTemp}&lang=${curLangue}`
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
    console.log(data);
    const countryCode = data.sys.country;
    const countryName = new Intl.DisplayNames([curLangue], {
        type: 'region',
    }).of(countryCode);

    // Форматируем дату и время
    const [weekday, day, month, time] = formatDate(data.timezone, curLangue);

    const {
        name,
        wind: { speed },
        main: { temp, feels_like, humidity },
        weather: [{ description, icon }],
        coord: { lat, lon },
    } = data;

    // Проверка на то, пришли ли верные данные из api (не изменилась ли структура api)
    if (!validateWeatherData(data)) {
        showErrorOverlay;
        return displayError('Данные от API повреждены или устарели');
    }

    todayWeatherDomElements.city.innerText = name;
    todayWeatherDomElements.country.innerText = countryName;
    todayWeatherDomElements.todayDate.innerText = `${weekday} ${month} ${day}`;
    todayWeatherDomElements.todayTime.innerText = time;
    todayWeatherDomElements.weatherCondition.innerText = description;
    todayWeatherDomElements.windSpeedNum.innerText = speed;
    todayWeatherDomElements.humidityNum.innerText = humidity;

    setToLocalStorage('city', data.name);

    // TODO: ... Изменение языка
    // Временно закомментировал вызов функции. Потом надо будет вернуть!!!!!!!
    // changeLanguageCityName()

    // Получаем код иконки и заменяю у сегодняшней погоды
    setIcon(icon, description);

    // Получаю и устанавливаю температуру
    setTemperature(temp, feels_like);

    // Устанавливаю координаты и запускаю показ карты
    createMap(lat, lon);
}

function setIcon(icon, description) {
    const iconCode = icon;
    todayWeatherDomElements.weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // Ссылка на иконку
    todayWeatherDomElements.weatherIcon.alt = description;
    todayWeatherDomElements.weatherIcon.removeAttribute('style');
}

function setTemperature(temp, feels_like) {
    // Создаю переменные под температуру в Цельсиях, записываю её в локалСторэдж и вписываю в html в нужном типе температуры (зависит от того, какой тип температуры сейчас выьран на странице)
    const tempToday = convertUnitTemp(temp);
    const tempfeelsLike = convertUnitTemp(feels_like);

    setToLocalStorage('tempTodayC', temp);
    setToLocalStorage('tempfeelsLikeC', feels_like);

    todayWeatherDomElements.numTemperatureToday.innerText = tempToday;
    todayWeatherDomElements.perceivedTemperatureNum.innerText = tempfeelsLike;
}

function createMap(lat, lon) {
    setToLocalStorage('latitude', lat);
    setToLocalStorage('longitude', lon);

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

// Применяем функции к выбранному ранее городу при запуске страницы
const defaultCity = getFromLocalStorage('city') || 'Moscow';
window.addEventListener('load', async () => {
    await loadCityWeather({ city: defaultCity, isInitialLoad: true });
});

export {
    convertUnitTemp,
    addItemToLocalStorageArray,
    setToLocalStorage,
    getFromLocalStorage,
};
