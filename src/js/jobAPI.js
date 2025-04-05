'use strict';

async function getApiKey() {
    try {
        const response = await fetch(
            'https://cors-proxy-server-0jmy.onrender.com/getApiKey'
        );
        const data = await response.json();
        console.log(data);
        return data.apiKey;
    } catch (error) {
        console.error('Ошибка при получении API-ключа:', error);
    }
}

async function fetchApiKey() {
    const API_KEY = await getApiKey();
    console.log(API_KEY);
    return API_KEY;
}
fetchApiKey();


async function getUnsplashApiKey() {
    try {
        const response = await fetch(
            'https://cors-proxy-server-0jmy.onrender.com/getUnsplashApiKey'
        );
        const data = await response.json();
        console.log(data);
        return data.apiKey;
    } catch (error) {
        console.error('Ошибка при получении API-ключа:', error);
    }
}

async function fetchUnsplashApiKey() {
    const unsplashApiKey = await getUnsplashApiKey()
    console.log(unsplashApiKey);
    return unsplashApiKey
}

export { fetchApiKey, fetchUnsplashApiKey };
