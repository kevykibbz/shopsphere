document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector(".signin-form"); 
  const emailInput = document.querySelector(".signin-email");
  const emailError = document.querySelector(".signin-email-error"); 
  const passwordInput = document.querySelector(".signin-password");
  const passwordError = document.querySelector(".signin-password-error"); 
  const submitButton = loginForm.querySelector("button[type='submit']");
  const buttonText = submitButton.innerHTML; 

  // Disable the button initially
  submitButton.disabled = true;
  submitButton.style.pointerEvents = "not-allowed";

  // Function to validate form
  function validateForm() {
    const emailValid = validateEmail(emailInput.value);
    const passwordValid = passwordInput.value.trim().length >= 6;

    // Show email error if invalid
    emailError.innerHTML =
      !emailValid && emailInput.value.trim() !== ""
        ? "⚠️ Invalid email format"
        : "";

    // Show password error if too short
    passwordError.innerHTML =
      !passwordValid && passwordInput.value.trim() !== ""
        ? "⚠️ Password must be at least 6 characters"
        : "";

    // Enable/disable submit button
    submitButton.disabled = !(emailValid && passwordValid);
    submitButton.style.pointerEvents = submitButton.disabled
      ? "not-allowed"
      : "auto";
  }

  // Email validation function
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Listen for input changes to enable/disable button
  emailInput.addEventListener("input", validateForm);
  passwordInput.addEventListener("input", validateForm);

  // Handle form submission
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Validate before sending request
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
      submitButton.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Logging in...`;

      const BASE_URL = `${window.location.origin}/api/users/login`;

      // Send POST request to API
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      // Success Notification
      showToast("Login successful! 🎉 Redirecting...", "success");

      // Redirect user after success
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      // Restore button state
      submitButton.innerHTML = buttonText;
      submitButton.disabled = false;
      submitButton.style.pointerEvents = "auto";
    }
  });
});
