// javascript file for the home page
// this is responsible for populating the available series,movies and recommened titles

document.addEventListener("DOMContentLoaded", function() {
    loadSeries();
    loadSeries2();
    //loadRecommendedTitles();
});

async function loadSeries() {
    const seriessContainer = document.querySelector(".movies_container");
    const loadingScreen = document.getElementById("loadingPage");

    loadingScreen.style.display = "block";

    for (let i = 500; i <= 503; i++) {
        try {
            // Fetch series data using XMLHttpRequest
            const series = await fetchSeriesData(i);
            createSeriesElement(series, seriessContainer);
        } catch (error) {
            console.error(error.message);
        }
    }

    loadingScreen.style.display = "none";
}
async function loadSeries2() {
    const seriessContainer = document.querySelector(".movies2_container");
    const loadingScreen = document.getElementById("loadingPage");

    loadingScreen.style.display = "block";

    for (let i = 300; i <= 303; i++) {
        try {
            // Fetch series data using XMLHttpRequest
            const series = await fetchSeriesData(i);
            createSeriesElement(series, seriessContainer);
        } catch (error) {
            console.error(error.message);
        }
    }

    loadingScreen.style.display = "none";
}
async function loadRecommendedTitles(){
    const seriessContainer = document.querySelector(".recommended_titles");
    const loadingScreen = document.getElementById("loadingPage");

    loadingScreen.style.display = "block";

    for (let i = 1; i <= 4; i++) {
        try {
            // Fetch series data using XMLHttpRequest
            const series = await fetchRecommendedTitles(i);
            createSeriesElement(series, seriessContainer);
        } catch (error) {
            console.error(error.message);
        }
    }

    loadingScreen.style.display = "none";

}


// Function to fetch series data using XMLHttpRequest
function fetchSeriesData(seriesId) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `https://api.tvmaze.com/shows/${seriesId}`, true);
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const seriesData = JSON.parse(xhr.responseText);
                    const imdbID = seriesData.externals.imdb;
                    // Fetch image URL from the TVmaze API using the IMDb ID
                    fetchImageUrl(imdbID, function(imageUrls) {
                        seriesData.imageUrls = imageUrls;
                        resolve(seriesData);
                    });
                } else {
                    reject(new Error(`Error fetching series with ID ${seriesId}`));
                }
            }
        };

        xhr.send();
    });
}
function fetchRecommendedTitles(seriesId) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `https://api.tvmaze.com/shows/${seriesId}`, true);
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const seriesData = JSON.parse(xhr.responseText);
                    const imdbID = seriesData.externals.imdb;
                    const rating = seriesData.rating.average;
                    // Fetch image URL from the TVmaze API using the IMDb ID
                    if (rating >= 8.5){
                    fetchImageUrl(imdbID, function(imageUrls) {
                        seriesData.imageUrls = imageUrls;
                        resolve(seriesData);
                    });
                }
                } else {
                    reject(new Error(`Error fetching series with ID ${seriesId}`));
                }
            }
        };

        xhr.send();
    });
}

// Function to fetch image URL from the TVmaze API based on the IMDb ID
function fetchImageUrl(imdbID, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.tvmaze.com/lookup/shows?imdb=" + imdbID, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                // Parse the response and extract image URLs
                var response = JSON.parse(xhr.responseText);
                var imageUrls = [];
                if (response.length > 0) {
                    for (var i = 0; i < response.length; i++) {
                        var imageURL = response[i].image ? response[i].image.medium : null;
                        imageUrls.push(imageURL);
                    }
                }
                // Call the callback function with the array of image URLs
                callback(imageUrls);
            } else if (xhr.status == 404) {
                console.log("Image not found");
                // Call the callback function with an empty array if image is not found
                callback([]);
            }
        }
    };

    xhr.send();
}


// Function to create series element
function createSeriesElement(series, container) {
    const seriesElement = document.createElement('div');
    seriesElement.classList.add('box');

    const seriesImage = series.image ? `<img src="${series.image.medium}" alt="${series.name}">` : '';
    const seriesGenres = series.genres.join(', ');

    seriesElement.innerHTML = `
        <div class="box_image">
            <a href="details.html">
                ${seriesImage}
            </a>
        </div>
        <h3>${series.name}</h3>
        <span>${series.runtime} min | ${seriesGenres}</span>
    `;

    container.appendChild(seriesElement);
}
