'use strict';
import { hideErrorMessage, displayError, showErrorOverlay } from "./errors.js"

async function getApiKey() {
    try {
        const response = await fetch(
            'https://cors-proxy-server-0jmy.onrender.com/getApiKey'
        );

        if (!response.ok) { // === ДОБАВЛЕНО ===
            showErrorOverlay();
            throw new Error(`Ошибка запроса API ключа: ${response.status}`);
        }   
        
        const data = await response.json();
        // проверка на наличие ключа ===
        if (!data || !data.apiKey) {
            showErrorOverlay();
            throw new Error('API ключ не получен или неверный формат');
        }


        console.log(data);
        return data.apiKey;
    } catch (error) {
        console.error('Ошибка при получении API-ключа:', error);
        showErrorOverlay()
        return null; // чтобы не вернуть undefined
    }
}

async function fetchApiKey() {
    const API_KEY = await getApiKey();
    return API_KEY;
}
fetchApiKey();

async function getUnsplashApiKey() {
    try {
        const response = await fetch(
            'https://cors-proxy-server-0jmy.onrender.com/getUnsplashApiKey'
        );

        if (!response.ok) { // === ДОБАВЛЕНО ===
            showErrorOverlay();
            throw new Error(`Ошибка запроса Unsplash ключа: ${response.status}`);
        }

        const data = await response.json();

        // проверка на наличие ключа ===
        if (!data || !data.apiKey) {
            showErrorOverlay();
            throw new Error('Unsplash ключ не получен или неверный формат');
        }

        console.log(data);
        return data.apiKey;
    } catch (error) {
        console.error('Ошибка при получении API-ключа:', error);
        showErrorOverlay()
        return null;
    }
}

async function fetchUnsplashApiKey() {
    const unsplashApiKey = await getUnsplashApiKey();
    console.log(unsplashApiKey);
    return unsplashApiKey;
}
fetchUnsplashApiKey();

export { fetchApiKey, fetchUnsplashApiKey };
