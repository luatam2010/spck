document.addEventListener("DOMContentLoaded", () => {
  loadPoints();
  loadVoucherQty();

  const voucherGrid = document.querySelector(".voucher-grid");

  // =========================
  // ÁP DỤNG VOUCHER
  // =========================
  voucherGrid.addEventListener("click", function (e) {
    const btn = e.target.closest(".btn-apply");

    if (!btn) return;

    handleApplyVoucher(btn);
  });

  // =========================
  // ĐỔI ĐIỂM
  // =========================
  document.querySelectorAll(".exchange-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const voucherPercent = btn.dataset.voucher;

      exchangeVoucher(voucherPercent);
    });
  });
});

// =========================
// HIỂN THỊ ĐIỂM
// =========================
function loadPoints() {
  const pointEl = document.getElementById("current-points");

  const points = Number(localStorage.getItem("burgerPoints")) || 0;

  pointEl.innerText = points;
}

// =========================
// LOAD SỐ LƯỢT VOUCHER
// =========================
function loadVoucherQty() {
  document.querySelectorAll(".voucher").forEach((voucher) => {
    const percent = voucher.dataset.discount;

    const qty = Number(localStorage.getItem(`voucher_${percent}`)) || 0;

    voucher.querySelector(".qty").innerText = qty;

    const btn = voucher.querySelector(".btn-apply");

    if (qty <= 0) {
      btn.disabled = true;
      btn.innerText = "HẾT LƯỢT";
    }
  });
}

// =========================
// ĐỔI ĐIỂM -> VOUCHER
// =========================
function exchangeVoucher(percent) {
  let points = Number(localStorage.getItem("burgerPoints")) || 0;

  // 10 điểm = 1 voucher
  const cost = 10;

  if (points < cost) {
    alert("❌ Không đủ điểm burger!");
    return;
  }

  points -= cost;

  localStorage.setItem("burgerPoints", points);

  // TĂNG SỐ LƯỢT VOUCHER
  let currentQty = Number(localStorage.getItem(`voucher_${percent}`)) || 0;

  currentQty++;

  localStorage.setItem(`voucher_${percent}`, currentQty);

  // UPDATE UI
  loadPoints();
  loadVoucherQty();

  alert(`🎉 Đổi thành công voucher ${percent}%`);
}

// =========================
// ÁP DỤNG VOUCHER
// =========================
function handleApplyVoucher(btn) {
  const voucher = btn.closest(".voucher");

  const qtyEl = voucher.querySelector(".qty");

  let qty = Number(qtyEl.innerText);

  // HẾT LƯỢT
  if (qty <= 0) {
    alert("❌ Voucher đã hết lượt!");
    return;
  }

  // GIỎ HÀNG
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("❌ Giỏ hàng trống!");
    return;
  }

  // TỔNG TIỀN
  let total = cart.reduce((sum, item) => {
    return sum + item.total;
  }, 0);

  // GIẢM GIÁ
  const discountPercent = Number(voucher.dataset.discount);

  const discountAmount = Math.round((total * discountPercent) / 100);

  // SAVE
  localStorage.setItem("voucherDiscount", discountAmount);

  localStorage.setItem("voucherApplied", "true");

  localStorage.setItem("voucherPercent", discountPercent);

  // TRỪ LƯỢT
  qty--;

  qtyEl.innerText = qty;

  localStorage.setItem(`voucher_${discountPercent}`, qty);

  if (qty <= 0) {
    btn.disabled = true;
    btn.innerText = "HẾT LƯỢT";
  }

  alert(`🎉 Áp dụng thành công voucher ${discountPercent}%`);
}
