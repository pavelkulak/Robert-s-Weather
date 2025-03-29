'use strict';

const content = document.querySelector(".content")
const control__refresh_BG = document.querySelector(".control__refresh-BG")
const control__change_language = document.querySelector(".control__change-language")
const control__name_language = document.querySelector(".control__name-language")
const control__hidden_list_languages = document.querySelector(".control__hidden-list-languages")
const control__hidden_element_language = document.querySelectorAll(".control__hidden-element-language")
const control__hidden_element_language_name = document.querySelectorAll(".control__hidden-element-language-name")

const control__change_temperature = document.querySelector(".control__change-temperature")
const control__type_temperature = document.querySelectorAll(".control__type-temperature")
const control__faringate = document.querySelector(".control__faringate")
const control__celsius = document.querySelector(".control__celsius")

const control__search_city_input = document.querySelector(".control__search-city-input")
const control__search_city_button = document.querySelector(".control__search-city-button")



const today_weather__city = document.querySelector(".today-weather__city")
const today_weather__country = document.querySelector(".today-weather__country")
const today_weather__today_date = document.querySelector(".today-weather__today-date")
const today_weather__today_time = document.querySelector(".today-weather__today-time")
const today_weather__num_temperature_today = document.querySelector(".today-weather__num-temperature-today")

const today_weather__weather_icon = document.querySelector(".today-weather__weather-icon")

const today_weather__weather_condition = document.querySelector(".today-weather__weather-condition")
const today_weather__perceived_temperature_num = document.querySelector(".today-weather__perceived-temperature-num")
const today_weather__wind_speed_num = document.querySelector(".today-weather__wind-speed-num")
const today_weather__humidity_num = document.querySelector(".today-weather__humidity-num")

const threeDaysArr = [...document.querySelectorAll(".day")]
const tomorrowDayEl = threeDaysArr[0]
const afterTomorrowDayEl = threeDaysArr[1]
const thirdDayEl = threeDaysArr[2]

const map__latitude_name = document.querySelector(".map__latitude-name")
const map__longitude_name = document.querySelector(".map__longitude-name")
const map__latitude = document.querySelector(".map__latitude-num")
const map__longitude = document.querySelector(".map__longitude-num")


export { content, control__refresh_BG, control__change_language, control__name_language, control__hidden_list_languages, control__hidden_element_language, control__hidden_element_language_name, control__change_temperature, control__type_temperature, control__faringate, control__celsius, control__search_city_input, control__search_city_button, today_weather__city, today_weather__country, today_weather__today_date, today_weather__today_time, today_weather__num_temperature_today, today_weather__weather_icon, today_weather__weather_condition, today_weather__perceived_temperature_num, today_weather__wind_speed_num, today_weather__humidity_num, tomorrowDayEl, afterTomorrowDayEl, thirdDayEl, map__latitude_name, map__longitude_name, map__latitude, map__longitude }