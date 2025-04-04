'use strict';

import {
    content,
    controlDomElements,
    todayWeatherDomElements,
    threeDaysArr,
    weatherThreeDaysDomElements,
    mapDomElements,
} from './dom.js';

// Сразу при запуске страницы обновляю стиль выбранного элемента на шкале температуры
controlDomElements.typesTemperature.forEach(function(el) {
    const curTypeTemp = window.localStorage.getItem("curTypeTemp")
    if (curTypeTemp == "imperial" && el.classList.contains("control__faringate")) {
        el.classList.add("control__type-temperature_selected-type")
    } 
    else if (curTypeTemp == "metric" && el.classList.contains("control__celsius")) {
        el.classList.add("control__type-temperature_selected-type")
    }
    else {
        el.classList.remove("control__type-temperature_selected-type")
    }
})


// При смене шкалы температуры
controlDomElements.changeTemperature.addEventListener("click", function(e) {
    // Если клик вне элемента с типом температуры, то игнор
    if (!e.target.closest(".control__type-temperature")) return

    const elementTypeTemperature = e.target.closest(".control__type-temperature")

    // Если нажатый элемент уже был выбран, то игнор
    if (elementTypeTemperature.classList.contains("control__type-temperature_selected-type")) return

    controlDomElements.typesTemperature.forEach(function(typeTemp) {
        typeTemp.classList.remove("control__type-temperature_selected-type")
    })
    elementTypeTemperature.classList.add("control__type-temperature_selected-type")

    // Создаю переменную для определения названия выбранной шкалы (которое нужно будет передать в функцию для api)
    let curTypeTemp = ""
    if (elementTypeTemperature.classList.contains("control__faringate")) {
        curTypeTemp = "imperial"
    } 
    else if (elementTypeTemperature.classList.contains("control__celsius")) {
        curTypeTemp = "metric"
    }

    window.localStorage.setItem("curTypeTemp", curTypeTemp)

    // Обновляю данные на странице, но прописав температуру в выбранной шкале
    convertDisplayTemp()
})



// Функция для смены показа температуры на странице
function convertDisplayTemp() {
    if (window.localStorage.getItem("curTypeTemp") === "metric") {
        todayWeatherDomElements.numTemperatureTodayC.classList.remove("hidden-by-display")
        todayWeatherDomElements.perceivedTemperatureNumC.classList.remove("hidden-by-display")

        todayWeatherDomElements.numTemperatureTodayF.classList.add("hidden-by-display")
        todayWeatherDomElements.perceivedTemperatureNumF.classList.add("hidden-by-display")

        threeDaysArr.forEach(function(day) {
            day.querySelector('.day__num-temperature-celsius').classList.remove("hidden-by-display")
            day.querySelector('.day__num-temperature-fahrenheit').classList.add("hidden-by-display")
        })
    } 
    else {
        todayWeatherDomElements.numTemperatureTodayF.classList.remove("hidden-by-display")
        todayWeatherDomElements.perceivedTemperatureNumF.classList.remove("hidden-by-display")

        todayWeatherDomElements.numTemperatureTodayC.classList.add("hidden-by-display")
        todayWeatherDomElements.perceivedTemperatureNumC.classList.add("hidden-by-display")

        threeDaysArr.forEach(function(day) {
            day.querySelector('.day__num-temperature-fahrenheit').classList.remove("hidden-by-display")
            day.querySelector('.day__num-temperature-celsius').classList.add("hidden-by-display")
        })
    }
}



const UNSPLASH_API_KEY = import.meta.env.VITE_UNSPLASH_KEY;
let numBgImg = 0
// При клике на кнопку изменения фонового изображения
controlDomElements.refreshBG.addEventListener("click", function(e) {
    const url = `https://api.unsplash.com/search/photos?query=${window.localStorage.getItem("city")}&client_id=${UNSPLASH_API_KEY}&per_page=6`;
    fetch(url)
    .then(response => response.json())
    .then(data => {
        if (numBgImg === 4) {
            numBgImg = 5
        } else if (numBgImg > 5) {
            numBgImg = 0
        }
        // Получаем ссылку на первое изображение из результата поиска
        const imageUrl = data.results[numBgImg]?.urls?.regular;
    
        if (imageUrl) {
            // Устанавливаем изображение в качестве фона
            content.style.backgroundImage = `url(${imageUrl})`;
            content.style.backgroundSize = "cover"; // Фоновое изображение будет растянуто на весь экран
            content.style.backgroundPosition = "center"; // Центрируем изображение

            numBgImg += 1
        } else {
            console.log("Изображение не найдено");
        }
        })
        .catch(error => console.error("Ошибка:", error));
})



