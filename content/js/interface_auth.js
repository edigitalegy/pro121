/****************************************************************************************************************/

function showSignUp() {
  document.getElementById("form-title").innerText = "إنشاء حساب جديد"; // Change title
  document.getElementById("input-fields").classList.remove("d-none"); // Show input fields
  document.getElementById("login-fields").classList.remove("d-none"); // Show login fields

  toggleButtons("signup"); // Show only create-btn and back-btn
}

function showLogin() {
  document.getElementById("form-title").innerText = "تسجيل الدخول"; // Change title
  document.getElementById("input-fields").classList.add("d-none"); // Hide name field
  document.getElementById("login-fields").classList.remove("d-none"); // Show login fields

  toggleButtons("login"); // Show only enter-btn and back-btn
}

function goBack() {
  document.getElementById("form-title").innerText = "يمكنك تسجيل دخولك أو إنشاء حساب جديد أو الدخول بالإيميل (Gmail)"; // Reset title
  document.getElementById("input-fields").classList.add("d-none"); // Hide input fields
  document.getElementById("login-fields").classList.add("d-none"); // Hide login fields
  toggleButtons("main"); // Show sign-up, login, and Google sign-in buttons again
}

function toggleButtons(mode) {
  // Hide all buttons first
  document.getElementById("signup-btn").classList.add("d-none");
  document.getElementById("login-btn").classList.add("d-none");
  document.getElementById("google-btn").classList.add("d-none");
  document.getElementById("create-btn").classList.add("d-none");
  document.getElementById("enter-btn").classList.add("d-none");
  document.getElementById("back-btn").classList.add("d-none");

  // Show buttons based on mode
  if (mode === "signup") {
      document.getElementById("create-btn").classList.remove("d-none");
      document.getElementById("back-btn").classList.remove("d-none");
  } else if (mode === "login") {
      document.getElementById("enter-btn").classList.remove("d-none");
      document.getElementById("back-btn").classList.remove("d-none");
  } else {
      document.getElementById("signup-btn").classList.remove("d-none");
      document.getElementById("login-btn").classList.remove("d-none");
      document.getElementById("google-btn").classList.remove("d-none");
  }
}
