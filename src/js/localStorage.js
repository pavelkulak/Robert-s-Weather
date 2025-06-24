'use strict';

function addItemToLocalStorageArray(key, item, index) {
    const arr = JSON.parse(localStorage.getItem(key)) || [];
    arr[index] = item
    localStorage.setItem(key, JSON.stringify(arr));
}

function setToLocalStorage(key, value) {
    // Если значение — строка, сохраняем как есть
    if (typeof value === 'string') {
        localStorage.setItem(key, value);
    } else {
        // Всё остальное (объекты, числа, булевы и т.д.) — сериализуем
        localStorage.setItem(key, JSON.stringify(value));
    }
}
function getFromLocalStorage(key, defaultValue = null) {
    const value = localStorage.getItem(key);

    if (value === null) return defaultValue;

    try {
        // Пробуем распарсить, если это валидный JSON (объект, массив, число, булевое и т.д.)
        return JSON.parse(value);
    } catch {
        // Если это просто строка (например, "metric") — вернуть как есть
        return value;
    }
}

export { addItemToLocalStorageArray, setToLocalStorage, getFromLocalStorage };
