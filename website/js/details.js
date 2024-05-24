// This is a file that will handle the API requests for series
// This includes processes like fetching image URLs, and series details

// Going to be using the TVmaze API for some of the data population

document.addEventListener("DOMContentLoaded", function() {
    loadDetails();
});

async function loadDetails() {
    const detailsContainer = document.querySelector(".details_container");

    for (let i = 1; i <= 15; i++) {
        try {
            // Fetch series data using XMLHttpRequest
            const series = await fetchDetails(i);
            createDetailssElement(series, detailsContainer);
        } catch (error) {
            console.error(error.message);
        }
    }

}

// Function to fetch series data using XMLHttpRequest
function fetchDetails(seriesId) {
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


function createDetailssElement(series) {
    const detailsContainer = document.querySelector(".details_container");
    detailsContainer.innerHTML = ''; // Clear previous details

    const seriesImage = series.image ? `<img src="${series.image.medium}" alt="${series.name}">` : '';
    const seriesGenres = series.genres.join(', ');

    const detailsElement = document.createElement('div');
    detailsElement.classList.add('details');

    detailsElement.innerHTML = `
        <div class="cover">
            ${seriesImage}
        </div>
        <div class="info">
            <h1 class="title">${series.name}</h1>
            <p class="description">${series.summary}</p>
            <p class="genre"><strong>Genre:</strong> ${seriesGenres}</p>
            <p class="rating"><strong>Rating:</strong> ${series.rating.average}</p>
            <!-- Add other details here -->
        </div>
    `;
    const detailsElement2 = document.createElement('div');
    detailsElement.classList.add('reviews');

    detailsElement2.innerHTML = `
    <div class="reviews">
    <h2>User Reviews</h2>
    <div class="review">
        <p><strong>user1223:</strong> This series was great. Amazing plot.</p>
    </div>
    <div class="review">
        <p><strong>user44232:</strong> Didn't really enjoy this series.</p>
    </div>
    <!--More reviews will be added, maybe only 10 will be displayed at a time? -->
</div>
    `;



    detailsContainer.appendChild(detailsElement);
    detailsContainer.appendChild(detailsElement2);
}
// Function to fetch series data using XMLHttpRequest
function fetchDetails(seriesId) {
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

