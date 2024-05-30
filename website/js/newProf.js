document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("newProfBTN").addEventListener("click", function(event) {
        event.preventDefault(); // Prevent default form submission
        handleSubmit('Register Profile');
    });
    
});

function handleSubmit(action) {
    const form = document.getElementById("newProf");
    const formData = new FormData(form);

    let data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Basic Auth credentials
    const username = "u22599012";
    const password = "Deanramsay2003!";
    const basicAuth = 'Basic ' + btoa(username + ':' + password);

    const xhr = new XMLHttpRequest();
    const url = 'https://wheatley.cs.up.ac.za/u22599012/COS221/api.php';
    
    xhr.open('POST', url, true);
    xhr.setRequestHeader("Authorization", basicAuth);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const response = JSON.parse(xhr.responseText);
                alert(response.message);
            } else {
                alert("Error: " + xhr.status);
            }
        }
    };

    data.type = action;

    xhr.send(JSON.stringify(data));
}
