<?php
session_start();
include 'db.php';

$user_id = $_SESSION['user_id'];

$result = $conn->query("SELECT * FROM passwords WHERE user_id = $user_id");

while ($row = $result->fetch_assoc()) {
    $decrypted = openssl_decrypt($row['encrypted_password'], "AES-128-CTR", "my_secret_key", 0, "1234567891011121");
    echo "<div>
        <strong>{$row['website']}</strong><br>
        Username: {$row['login_username']}<br>
        Password: $decrypted<br>
        <form action='delete_password.php' method='POST'>
            <input type='hidden' name='id' value='{$row['id']}'>
            <button type='submit'>Delete</button>
        </form>
    </div><hr>";
}
?>
