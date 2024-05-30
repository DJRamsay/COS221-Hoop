document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("addCreditBTN").addEventListener("click", function(event) {
        event.preventDefault(); 
        addCredit();
    });
    document.getElementById("tcAdd").addEventListener("click", function(event) {
        event.preventDefault(); 
        addTitleCredit();
    });
    document.getElementById("tcUpdate").addEventListener("click", function(event) {
        event.preventDefault(); 
        updateTitleCredit();
    });
});

function addCredit() {
    var creditName = document.getElementById("creditName").value.toLowerCase();
    var postData = { 
        "type" : "addCredit",
        "name": creditName 
    };

    // Basic Auth credentials
    let xhr = new XMLHttpRequest();
    let url = 'https://wheatley.cs.up.ac.za/u22599012/COS221/api.php';
    var username = "u22599012";
    var pass = "Deanramsay2003!"
    
    xhr.open('POST', url, true);
    xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + pass));
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

    xhr.send(JSON.stringify(postData));
}

function addTitleCredit() {
    var titleId = document.getElementById("titleId").value;
    var creditId = document.getElementById("creditId").value;
    var role = document.getElementById("role").value;
    var creditType = document.getElementById("ttype").value;

    var postData = {
        "type" : "AddTitleCredit",
        "title_id": titleId,
        "credit_id": creditId,
        "role": role,
        "credit_type": creditType
    };

    // Basic Auth credentials
    let xhr = new XMLHttpRequest();
    let url = 'https://wheatley.cs.up.ac.za/u22599012/COS221/api.php';
    var username = "u22599012";
    var pass = "Deanramsay2003!"
    
    xhr.open('POST', url, true);
    xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + pass));
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

    xhr.send(JSON.stringify(postData));
}

function updateTitleCredit() {
    var titleCreditId = document.getElementById("titleCreditId").value;
    var titleId = document.getElementById("titleId").value;
    var creditId = document.getElementById("creditId").value;
    var role = document.getElementById("role").value;
    var creditType = document.getElementById("ttype").value;

    var postData = {
        "type" : "UpdateTitleCredit",
        "title_credit_id": titleCreditId,
        "title_id": titleId,
        "credit_id": creditId,
        "role": role,
        "credit_type": creditType
    };

    // Basic Auth credentials
    let xhr = new XMLHttpRequest();
    let url = 'https://wheatley.cs.up.ac.za/u22599012/COS221/api.php';
    var username = "u22599012";
    var pass = "Deanramsay2003!"
    
    xhr.open('POST', url, true);
    xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + pass));
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

    xhr.send(JSON.stringify(postData));
}
