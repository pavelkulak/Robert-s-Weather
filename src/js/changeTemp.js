'use strict';

import {
    controlDomElements,
    todayWeatherDomElements,
    threeDaysArr,
} from './dom.js';
import { convertUnitTemp} from "./testJs.js"


// Проставляет активный класс выбранной шкале температуры
function setActiveTemperatureType(curTypeTempName) {
    controlDomElements.typesTemperature.forEach(function(el) {
        el.classList.remove("control__type-temperature_selected-type")
    })
    
    const selected = controlDomElements.changeTemperature.querySelector(`.control__${curTypeTempName}`);
    selected?.classList.add("control__type-temperature_selected-type");
}

// Сразу при запуске страницы обновляю стиль выбранного элемента на шкале температуры
setActiveTemperatureType(window.localStorage.getItem("curTypeTempName"))




// При смене шкалы температуры
controlDomElements.changeTemperature.addEventListener("click", function(e) {
    const button = e.target.closest(".control__type-temperature");
    // Если клик вне элемента с типом температуры ИЛИ нажатый элемент уже был выбран, то игнор
    if (!button || button.classList.contains("control__type-temperature_selected-type")) return;


    // Определения названия выбранной шкалы (которое нужно будет передать в функцию для api)
    const isFahrenheit = button.classList.contains("control__faringate");
    const curTypeTemp = isFahrenheit ? "imperial" : "metric";
    const curTypeTempName = isFahrenheit ? "faringate" : "celsius";


    // Обновляю html стиль выбранной температуры, данные в localstorage и саму вписанную температуру (перевожу в нужную шкалу)
    setActiveTemperatureType(curTypeTempName)

    window.localStorage.setItem("curTypeTemp", curTypeTemp)
    window.localStorage.setItem("curTypeTempName", curTypeTempName)

    convertDisplayTemp()
})



// Функция для смены показа температуры на странице
function convertDisplayTemp() {
    todayWeatherDomElements.numTemperatureToday.innerText = convertUnitTemp(window.localStorage.getItem("tempTodayC"))
    todayWeatherDomElements.perceivedTemperatureNum.innerText = convertUnitTemp(window.localStorage.getItem("tempfeelsLikeC"))

    const arrDays = JSON.parse(window.localStorage.getItem("tempOtherDays"))
    threeDaysArr.forEach(function(day) {
        day.querySelector('.day__num-temperature').innerText = convertUnitTemp(arrDays.shift());
    })
}   