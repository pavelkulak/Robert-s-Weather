'use strict';

import { mapDomElements } from './dom.js';

let map;
function initMap(lat, lon) {
    // Удаляем старую карту, если она уже существует
    if (map) {
        map.remove(); // Удаляем старую карту, чтобы избежать наложений
    }

    // Создаём карту и устанавливаем координаты
    map = L.map('map').setView([lat, lon], 10);

    // Добавляем слой карты CartoDB с локализацией
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CartoDB</a>',
    }).addTo(map);

    // Добавляем метку города
    L.marker([lat, lon]).addTo(map).bindPopup('Выбранный город').openPopup();

    // Преобразуем координаты в формат градусов, минут, секунд. Затем вписываем их в HTML
    mapDomElements.latitudeValue.innerText = convertToDMS(lat);
    mapDomElements.longitudeValue.innerText = convertToDMS(lon);
}

// Функция для преобразования координат в формат градусов, минут, секунд
function convertToDMS(coord) {
    const degrees = Math.floor(coord); // Целые градусы
    const minutesFloat = (coord - degrees) * 60; // Остаток, умноженный на 60
    const minutes = Math.floor(minutesFloat); // Целые минуты
    const seconds = Math.round((minutesFloat - minutes) * 60); // Оставшиеся секунды

    return `${degrees}°${minutes}'${seconds}"`; // Форматируем строку
}

export { initMap };
