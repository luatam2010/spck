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

      localStorage.setItem(
        "userData",
        JSON.stringify({
          uid: user.uid,
          fullName: user.displayName,
          username: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        }),
      );

      try {
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
      } catch (firestoreError) {
        console.error("Firestore Error:", firestoreError);
      }

      alert("Login With Google Successful! Welcome Back!");
      window.location.href = "http://127.0.0.1:5502/index.html";
    } catch (error) {
      console.error(error);
      alert("Login With Google Failed!");
    }
  });

  // EMAIL / USERNAME LOGIN
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const identifier = form.identifier.value.trim();
    const password = form.password.value;

    let email = identifier;

    try {
      // LOGIN BY USERNAME
      if (!identifier.includes("@")) {
        try {
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
        } catch (firestoreError) {
          console.error("Username Query Error:", firestoreError);
          alert("Firestore Permission Error. Check Firestore Rules.");
          return;
        }
      }

      // FIREBASE LOGIN
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      await user.reload();

      if (!auth.currentUser.emailVerified) {
        alert("Please Verify Your Email Before Logging In!");
        return;
      }

      // GET USER DATA
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          localStorage.setItem("userData", JSON.stringify(userData));
        }
      } catch (firestoreError) {
        console.error("Get User Data Error:", firestoreError);
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
      } else if (error.code === "auth/too-many-requests") {
        message = "Too Many Attempts. Please Try Again Later.";
      }

      alert(message);
    }
  });
});
