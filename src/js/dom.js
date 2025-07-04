'use strict';

const content = document.querySelector('.content');

const controlSection = document.querySelector('.control');
const controlDomElements = {
    refreshBGButton: controlSection.querySelector(
        '.control__refresh-BG-button'
    ),
    refreshBG: controlSection.querySelector('.control__refresh-BG-img'),
    changeLanguage: controlSection.querySelector('.control__change-language'),
    nameLanguage: controlSection.querySelector('.control__name-language'),
    hiddenListLanguages: controlSection.querySelector(
        '.control__hidden-list-languages'
    ),
    hiddenElementsLanguage: controlSection.querySelectorAll(
        '.control__hidden-element-language'
    ),
    hiddenElementLanguageName: controlSection.querySelectorAll(
        '.control__hidden-element-language-name'
    ),

    changeTemperature: controlSection.querySelector(
        '.control__change-temperature'
    ),
    typesTemperature: controlSection.querySelectorAll(
        '.control__type-temperature'
    ),
    faringate: controlSection.querySelector('.control__faringate'),
    celsius: controlSection.querySelector('.control__celsius'),

    searchBar: controlSection.querySelector('.control__search-bar'),
    searchCityInput: controlSection.querySelector(
        '.control__search-city-input'
    ),
    searchCityIcon: controlSection.querySelector('.control__search-city-icon'),
    searchCityButton: controlSection.querySelector(
        '.control__search-city-button'
    ),
};

const todayWeatherSection = document.querySelector('.today-weather');
const todayWeatherDomElements = {
    city: todayWeatherSection.querySelector('.today-weather__city'),
    country: todayWeatherSection.querySelector('.today-weather__country'),
    todayDate: todayWeatherSection.querySelector('.today-weather__today-date'),
    todayTime: todayWeatherSection.querySelector('.today-weather__today-time'),
    numTemperatureToday: todayWeatherSection.querySelector(
        '.today-weather__num-temperature-today'
    ),

    weatherIcon: todayWeatherSection.querySelector(
        '.today-weather__weather-icon'
    ),

    weatherCondition: todayWeatherSection.querySelector(
        '.today-weather__weather-condition'
    ),
    perceivedTemperatureNum: todayWeatherSection.querySelector(
        '.today-weather__perceived-temperature-num'
    ),
    windSpeedNum: todayWeatherSection.querySelector(
        '.today-weather__wind-speed-num'
    ),
    humidityNum: todayWeatherSection.querySelector(
        '.today-weather__humidity-num'
    ),
};

const upcomingForecastSection = document.querySelector('.upcoming-forecast');
const upcomingForecastDays = [
    ...upcomingForecastSection.querySelectorAll('.day'),
];

const mapSection = document.querySelector('.map');
const mapDomElements = {
    latitudeLabel: mapSection.querySelector('.map__latitude-name'),
    longitudeLabel: mapSection.querySelector('.map__longitude-name'),
    latitudeValue: mapSection.querySelector('.map__latitude-num'),
    longitudeValue: mapSection.querySelector('.map__longitude-num'),
};

const errorContainer = document.querySelector('.error-container');
const errorMessage = document.querySelector('.error-message__button');

export {
    content,
    controlDomElements,
    todayWeatherDomElements,
    upcomingForecastDays,
    mapDomElements,
    errorContainer,
    errorMessage,
};
