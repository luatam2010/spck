const userData = JSON.parse(localStorage.getItem("userData"));

if (!userData) {
  alert("Bạn chưa đăng nhập!");
  window.location.href = "main.html";
}

// Hiển thị dữ liệu
document.getElementById("p-fullname").innerText = userData.fullName;
document.getElementById("p-username").innerText = userData.username;
document.getElementById("p-email").innerText = userData.email;
document.getElementById("p-phone").innerText = userData.phone;

if (userData.avatar) {
  document.getElementById("profile-avatar").src = userData.avatar;
}

// ========================
function goHome() {
  window.location.href = "http://127.0.0.1:5502/main/main.html";
}

function logout() {
  localStorage.removeItem("isLoggedIn");
  window.location.href = "http://127.0.0.1:5502/main/main.html";
}
