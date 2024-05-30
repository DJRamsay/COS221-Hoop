// javascript file for processing login of a user
// this function should keep the user's api key in local storage
// logging out , removes the users apikey from storage
document.getElementById("log").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission
    loginUser();
});

function loginUser() {
    // Get input values
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    
    // Construct post data
    var data = {
        "type": "Login",
        "email": email,
        "password": password
    };

    let xhr = new XMLHttpRequest();
    let url = 'https://wheatley.cs.up.ac.za/u22599012/COS221/api.php';
    var username = "u22599012";
    var pass = "Deanramsay2003!"
    
    xhr.open('POST', url, true);
    xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + pass));
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
                window.location.href = "myProfiles.html";
            
        } else {
            alert("Error: " + xhr.status);
        }
    };

    xhr.send(JSON.stringify(data));
}
