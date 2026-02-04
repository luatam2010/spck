// function openPopup(button) {
//   const name = button.dataset.name;
//   const price = button.dataset.price;
//   const image = button.dataset.image;

//   // Lưu dữ liệu để popup dùng
//   localStorage.setItem("popupItem", JSON.stringify({
//     name,
//     price,
//     image
//   }));

//   const iframe = document.getElementById("popupFrame");
//   iframe.src = "popuppizza3/addtocart.html";

//   document.getElementById("overlay").style.display = "block";
//     iframe.style.display = "block";
//     document.body.style.overflow = "hidden";
// }

// function closePopup() {
//   document.getElementById("overlay").style.display = "none";
//   document.getElementById("popupFrame").style.display = "none";
//   document.body.style.overflow = "auto";
// }


document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".open-popup-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            openPopup(btn.dataset);
        });
    });
});

function openPopup(data) {
    if (document.getElementById("popup")) return;

    fetch("../popuppizza3/addtocart.html")
        .then(res => res.text())
        .then(html => {
            const wrapper = document.createElement("div");
            wrapper.innerHTML = html;

            const popup = wrapper.querySelector(".popup-box");
            document.body.appendChild(popup);

            document.getElementById("popup-name").innerText = data.name;
            document.getElementById("popup-img").src = data.img;

            popup.style.display = "block";
        });
}
