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

  googleLoginBtn.addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const user = result.user;

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

      alert("Login With Google Successful! Welcome Back!");

      localStorage.setItem(
        "userData",
        JSON.stringify({
          fullName: user.displayName,
          username: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        }),
      );

      window.location.href = "http://127.0.0.1:5502/index.html";
    } catch (error) {
      console.error(error);
      alert("Login With Google Failed!");
    }
  });

  // LOGIN
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const identifier = form.identifier.value.trim();
    const password = form.password.value;

    let email = identifier;

    try {
      if (!identifier.includes("@")) {
        const q = query(
          collection(db, "users"),
          where("username", "==", identifier),
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          alert("Invalid Username!");
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

      const userRef = doc(db, "users", user.uid);

      const userSnap = await getDoc(userRef);

      const userData = userSnap.data();

      localStorage.setItem("userData", JSON.stringify(userData));

      // CHECK VERIFY EMAIL
      if (!user.emailVerified) {
        alert("Please Verify Your Email Before Logging In!");
        return;
      }

      alert("Login Successful! Welcome Back!");

      form.reset();

      window.location.href = "http://127.0.0.1:5502/index.html";
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);

      let message = "Login Failed!";

      if (error.code === "auth/invalid-credential") {
        message = "Invalid Email or Password.";
      } else if (error.code === "auth/user-not-found") {
        message = "Account Does Not Exist.";
      } else if (error.code === "auth/wrong-password") {
        message = "Wrong Password.";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid Email Address.";
      }

      alert(message);
    }
  });
});
