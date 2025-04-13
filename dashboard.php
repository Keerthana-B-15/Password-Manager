<?php
session_start();
include 'db.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: index.html");
    exit();
}

$user_id = $_SESSION['user_id'];

// Get username
$stmt = $conn->prepare("SELECT username FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$username = $user['username'];
?>

<!DOCTYPE html>
<html>
<head>
    <title>Password Manager Dashboard</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <header>
            <h2>Welcome, <?php echo htmlspecialchars($username); ?></h2>
            <div class="header-actions">
                <a href="logout.php" class="logout-btn">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </a>
            </div>
        </header>

        <section class="add-password-section">
            <h3>Add New Password</h3>
            <form action="add_password.php" method="POST">
                <div class="form-group">
                    <label for="website">Website/Service</label>
                    <input type="text" id="website" name="website" placeholder="e.g., Google, Facebook, Twitter" required>
                </div>
                
                <div class="form-group">
                    <label for="login_username">Username/Email</label>
                    <input type="text" id="login_username" name="login_username" placeholder="Your login username or email" required>
                </div>
                
                <div class="form-group">
                    <label for="password-input">Password</label>
                    <div class="password-field">
                        <input type="password" id="password-input" name="password" placeholder="Your password" required>
                        <button type="button" class="password-toggle" title="Show password">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" id="generate-password">
                        <i class="fas fa-key"></i> Generate Strong Password
                    </button>
                    <button type="submit">
                        <i class="fas fa-plus-circle"></i> Add Password
                    </button>
                </div>
            </form>
        </section>

        <section class="password-section">
            <h3>Your Saved Passwords</h3>
            
            <div class="search-container">
                <input type="text" id="password-search" placeholder="Search websites or usernames...">
                <i class="fas fa-search search-icon"></i>
            </div>
            
            <div class="password-list">
                <?php
                $query = $conn->prepare("SELECT * FROM passwords WHERE user_id = ? ORDER BY website ASC");
                $query->bind_param("i", $user_id);
                $query->execute();
                $result = $query->get_result();

                if ($result->num_rows === 0) {
                    echo "<p class='no-passwords'>You haven't saved any passwords yet. Add your first password above.</p>";
                }

                while ($row = $result->fetch_assoc()) {
                    $decrypted_password = openssl_decrypt(
                        $row['encrypted_password'],
                        "AES-128-CTR",
                        "my_secret_key",
                        0,
                        "1234567891011121"
                    );

                    $masked_password = str_repeat('•', strlen($decrypted_password));
                    
                    echo "<div class='password-item'>
                        <div class='password-details'>
                            <p><strong>Website:</strong> <span class='website-value'>{$row['website']}</span></p>
                            <p><strong>Username:</strong> <span class='username-value'>{$row['login_username']}</span></p>
                            <p>
                                <strong>Password:</strong> 
                                <div class='password-value'>
                                    <span class='password-text hidden-password' data-password='" . htmlspecialchars($decrypted_password) . "'>{$masked_password}</span>
                                    <button type='button' class='saved-password-toggle' title='Show password'>
                                        <i class='fas fa-eye'></i>
                                    </button>
                                    <button type='button' class='copy-password' title='Copy to clipboard'>
                                        <i class='fas fa-copy'></i>
                                    </button>
                                </div>
                            </p>
                        </div>
                        <div class='password-actions'>
                            <form action='delete_password.php' method='POST' class='delete-form'>
                                <input type='hidden' name='id' value='{$row['id']}'>
                                <button type='submit' class='delete-btn'>
                                    <i class='fas fa-trash-alt'></i> Delete
                                </button>
                            </form>
                        </div>
                    </div>";
                }
                ?>
            </div>
        </section>
    </div>

    <script src="script.js"></script>
</body>
</html>