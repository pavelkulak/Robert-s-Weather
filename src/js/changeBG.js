'use strict';

import { content, controlDomElements } from './dom.js';
import { fetchUnsplashApiKey } from './jobAPI.js';

let cachedBGImages = [];
let numBgImg = Number(localStorage.getItem('numBgImg')) || 0;

// При загрузке страницы сначала блокируем кнопку и добавляем эффект загрузки
const refreshBtn = controlDomElements.refreshBGButton;
refreshBtn.classList.add('control__refresh-BG_loading');
refreshBtn.disabled = true;

async function getApiBG(initialLoad = false, cityChanged = false) {
    try {
        // Если город изменился, очищаем кэш изображений
        if (cityChanged) {
            cachedBGImages = [];
            numBgImg = 0;
            localStorage.setItem('numBgImg', numBgImg); // Сбрасываем индекс
        }

        const unsplashApiKey = await fetchUnsplashApiKey();
        const url = `https://api.unsplash.com/search/photos?query=${window.localStorage.getItem('city')}&client_id=${unsplashApiKey}&per_page=6`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Could not fetch weather data');
        }
        const data = await response.json();
        cachedBGImages = data.results;
        console.log('Изображения загружены:', cachedBGImages);
        console.log("Данные BG", data);

        const index = initialLoad ? numBgImg % cachedBGImages.length : numBgImg;
        setBackgroundImage(index);

        // ✅ Убираем индикатор загрузки и разблокируем кнопку
        controlDomElements.refreshBGButton.classList.remove(
            'control__refresh-BG_loading'
        );
        controlDomElements.refreshBGButton.disabled = false;
    } catch (err) {
        console.error('Ошибка при загрузке изображений:', err.message);
    }
}

function setBackgroundImage(index) {
    const imageUrl = cachedBGImages[index]?.urls?.regular;
    if (imageUrl) {
        content.style.backgroundImage = `url(${imageUrl})`;
    }
}

function refreshBG() {
    if (!cachedBGImages.length) {
        console.log('Фоновые изображения ещё не загружены.');
        return;
    }
    numBgImg = (numBgImg + 1) % cachedBGImages.length;
    localStorage.setItem('numBgImg', numBgImg);
    setBackgroundImage(numBgImg);
}

window.addEventListener('load', async () => {
    await getApiBG();
});

// При клике на кнопку изменения фонового изображения
refreshBtn.addEventListener('click', refreshBG);

export { refreshBG, getApiBG }
