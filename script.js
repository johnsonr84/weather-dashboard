// Openweather API Key //
var apiKey = "0ad804791848d3621c16320ba8701218";
var currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q"
var currentWeather = $("#weather");

$(document).ready(function () {
    $("#cityInput").keyup(function (event) {
        if (event.keyCode == 13) {
            $("#submitCity").click();
        }
    });
});

$("#submitCity").click(function () {
    event.preventDefault();
    let cityName = $("#cityInput").val();
    localStorage.setItem("currentCity", cityName)
    returnWeather(cityName);
});

// API call for weather
function returnWeather(cityName) {
    let queryURL = `${currentWeatherURL}=${cityName}&units=imperial&APPID=${apiKey}`;

    // Get info from URL When searched
    $.get(queryURL).then(function (response) {
        // Current Date 
        let currTime = new Date(response.dt * 1000);
        // Displays Weather Icon 
        let weatherIcon = `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
        // When searched display info on Weather info
        currentWeather.html(`
        <h2>${response.name}, ${response.sys.country} (${currTime.getMonth() + 1}/${currTime.getDate()}/${currTime.getFullYear()})<img src=${weatherIcon} height="75px"></h2>
        <p>Temperature: ${response.main.temp}&#176;F</p>
        <p>Humidity: ${response.main.humidity}%</p>
        <p>Wind Speed: ${response.wind.speed} mph</p>
        `, uvIndex(response.coord))
        localStorage.setItem("cityObject", JSON.stringify(response));
        console.log(response);
    })
};

// API call to retrieve the UV index, this is called in the "reutnrCurrentWeather" function.
function uvIndex(coordinates) {
    let queryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${coordinates.lat}&lon=${coordinates.lon}&APPID=${apiKey}`;

    $.get(queryURL).then(function (response) {
        let currUVIndex = response.value;
        // default green color for the UV index
        let uvStrength = "green";
        let textColor = "white"

        // based on the returned UV index, the color of the value will be set.
        if (currUVIndex >= 8) {
            uvStrength = "red";
            textColor = "white"
        } else if (currUVIndex >= 6) {
            uvStrength = "orange";
            textColor = "black"
        } else if (currUVIndex >= 3) {
            uvStrength = "yellow";
            textColor = "black"
        }
        currentWeather.append(`<p>UV Index: <span class="text-${textColor}" style="background-color: ${uvStrength};">${currUVIndex}</span></p>`);
    })
}