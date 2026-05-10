import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

import { auth, db } from "./firebase.js";

const provider = new GoogleAuthProvider();

// DOM loaded
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");
  const passwordInput = document.getElementById("password");
  const eye = document.getElementById("eye");

  const googleRegisterBtn = document.getElementById("google-register");

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

  // GOOGLE REGISTER
  googleRegisterBtn.addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      // CHECK USER EXISTS
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          fullName: user.displayName || "",
          username: user.displayName || "",
          email: user.email || "",
          phoneNumber: "",
          createdAt: serverTimestamp(),
        });
      }

      alert("Đăng ký Google thành công!");

      window.location.href = "Log in/login.html";
    } catch (error) {
      console.error(error);
      alert("Đăng ký Google thất bại!");
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

    // CHECK EMPTY EMAIL
    if (!email) {
      alert("Email không được để trống!");
      return;
    }

    // CHECK EMAIL FORMAT
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      alert("Email không đúng định dạng!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      alert("Mật khẩu phải có ít nhất 1 chữ hoa!");
      return;
    }

    if (!/[a-z]/.test(password)) {
      alert("Mật khẩu phải có ít nhất 1 chữ thường!");
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      alert("Mật khẩu phải có ít nhất 1 ký tự đặc biệt!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      await updateProfile(user, {
        displayName: username,
      });

      await setDoc(doc(db, "users", user.uid), {
        fullName,
        username,
        email,
        phoneNumber,
        createdAt: serverTimestamp(),
      });

      await sendEmailVerification(user);

      alert("Đăng ký thành công! Vui lòng kiểm tra email.");

      form.reset();

      window.location.href = "Log in/login.html";
    } catch (error) {
      console.error(error);

      let message = "Đăng ký thất bại!";

      if (error.code === "auth/email-already-in-use") {
        message = "Email đã được sử dụng.";
      } else if (error.code === "auth/invalid-email") {
        message = "Email không hợp lệ.";
      } else if (error.code === "auth/weak-password") {
        message = "Mật khẩu phải từ 6 ký tự trở lên.";
      }

      alert(message);
    }
  });
});
