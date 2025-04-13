document.addEventListener('DOMContentLoaded', function() {
    // Toggle password visibility in input fields
    const passwordToggles = document.querySelectorAll('.password-toggle');
    
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const passwordField = this.previousElementSibling;
            const type = passwordField.getAttribute('type');
            
            if (type === 'password') {
                passwordField.setAttribute('type', 'text');
                this.innerHTML = '<i class="fas fa-eye-slash"></i>';
                this.setAttribute('title', 'Hide password');
            } else {
                passwordField.setAttribute('type', 'password');
                this.innerHTML = '<i class="fas fa-eye"></i>';
                this.setAttribute('title', 'Show password');
            }
        });
    });
    
    // Toggle saved password visibility
    const savedPasswordToggles = document.querySelectorAll('.saved-password-toggle');
    
    savedPasswordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const passwordText = this.previousElementSibling;
            
            if (passwordText.classList.contains('hidden-password')) {
                // Show password
                passwordText.textContent = passwordText.getAttribute('data-password');
                passwordText.classList.remove('hidden-password');
                this.innerHTML = '<i class="fas fa-eye-slash"></i>';
                this.setAttribute('title', 'Hide password');
            } else {
                // Hide password
                const password = passwordText.getAttribute('data-password');
                passwordText.textContent = '•'.repeat(password.length);
                passwordText.classList.add('hidden-password');
                this.innerHTML = '<i class="fas fa-eye"></i>';
                this.setAttribute('title', 'Show password');
            }
        });
    });
    
    // Confirm deletion 
    const deleteForms = document.querySelectorAll('.delete-form');
    
    deleteForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!confirm('Are you sure you want to delete this password?')) {
                e.preventDefault();
            }
        });
    });
    
    // Search functionality
    const searchInput = document.getElementById('password-search');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const passwordItems = document.querySelectorAll('.password-item');
            
            passwordItems.forEach(item => {
                const website = item.querySelector('.website-value').textContent.toLowerCase();
                const username = item.querySelector('.username-value').textContent.toLowerCase();
                
                if (website.includes(searchTerm) || username.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    // Copy password to clipboard
    const copyButtons = document.querySelectorAll('.copy-password');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordText = this.previousElementSibling.previousElementSibling;
            const password = passwordText.getAttribute('data-password');
            
            navigator.clipboard.writeText(password).then(() => {
                // Show feedback
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i>';
                this.disabled = true;
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.disabled = false;
                }, 1500);
            }).catch(err => {
                console.error('Could not copy password: ', err);
            });
        });
    });
    
    // Advanced Password Validation
    const passwordInput = document.getElementById('register-password') || document.getElementById('password-input');
    const strengthMeter = document.getElementById('password-strength');
    const registerForm = document.querySelector('form[action="register.php"]');
    const addPasswordForm = document.querySelector('form[action="add_password.php"]');
    
    // Password strength validation function
    function validatePassword(password) {
        // Initialize strength score and feedback
        let strength = 0;
        let feedback = [];
        
        // Check password length (8-64 characters)
        if (password.length >= 8) {
            strength += 1;
        } else {
            feedback.push("At least 8 characters");
        }
        
        if (password.length > 12) {
            strength += 1;
        }
        
        // Check for uppercase letters
        if (password.match(/[A-Z]/)) {
            strength += 1;
        } else {
            feedback.push("At least one uppercase letter");
        }
        
        // Check for lowercase letters
        if (password.match(/[a-z]/)) {
            strength += 1;
        } else {
            feedback.push("At least one lowercase letter");
        }
        
        // Check for numbers
        if (password.match(/\d/)) {
            strength += 1;
        } else {
            feedback.push("At least one number");
        }
        
        // Check for special characters
        if (password.match(/[^a-zA-Z0-9]/)) {
            strength += 1;
        } else {
            feedback.push("At least one special character");
        }
        
        // Check for repeated characters
        if (password.match(/(.)\1{2,}/)) {
            strength -= 1;
            feedback.push("Avoid repeated characters");
        }
        
        // Check for sequential characters
        if (password.match(/abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789/i)) {
            strength -= 1;
            feedback.push("Avoid sequential characters");
        }
        
        // Check for common words/patterns
        const commonPatterns = ['password', 'qwerty', 'admin', '12345', 'welcome', 'letmein'];
        for (const pattern of commonPatterns) {
            if (password.toLowerCase().includes(pattern)) {
                strength -= 2;
                feedback.push("Avoid common passwords");
                break;
            }
        }
        
        // Ensure strength is within bounds
        strength = Math.max(0, Math.min(strength, 5));
        
        return {
            score: strength,
            feedback: feedback
        };
    }
    
    // Update strength meter if it exists
    if (passwordInput && strengthMeter) {
        // Create feedback element if it doesn't exist
        let feedbackElement = document.getElementById('password-feedback');
        if (!feedbackElement) {
            feedbackElement = document.createElement('ul');
            feedbackElement.id = 'password-feedback';
            feedbackElement.className = 'password-feedback';
            strengthMeter.parentNode.insertBefore(feedbackElement, strengthMeter.nextSibling);
        }
        
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const result = validatePassword(password);
            
            // Update strength meter
            strengthMeter.className = '';
            feedbackElement.innerHTML = '';
            
            if (password.length === 0) {
                strengthMeter.className = 'strength-none';
                strengthMeter.textContent = '';
                return;
            }
            
            // Set appropriate strength class and text
            let strengthText = '';
            let strengthClass = '';
            
            switch (result.score) {
                case 0:
                case 1:
                    strengthClass = 'strength-weak';
                    strengthText = 'Weak';
                    break;
                case 2:
                    strengthClass = 'strength-medium';
                    strengthText = 'Medium';
                    break;
                case 3:
                case 4:
                    strengthClass = 'strength-good';
                    strengthText = 'Good';
                    break;
                case 5:
                    strengthClass = 'strength-strong';
                    strengthText = 'Strong';
                    break;
            }
            
            strengthMeter.className = strengthClass;
            strengthMeter.textContent = strengthText;
            
            // Display feedback
            if (result.feedback.length > 0 && password.length > 0) {
                result.feedback.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    feedbackElement.appendChild(li);
                });
            }
        });
    }
    
    // Form validation
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            const password = document.getElementById('register-password').value;
            const result = validatePassword(password);
            
            if (result.score < 3) {
                e.preventDefault();
                alert('Please create a stronger password. Follow the suggestions provided.');
            }
        });
    }
    
    if (addPasswordForm) {
        addPasswordForm.addEventListener('submit', function(e) {
            const password = document.getElementById('password-input').value;
            const result = validatePassword(password);
            
            if (result.score < 3) {
                const confirm = window.confirm('The password you entered is weak. Are you sure you want to save it?');
                if (!confirm) {
                    e.preventDefault();
                }
            }
        });
    }
    
    // Generate secure password with options
    const generateBtn = document.getElementById('generate-password');
    
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            const passwordField = document.getElementById('password-input') || document.getElementById('register-password');
            
            // Show password generator options modal
            showPasswordGeneratorModal(passwordField);
        });
    }
    
    // Create modal for password generator
    function showPasswordGeneratorModal(targetField) {
        // Create modal container if it doesn't exist
        let modal = document.getElementById('password-generator-modal');
        
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'password-generator-modal';
            modal.className = 'modal';
            
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h3>Generate Secure Password</h3>
                    
                    <div class="generator-options">
                        <div class="form-group">
                            <label>Password Length: <span id="length-value">16</span></label>
                            <input type="range" id="password-length" min="8" max="32" value="16">
                        </div>
                        
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="include-uppercase" checked>
                                Include Uppercase Letters
                            </label>
                        </div>
                        
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="include-lowercase" checked>
                                Include Lowercase Letters
                            </label>
                        </div>
                        
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="include-numbers" checked>
                                Include Numbers
                            </label>
                        </div>
                        
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="include-symbols" checked>
                                Include Special Characters
                            </label>
                        </div>
                    </div>
                    
                    <div class="generator-preview">
                        <input type="text" id="generated-password" readonly>
                        <button type="button" id="refresh-password" title="Generate New Password">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                    </div>
                    
                    <div class="generator-actions">
                        <button type="button" id="use-password">Use This Password</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Style the modal
            const style = document.createElement('style');
            style.textContent = `
                .modal {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    z-index: 1000;
                    justify-content: center;
                    align-items: center;
                }
                
                .modal-content {
                    background-color: white;
                    padding: 25px;
                    border-radius: 8px;
                    max-width: 500px;
                    width: 90%;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                    position: relative;
                }
                
                .close-modal {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    font-size: 24px;
                    cursor: pointer;
                    color: #888;
                    transition: color 0.3s;
                }
                
                .close-modal:hover {
                    color: #333;
                }
                
                .generator-options {
                    margin: 20px 0;
                }
                
                .checkbox-label {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    margin-bottom: 10px;
                }
                
                .checkbox-label input {
                    margin-right: 10px;
                    width: auto;
                }
                
                .generator-preview {
                    display: flex;
                    margin: 20px 0;
                }
                
                .generator-preview input {
                    flex-grow: 1;
                    margin-right: 10px;
                    font-family: monospace;
                    font-size: 16px;
                    letter-spacing: 1px;
                }
                
                .generator-preview button {
                    width: 40px;
                    height: 40px;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .generator-actions {
                    display: flex;
                    justify-content: flex-end;
                }
            `;
            
            document.head.appendChild(style);
            
            // Event listeners for modal
            const closeModal = modal.querySelector('.close-modal');
            closeModal.addEventListener('click', function() {
                modal.style.display = 'none';
            });
            
            // Generate password when options change
            const lengthSlider = modal.querySelector('#password-length');
            const lengthValue = modal.querySelector('#length-value');
            const uppercaseCheck = modal.querySelector('#include-uppercase');
            const lowercaseCheck = modal.querySelector('#include-lowercase');
            const numbersCheck = modal.querySelector('#include-numbers');
            const symbolsCheck = modal.querySelector('#include-symbols');
            const generatedPasswordInput = modal.querySelector('#generated-password');
            const refreshBtn = modal.querySelector('#refresh-password');
            
            // Update length display
            lengthSlider.addEventListener('input', function() {
                lengthValue.textContent = this.value;
                generateRandomPassword();
            });
            
            // Update when checkboxes change
            [uppercaseCheck, lowercaseCheck, numbersCheck, symbolsCheck].forEach(checkbox => {
                checkbox.addEventListener('change', generateRandomPassword);
            });
            
            // Refresh button
            refreshBtn.addEventListener('click', generateRandomPassword);
            
            // Use password button
            const usePasswordBtn = modal.querySelector('#use-password');
            usePasswordBtn.addEventListener('click', function() {
                targetField.value = generatedPasswordInput.value;
                modal.style.display = 'none';
                
                // Trigger password strength calculation
                const event = new Event('input');
                targetField.dispatchEvent(event);
            });
            
            // Function to generate password based on options
            function generateRandomPassword() {
                let charset = '';
                const length = lengthSlider.value;
                
                // Build character set based on options
                if (uppercaseCheck.checked) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                if (lowercaseCheck.checked) charset += 'abcdefghijklmnopqrstuvwxyz';
                if (numbersCheck.checked) charset += '0123456789';
                if (symbolsCheck.checked) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
                
                // Ensure at least one set is selected
                if (charset === '') {
                    charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
                    [uppercaseCheck, lowercaseCheck, numbersCheck, symbolsCheck].forEach(checkbox => {
                        checkbox.checked = true;
                    });
                }
                
                // Generate password
                let password = '';
                
                // Ensure each selected character type is included
                if (uppercaseCheck.checked) {
                    const randomIndex = Math.floor(Math.random() * 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.length);
                    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[randomIndex];
                }
                
                if (lowercaseCheck.checked) {
                    const randomIndex = Math.floor(Math.random() * 'abcdefghijklmnopqrstuvwxyz'.length);
                    password += 'abcdefghijklmnopqrstuvwxyz'[randomIndex];
                }
                
                if (numbersCheck.checked) {
                    const randomIndex = Math.floor(Math.random() * '0123456789'.length);
                    password += '0123456789'[randomIndex];
                }
                
                if (symbolsCheck.checked) {
                    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
                    const randomIndex = Math.floor(Math.random() * symbols.length);
                    password += symbols[randomIndex];
                }
                
                // Fill the rest with random characters
                for (let i = password.length; i < length; i++) {
                    const randomIndex = Math.floor(Math.random() * charset.length);
                    password += charset[randomIndex];
                }
                
                // Shuffle the password
                password = password.split('').sort(() => 0.5 - Math.random()).join('');
                
                generatedPasswordInput.value = password;
            }
            
            // Generate initial password
            generateRandomPassword();
        }
        
        // Show the modal
        modal.style.display = 'flex';
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('password-generator-modal');
        if (modal && event.target === modal) {
            modal.style.display = 'none';
        }
    });
});