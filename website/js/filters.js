// This file will contain evrything that has to do with filtering the movies/series pages
// This includes the search bar, and the drop down menu options

// search bar functionality
// has a submit button, that will be used to detect any changes
document.addEventListener("DOMContentLoaded", function() {
    showListings();
    document.getElementById("search").addEventListener("click", function(event) {
        event.preventDefault(); 
        searchBar();
    });
});
function searchBar(){
    // link : https://api.tvmaze.com/search/shows?q=girls
    
}

function searchBar() {
    document.querySelector(".house").innerHTML = "";
    var searchInput = document.getElementById("searchbar").value.toLowerCase();

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://wheatley.cs.up.ac.za/api/", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    
    
    var loadingScreen = document.getElementById("loadingPage");
    
    xhr.onprogress = function(){
        loadingScreen.style.display = "block";
    }
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            loadingScreen.style.display = "none";
           
            var response = JSON.parse(xhr.responseText);
            if (response.status === "success") {
                var output = "";
                var n = 0;
                for (var i = 0; i < response.data.length; i++) {
                    if (searchInput === response.data[i].location.toLowerCase()) {
                        n++;
                    }
                }
                if (n <= 0) {
                    alert("Please enter a valid location");
                    output += "<div class='house'>" +
                        "<p> No properties found for location " + searchInput + "</p>" +
                        "</div>";
                    document.querySelector(".house").innerHTML += output;
                } else {
                    for (var i = 0; i < response.data.length; i++) {
                        if (searchInput === response.data[i].location.toLowerCase()) {
                            output += "<div class='house'>" +
                                "<div class='house_image'>" +
                                "<a href='view.html'>" +
                                "<img src='" + fetchImageUrl()[i] + "' alt='loading'></img>" +
                                "</a>" +
                                "<i class='fa-regular fa-heart'></i>" +
                                "</div>" +
                                "<div class='house_info'>" +
                                "<h3>" + response.data[i].title + "</h3>" +
                                "<p>" + response.data[i].location + "</p>" +
                                "<p>" + response.data[i].bathrooms + "<i class='fa-solid fa-bed'></i> |" + response.data[i].bedrooms + "<i class='fa-solid fa-bath'></i> |" + response.data[i].parking_spaces + "<i class='fa-solid fa-car'></i></p>" +
                                "<div class='price'>" +
                                "<h4>" + "R " + response.data[i].price + "</h4>" +
                                "</div>" +
                                "</div>" +
                                "</div>";
                        }
                    }
                    document.querySelector(".house").innerHTML += output;
                }
            }else{
                console.error("Request error");
            }
        }
        else if (xhr.status == 404){
            console.error("Request error");
        }
    };

    xhr.onerror = function() {
        console.error("Request error");
    };

    var postBody = {
        "studentnum": "u21532941",
        "type": "GetAllListings",
        "limit": 20,
        "apikey": "fe1569f7b7e5414a6895e1c7f5c77c53",
        "search": {
            "location": searchInput,
        },
        "return": "*"
    };

    xhr.send(JSON.stringify(postBody));
}
