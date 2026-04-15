import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

import {
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

import { auth, db } from "../firebase.js";

// DOM loaded
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const passwordInput = document.getElementById("password");
  const eye = document.getElementById("eye");

  // SHOW / HIDE PASSWORD
  eye.addEventListener("click", () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      eye.textContent = "🍔";
    } else {
      passwordInput.type = "password";
      eye.textContent = "🚫";
    }
  });

  // LOGIN
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const identifier = form.identifier.value.trim();
    const password = form.password.value;

    let email = identifier;

    try {
      // NẾU NHẬP USERNAME THÌ TÌM EMAIL
      if (!identifier.includes("@")) {
        const q = query(
          collection(db, "users"),
          where("username", "==", identifier),
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          alert("Username không tồn tại!");
          return;
        }

        email = querySnapshot.docs[0].data().email;
      }

      // LOGIN FIREBASE
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      // CHECK VERIFY EMAIL
      if (!user.emailVerified) {
        alert("Vui lòng xác thực email trước khi đăng nhập!");
        return;
      }

      alert("Đăng nhập thành công!");
      form.reset();

      // CHUYỂN VỀ TRANG CHỦ
      window.location.href = "../index.html";
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);

      let message = "Đăng nhập thất bại!";

      if (error.code === "auth/invalid-credential") {
        message = "Sai tài khoản hoặc mật khẩu.";
      } else if (error.code === "auth/user-not-found") {
        message = "Tài khoản không tồn tại.";
      } else if (error.code === "auth/wrong-password") {
        message = "Mật khẩu không đúng.";
      } else if (error.code === "auth/invalid-email") {
        message = "Email không hợp lệ.";
      }

      alert(message);
    }
  });
});
