'use strict';

import { getFromLocalStorage } from './localStorage.js';

function formatDate(timezoneOffset, curLangue) {
    // Получаем смещение часового пояса
    const localTime = new Date(Date.now() + timezoneOffset * 1000);

    // Форматируем дату и время
    const options = {
        weekday: 'short', // "Thu" → "Чт" (если ru)
        day: 'numeric',
        month: 'long', // "March" → "Март"
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // Для 24-часового формата
        timeZone: 'UTC',
    };
    return localTime
        .toLocaleDateString(curLangue, options)
        .replace(',', '') // убираем запятую
        .replace(' at', '') // убираем "at" если есть
        .split(' '); // возвращаем массив в нужном виде
}

// Функция для конвертации температуры в другой тип. (Либо возвращения этого же числа)
function convertUnitTemp(temp) {
    const currentTypeTemperature = getFromLocalStorage(
        'currentTypeTemperature'
    );
    if (currentTypeTemperature === 'metric') return Math.round(temp);
    if (currentTypeTemperature === 'imperial')
        return Math.round((temp * 9) / 5 + 32);
}

export { formatDate, convertUnitTemp };
