<?php
session_start();
include 'db.php';

$id = $_POST['id'];
$user_id = $_SESSION['user_id'];

$stmt = $conn->prepare("DELETE FROM passwords WHERE id = ? AND user_id = ?");
$stmt->bind_param("ii", $id, $user_id);
$stmt->execute();

header("Location: dashboard.php");
?>
