const userData = JSON.parse(localStorage.getItem("userData"));
const isLoggedIn = localStorage.getItem("isLoggedIn");

const userBox = document.getElementById("user-box");
const logoutBox = document.getElementById("logout-box");
const navUsername = document.getElementById("nav-username");

if (isLoggedIn && userData) {
  userBox.classList.remove("d-none");
  logoutBox.classList.remove("d-none");

  navUsername.innerText = userData.username || userData.email;
}