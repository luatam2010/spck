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
// UPLOAD AVATAR
// ========================
function changeAvatar(input) {
  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = function () {
    userData.avatar = reader.result;
    localStorage.setItem("userData", JSON.stringify(userData));
    document.getElementById("profile-avatar").src = reader.result;
  };

  reader.readAsDataURL(file);
}

// ========================
function goHome() {
  window.location.href = "http://127.0.0.1:5502/main/main.html";
}

function logout() {
  localStorage.removeItem("isLoggedIn");
  window.location.href = "http://127.0.0.1:5502/main/main.html";
}
