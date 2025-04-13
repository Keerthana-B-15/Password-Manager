<?php
session_start();
include 'db.php';

$user_id = $_SESSION['user_id'];
$website = $_POST['website'];
$login_username = $_POST['login_username'];
$password = $_POST['password'];

$encrypted_password = openssl_encrypt(
    $password,
    "AES-128-CTR",
    "my_secret_key",
    0,
    "1234567891011121"
);

$stmt = $conn->prepare("INSERT INTO passwords (user_id, website, login_username, encrypted_password) VALUES (?, ?, ?, ?)");
$stmt->bind_param("isss", $user_id, $website, $login_username, $encrypted_password);
$stmt->execute();

header("Location: dashboard.php");
?>
