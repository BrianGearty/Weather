$(document).ready(function () {
    var longitude;
    var latitude;

    setInterval(function () {
        var momentNow = moment();
        $("#date").html(momentNow.format("ddd").toUpperCase().substring(0, 8) + ",  " + momentNow.format('MMMM Do YYYY, h:mm a'));
    }, 100);

    function getLocation() {
        navigator.geolocation.getCurrentPosition(showPosition);
        showPosition();
    }
    function showPosition(position) {
        longitude = position.coords.longitude;
        latitude = position.coords.latitude;
        renderWeather()
    }
    function renderWeather() {
        var apiKey = "37d198b6a9dd6e25b1cb3dcdfedb4eb1"
        var GoogleAPIKey = "AIzaSyCeH1mhLsEJFzLUol5eDRmfP8uFHHqltPE"
        var googleURL = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&key=" + GoogleAPIKey;
        var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=" + apiKey;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            let currentWeather = response.current.weather[0].main;
            if (currentWeather == "Clear") {
                let clearImg = $(".backgroundImage").css({
                    'background-image': 'url(./Assets/clear.gif)',
                    'background-repeat': 'no-repeat',
                    'background-size': 'cover',
                    'background-position': '75% 75% '
                })
                $(".jumbotron").append(clearImg)
            } else if (currentWeather == "Rain") {
                let raimImg = $(".backgroundImage").css({
                    'background-image': 'url(./Assets/raindrop.gif)',
                    'background-repeat': 'no-repeat',
                    'background-size': 'cover'
                })
                $(".jumbotron").append(raimImg)
            } else if (currentWeather == "Thunderstorm") {
                let thunderImg = $(".backgroundImage").css({
                    'background-image': 'url(./Assets/thunderstorm.gif)',
                    'background-repeat': 'no-repeat',
                    'background-size': 'cover'
                })
                $(".jumbotron").append(thunderImg)
            } else if (currentWeather == "Clouds") {
                let overcastImg = $(".backgroundImage").css({
                    'background-image': 'url(./Assets/overcast.gif)',
                    'background-repeat': 'no-repeat',
                    'background-size': 'cover'
                })
                $(".jumbotron").append(overcastImg)
            } else if (currentWeather == "Snow") {
                let snowImg = $(".backgroundImage").css({
                    'background-image': 'url(./Assets/snow.gif)',
                    'background-repeat': 'no-repeat',
                    'background-size': 'cover'
                })
                $(".jumbotron").append(snowImg)
            } else if (currentWeather == "Mist") {
                let mistImg = $(".backgroundImage").css({
                    'background-image': 'url(./Assets/mist.gif)',
                    'background-repeat': 'no-repeat',
                    'background-size': 'cover'
                })
                $(".jumbotron").append(mistImg)
            }
            $("#currentWeather").empty();
            var tempDiv = $("<p id='temp' class='card-text'>");
            var humidDiv = $("<p id='humid' class='card-text'>");
            var windDiv = $("<p id='wind' class='card-text'>");
            var uvidDiv = $("<p id='uvid' class='card-text UV'>");
            var weatherData = "http://openweathermap.org/img/wn/" + response.current.weather[0].icon + ".png";
            var tempData = response.current.temp;
            var humidData = response.current.humidity;
            var windData = response.current.wind_speed;
            var uvidData = response.current.uvi;
            var weatherIcon = $("<img>").attr("src", weatherData);
            weatherIcon.empty();
            $("#currentWeather").prepend(weatherIcon);
            tempDiv.text("Temperature: " + tempData + String.fromCharCode(176) + "F");
            humidDiv.text("Humidity: " + humidData + "%");
            windDiv.text("Wind Speed: " + windData + "Mph");
            uvidDiv.text("UV Index: " + uvidData);
            $("#currentWeather").append(tempDiv);
            $("#currentWeather").append(humidDiv);
            $("#currentWeather").append(windDiv);
            $("#currentWeather").append(uvidDiv);
            if (uvidData < 4) {
                $(".UV").addClass("low-uv").removeClass("moderate-uv high-uv danger-uv");
            } else if (uvidData < 7) {
                $(".UV").addClass("moderate-uv").removeClass("low-uv high-uv danger-uv");
            } else if (uvidData < 10) {
                $(".UV").addClass("high-uv").removeClass("moderate-uv low-uv danger-uv");
            } else {
                $(".UV").addClass("danger-uv").removeClass("moderate-uv high-uv low-uv");
            }
            $("#forecastBody").html("");
            for (i = 1; i < 6; i++) {
                var forecastDate = moment().add(i, 'days').format('L');
                var forecastCol = $("<div class='col-sm'>");
                var forecastCard = $("<div class='card forecast'>");
                var forecastHeader = $("<div class='card-header fiveDay'>");
                var forecastDateP = $("<p>").text(forecastDateP);
                $("#forecastBody").append(forecastCol);
                forecastCol.append(forecastCard);
                forecastCard.append(forecastHeader);
                forecastHeader.append(forecastDate);
                var forecastWeatherData = "http://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon + ".png";
                var forecastTempData = parseInt(response.daily[i].temp.day);
                var forecastHumidData = response.daily[i].humidity;
                var forecastData = $("<div class='card-body'>");
                var forecastWeatherIcon = $("<img>").attr("src", forecastWeatherData);
                var forecastTempDiv = $("<p class='fiveDay'>").text("Temperature: " + forecastTempData + String.fromCharCode(176) + "F");
                var forecastHumidDiv = $("<p class='fiveDay'>").text("Humidity: " + forecastHumidData + "%");
                forecastCard.append(forecastData);
                forecastData.append(forecastWeatherIcon, forecastTempDiv, forecastHumidDiv);
            }
        });
        $.ajax({
            url: googleURL,
            method: "GET"
        }).then(function (response) {
            var cityDiv = $("#cityName");
            var cityData = response.results[5].formatted_address;
            cityDiv.html("");
            var cityDisplay = $("<h3 class='display-4'>").text(cityData);
            cityDiv.append(cityDisplay);
        });
    }
    var clickCity;
    function citybutton() {
        var OpenCageAPIKey = "018eae80efa940958a187269d38fdc75"
        var opencageURL = "https://api.opencagedata.com/geocode/v1/json?q=" + clickCity + "&key=" + OpenCageAPIKey;
        $.ajax({
            url: opencageURL,
            method: "GET"
        }).then(function (response) {
            latitude = response.results[0].geometry.lat
            longitude = response.results[0].geometry.lng
            renderWeather();
        })
    }
    var cityHistory = ["NEW YORK", "CHICAGO", "LOS ANGELES", "MIAMI", "PORTLAND"];
    function StorageCheck() {
        var storedCity = JSON.parse(localStorage.getItem("searchHistory"));
        if (storedCity !== null) {
            cityHistory = storedCity;
        }
        renderButtons();
    }
    let newButton;
    function renderButtons() {
        $("#CityButton").html("");
        for (var i = 0; i < cityHistory.length; i++) {
            var city = cityHistory[i];
            newButton = $("<button>");
            newButton.addClass("btn searchResult display-4 mx-auto");
            newButton.attr("data-name", city);
            newButton.attr("id", "cityButton");
            newButton.text(city);

            $("#CityButton").prepend(newButton);
        }
    }

    $("#CityButton").on("click", "button", function (event) {
        event.preventDefault();
        clickCity = $(this).attr("data-name");
        citybutton();
    })
    $("#searchButton").on("click", function (event) {
        event.preventDefault();
        var searchValue = ($("#searchBar").val().toUpperCase());
        if (searchValue === "") {
            alert("Please type in a city")
        } else {
            cityHistory.push(searchValue);
            localStorage.setItem("searchHistory", JSON.stringify(cityHistory));
            $("#searchBar").val("");
            renderButtons();
            renderWeather();
        }
    })
    $("#clearButton").on("click",  function (event) {
        event.preventDefault();
        $("#searchBar").val(""); 
        var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
        searchHistory.splice(searchHistory.length -1)
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        let deletedCity = $("#CityButton")[0].children;
        // let findDeleted = $("#CityButton").find(deletedCity).prevObject[0].firstChild.innerText;
        // let toDelete = $("#CityButton")[0].children[0]
        for (var i = 0; i < deletedCity.length; i++){
            if(parseInt([i]) === 0){
                deletedCity = parseInt([i])
                $("#CityButton" + deletedCity).remove();
            }
        }
        console.log(deletedCity)
        renderButtons();
    })
    StorageCheck();
    getLocation();
});