'use strict';

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

const map__latitude = document.querySelector(".map__latitude-num")
const map__longitude = document.querySelector(".map__longitude-num")


export {today_weather__city, today_weather__country, today_weather__today_date, today_weather__today_time, today_weather__num_temperature_today, today_weather__weather_icon, today_weather__weather_condition, today_weather__perceived_temperature_num, today_weather__wind_speed_num, today_weather__humidity_num, tomorrowDayEl, afterTomorrowDayEl, thirdDayEl, map__latitude, map__longitude}