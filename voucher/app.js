document.addEventListener("DOMContentLoaded", () => {
  const voucherGrid = document.querySelector(".voucher-grid");

  voucherGrid.addEventListener("click", function (e) {
    const btn = e.target.closest(".btn-apply");
    if (!btn) return;

    handleApplyVoucher(btn);
  });
});

// ============================
// XỬ LÝ ÁP DỤNG VOUCHER
// ============================
function handleApplyVoucher(btn) {
  const voucher = btn.closest(".voucher");
  const qtyEl = voucher.querySelector(".qty");
  let qty = Number(qtyEl.innerText);

  // HẾT LƯỢT
  if (qty <= 0) {
    alert("❌ Voucher đã hết lượt!");
    return;
  }

  // KIỂM TRA GIỎ HÀNG
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("❌ Giỏ hàng trống!");
    return;
  }

  // TÍNH TỔNG TIỀN GỐC
  let total = cart.reduce((sum, item) => {
    return sum + item.total;
  }, 0);

  // TÍNH GIẢM GIÁ
  const discountPercent = Number(voucher.dataset.discount);
  const discountAmount = Math.round((total * discountPercent) / 100);

  // ============================
  // LƯU GIẢM GIÁ (CŨ)
  // ============================
  localStorage.setItem("voucherDiscount", discountAmount);

  // ============================
  // === ADDED: ĐÁNH DẤU ĐÃ ÁP DỤNG VOUCHER
  // (để shopping cart nhận biết)
  // ============================
  localStorage.setItem("voucherApplied", "true");
  localStorage.setItem("voucherPercent", discountPercent);
  // ============================

  // GIẢM SỐ LƯỢT
  qty--;
  qtyEl.innerText = qty;

  if (qty === 0) {
    btn.disabled = true;
    btn.innerText = "HẾT LƯỢT";
  }

  alert(`🎉 Áp dụng thành công voucher giảm ${discountPercent}%`);
}