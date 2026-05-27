document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const user = JSON.parse(localStorage.getItem("currentUser")) || {};

  const billList = document.getElementById("bill-list");
  const billTotal = document.getElementById("bill-total");

  const fullName = document.getElementById("fullName");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");

  let total = 0;

  // =========================
  // HIỂN THỊ BILL
  // =========================
  cart.forEach((item) => {
    total += item.total;

    billList.innerHTML += `
      <div class="bill-item">
        <span>${item.name} x${item.quantity}</span>
        <span>${item.total.toLocaleString()} VNĐ</span>
      </div>
    `;
  });

  // =========================
  // ÁP DỤNG VOUCHER
  // =========================
  const discount = Number(localStorage.getItem("voucherDiscount")) || 0;

  const finalTotal = total - discount;

  billTotal.textContent = finalTotal.toLocaleString();

  // =========================
  // TỰ ĐIỀN USER
  // =========================
  fullName.value = user.fullName || "";
  email.value = user.email || "";
  phone.value = user.phoneNumber || "";

  // =========================
  // THANH TOÁN
  // =========================
  document
    .getElementById("payment-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const method = document.getElementById("payment-method").value;

      // =========================
      // QR PAYMENT
      // =========================
      if (method === "Bank Transfer" || method === "E-Wallet") {
        showQRNotification();
        return;
      }

      // COD
      completePayment();
    });

  // =========================
  // HIỂN THỊ QR POPUP
  // =========================
  function showQRNotification() {
    const popup = document.createElement("div");

    popup.innerHTML = `
      <div class="qr-popup">

        <div class="qr-box">

          <h2>📱 QR Payment</h2>

          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlTWf74Rtl6747xTtb680Kl0gp90KQ4VnH2g&s"
            alt="QR Payment"
          />

          <p>
            Please scan the QR code to complete payment
          </p>

          <button id="done-payment">
            ✅ Payment Completed
          </button>

        </div>

      </div>
    `;

    document.body.appendChild(popup);

    // NÚT XÁC NHẬN ĐÃ THANH TOÁN
    document.getElementById("done-payment").addEventListener("click", () => {
      popup.remove();
      completePayment();
    });
  }

  // =========================
  // HOÀN TẤT THANH TOÁN
  // =========================
  function completePayment() {
    // TÍCH ĐIỂM 🍔
    const earnedPoints = Math.floor(finalTotal / 10000);

    let currentPoints = Number(localStorage.getItem("burgerPoints")) || 0;

    currentPoints += earnedPoints;

    localStorage.setItem("burgerPoints", currentPoints);

    alert(`🎉 Thanh toán thành công!\nBạn nhận được ${earnedPoints} 🍔`);

    // XÓA GIỎ HÀNG
    localStorage.removeItem("cart");
    localStorage.removeItem("voucherApplied");
    localStorage.removeItem("voucherDiscount");
    localStorage.removeItem("voucherPercent");

    // CHUYỂN TRANG
    window.location.href = "http://127.0.0.1:5502/index.html";
  }
});
