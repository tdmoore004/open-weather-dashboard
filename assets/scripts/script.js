let now = moment();
let cityName = "";
let citySearch = $("#city-search");
let savedCities = $("#saved-cities");

// Display previously searched cities
function displayCities() {
    let searchedCities = JSON.parse(localStorage.getItem("searchedCities"));
    if (!searchedCities) searchedCities = [];

    savedCities.empty();

    $.each(searchedCities, function (index, city) {
        pastCity = $("<li>");
        pastCity.addClass("list-group-item");
        pastCity.text(city);
        savedCities.append(pastCity);
        if (index === 7) {
            return false;
        }
    })
};

// Function for saving city to search history
function saveCity() {
    cityName = citySearch[0].value;

    if (cityName === "") {
        return false;
    } else {
        localStorage.setItem("cityName", JSON.stringify(cityName));

        let searchedCities = JSON.parse(localStorage.getItem("searchedCities"));
        if (!searchedCities) searchedCities = [];

        searchedCities.unshift(cityName);

        localStorage.setItem("searchedCities", JSON.stringify(searchedCities));

        citySearch[0].value = "";

        displayCities();
    }
}

// Function for gathering current weather data and 5 day forecast
function currentWeather(event) {
    event.preventDefault();

    cityName = citySearch[0].value;

    if (cityName === "") {
        return false;
    } else {
        const currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=551d8730f73576299c873b5024b35db0";
        $.ajax({
            url: currentWeatherURL,
            method: "GET"
        }).then(function (currentData) {
            console.log(currentData);
            
            // Get latitude and longitude for forecast data
            cityLat = currentData.coord.lat;
            cityLon = currentData.coord.lon;
            
            const forecastURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&appid=551d8730f73576299c873b5024b35db0";
            $.ajax({
                url: forecastURL,
                method: "GET"
            }).then(function (forecastData) {
                console.log(forecastData);

                displayCurrentWeather(forecastData);
                displayForecast(forecastData);
            })
        });
        
        saveCity();

    }
}

// Function for displaying the current weather
function displayCurrentWeather(currentData) {
    $("#weather-info").empty();
    let currentWeatherInfo = $("<div>");
    currentWeatherInfo.addClass("container");
    
    let weatherCity = $("<h2>");
    weatherCity.text(cityName);
    currentWeatherInfo.append(weatherCity);
    
    let currentWeatherImage = $("<img>");
    currentWeatherImage.attr("src", "http://openweathermap.org/img/wn/" + currentData.current.weather[0].icon + "@2x.png");
    weatherCity.append(currentWeatherImage);
    
    let currentDate = $("<h5>");
    currentDate.text(now.format("M/D/YYYY"));
    currentWeatherInfo.append(currentDate);
    
    let currentTemp = $("<p>")
    tempFaren = ((currentData.current.temp - 273.15) * 1.8 + 32).toFixed(1);
    currentTemp.addClass("my-3");
    currentTemp.text("Temperature: " + tempFaren + " \u00B0F")
    currentWeatherInfo.append(currentTemp);
    
    let currentHumidity = $("<p>");
    currentHumidity.addClass("my-3");
    currentHumidity.text("Humidity: " + currentData.current.humidity + "%");
    currentWeatherInfo.append(currentHumidity);
    
    let currentWindSpeed = $("<p>");
    currentWindSpeed.addClass("my-3");
    currentWindSpeed.text("Wind Speed: " + currentData.current.wind_speed + " MPH");
    currentWeatherInfo.append(currentWindSpeed);

    let currentUV = $("<p>");
    currentUV.addClass("my-3 pl-1 col-6");
    currentUV.attr("id", "uv-index");
    currentUV.text("UV Index: " + currentData.current.uvi);
    currentWeatherInfo.append(currentUV);
    if ((currentData.current.uvi > 0) && (currentData.current.uvi < 2)) {
        currentUV.css("background-color", "green");
    } else if ((currentData.current.uvi > 3) && (currentData.current.uvi < 5)) {
        currentUV.css("background-color", "yellow");
    } else if ((currentData.current.uvi > 6) && (currentData.current.uvi < 7)) {
        currentUV.css("background-color", "orange");
    } else {
        currentUV.css("background-color", "red");
        currentUV.css("color", "white");
    };
    
    $("#weather-info").append(currentWeatherInfo);
}

// Function for displaying the 5 day forecast
function displayForecast(forecastData) {
let dailyForecastTitle = $("<h2>");
dailyForecastTitle.addClass("mt-5");
dailyForecastTitle.text("Five Day Forecast:");
$("#weather-info").append(dailyForecastTitle);

let fiveDayForecast = $("<div>");
fiveDayForecast.addClass("row");
$("#weather-info").append(fiveDayForecast);

for (let i = 0; i < 5; i++) {
    let dailyForecast = $("<div>");
    dailyForecast.addClass("ml-2 mt-2 p-2 border border-primary rounded col-10 col-md-2");
    let dailyForecastDate = moment().add(i + 1, "d");
    
    let dailyDate = $("<h5>");
    dailyDate.text(dailyForecastDate.format("M/D/YYYY"));
    dailyForecast.append(dailyDate);

    let dailyWeatherIcon = $("<img>");
    dailyWeatherIcon.attr("src", "http://openweathermap.org/img/wn/" + forecastData.daily[i].weather[0].icon + "@2x.png");
    dailyForecast.append(dailyWeatherIcon);

    let dailyTemp = $("<p>");
    let dailyTempFaren = ((forecastData.daily[i].temp.day - 273.15) * 1.8 + 32).toFixed(1);
    dailyTemp.text("Temp: " + (dailyTempFaren) + " \u00B0F");
    dailyForecast.append(dailyTemp);

    let dailyHumidity = $("<p>");
    dailyHumidity.text("Humidity: " + forecastData.daily[i].humidity + "%");
    dailyForecast.append(dailyHumidity);

    fiveDayForecast.append(dailyForecast);
}
}

displayCities();
$("#city-submit").click(currentWeather);