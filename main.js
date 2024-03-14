'use strict';

const weatherImg = document.querySelector('.weather-icon');
const country = document.querySelector('.country');
const cityName = document.querySelector('.city');

const weatherCond = document.querySelector('.weather-condition');
const temp = document.querySelector('.city-temp');
const time = document.querySelector('.time');
const dayWeek = document.querySelector('.day');
const date = document.querySelector('.date');
const realDate = document.querySelector('.real-date');
const humidity = document.querySelector('.humid');
const rainful = document.querySelector('.rain');
const wind = document.querySelector('.wind__speed');
const input = document.querySelector('.search');
const btn = document.querySelector('.btn');
const errBox = document.querySelector('.error-box');
const warningMsg = document.querySelector('.msg');


// Getting the day of the week
const dayOfTheWeek = function(num) {
  const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
  return days[num];
}

//Setting up error box
const errorBox = function(message) {
  
  warningMsg.textContent = message;
  errBox.classList.remove('display');
  
  //Display for only 3 seconds 
  setTimeout(function() {
    errBox.classList.add('display');
  }, 3000);
}

const getJson = function(url, errorMsg = 'Something went wrong') {
  // Tab to edit
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMsg} ${response.status}`)
    
    return response.json();
  })
}

const weatherData = async function (city) {
  try {
    
    //trying weather data
    const data = await getJson(`http://api.weatherapi.com/v1/current.json?key=ccd61afa76a94046a7a103445242602&q=${city}&aqi=no`);
    
    console.log(data);
    
    //Fetching time based on weather data timeZone 
    const timeZone = await getJson(`https://worldtimeapi.org/api/timezone/${data.location.tz_id}`);
 
    const date = new Date(timeZone.datetime);
    
    //Updating DOM
    weatherImg.setAttribute('src', data.current.condition.icon);
    country.textContent = data.location.country + ', ';
    cityName.textContent = data.location.name;
    
    weatherCond.textContent = data.current.condition.text;
    temp.textContent = data.current.temp_c;
    time.textContent = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    dayWeek.textContent = dayOfTheWeek(date.getDay());
    realDate.textContent = new Intl.DateTimeFormat(navigator.language).format(date);
    
    humidity.textContent = data.current.humidity;
    rainful.textContent = data.current.precip_mm;
    wind.textContent = Math.floor(data.current.wind_kph);
  } catch (e) {
    //Catching errors
    console.error(`Problem getting the city`);
    errorBox(`Problem getting city: ${e.message}`);
  }
}

//Get users current location
const getPosition = async function() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  })

}


const getCity = async function() {
  // Tab to edit
  try {
    //Getting users location logic
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;
    const resGeo = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json&auth=125481622744063e15765083x64754`);
   
    const data = await resGeo.json();
    const city = data.city.toLowerCase();
    
    //Updating DOM with city name
    weatherData(city);
    
  } catch (error) {
    //Setting a default location display
    weatherData('ibadan');
    errorBox('Problem getting your current location');
  }
}

getCity();

const searchCity = function() {
  if(input.value) {
    weatherData(input.value.trim());
  } else {
    errorBox('Type in a city');
  }
}

btn.addEventListener('click', searchCity);