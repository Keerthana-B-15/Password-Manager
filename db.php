<?php
$host = 'localhost';
$user = 'root';
$password = 'root';
$database = 'password_manager';

$conn = new mysqli($host, $user, $password, $database);

if($conn -> connect_error){
    die("connection falied: ".$conn-> connect_error);
}
?>