function openPopup(button) {
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
        .then(res => {
            if (!res.ok) throw new Error("Failed to load popup");
            return res.text();
        })
        .then(html => {
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
            const existingScript = document.querySelector('script[src="popuppizza3/addtocart.js"]');
            if (!existingScript) {
                const script = document.createElement("script");
                script.src = "popuppizza3/addtocart.js";
                document.body.appendChild(script);
            }
        })
        .catch(err => {
            console.error("Error loading popup:", err);
            alert("Không thể mở popup. Vui lòng thử lại!");
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
