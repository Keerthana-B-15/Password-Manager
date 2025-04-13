<?php
session_start();
include 'db.php';

$username = $_POST['username'];
$password = $_POST['password'];

$stmt = $conn->prepare("SELECT id, password FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($id, $hashed_password);
$stmt->fetch();

if ($stmt->num_rows > 0 && password_verify($password, $hashed_password)) {
    $_SESSION['user_id'] = $id;
    header("Location: dashboard.php");
} else {
    echo "Invalid credentials!";
}
?>
