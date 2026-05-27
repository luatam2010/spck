const userData = JSON.parse(localStorage.getItem("userData"));

if (!userData) {
  window.location.href = "/index.html";
}

document.getElementById("profile-name").innerText =
  userData.fullName || userData.username;

document.getElementById("profile-email").innerText = userData.email;

document.getElementById("profile-phone").innerText =
  userData.phoneNumber || "No Phone Number";

if (userData.photoURL) {
  document.getElementById("profile-avatar").src = userData.photoURL;
}

document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("userData");

  window.location.href = "/index.html";
});
