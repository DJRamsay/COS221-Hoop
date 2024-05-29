// javascript file for processing login of a user
// this function should keep the user's api key in local storage
// logging out , removes the users apikey from storage
document.getElementById("log").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission
    
    // Get input values
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    
    // Construct post data
    var data = {
        "type": "Login",
        "email": email,
        "password": password
    };

    // Send AJAX request to our API
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://wheatley.cs.up.ac.za/u22599012/api.php");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.hasOwnProperty("message")) {
                // Redirect to myProfiles.html
                window.location.href = "myProfiles.html";
                document.getElementById("email").value = "";
                document.getElementById("password").value = "";
            } else {
                alert(response.error); // Display error message
            }
        } else {
            alert("Error: " + xhr.status);
        }
    };
    xhr.send(JSON.stringify(data));
});
