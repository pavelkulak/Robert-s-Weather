'use strict';

import {
    content,
    controlDomElements,
    todayWeatherDomElements,
    weatherThreeDaysDomElements,
    mapDomElements,
} from './dom.js';

import { getTodayWeather, getThreeDaysWeather, initMap } from './script.js';

// Сразу при запуске страницы обновляю стиль выбранного элемента на языке
controlDomElements.hiddenElementsLanguage.forEach(function (el) {
    const elNameLanguage = el.querySelector(
        '.control__hidden-element-language-name'
    );
    if (elNameLanguage.innerText == window.localStorage.getItem('language')) {
        el.classList.add('control__hidden-element-language_selected');
        controlDomElements.nameLanguage.innerText =
            window.localStorage.getItem('language');
    } else {
        el.classList.remove('control__hidden-element-language_selected');
    }
});

// Сразу при запуске страницы обновляю стиль выбранного элемента на шкале температуры
controlDomElements.typesTemperature.forEach(function (el) {
    const curTypeTemp = window.localStorage.getItem('curTypeTemp');
    if (
        curTypeTemp == 'imperial' &&
        el.classList.contains('control__faringate')
    ) {
        el.classList.add('control__type-temperature_selected-type');
    } else if (
        curTypeTemp == 'metric' &&
        el.classList.contains('control__celsius')
    ) {
        el.classList.add('control__type-temperature_selected-type');
    } else {
        el.classList.remove('control__type-temperature_selected-type');
    }
});

const translations = {
    en: { Latitude: 'Latitude', Longitude: 'Longituded' },
    es: { Latitude: 'Latitud', Longitude: 'Longitud' },
    ru: { Latitude: 'Широта', Longitude: 'Долгота' },
};

function translate(text, lang) {
    return translations[lang][text];
}

// При изменении языка
controlDomElements.changeLanguage.addEventListener('click', function (e) {
    controlDomElements.hiddenListLanguages.classList.toggle(
        'hidden-by-display'
    );

    // Если клик вне скрытого меню с языками, то игнор
    if (!e.target.closest('.control__hidden-element-language')) return;

    const elementLanguage = e.target.closest(
        '.control__hidden-element-language'
    );

    // Если нажатый элемент уже был выбран, то игнор
    if (
        elementLanguage.querySelector('.control__hidden-element-language-name')
            .innerText === controlDomElements.nameLanguage.innerText
    )
        return;

    // Убираю стиль выбранного элемента и добавляю на новый выбранный
    controlDomElements.hiddenElementsLanguage.forEach(function (el) {
        el.classList.remove('control__hidden-element-language_selected');
    });
    elementLanguage.classList.add('control__hidden-element-language_selected');

    // Заменяю название языка в окне с текущим языком (тем, на который нажали)
    controlDomElements.nameLanguage.innerText = elementLanguage.querySelector(
        '.control__hidden-element-language-name'
    ).innerText;
    getTodayWeather(
        controlDomElements.nameLanguage.innerText,
        window.localStorage.getItem('curTypeTemp')
    );
    getThreeDaysWeather(
        controlDomElements.nameLanguage.innerText,
        window.localStorage.getItem('curTypeTemp')
    );

    // Меняю язык у "ширина" и "долгота"
    mapDomElements.latitudeName.innerText = translate(
        'Latitude',
        controlDomElements.nameLanguage.innerText.toLowerCase()
    );
    mapDomElements.longitudeName.innerText = translate(
        'Longitude',
        controlDomElements.nameLanguage.innerText.toLowerCase()
    );

    window.localStorage.setItem(
        'language',
        controlDomElements.nameLanguage.innerText
    );
});

