'use strict';
import { content, control__refresh_BG, control__change_language, control__name_language, control__hidden_list_languages, control__hidden_element_language, control__hidden_element_language_name, control__change_temperature, control__type_temperature, control__faringate, control__celsius, control__search_city_input, control__search_city_icon, control__search_city_button, today_weather__city, today_weather__country, today_weather__today_date, today_weather__today_time, today_weather__num_temperature_today, today_weather__weather_icon, today_weather__weather_condition, today_weather__perceived_temperature_num, today_weather__wind_speed_num, today_weather__humidity_num, tomorrowDayEl, afterTomorrowDayEl, thirdDayEl, map__latitude_name, map__longitude_name, map__latitude, map__longitude } from "./dom.js"
import {getTodayWeather, getThreeDaysWeather, initMap} from "./script.js"



// Сразу при запуске страницы обновляю стиль выбранного элемента на языке
control__hidden_element_language.forEach(function(el) {
    const elNameLanguage = el.querySelector(".control__hidden-element-language-name")
    if (elNameLanguage.innerText == window.localStorage.getItem("language")) {
        el.classList.add("control__hidden-element-language_selected")
        control__name_language.innerText = window.localStorage.getItem("language")
    }
    else {
        el.classList.remove("control__hidden-element-language_selected")
    }
})

// Сразу при запуске страницы обновляю стиль выбранного элемента на шкале температуры
control__type_temperature.forEach(function(el) {
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




const translations = {
    "en": { "Latitude": "Latitude", "Longitude": "Longituded" },
    "es": { "Latitude": "Latitud", "Longitude": "Longitud" },
    "ru": { "Latitude": "Широта", "Longitude": "Долгота" }
};

function translate(text, lang) {
    return translations[lang][text]
}


// При изменении языка
control__change_language.addEventListener("click", function(e) {
    control__hidden_list_languages.classList.toggle("hidden-by-display")

    // Если клик вне скрытого меню с языками, то игнор
    if (!e.target.closest(".control__hidden-element-language")) return

    const elementLanguage = e.target.closest(".control__hidden-element-language")
    
    // Если нажатый элемент уже был выбран, то игнор
    if (elementLanguage.querySelector(".control__hidden-element-language-name").innerText === control__name_language.innerText) return

    // Убираю стиль выбранного элемента и добавляю на новый выбранный
    control__hidden_element_language.forEach(function(el) {
        el.classList.remove("control__hidden-element-language_selected")
    })
    elementLanguage.classList.add("control__hidden-element-language_selected")

    // Заменяю название языка в окне с текущим языком (тем, на который нажали)
    control__name_language.innerText = elementLanguage.querySelector(".control__hidden-element-language-name").innerText
    getTodayWeather(control__name_language.innerText, window.localStorage.getItem("curTypeTemp"))
    getThreeDaysWeather(control__name_language.innerText, window.localStorage.getItem("curTypeTemp"))


    // Меняю язык у "ширина" и "долгота"
    map__latitude_name.innerText = translate("Latitude", control__name_language.innerText.toLowerCase()) 
    map__longitude_name.innerText = translate("Longitude", control__name_language.innerText.toLowerCase())

    window.localStorage.setItem("language", control__name_language.innerText)
})


// При смене шкалы температуры
control__change_temperature.addEventListener("click", function(e) {
    // Если клик вне элемента с типом температуры, то игнор
    if (!e.target.closest(".control__type-temperature")) return

    const elementTypeTemperature = e.target.closest(".control__type-temperature")

    // Если нажатый элемент уже был выбран, то игнор
    if (elementTypeTemperature.classList.contains("control__type-temperature_selected-type")) return

    control__type_temperature.forEach(function(typeTemp) {
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
    getTodayWeather(control__name_language.innerText, curTypeTemp )
    getThreeDaysWeather(control__name_language.innerText, curTypeTemp )
})






const UNSPLASH_API_KEY = "Ie-v99zRFc6xkpCVhSXQKKRdwzheohCdmwvcxcDScYw";
let numBgImg = 0
// При клике на кнопку изменения фонового изображения
control__refresh_BG.addEventListener("click", function(e) {
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



control__search_city_button.addEventListener("click", function(e) {
    e.preventDefault()
    const city = control__search_city_input.value.trim();     // Получаем город из input

    if (city) {
        getTodayWeather(control__name_language.innerText, window.localStorage.getItem("curTypeTemp"), city);
        getThreeDaysWeather(control__name_language.innerText, window.localStorage.getItem("curTypeTemp"), city);
        control__search_city_input.value = ""

    } else {
        alert("Пожалуйста, введите название города.");
    }
})




// Проверяем поддержку браузером Web Speech API
const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (speechRecognition) {
    const recognition = new speechRecognition();
     
    recognition.interimResults = false; // Не показывать промежуточные результаты
    recognition.maxAlternatives = 1; // Одна лучшая альтернатива результата


    // При нажатии на кнопку микрофона запускаем распознавание речи
    control__search_city_icon.addEventListener("click", () => {
        // Устанавливаем язык для распознавания речи
        recognition.lang = `${window.localStorage.getItem("language").toLowerCase()}-${window.localStorage.getItem("language")}`;
        console.log(`${window.localStorage.getItem("language").toLowerCase()}-${window.localStorage.getItem("language")}`); 
        recognition.start();
        control__search_city_input.value = "🎙️ Говорите...";
    });

    // Обработчик события успешного распознавания
    recognition.addEventListener("result", (event) => {
        const transcript = event.results[0][0].transcript.trim(); // Распознанный текст
        control__search_city_input.value = transcript; // Вставляем текст в инпут
        console.log("Распознанный текст:", transcript);
        recognition.stop(); // Останавливаем распознавание

        // Автоматически запускаем поиск после распознавания
        control__search_city_button.click();
    });

    // Обработчик ошибки
    recognition.addEventListener("error", (event) => {
        console.error("Ошибка распознавания:", event.error);
        alert("Ошибка распознавания речи. Попробуйте снова.");
        control__search_city_input.value = "🎤";
    });

} else {
    console.warn("Web Speech API не поддерживается в этом браузере");
    alert("Ваш браузер не поддерживает голосовой ввод 😢");
}
