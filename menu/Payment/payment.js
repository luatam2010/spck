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
        <span>${item.total} VNĐ</span>
      </div>
    `;
  });

  billTotal.textContent = total.toLocaleString();

  // TỰ ĐIỀN THÔNG TIN USER
  fullName.value = user.fullName || "";
  email.value = user.email || "";
  phone.value = user.phoneNumber || "";

  // THANH TOÁN
  document
    .getElementById("payment-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      alert("🎉 Thanh toán thành công! Đơn hàng đang được chuẩn bị.");

      localStorage.removeItem("cart");

      window.location.href = "./index.html";
    });
});
