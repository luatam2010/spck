import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

import { auth, db } from "./firebase.js";

// DOM loaded
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");
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

  // REGISTER
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = form.fullName.value.trim();
    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const phoneNumber = form.phoneNumber.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    // CHECK PASSWORD MATCH
    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      // UPDATE PROFILE
      await updateProfile(user, {
        displayName: username,
      });

      // SAVE TO FIRESTORE
      await setDoc(doc(db, "users", user.uid), {
        fullName: fullName,
        username: username,
        email: email,
        phoneNumber: phoneNumber,
        createdAt: serverTimestamp(),
      });

      // SEND EMAIL VERIFY
      await sendEmailVerification(user);

      alert("Đăng ký thành công! Vui lòng kiểm tra email.");
      form.reset();

      window.location.href = "Log in/login.html";
    } catch (error) {
      console.error(error);

      let message = "Đăng ký thất bại!";

      if (error.code === "auth/email-already-in-use") {
        message = "Email đã được sử dụng.";
      } else if (error.code === "auth/weak-password") {
        message = "Mật khẩu phải từ 6 ký tự trở lên.";
      } else if (error.code === "auth/invalid-email") {
        message = "Email không hợp lệ.";
      }

      alert(message);
    }
  });
});
