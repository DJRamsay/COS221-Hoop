// This is a file that will handle the API requests for titles
// This includes processes like fetching image URLs, and series details

// Going to be using the TVmaze API for some of the data population

document.addEventListener("DOMContentLoaded", function() {
    loadMovies();
});

async function loadMovies() {
    const moviesContainer = document.querySelector(".movies_container");
    const loadingScreen = document.getElementById("loadingPage");
    
    loadingScreen.style.display = "block";

    for (let i = 1; i <= 33; i++) {
        try {
            const response = await fetch(`https://api.tvmaze.com/shows/${i}`);
            if (!response.ok) {
                throw new Error(`Error fetching show with ID ${i}`);
            }

            const data = await response.json();
            createMovieElement(data, moviesContainer);
        } catch (error) {
            console.error(error.message);
        }
    }

    loadingScreen.style.display = "none";
}

function createMovieElement(movie, container) {
    const movieElement = document.createElement('div');
    movieElement.classList.add('box');

    const movieImage = movie.image ? `<img src="${movie.image.medium}" alt="${movie.name}">` : '';
    const movieGenres = movie.genres.join(', ');

    movieElement.innerHTML = `
        <div class="box_image">
            <a href="details.html">
                ${movieImage}
            </a>
        </div>
        <h3>${movie.name}</h3>
        <span>${movie.runtime} min | ${movieGenres}</span>
    `;

    container.appendChild(movieElement);
}
