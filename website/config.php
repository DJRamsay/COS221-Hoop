<?php
$host = "wheatley.cs.up.ac.za";
$username = "u22599012";
$password = "CQCQ6TZ3NAKTUV2KKCZLF7XTAMQ4ONZU";
$database = "u22599012_hoop";

$mysqli = new mysqli($host, $username, $password, $database);

if ($mysqli->connect_error) {
    die("Connection failure: " . $mysqli->connect_error);
} else {
}
?>
