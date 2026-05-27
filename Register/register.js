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
  async function registerWithGoogle() {
    try {
      // LOGIN GOOGLE
      const result = await signInWithPopup(auth, provider);

      // USER DATA
      const user = result.user;

      // USER DOCUMENT
      const userDoc = doc(db, "users", user.uid);

      // CHECK USER
      const existingUser = await getDoc(userDoc);

      // IF USER NOT EXISTS
      if (!existingUser.exists()) {
        // CREATE NEW USER DATA
        const userData = {
          uid: user.uid,

          fullName: user.displayName || "Unknown",
          username: user.email?.split("@")[0] || "user",
          email: user.email || "",

          phoneNumber: "",

          photoURL: user.photoURL || "",

          burgerPoints: 0,
          orders: 0,
          vouchers: 0,

          provider: "google",

          createdAt: serverTimestamp(),
        };

        // SAVE FIRESTORE
        await setDoc(userDoc, userData);
      }

      // SUCCESS
      alert("Google Register Successful!");

      localStorage.setItem(
        "userData",
        JSON.stringify({
          uid: user.uid,
          fullName: user.displayName,
          username: user.email.split("@")[0],
          email: user.email,
          photoURL: user.photoURL,
        }),
      );

      // REDIRECT
      window.location.href = "Log in/login.html";
    } catch (error) {
      console.error("Google Register Error:", error);

      let message = "Google Register Failed!";

      switch (error.code) {
        case "auth/popup-closed-by-user":
          message = "Google Popup Closed!";
          break;

        case "auth/network-request-failed":
          message = "Check Your Internet!";
          break;

        case "auth/cancelled-popup-request":
          message = "Popup Request Cancelled!";
          break;
      }

      alert(message);
    }
  }

  // BUTTON EVENT
  googleRegisterBtn.addEventListener("click", registerWithGoogle);

  // REGISTER
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = form.fullName.value.trim();
    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const phoneNumber = form.phoneNumber.value.trim();
    const password = form.password.value;

    const confirmPassword = form.querySelector(
      '[name="confirmPassword"]',
    ).value;

    // CHECK EMPTY EMAIL
    if (!email) {
      alert("Email không được để trống!");
      return;
    }

    // CHECK EMAIL FORMAT
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      alert("Email Format Is Incorrect!");
      return;
    }

    // FIX PASSWORD LENGTH
    if (password.length < 6) {
      alert("Password Must Be At Least 6 Characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Confirm Password Does Not Match!");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      alert("Password Must Include Uppercase!");
      return;
    }

    if (!/[a-z]/.test(password)) {
      alert("Password Must Include Lowercase!");
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      alert("Password Must Include Special characters!");
      return;
    }

    try {
      // TẠO TÀI KHOẢN
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      // UPDATE PROFILE
      try {
        await updateProfile(user, {
          displayName: username,
        });
      } catch (e) {
        console.log("Update profile:", e);
      }

      // LƯU FIRESTORE
      try {
        await setDoc(doc(db, "users", user.uid), {
          burgerPoints: 0,
          orders: 0,
          vouchers: 0,
          photoURL: "",
          uid: user.uid,
          fullName,
          username,
          email,
          phoneNumber,
          createdAt: serverTimestamp(),
        });
      } catch (e) {
        console.log("Firestore:", e);
      }

      // GỬI EMAIL VERIFY
      try {
        await sendEmailVerification(user);
      } catch (e) {
        console.log("Email verify:", e);
      }

      alert("Registration Successful! Please Check Your Email.");

      localStorage.setItem(
        "userData",
        JSON.stringify({
          uid: user.uid,
          fullName,
          username,
          email,
          phoneNumber,
        }),
      );

      form.reset();

      window.location.href = "Log in/login.html";
    } catch (error) {
      console.error(error);

      let message = error.message;

      if (error.code === "auth/email-already-in-use") {
        message = "Email Already Exists.";
      } else if (error.code === "auth/invalid-email") {
        message = "Email Format Is Incorrect.";
      } else if (error.code === "auth/weak-password") {
        message = "Password Must Be At Least 6 Characters.";
      }

      alert(message);
    }
  });
});
