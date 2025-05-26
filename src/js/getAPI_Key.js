'use strict';

async function fetchKey(endpoint) {
    try {
        const res = await fetch(
            `https://cors-proxy-server-0jmy.onrender.com/${endpoint}`
        );
        if (!res.ok) throw new Error(`${endpoint} fetch error: ${res.status}`);

        const data = await res.json();
        if (!data || !data.apiKey)
            throw new Error(`${endpoint} invalid response`);

        return data.apiKey;
    } catch (err) {
        console.error(`Ошибка получения ключа (${endpoint}):`, err);
        // showErrorOverlay();
        return null;
    }
}

export const fetchApiKey = () => fetchKey('getApiKey');
export const fetchUnsplashApiKey = () => fetchKey('getUnsplashApiKey');

// export { fetchApiKey, fetchUnsplashApiKey };
