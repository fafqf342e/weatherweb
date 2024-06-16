const apiKey = '0ca7c41a4cd845edba8215522241406';
const apiBaseUrl = 'http://api.weatherapi.com/v1/current.json?key=';

const initialCities = ['Odesa', 'Dnipropetrovsk', 'Donetsk, Ukraine', 'Luhansk', 'Kherson', 'Kharkiv', 'Kyiv', 'Lviv'];

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const searchInput = document.getElementById('search');
    const weatherContainer = document.getElementById('weather_container');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const city = searchInput.value.trim();
        if (city) {
            fetchWeatherData(city, true);
            searchInput.value = '';
        }
    });

    const weatherColors = {
        1000: 'rgba(255, 223, 0, 0.75)',    // Sunny
        1003: 'rgba(201, 201, 201, 0.75)',  // Partly cloudy
        1006: 'rgba(169, 169, 169, 0.75)',  // Cloudy
        1009: 'rgba(128, 128, 128, 0.75)',  // Overcast
        1030: 'rgba(192, 192, 192, 0.75)',  // Mist
        1063: 'rgba(173, 216, 230, 0.75)',  // Patchy rain possible
        1066: 'rgba(240, 255, 255, 0.75)',  // Patchy snow possible
        1069: 'rgba(176, 196, 222, 0.75)',  // Patchy sleet possible
        1072: 'rgba(255, 250, 250, 0.75)',  // Patchy freezing drizzle possible
        1087: 'rgba(105, 105, 105, 0.75)',  // Thundery outbreaks possible
        1114: 'rgba(240, 248, 255, 0.75)',  // Blowing snow
        1117: 'rgba(245, 245, 245, 0.75)',  // Blizzard
        1135: 'rgba(211, 211, 211, 0.75)',  // Fog
        1147: 'rgba(255, 245, 238, 0.75)',  // Freezing fog
        1150: 'rgba(173, 216, 230, 0.75)',  // Patchy light drizzle
        1153: 'rgba(176, 224, 230, 0.75)',  // Light drizzle
        1168: 'rgba(224, 255, 255, 0.75)',  // Freezing drizzle
        1171: 'rgba(0, 255, 255, 0.75)',    // Heavy freezing drizzle
        1180: 'rgba(176, 224, 230, 0.75)',  // Patchy light rain
        1183: 'rgba(0, 191, 255, 0.75)',    // Light rain
        1186: 'rgba(70, 130, 180, 0.75)',   // Moderate rain at times
        1189: 'rgba(30, 144, 255, 0.75)',   // Moderate rain
        1192: 'rgba(25, 25, 112, 0.75)',    // Heavy rain at times
        1195: 'rgba(0, 0, 139, 0.75)',      // Heavy rain
        1198: 'rgba(240, 255, 255, 0.75)',  // Light freezing rain
        1201: 'rgba(0, 255, 255, 0.75)',    // Moderate or heavy freezing rain
        1204: 'rgba(176, 196, 222, 0.75)',  // Light sleet
        1207: 'rgba(100, 149, 237, 0.75)',  // Moderate or heavy sleet
        1210: 'rgba(240, 248, 255, 0.75)',  // Patchy light snow
        1213: 'rgba(255, 250, 250, 0.75)',  // Light snow
        1216: 'rgba(230, 230, 250, 0.75)',  // Patchy moderate snow
        1219: 'rgba(0, 0, 255, 0.75)',      // Moderate snow
        1222: 'rgba(25, 25, 112, 0.75)',    // Patchy heavy snow
        1225: 'rgba(0, 0, 139, 0.75)',      // Heavy snow
        1237: 'rgba(240, 255, 255, 0.75)',  // Ice pellets
        1240: 'rgba(0, 191, 255, 0.75)',    // Light rain shower
        1243: 'rgba(30, 144, 255, 0.75)',   // Moderate or heavy rain shower
        1246: 'rgba(25, 25, 112, 0.75)',    // Torrential rain shower
        1249: 'rgba(176, 196, 222, 0.75)',  // Light sleet showers
        1252: 'rgba(100, 149, 237, 0.75)',  // Moderate or heavy sleet showers
        1255: 'rgba(240, 248, 255, 0.75)',  // Light snow showers
        1258: 'rgba(0, 0, 255, 0.75)',      // Moderate or heavy snow showers
        1261: 'rgba(240, 255, 255, 0.75)',  // Light showers of ice pellets
        1264: 'rgba(0, 255, 255, 0.75)',    // Moderate or heavy showers of ice pellets
        1273: 'rgba(105, 105, 105, 0.75)',  // Patchy light rain with thunder
        1276: 'rgba(128, 128, 128, 0.75)',  // Moderate or heavy rain with thunder
        1279: 'rgba(240, 248, 255, 0.75)',  // Patchy light snow with thunder
        1282: 'rgba(245, 245, 245, 0.75)'   // Moderate or heavy snow with thunder
    };

    const fetchWeatherData = (city, clearContainer = false) => {
        fetch(`${apiBaseUrl}${apiKey}&q=${city}&aqi=no`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('City not found');
                }
                return response.json();
            })
            .then(data => displayWeatherData(data, clearContainer))
            .catch(error => displayErrorMessage(error.message));
    };

    const displayWeatherData = (data, clearContainer) => {
        const { name, country } = data.location;
        const { temp_c, condition, wind_kph, cloud } = data.current;
        const weatherCode = data.current.condition.code;
        const backgroundColor = weatherColors[weatherCode] || 'rgba(255, 255, 255, 0.75)';

        const card = document.createElement('div');
        card.classList.add('weather-card');
        card.style.backgroundColor = backgroundColor;

        card.innerHTML = `
            <h3>${name}, ${country}</h3>
            <img src="${condition.icon}" alt="${condition.text}">
            <p>${condition.text}</p>
            <p>Temp: ${temp_c} °C</p>
            <p>Cloud: ${cloud} %</p>
            <p>Wind: ${wind_kph} kph</p>
        `;

        if (clearContainer) {
            weatherContainer.innerHTML = '';  
        }
        weatherContainer.appendChild(card);
        setDynamicBackground(condition.text);
    };

    const displayErrorMessage = (message) => {
        weatherContainer.innerHTML = `<p class="error-message">${message}</p>`;
        document.body.style.backgroundColor = 'var(--white-color)';
    };

    const setDynamicBackground = (condition) => {
        let backgroundColor;
        if (condition.toLowerCase().includes('sunny')) {
            backgroundColor = 'var(--sunny-color)';
        } else if (condition.toLowerCase().includes('cloudy')) {
            backgroundColor = 'var(--cloudy-color)';
        } else if (condition.toLowerCase().includes('drizzle')) {
            backgroundColor = 'var(--drizzle-color)';
        } else {
            backgroundColor = 'var(--white-color)';
        }
        document.body.style.backgroundColor = backgroundColor;
    };

    initialCities.forEach(city => fetchWeatherData(city));
});

