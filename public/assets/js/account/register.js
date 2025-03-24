document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.querySelector(".register-form");
    const emailInput = document.querySelector(".register-email");
    const emailInputError = document.querySelector(".register-email-error");
    const passwordInput = document.querySelector(".register-password");
    const passwordInputError = document.querySelector(".register-password-error");
    const policyCheckbox = document.querySelector("#register-policy");
    const submitButton = registerForm.querySelector("button[type='submit']");
    const buttonText = submitButton.innerHTML; // Store the original button text

    // Disable the button initially
    submitButton.disabled = true;

    // Function to validate the form and show errors
    function validateForm() {
        const emailValid = validateEmail(emailInput.value);
        const passwordValid = passwordInput.value.trim().length >= 6;
        const policyChecked = policyCheckbox.checked;

        // Show email error if invalid
        if (!emailValid && emailInput.value.trim() !== "") {
            emailInputError.innerHTML = `<span style="color: red;">⚠️ Invalid email format</span>`;
        } else {
            emailInputError.innerHTML = "";
        }

        // Show password error if too short
        if (!passwordValid && passwordInput.value.trim() !== "") {
            passwordInputError.innerHTML = `<span style="color: red;">⚠️ Password must be at least 6 characters</span>`;
        } else {
            passwordInputError.innerHTML = "";
        }

        // Enable/disable submit button
        submitButton.disabled = !(emailValid && passwordValid && policyChecked);
    }

    // Email validation function
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Listen for input changes to validate in real-time
    emailInput.addEventListener("input", validateForm);
    passwordInput.addEventListener("input", validateForm);
    policyCheckbox.addEventListener("change", validateForm);

    // Handle form submission
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Validate one last time before sending request
        if (!validateEmail(email)) {
            showToast("Invalid email format.", "error");
            return;
        }

        if (password.length < 6) {
            showToast("Password must be at least 6 characters.", "error");
            return;
        }

        try {
            // Show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Processing...`;
            const BASE_URL = `${window.location.origin}/api/users/register`;

            // Send POST request to API
            const response = await fetch(BASE_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed.");
            }

            // Success Notification
            showToast("Registration successful! 🎉", "success");

            // Reset Form
            registerForm.reset();
            validateForm(); // Disable button again after reset
        } catch (error) {
            showToast(error.message, "error");
        } finally {
            // Restore button state
            submitButton.innerHTML = buttonText;
            submitButton.disabled = false;
        }
    });
});