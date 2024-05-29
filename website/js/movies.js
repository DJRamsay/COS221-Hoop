document.addEventListener("DOMContentLoaded", function() {
    loadSeries();
    document.getElementById("searchBTN").addEventListener("click", function(event) {
        event.preventDefault(); 
        fetchSearchData();
    });
});

function fetchSearchData() {
    const seriesContainer = document.querySelector(".movies_container");
    const loadingScreen = document.getElementById("loadingPage");
    const searchInput = document.getElementById("searchbar").value.toLowerCase();

    // Clear previous results
    seriesContainer.innerHTML = '';
    loadingScreen.style.display = "block";

    searchSeries(searchInput, function(seriesList) {
        seriesList.forEach(series => {
            createSeriesElement(series, seriesContainer);
        });
        loadingScreen.style.display = "none";
    });
}

function searchSeries(query, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `https://api.tvmaze.com/search/shows?q=${query}`, true);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const seriesData = JSON.parse(xhr.responseText);
                // Extract the show data from the search results
                const seriesList = seriesData.map(item => item.show);
                callback(seriesList);
            } else {
                console.error(`Error fetching series with query "${query}"`);
                callback([]);
            }
        }
    };

    xhr.send();
}


async function loadSeries() {
    const seriessContainer = document.querySelector(".movies_container");
    const loadingScreen = document.getElementById("loadingPage");

    loadingScreen.style.display = "block";

    for (let i = 33; i <= 63; i++) {
        try {
            const series = await fetchSeriesData(i);
            createSeriesElement(series, seriessContainer);
        } catch (error) {
            console.error(error.message);
        }
    }

    loadingScreen.style.display = "none";
}

function fetchSeriesData(seriesId) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `https://api.tvmaze.com/shows/${seriesId}`, true);
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const seriesData = JSON.parse(xhr.responseText);
                    resolve(seriesData);
                } else {
                    reject(new Error(`Error fetching series with ID ${seriesId}`));
                }
            }
        };

        xhr.send();
    });
}

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
