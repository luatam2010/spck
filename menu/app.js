function openPopup(button) {
  const userData = JSON.parse(localStorage.getItem("userData"));

  if (!userData) {
    alert("Please Login First!");

    window.location.href = "/Register/Log in/login.html";

    return;
  }
  console.log("Opening popup...", button.dataset);

  const name = button.dataset.name;
  const price = button.dataset.price;
  const image = button.dataset.image;

  if (!name || !image) {
    console.error("Missing data:", { name, price, image });
    return;
  }

  // Kiểm tra nếu popup đã tồn tại
  const existingPopup = document.querySelector(".popup-overlay");
  if (existingPopup) {
    existingPopup.remove();
  }

  // Load popup HTML
  fetch("popuppizza3/addtocart.html")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to load popup");
      return res.text();
    })
    .then((html) => {
      console.log("Popup HTML loaded");

      // Tạo container cho popup
      const container = document.getElementById("popup-container");
      if (!container) {
        console.error("popup-container not found!");
        return;
      }

      container.innerHTML = html;

      // Đợi một chút để DOM được render
      setTimeout(() => {
        // Cập nhật thông tin món ăn
        const popupName = document.getElementById("popup-name");
        const popupImg = document.getElementById("popup-img");
        const overlay = document.getElementById("overlay");
        const popupOverlay = document.querySelector(".popup-overlay");

        if (popupName) popupName.innerText = name;
        if (popupImg) popupImg.src = image;

        // Hiển thị popup và overlay
        if (overlay) overlay.style.display = "block";
        if (popupOverlay) popupOverlay.style.display = "flex";
        document.body.style.overflow = "hidden";

        console.log("Popup displayed");
      }, 50);

      // Load CSS cho popup
      if (!document.querySelector('link[href="popuppizza3/addtocart.css"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "popuppizza3/addtocart.css";
        document.head.appendChild(link);
      }

      // Load JavaScript cho popup
      const existingScript = document.querySelector(
        'script[src="popuppizza3/addtocart.js"]',
      );
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "popuppizza3/addtocart.js";
        document.body.appendChild(script);
      }
    })
    .catch((err) => {
      console.error("Error loading popup:", err);
      alert("Cannot popup. Please Try Again!");
    });
}

function closePopup() {
  console.log("Closing popup...");

  const overlay = document.getElementById("overlay");
  const container = document.getElementById("popup-container");

  if (overlay) overlay.style.display = "none";
  if (container) container.innerHTML = "";
  document.body.style.overflow = "auto";
}

function searchFood() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const foods = document.querySelectorAll(".food-item");
  const categories = document.querySelectorAll(".food-category");
  const noResult = document.getElementById("no-result-message");

  let hasSearch = input.trim() !== "";
  let found = false;

  foods.forEach((food) => {
    const name = food.querySelector(".information").innerText.toLowerCase();

    if (!hasSearch || name.includes(input)) {
      food.style.display = "block";
      found = true;
    } else {
      food.style.display = "none";
    }
  });

  categories.forEach((category) => {
    category.style.display = hasSearch ? "none" : "block";
  });

  // thông báo
  if (hasSearch && !found) {
    noResult.style.display = "block";
  } else {
    noResult.style.display = "none";
  }
}

const adminProducts = JSON.parse(localStorage.getItem("adminProducts")) || [];

const menuContainer = document.getElementById("menu-products");

adminProducts.forEach((product) => {
  const div = document.createElement("nav");

  // GIỐNG CẤU TRÚC MENU CỦA BẠN
  div.className = "menu1 food-item";

  div.setAttribute("data-category", "Admin");

  div.innerHTML = `
  
    <img
      class="picture"
      style="width: 300px; height: 300px; vertical-align: middle"
      src="${product.image}"
      alt="${product.name}"
    />

    <p class="information">
      ${product.name}
    </p>

    <span class="size">
      ${Number(product.price).toLocaleString()}đ
    </span>

    <button
      class="btn open-btn"

      data-name="${product.name}"
      data-price="${product.price}"
      data-image="${product.image}"

      onclick="openPopup(this)"
    >
      ADD TO CART
    </button>
  `;

  menuContainer.appendChild(div);
});
