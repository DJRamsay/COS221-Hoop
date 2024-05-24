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
            const response = await fetch(`https://api.tvmaze.com/shows/${i}`);
            if (!response.ok) {
                throw new Error(`Error fetching show with ID ${i}`);
            }

            const data = await response.json();
            createSeriesElement(data, seriessContainer);
        } catch (error) {
            console.error(error.message);
        }
    }

    loadingScreen.style.display = "none";
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
