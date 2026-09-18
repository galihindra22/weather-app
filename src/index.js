import './styles.css';

const form = document.getElementById("weather-form");
const submitLocationBtn = document.getElementById("submit-location-weather");
const locationInput = document.getElementById("weather");

const loader = document.getElementById("loading-spinner");

const contentDiv = document.querySelector(".display-content");
const location = document.getElementById("weather-location");
const temperature = document.getElementById("weather-temp");
const condition = document.getElementById("weather-desc");
const toggleUnitBtn = document.getElementById("toggle-unit");

let isFahrenheit = true;
let currentTempF = null;

async function getLocationData(location) {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=Q5U4SZQZFUHVR5BYLD4SY6WNB`);
    if (!response.ok) {
        throw new Error(`Location not found (${response.status})`);
    }
    return await response.json();
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    displayLoading();

    try {
        const data = await getLocationData(locationInput.value.trim());
        displayWeatherData(data);
    } catch (error) {
        console.log(error);
        contentDiv.style.display = "none";
    } finally{
        hideLoading();
    }
});

function displayLoading() {
    loader.style.display = "block";
    contentDiv.style.display = "none"
    submitLocationBtn.disabled = true;
}

function hideLoading(){
    loader.style.display = "none";
    submitLocationBtn.disabled = false;
}

function displayWeatherData(data) {
    location.textContent = data.resolvedAddress;
    temperature.textContent = data.currentConditions.temp + "°F";
    condition.textContent = data.currentConditions.conditions;
    toggleUnitBtn.textContent = "Display in Celsius";

    isFahrenheit = true;
    currentTempF = data.currentConditions.temp;
    contentDiv.style.display = "block";
}

toggleUnitBtn.addEventListener("click", () => {
    if (isFahrenheit) {
        const celsius = (currentTempF - 32) * (5 / 9);
        temperature.textContent = `${celsius.toFixed(1)}°C`;
        toggleUnitBtn.textContent = "Display in Fahrenheit";
        isFahrenheit = false;
    } else {
        temperature.textContent = `${currentTempF}°F`;
        toggleUnitBtn.textContent = "Display in Celsius";
        isFahrenheit = true;
    }
})