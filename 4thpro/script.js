const searchForm = document.querySelector("#search-form");
const cityInput = document.querySelector("#city-input");
const dashboard = document.querySelector("#weather-dashboard");
const loadingState = document.querySelector("#loading-state");
const errorState = document.querySelector("#error-state");
const welcomeState = document.querySelector("#welcome-state");
const searchStatus = document.querySelector("#search-status");

const weatherCodes = {
  0: ["Clear sky", "☀"], 1: ["Mainly clear", "🌤"], 2: ["Partly cloudy", "⛅"], 3: ["Overcast", "☁"],
  45: ["Foggy", "🌫"], 48: ["Rime fog", "🌫"], 51: ["Light drizzle", "🌦"], 53: ["Drizzle", "🌦"], 55: ["Heavy drizzle", "🌧"],
  61: ["Light rain", "🌦"], 63: ["Rain", "🌧"], 65: ["Heavy rain", "🌧"], 71: ["Light snow", "🌨"], 73: ["Snow", "❄"], 75: ["Heavy snow", "❄"],
  80: ["Rain showers", "🌦"], 81: ["Rain showers", "🌧"], 82: ["Heavy showers", "⛈"], 95: ["Thunderstorm", "⛈"], 96: ["Thunderstorm", "⛈"], 99: ["Thunderstorm", "⛈"]
};

function setLoading(isLoading) {
  loadingState.hidden = !isLoading;
  searchForm.querySelector("button").disabled = isLoading;
}

function setError(message) {
  errorState.hidden = false;
  document.querySelector("#error-message").textContent = message;
  dashboard.hidden = true;
  welcomeState.hidden = true;
}

function formatTime(value) {
  return new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

function formatDay(value, index) {
  return index === 0 ? "Today" : new Intl.DateTimeFormat("en", { weekday: "short" }).format(new Date(`${value}T12:00:00`));
}

function windDirection(degrees) {
  return ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.round(degrees / 45) % 8];
}

function renderForecast(daily) {
  const list = document.querySelector("#forecast-list");
  list.replaceChildren(...daily.time.map((date, index) => {
    const item = document.createElement("article");
    const [description, icon] = weatherCodes[daily.weather_code[index]] || ["Variable", "◌"];
    item.className = `forecast-item${index === 0 ? " today" : ""}`;
    item.setAttribute("role", "listitem");
    item.innerHTML = `<time datetime="${date}">${formatDay(date, index)}</time><span class="forecast-icon" aria-hidden="true">${icon}</span><span class="forecast-temp">${Math.round(daily.temperature_2m_max[index])}° <small>/ ${Math.round(daily.temperature_2m_min[index])}°</small></span><span class="sr-only">${description}</span>`;
    return item;
  }));
}

function renderWeather(place, data) {
  const current = data.current;
  const daily = data.daily;
  const [description, icon] = weatherCodes[current.weather_code] || ["Variable conditions", "◌"];
  document.querySelector("#city-name").textContent = place.name;
  document.querySelector("#country-name").textContent = place.country || place.country_code;
  document.querySelector("#updated-time").textContent = formatTime(current.time);
  document.querySelector("#current-date").textContent = new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(new Date(current.time));
  document.querySelector("#weather-description").textContent = description;
  document.querySelector("#weather-icon").textContent = icon;
  document.querySelector("#temperature").textContent = Math.round(current.temperature_2m);
  document.querySelector("#feels-like").textContent = Math.round(current.apparent_temperature);
  document.querySelector("#humidity").textContent = Math.round(current.relative_humidity_2m);
  document.querySelector("#wind-speed").textContent = Math.round(current.wind_speed_10m);
  document.querySelector("#wind-direction").textContent = `${windDirection(current.wind_direction_10m)} wind`;
  document.querySelector("#precipitation").textContent = Number(current.precipitation).toFixed(1);
  document.querySelector("#uv-index").textContent = Number(daily.uv_index_max[0]).toFixed(1);
  document.querySelector("#uv-note").textContent = daily.uv_index_max[0] > 5 ? "Use sun protection" : "Low exposure";
  document.querySelector("#sunrise").textContent = formatTime(daily.sunrise[0]);
  document.querySelector("#sunset").textContent = formatTime(daily.sunset[0]);
  renderForecast(daily);
  dashboard.hidden = false;
  welcomeState.hidden = true;
  errorState.hidden = true;
}

async function getWeather(city) {
  setLoading(true);
  searchStatus.textContent = "";
  try {
    const locationResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
    if (!locationResponse.ok) throw new Error("The location service is unavailable.");
    const locationData = await locationResponse.json();
    const place = locationData.results?.[0];
    if (!place) throw new Error("No matching city was found.");
    const forecastUrl = new URL("https://api.open-meteo.com/v1/forecast");
    forecastUrl.search = new URLSearchParams({
      latitude: place.latitude, longitude: place.longitude,
      current: "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m",
      daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max",
      timezone: "auto", forecast_days: "5"
    });
    const weatherResponse = await fetch(forecastUrl);
    if (!weatherResponse.ok) throw new Error("The weather service is unavailable.");
    const weatherData = await weatherResponse.json();
    if (!weatherData.current || !weatherData.daily) throw new Error("The weather response was incomplete.");
    renderWeather(place, weatherData);
  } catch (error) {
    setError(error instanceof Error ? error.message : "Something went wrong while loading the forecast.");
  } finally {
    setLoading(false);
  }
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (!city) {
    searchStatus.textContent = "Enter a city name to search.";
    cityInput.focus();
    return;
  }
  getWeather(city);
});
