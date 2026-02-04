const loginForm = document.getElementById("login-form");


loginForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Ngăn reload trang

    // Lấy dữ liệu từ form
    const username = loginForm.username.value.trim();
    const email = loginForm.email.value.trim();
    const pass = loginForm.password.value;

    // KIỂM TRA EMAIL
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
        alert("❌ Email sai định dạng (phải là @gmail.com)");
        return;
    }

    // KIỂM TRA MẬT KHẨU MẠNH
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(pass)) {
        alert(
            "❌ Mật khẩu chưa đủ mạnh!\n" +
            "- Ít nhất 8 ký tự\n" +
            "- Có chữ hoa\n" +
            "- Có chữ thường\n" +
            "- Có số\n" +
            "- Có ký tự đặc biệt"
        );
        return;
    }

    // NẾU HỢP LỆ
    const userData = {
        username,
        email,
        pass,
    };

    localStorage.setItem("userData", JSON.stringify(userData));
    localStorage.setItem("isLogin", "true");


    alert("✅ Đăng nhập tài khoản thành công!");
    window.location.href = "main/main.html";
});

window.onload = function () {
    const saved = localStorage.getItem("userData");
    if (!saved) return;

    const data = JSON.parse(saved);
    loginForm.username.value = data.username || "";
    loginForm.email.value = data.email || "";
    loginForm.password.value = data.pass || "";
};

function togglePassword() {
  const pw = document.getElementById("password");
  const eye = document.getElementById("eye");

  if (pw.type === "password") {
    pw.type = "text";
    eye.classList.remove("hide"); // hiện mật khẩu = không gạch
  } else {
    pw.type = "password";
    eye.classList.add("hide");    // che mật khẩu = gạch chéo
  }
}