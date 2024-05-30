// // This is a file that will handle the API requests for series
// // This includes processes like fetching image URLs, and series details

// // Going to be using the TVmaze API for some of the data population

// document.addEventListener("DOMContentLoaded", function() {
//     loadDetails();
// });

// async function loadDetails() {
//     const detailsContainer = document.querySelector(".details_container");

//     for (let i = 1; i <= 15; i++) {
//         try {
//             // Fetch series data using XMLHttpRequest
//             const series = await fetchDetails(i);
//             createDetailssElement(series, detailsContainer);
//         } catch (error) {
//             console.error(error.message);
//         }
//     }

// }

// // Function to fetch series data using XMLHttpRequest
// function fetchDetails(seriesId) {
//     return new Promise((resolve, reject) => {
//         const xhr = new XMLHttpRequest();
//         xhr.open("GET", `https://api.tvmaze.com/shows/${seriesId}`, true);
        
//         xhr.onreadystatechange = function() {
//             if (xhr.readyState === XMLHttpRequest.DONE) {
//                 if (xhr.status === 200) {
//                     const seriesData = JSON.parse(xhr.responseText);
//                     const imdbID = seriesData.externals.imdb;
//                     // Fetch image URL from the TVmaze API using the IMDb ID
//                     fetchImageUrl(imdbID, function(imageUrls) {
//                         seriesData.imageUrls = imageUrls;
//                         resolve(seriesData);
//                     });
//                 } else {
//                     reject(new Error(`Error fetching series with ID ${seriesId}`));
//                 }
//             }
//         };

//         xhr.send();
//     });
// }

// // Function to fetch image URL from the TVmaze API based on the IMDb ID
// function fetchImageUrl(imdbID, callback) {
//     var xhr = new XMLHttpRequest();
//     xhr.open("GET", "https://api.tvmaze.com/lookup/shows?imdb=" + imdbID, true);

//     xhr.onreadystatechange = function () {
//         if (xhr.readyState == 4) {
//             if (xhr.status == 200) {
//                 // Parse the response and extract image URLs
//                 var response = JSON.parse(xhr.responseText);
//                 var imageUrls = [];
//                 if (response.length > 0) {
//                     for (var i = 0; i < response.length; i++) {
//                         var imageURL = response[i].image ? response[i].image.medium : null;
//                         imageUrls.push(imageURL);
//                     }
//                 }
//                 // Call the callback function with the array of image URLs
//                 callback(imageUrls);
//             } else if (xhr.status == 404) {
//                 console.log("Image not found");
//                 // Call the callback function with an empty array if image is not found
//                 callback([]);
//             }
//         }
//     };

//     xhr.send();
// }


// function createDetailssElement(series) {
//     const detailsContainer = document.querySelector(".details_container");
//     detailsContainer.innerHTML = ''; // Clear previous details

//     const seriesImage = series.image ? `<img src="${series.image.medium}" alt="${series.name}">` : '';
//     const seriesGenres = series.genres.join(', ');

//     const detailsElement = document.createElement('div');
//     detailsElement.classList.add('details');

//     detailsElement.innerHTML = `
//         <div class="cover">
//             ${seriesImage}
//         </div>
//         <div class="info">
//             <h1 class="title">${series.name}</h1>
//             <p class="description">${series.summary}</p>
//             <p class="genre"><strong>Genre:</strong> ${seriesGenres}</p>
//             <p class="rating"><strong>Rating:</strong> ${series.rating.average}</p>
//             <!-- Add other details here -->
//         </div>
//     `;
//     const detailsElement2 = document.createElement('div');
//     detailsElement.classList.add('reviews');

//     detailsElement2.innerHTML = `
//     <div class="reviews">
//     <h2>User Reviews</h2>
//     <div class="review">
//         <p><strong>user1223:</strong> This series was great. Amazing plot.</p>
//     </div>
//     <div class="review">
//         <p><strong>user44232:</strong> Didn't really enjoy this series.</p>
//     </div>
//     <!--More reviews will be added, maybe only 10 will be displayed at a time? -->
// </div>
//     `;



//     detailsContainer.appendChild(detailsElement);
//     detailsContainer.appendChild(detailsElement2);
// }
// // Function to fetch series data using XMLHttpRequest
// function fetchDetails(seriesId) {
//     return new Promise((resolve, reject) => {
//         const xhr = new XMLHttpRequest();
//         xhr.open("GET", `https://api.tvmaze.com/shows/${seriesId}`, true);
        
//         xhr.onreadystatechange = function() {
//             if (xhr.readyState === XMLHttpRequest.DONE) {
//                 if (xhr.status === 200) {
//                     const seriesData = JSON.parse(xhr.responseText);
//                     const imdbID = seriesData.externals.imdb;
//                     // Fetch image URL from the TVmaze API using the IMDb ID
//                     fetchImageUrl(imdbID, function(imageUrls) {
//                         seriesData.imageUrls = imageUrls;
//                         resolve(seriesData);
//                     });
//                 } else {
//                     reject(new Error(`Error fetching series with ID ${seriesId}`));
//                 }
//             }
//         };

