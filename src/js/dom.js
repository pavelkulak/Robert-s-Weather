'use strict';

const content = document.querySelector(".content")

const controlSection = document.querySelector(".control")
const controlDomElements = {
    refreshBG: controlSection.querySelector(".control__refresh-BG"),
    changeLanguage: controlSection.querySelector(".control__change-language"),
    nameLanguage: controlSection.querySelector(".control__name-language"),
    hiddenListLanguages: controlSection.querySelector(".control__hidden-list-languages"),
    hiddenElementsLanguage: controlSection.querySelectorAll(".control__hidden-element-language"),
    hiddenElementLanguageName: controlSection.querySelectorAll(".control__hidden-element-language-name"),

    changeTemperature: controlSection.querySelector(".control__change-temperature"),
    typesTemperature: controlSection.querySelectorAll(".control__type-temperature"),
    faringate: controlSection.querySelector(".control__faringate"),
    celsius: controlSection.querySelector(".control__celsius"),

    serchBar: controlSection.querySelector(".control__serch-bar"),
    searchCityInput: controlSection.querySelector(".control__search-city-input"),
    searchCityIcon: controlSection.querySelector(".control__search-city-icon"),
    searchCityButton: controlSection.querySelector(".control__search-city-button")
}

const todayWeatherSection = document.querySelector(".today-weather")
const todayWeatherDomElements = {
    city: todayWeatherSection.querySelector(".today-weather__city"),
    country: todayWeatherSection.querySelector(".today-weather__country"),
    todayDate: todayWeatherSection.querySelector(".today-weather__today-date"),
    todayTime: todayWeatherSection.querySelector(".today-weather__today-time"),
    numTemperatureToday: todayWeatherSection.querySelectorAll(".today-weather__num-temperature-today"),
    numTemperatureTodayC: todayWeatherSection.querySelector(".today-weather__num-temperature-today-celsius"),
    numTemperatureTodayF: todayWeatherSection.querySelector(".today-weather__num-temperature-today-fahrenheit"),

    weatherIcon: todayWeatherSection.querySelector(".today-weather__weather-icon"),

    weatherCondition: todayWeatherSection.querySelector(".today-weather__weather-condition"),
    perceivedTemperatureNum: todayWeatherSection.querySelectorAll(".today-weather__perceived-temperature-num"),
    perceivedTemperatureNumC: todayWeatherSection.querySelector(".today-weather__perceived-temperature-num-celsius"),
    perceivedTemperatureNumF: todayWeatherSection.querySelector(".today-weather__perceived-temperature-num-fahrenheit"),
    windSpeedNum: todayWeatherSection.querySelector(".today-weather__wind-speed-num"),
    humidityNum: todayWeatherSection.querySelector(".today-weather__humidity-num")
}

const weatherThreeDaysSection = document.querySelector(".weather-three-days")
const threeDaysArr = [...weatherThreeDaysSection.querySelectorAll(".day")]
const weatherThreeDaysDomElements = {
    tomorrowDayEl: threeDaysArr[0],
    afterTomorrowDayEl: threeDaysArr[1],
    thirdDayEl: threeDaysArr[2]
}

const mapSection = document.querySelector(".map")
const mapDomElements = {
    latitudeName: mapSection.querySelector(".map__latitude-name"),
    longitudeName: mapSection.querySelector(".map__longitude-name"),
    latitude: mapSection.querySelector(".map__latitude-num"),
    longitude: mapSection.querySelector(".map__longitude-num")
}

export {content, controlDomElements, todayWeatherDomElements, threeDaysArr, weatherThreeDaysDomElements, mapDomElements}