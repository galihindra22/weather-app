import './styles.css';
async function getLocationData(location) {
    try {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=Q5U4SZQZFUHVR5BYLD4SY6WNB`);
        const locationData = await response.json();
        console.log(response);
        console.log(locationData);
        return locationData;
    }
    catch (error) {
        console.log(error);
    }
}

const submitLocationBtn = document.getElementById("submit-location-weather");
const locationInput = document.getElementById("weather");
const contentDiv = document.querySelector(".display-content");
const location = document.getElementById("weather-location");
const temperature = document.getElementById("weather-temp");
const condition = document.getElementById("weather-desc");

submitLocationBtn.addEventListener("click", async (event) =>{
    event.preventDefault();
    displayLoading();
    const data =  await getLocationData(locationInput.value.trim());
    displayWeatherData(data);
});

function displayLoading(){
    location.textContent = "Loading";
}

function displayWeatherData(data){
    location.textContent = data.resolvedAddress;
    temperature.textContent = data.currentConditions.temp;
    condition.textContent = data.currentConditions.conditions;

}