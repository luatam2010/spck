const userData = JSON.parse(localStorage.getItem("userData"));

const userBox = document.getElementById("user-box");
const navUsername = document.getElementById("nav-username");

const loginNav = document.getElementById("login-nav");

if (userData) {
  // HIỆN PROFILE
  userBox.classList.remove("d-none");

  navUsername.innerText =
    userData.username || userData.fullName || userData.email;

  // ẨN LOGIN
  if (loginNav) {
    loginNav.classList.add("d-none");
  }

  // TẠO ADMIN BUTTON
  const navbar = document.querySelector(".navbar-nav");

  const adminItem = document.createElement("li");

  adminItem.className = "nav-item";

  adminItem.innerHTML = `
    <a class="nav-link" href="/admin/admin.html">
      Admin
    </a>
  `;

  navbar.appendChild(adminItem);
}
