const showResults = (results) => {
    document.querySelector('#main-wrapper').classList.add('md:mr-96');
    document.querySelector('#results').classList.remove('hidden');

    document.querySelector('#result-data').innerHTML = JSON.stringify(results, undefined, 2);
    document.querySelector('#result-data-input').value = JSON.stringify(results, undefined, 2);
};

window.showResults = showResults;

const hideResults = () => {
    document.querySelector('#main-wrapper').classList.remove('md:mr-96');
    document.querySelector('#results').classList.add('hidden');
};

window.hideResults = hideResults;

const generateState = (preferPopup = false) => {
    const char = () => Math.floor((Math.random() * (122 - 97)) + 97);
    const stateObj = {
        id: Array.from({ length: 20 }, () => String.fromCharCode(char())).join(''),
        popup: preferPopup,
    };
    return btoa(JSON.stringify(stateObj));
};

export { showResults, hideResults, generateState };
