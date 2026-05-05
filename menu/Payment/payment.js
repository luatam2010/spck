document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const user = JSON.parse(localStorage.getItem("currentUser")) || {};

  const billList = document.getElementById("bill-list");
  const billTotal = document.getElementById("bill-total");

  const fullName = document.getElementById("fullName");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");

  let total = 0;

  // HIỂN THỊ BILL
  cart.forEach((item) => {
    total += item.total;

    billList.innerHTML += `
      <div>
        <span>${item.name} x${item.quantity}</span>
        <span>${item.total.toLocaleString()} VNĐ</span>
      </div>
    `;
  });

  // ÁP DỤNG VOUCHER NẾU CÓ
  const discount = Number(localStorage.getItem("voucherDiscount")) || 0;

  const finalTotal = total - discount;

  billTotal.textContent = finalTotal.toLocaleString();

  // TỰ ĐIỀN THÔNG TIN USER
  fullName.value = user.fullName || "";
  email.value = user.email || "";
  phone.value = user.phoneNumber || "";

  // THANH TOÁN
  document
    .getElementById("payment-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      // =====================
      // TÍCH ĐIỂM 🍔
      // =====================
      const earnedPoints = Math.floor(finalTotal / 10000);

      let currentPoints = Number(localStorage.getItem("burgerPoints")) || 0;

      currentPoints += earnedPoints;

      localStorage.setItem("burgerPoints", currentPoints);

      alert(`🎉 Thanh toán thành công!\nBạn nhận được ${earnedPoints} 🍔`);

      // XÓA BILL + VOUCHER
      localStorage.removeItem("cart");
      localStorage.removeItem("voucherApplied");
      localStorage.removeItem("voucherDiscount");
      localStorage.removeItem("voucherPercent");

      window.location.href = "http://127.0.0.1:5502/index.html";
    });
});
