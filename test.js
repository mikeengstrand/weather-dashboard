// global variables
var searchHistory = [];
var weatherApiRootUrl = 'https://api.openweathermap.org';
var weatherApiKey = '43ef8a8226b036c3c72cb0312dfd7c48';

// dom element ref
var searchForm = document.querySelector('#search-form');
var searchInput = document.querySelector('#search-input');
var todayWeather = document.querySelector('#today');
var forecastWeather = document.querySelector('#forecast');
var searchHistoryList = document.querySelector('#history');

// add time from daysjs
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);


// Function to display the current weather data fetched from OpenWeather api.
function displayCurrentWeather(city, weather) {
  var date = dayjs().format('M/D/YYYY');
  // Store response data from our fetch request in variables
  var tempF = weather.main.temp;
  var windMph = weather.wind.speed;
  var humidity = weather.main.humidity;
  var iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
  var iconDescription = weather.weather[0].description || weather[0].main;

  var card = document.createElement('div');
  var cardBody = document.createElement('div');
  var header = document.createElement('h2');
  var weatherIcon = document.createElement('img');
  var temperature = document.createElement('p');
  var wind = document.createElement('p');
  var humidity = document.createElement('p');

  card.setAttribute('class', 'card');
  cardBody.setAttribute('class', 'card-body');
  card.append(cardBody);

  header.setAttribute('class', 'h3 card-title');
  temperature.setAttribute('class', 'card-text');
  wind.setAttribute('class', 'card-text');
  humidity.setAttribute('class', 'card-text');

  header.textContent = `${city} (${date})`;
  weatherIcon.setAttribute('src', iconUrl);
  weatherIcon.setAttribute('alt', iconDescription);
  weatherIcon.setAttribute('class', 'weather-img');
  header.append(weatherIcon);
  temperature.textContent = `Temp: ${tempF}°F`;
  wind.textContent = `Wind: ${windMph} MPH`;
  humidity.textContent = `Humidity: ${humidity} %`;
  cardBody.append(header, temperature, wind, humidity);

  todayWeather.innerHTML = '';
  todayWeather.append(card);
}




function displyaInfo(city, data) {
  displayCurrentWeather(city, data.list[0], data.city.timezone);
  // forecast info go here
}


// see gary notes in slack
function getWeather(location) {
  var { lat } = location;
  var { lon } = location;
  var city = location.name;

  var apiUrl = `${weatherApiRootUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherApiKey}`;

  fetch(apiUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      displyaInfo(city, data);
    })
    .catch(function (err) {
      console.error(err);
    });
}

function showSearchHistory() {
  searchHistoryList.innerHTML = '';

  for (var i = searchHistory.length - 1; i >= 0; i--) {
    var btn = document.createElement('button');
    btn.classList.add('history-btn', 'btn-history');

    btn.setAttribute('data-search', searchHistory[i]);
    btn.textContent = searchHistory[i];
    searchHistoryList.append(btn);
  }
}

function udpateHistory(search) {
  if (searchHistory.indexOf(search) !== -1) {
    return;
  }
  searchHistory.push(search);

  localStorage.setItem('search-history', JSON.stringify(searchHistory));
  showSearchHistory();
}

function getCoordinates(search) {
  var apiUrl = `${weatherApiRootUrl}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherApiKey}`;

  fetch(apiUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (!data[0]) {
        alert('Location not found');
      } else {
        udpateHistory(search);
        getWeather(data[0]);
      }
    })
    .catch(function (err) {
      console.error(err);
    });
}





searchForm.addEventListener('submit', handleSearchFormSubmit);

function handleSearchFormSubmit(e) {
  if (!searchInput.value) {
    return;
  }
  e.preventDefault();
  var search = searchInput.value.trim();
  getCoordinates(search);
  console.log(search)
  searchInput.value = '';
}


