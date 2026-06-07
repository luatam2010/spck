const userData = JSON.parse(localStorage.getItem("userData"));

const userBox = document.getElementById("user-box");
const navUsername = document.getElementById("nav-username");
const loginNav = document.getElementById("login-nav");

const ADMIN_EMAIL = "nguyentructhanhm@gmail.com";

if (userData) {
  // HIỆN PROFILE
  if (userBox) {
    userBox.classList.remove("d-none");
  }

  // HIỆN TÊN
  if (navUsername) {
    navUsername.innerText =
      userData.username || userData.fullName || userData.email;
  }

  // ẨN LOGIN
  if (loginNav) {
    loginNav.classList.add("d-none");
  }

  // CHỈ ADMIN MỚI THẤY NÚT ADMIN
  if (userData.email && userData.email.toLowerCase() === ADMIN_EMAIL) {
    const navbar = document.querySelector(".navbar-nav");

    if (navbar) {
      const adminItem = document.createElement("li");

      adminItem.className = "nav-item";

      adminItem.innerHTML = `
        <a class="nav-link" href="/admin/admin.html">
          🔧 Admin
        </a>
      `;

      navbar.appendChild(adminItem);
    }
  }
}