//         xhr.send();
//     });
// }



// // Function to fetch image URL from the TVmaze API based on the IMDb ID
// function fetchImageUrl(imdbID, callback) {
//     var xhr = new XMLHttpRequest();
//     xhr.open("GET", "https://api.tvmaze.com/lookup/shows?imdb=" + imdbID, true);

//     xhr.onreadystatechange = function () {
//         if (xhr.readyState == 4) {
//             if (xhr.status == 200) {
//                 // Parse the response and extract image URLs
//                 var response = JSON.parse(xhr.responseText);
//                 var imageUrls = [];
//                 if (response.length > 0) {
//                     for (var i = 0; i < response.length; i++) {
//                         var imageURL = response[i].image ? response[i].image.medium : null;
//                         imageUrls.push(imageURL);
//                     }
//                 }
//                 // Call the callback function with the array of image URLs
//                 callback(imageUrls);
//             } else if (xhr.status == 404) {
//                 console.log("Image not found");
//                 // Call the callback function with an empty array if image is not found
//                 callback([]);
//             }
//         }
//     };

//     xhr.send();
// }

document.addEventListener("DOMContentLoaded", function() {
    const queryString = window.location.search;
    const urlParam = new URLSearchParams(queryString);
    const param1Value = urlParam.get('param1');
    const param2Value = urlParam.get('param2');
    var titleID = param1Value;
    var type = param2Value;

    if(type == "series"){
        loadSeries2(titleID);
    } else if(type=="movie"){
        loadSeries(titleID);
    }
    
});

async function loadSeries(titleID) {
    let xmlObject = new XMLHttpRequest();
    let url = 'https://wheatley.cs.up.ac.za/u22599012/COS221/api.php';
    var username = "u22599012";
    var pass = "Deanramsay2003!"
    
    xmlObject.open('POST', url, true);
    xmlObject.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + pass));
    xmlObject.setRequestHeader("Content-Type", "application/json");
    xmlObject.onreadystatechange = function(){
        if(xmlObject.readyState === 4 && xmlObject.status === 200){
            let response = JSON.parse(xmlObject.responseText);
            if(response.status === "success"){
                let data = response.data;
                for(let i = 1; i<data.length;i++){
                    if(i == titleID){ 
                        let index = data[i-2];
                        populateMovies(index);
                    }
                }
            } else{
                console.error(response.message);    
            }
        }
    }

    let reqData = {
        type: "GetMovies"
    };

    xmlObject.send(JSON.stringify(reqData));

}

async function loadSeries2(titleID) {

   let xmlObject = new XMLHttpRequest();
    let url = 'https://wheatley.cs.up.ac.za/u22599012/COS221/api.php';
    var username = "u22599012";
    var pass = "Deanramsay2003!"
    
    xmlObject.open('POST', url, true);
    xmlObject.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + pass));
    xmlObject.setRequestHeader("Content-Type", "application/json");
    xmlObject.onreadystatechange = function(){
        if(xmlObject.readyState === 4 && xmlObject.status === 200){
            let response = JSON.parse(xmlObject.responseText);
            if(response.status === "success"){
                let data = response.data;
                for(let i = 1; i<data.length;i++){
                    if(i == titleID){
                        let index = data[i];
                        populateSeries(index);
                    }
                }
            } else{
                console.error(response.message);    
            }
        }
    }

    let reqData = {
        type: "GetSeries"
    };

    xmlObject.send(JSON.stringify(reqData));

}

function populateMovies(listData){
    
    let listingContainer = document.querySelector('.details_container');
    let listElement = document.createElement('div');
    listElement.classList.add('movie.type');
    
    listElement.innerHTML = `
        <div class="cover">
        <img src="${listData.image}">
         </div>
         <div class="info">
             <h1 class="title">${listData.title_name}</h1>
             <p class="description">${listData.description}</p>
             <p class="genre"><strong>Genre:</strong> ${listData.genre}</p>
             <p class="rating"><strong>Rating:</strong> ${listData.rating}</p>
             <p class="rating"><strong>PG-Rating:</strong> ${listData.pg_rating}</p>
             <!-- Add other details here -->
         </div>
    `;

    listingContainer.appendChild(listElement);
}

function populateSeries(listData){
    let listingContainer = document.querySelector('.details_container');
    let listElement = document.createElement('div');
    listElement.classList.add('series.type');
    listElement.innerHTML = `
    <div class="cover">
    <img src="${listData.image}">
         </div>
         <div class="info">
             <h1 class="title">${listData.title_name}</h1>
             <p class="description">${listData.description}</p>
             <p class="genre"><strong>Genre:</strong> ${listData.genre}</p>
             <p class="rating"><strong>Rating:</strong> ${listData.rating}</p>
             <p class="rating"><strong>PG-Rating:</strong> ${listData.pg_rating}</p>
             <!-- Add other details here -->
         </div>
    `;

    listingContainer.appendChild(listElement);
}