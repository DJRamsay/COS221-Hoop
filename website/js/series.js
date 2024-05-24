// This is a file that will handle the API requests for series
// This includes processes like fetching image URLs, and series details

// Going to be using the TVmaze API for some of the data population

document.addEventListener("DOMContentLoaded", function() {
    loadSeries();
});

async function loadSeries() {
    const seriessContainer = document.querySelector(".movies_container");
    const loadingScreen = document.getElementById("loadingPage");

    loadingScreen.style.display = "block";

    for (let i = 1; i <= 33; i++) {
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
//This function will filter the series/movies page based on genre

function filterByGenre(){


}
//This function will filter the series/movies page based on genre
function filterByPGRating(){
    
}
//This function will filter the series/movies page based on genre
function filterByRating(){
    
}
