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
    console.log("saving city")
    cityName = citySearch[0].value;

    localStorage.setItem("cityName", JSON.stringify(cityName));

    let searchedCities = JSON.parse(localStorage.getItem("searchedCities"));
    if (!searchedCities) searchedCities = [];

    searchedCities.unshift(cityName);

    localStorage.setItem("searchedCities", JSON.stringify(searchedCities));

    citySearch[0].value = "";

    displayCities();
}

// Function for gathering current weather data and 5 day forecast
function currentWeather(event) {
    event.preventDefault();

    cityName = citySearch[0].value;
    
    const currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=551d8730f73576299c873b5024b35db0";
    $.ajax({
        url: currentWeatherURL,
        method: "GET"
    }).then(function (currentData) {
        console.log(currentData);
        
        cityLat = currentData.coord.lat;
        cityLon = currentData.coord.lon;
        
        const forecastURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&appid=551d8730f73576299c873b5024b35db0";
        $.ajax({
            url: forecastURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
        })
    });

    saveCity();

}

displayCities();
$("#city-submit").click(currentWeather);