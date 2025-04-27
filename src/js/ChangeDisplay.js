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
