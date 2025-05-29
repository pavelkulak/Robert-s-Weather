'use strict';

import { controlDomElements, errorContainer, errorMessage } from './dom.js';

function hideErrorMessage() {
    const el = controlDomElements.searchBar.querySelector(
        '.control__ErrorMessage'
    );
    if (el) {
        controlDomElements.searchCityInput.classList.remove(
            'control__search-city-input_error'
        );
        el.remove();
    }
}

function displayError(error) {
    const existing = controlDomElements.searchBar.querySelector(
        '.control__ErrorMessage'
    );
    // Если ранее уже была выдана ошибка, то только меняю текст в html поле. Иначе создаю новый
    if (existing) {
        existing.innerText = error;
    } else {
        controlDomElements.searchCityInput.classList.add(
            'control__search-city-input_error'
        );
        const htmlErrorMessage = document.createElement('p');
        htmlErrorMessage.textContent = error;
        htmlErrorMessage.classList.add('control__ErrorMessage');
        controlDomElements.searchBar.appendChild(htmlErrorMessage);
    }
}

function showErrorOverlay(e) {
    console.log(e);
    if (errorContainer) {
        errorContainer.classList.remove('hidden-by-display');
    }
}

errorMessage.addEventListener('click', function () {
    location.reload();
});

function validateWeatherData(data) {
    if (
        !data ||
        typeof data.name !== 'string' ||
        !data.main ||
        typeof data.main.temp !== 'number' ||
        !data.wind ||
        typeof data.wind.speed !== 'number' ||
        !Array.isArray(data.weather) ||
        !data.weather[0] ||
        typeof data.weather[0].description !== 'string'
    ) {
        return false;
    }
    return true;
}

export {
    hideErrorMessage,
    displayError,
    showErrorOverlay,
    validateWeatherData,
};
