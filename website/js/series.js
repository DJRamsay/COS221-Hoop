// javascript file for the home page
// this is responsible for populating the available series,movies and recommened titles

document.addEventListener("DOMContentLoaded", function() {
    loadSeries();
});

async function loadSeries() {
    const loadingScreen = document.getElementById("loadingPage");

    loadingScreen.style.display = "block";

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
                for(let i = 0; i<data.length;i++){
                    let index = data[i];
                    populateSeries(index);
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

    loadingScreen.style.display = "none";
}

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

function populateSeries(listData){
    let listingContainer = document.querySelector('.series_container');
    let listElement = document.createElement('div');
    listElement.classList.add('series.type');
    listElement.innerHTML = `
    <div class="card-container">
        <div class="card">
        <a href ="details.html?param1=1&param2=series"><img src="${listData.image}"></a>
            <h3>${listData.title_name}</h3>
            <h6>${listData.genre}</h6>
            <h6>${listData.release_date}</h6>
        </div>
    </div>
    `;

    listingContainer.appendChild(listElement);
}