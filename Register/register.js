const registerForm = document.getElementById("register-form");

registerForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Ngăn reload trang

    // ========================
    // LẤY DỮ LIỆU
    // ========================
    const fullName = registerForm.fullName.value.trim();
    const username = registerForm.username.value.trim();
    const email = registerForm.email.value.trim();
    const phone = registerForm.phoneNumber.value.trim();
    const password = registerForm.password.value;
    const confirmPassword = registerForm.confirmPassword.value;

    // ========================
    // KIỂM TRA RỖNG
    // ========================
    if (
        !fullName ||
        !username ||
        !email ||
        !phone ||
        !password ||
        !confirmPassword
    ) {
        alert("❌ Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    // KIỂM TRA EMAIL
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
        alert("❌ Email phải có định dạng @gmail.com");
        return;
    }

    // KIỂM TRA MẬT KHẨU MẠNH
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
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

    // ========================
    // KIỂM TRA CONFIRM PASSWORD
    // ========================
    if (password !== confirmPassword) {
        alert("❌ Mật khẩu xác nhận không khớp!");
        return;
    }

    // ========================
    // LƯU DỮ LIỆU
    // ========================
    const userData = {
        fullName,
        username,
        email,
        phone,
        password,
        avatar: ""
    };

    localStorage.setItem("userData", JSON.stringify(userData));

    
    alert("✅ Đăng ký tài khoản thành công!");
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "Log in/login.html";
});

// ========================
// TỰ ĐỘNG ĐIỀN LẠI FORM
// ========================
window.onload = function () {
    const saved = localStorage.getItem("userData");
    if (!saved) return;

    const data = JSON.parse(saved);
    registerForm.fullName.value = data.fullName || "";
    registerForm.username.value = data.username || "";
    registerForm.email.value = data.email || "";
    registerForm.phoneNumber.value = data.phone || "";
    registerForm.password.value = data.password || "";
    registerForm.confirmPassword.value = data.password || "";

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