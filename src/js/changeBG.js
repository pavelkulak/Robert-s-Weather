'use strict';

import { content, controlDomElements } from './dom.js';
import { fetchUnsplashApiKey } from './getAPI_Key.js';
import { getFromLocalStorage } from './localStorage.js';

let cachedBGImages = [];
let currentBG_Img_Index =
    Number(localStorage.getItem('currentBG_Img_Index')) || 0;

// При загрузке страницы сначала блокируем кнопку и добавляем эффект загрузки
const refreshBtn = controlDomElements.refreshBGButton;
refreshBtn.classList.add('control__refresh-BG_loading');
refreshBtn.disabled = true;

async function getApiBG({ isInitialLoad = false, isCityChanged = false } = {}) {
    try {
        // Если город изменился, очищаем кэш изображений
        if (isCityChanged) {
            cachedBGImages = [];
            currentBG_Img_Index = 0;
            localStorage.setItem('currentBG_Img_Index', currentBG_Img_Index); // Сбрасываем индекс
        }

        const unsplashApiKey = await fetchUnsplashApiKey();
        const url = `https://api.unsplash.com/search/photos?query=${getFromLocalStorage('city')}&client_id=${unsplashApiKey}&per_page=6`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Could not fetch weather data');
        }
        const data = await response.json();
        cachedBGImages = data.results;
        console.log('Изображения загружены:', cachedBGImages);
        console.log('Данные BG', data);

        // Если функция инициализироана при загрузке страницы (isInitialLoad = true), то берём индекс currentBG_Img_Index как есть. Если же смена идёт по клику (isInitialLoad=false), то переходим к следующему изображению (currentBG_Img_Index % cachedBGImages.length)
        const index = isInitialLoad
            ? currentBG_Img_Index % cachedBGImages.length
            : currentBG_Img_Index;
        setBackgroundImage(index);

        // ✅ Убираем индикатор загрузки и разблокируем кнопку
        controlDomElements.refreshBGButton.classList.remove(
            'control__refresh-BG_loading'
        );
        controlDomElements.refreshBGButton.disabled = false;
        controlDomElements.refreshBG.classList.remove('hidden-by-visibility');
    } catch (err) {
        console.error('Ошибка при загрузке изображений:', err.message);
    }
}

function setBackgroundImage(index) {
    console.log(index);
    const imageUrl = cachedBGImages[index]?.urls?.regular;
    if (imageUrl) {
        content.style.backgroundImage = `url(${imageUrl})`;
    }
}

function refreshBG() {
    console.log('REFRESH');
    if (!cachedBGImages.length) {
        console.log('Фоновые изображения ещё не загружены.');
        return;
    }
    currentBG_Img_Index = (currentBG_Img_Index + 1) % cachedBGImages.length;
    localStorage.setItem('currentBG_Img_Index', currentBG_Img_Index);
    setBackgroundImage(currentBG_Img_Index);
}

// При клике на кнопку изменения фонового изображения
refreshBtn.addEventListener('click', refreshBG);

export { refreshBG, getApiBG };
