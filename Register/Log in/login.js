import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

import { auth, db } from "../firebase.js";

const provider = new GoogleAuthProvider();

// DOM loaded
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const passwordInput = document.getElementById("password");
  const eye = document.getElementById("eye");

  const googleLoginBtn = document.getElementById("google-login");

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

  // GOOGLE LOGIN
  googleLoginBtn.addEventListener("click", async () => {
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

      alert("Đăng nhập Google thành công!");

      window.location.href = "http://127.0.0.1:5502/index.html";
    } catch (error) {
      console.error(error);
      alert("Đăng nhập Google thất bại!");
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

      window.location.href = "http://127.0.0.1:5502/index.html";
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