// При смене шкалы температуры
controlDomElements.changeTemperature.addEventListener('click', function (e) {
    // Если клик вне элемента с типом температуры, то игнор
    if (!e.target.closest('.control__type-temperature')) return;

    const elementTypeTemperature = e.target.closest(
        '.control__type-temperature'
    );

    // Если нажатый элемент уже был выбран, то игнор
    if (
        elementTypeTemperature.classList.contains(
            'control__type-temperature_selected-type'
        )
    )
        return;

    controlDomElements.typesTemperature.forEach(function (typeTemp) {
        typeTemp.classList.remove('control__type-temperature_selected-type');
    });
    elementTypeTemperature.classList.add(
        'control__type-temperature_selected-type'
    );

    // Создаю переменную для определения названия выбранной шкалы (которое нужно будет передать в функцию для api)
    let curTypeTemp = '';
    if (elementTypeTemperature.classList.contains('control__faringate')) {
        curTypeTemp = 'imperial';
    } else if (elementTypeTemperature.classList.contains('control__celsius')) {
        curTypeTemp = 'metric';
    }

    window.localStorage.setItem('curTypeTemp', curTypeTemp);

    // Обновляю данные на странице, но прописав температуру в выбранной шкале
    getTodayWeather(controlDomElements.nameLanguage.innerText, curTypeTemp);
    getThreeDaysWeather(controlDomElements.nameLanguage.innerText, curTypeTemp);
});

const UNSPLASH_API_KEY = import.meta.env.VITE_UNSPLASH_KEY;
let numBgImg = 0;
// При клике на кнопку изменения фонового изображения
controlDomElements.refreshBG.addEventListener('click', function (e) {
    const url = `https://api.unsplash.com/search/photos?query=${window.localStorage.getItem('city')}&client_id=${UNSPLASH_API_KEY}&per_page=6`;
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            if (numBgImg === 4) {
                numBgImg = 5;
            } else if (numBgImg > 5) {
                numBgImg = 0;
            }
            // Получаем ссылку на первое изображение из результата поиска
            const imageUrl = data.results[numBgImg]?.urls?.regular;

            if (imageUrl) {
                // Устанавливаем изображение в качестве фона
                content.style.backgroundImage = `url(${imageUrl})`;
                content.style.backgroundSize = 'cover'; // Фоновое изображение будет растянуто на весь экран
                content.style.backgroundPosition = 'center'; // Центрируем изображение

                numBgImg += 1;
            } else {
                console.log('Изображение не найдено');
            }
        })
        .catch((error) => console.error('Ошибка:', error));
});

controlDomElements.searchCityButton.addEventListener('click', function (e) {
    e.preventDefault();
    const city = controlDomElements.searchCityInput.value.trim(); // Получаем город из input

    if (city) {
        getTodayWeather(
            controlDomElements.nameLanguage.innerText,
            window.localStorage.getItem('curTypeTemp'),
            city
        );
        getThreeDaysWeather(
            controlDomElements.nameLanguage.innerText,
            window.localStorage.getItem('curTypeTemp'),
            city
        );
        controlDomElements.searchCityInput.value = '';
    } else {
        alert('Пожалуйста, введите название города.');
    }
});

// Проверяем поддержку браузером Web Speech API
const speechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

if (speechRecognition) {
    const recognition = new speechRecognition();

    recognition.interimResults = false; // Не показывать промежуточные результаты
    recognition.maxAlternatives = 1; // Одна лучшая альтернатива результата

    // При нажатии на кнопку микрофона запускаем распознавание речи
    controlDomElements.searchCityIcon.addEventListener('click', () => {
        // Устанавливаем язык для распознавания речи
        recognition.lang = `${window.localStorage.getItem('language').toLowerCase()}-${window.localStorage.getItem('language')}`;
        console.log(
            `${window.localStorage.getItem('language').toLowerCase()}-${window.localStorage.getItem('language')}`
        );
        recognition.start();
        controlDomElements.searchCityInput.value = '🎙️ Говорите...';
    });

    // Обработчик события успешного распознавания
    recognition.addEventListener('result', (event) => {
        const transcript = event.results[0][0].transcript.trim(); // Распознанный текст
        controlDomElements.searchCityInput.value = transcript; // Вставляем текст в инпут
        console.log('Распознанный текст:', transcript);
        recognition.stop(); // Останавливаем распознавание

        // Автоматически запускаем поиск после распознавания
        controlDomElements.searchCityButton.click();
    });

    // Обработчик ошибки
    recognition.addEventListener('error', (event) => {
        console.error('Ошибка распознавания:', event.error);
        alert('Ошибка распознавания речи. Попробуйте снова.');
        controlDomElements.searchCityInput.value = '🎤';
    });
} else {
    console.warn('Web Speech API не поддерживается в этом браузере');
    alert('Ваш браузер не поддерживает голосовой ввод 😢');
}
