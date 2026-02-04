function addToShopCart(name, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let item = cart.find(p => p.name === name);
  if (item) {
    item.quantity++;
    item.total = item.price * item.quantity;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
      total: price
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Đã thêm vào giỏ hàng!");
}

// ================================
// CART DATA
// ================================
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let tbody = document.getElementById("cart-body");
let total = 0;

// === ADDED: LẤY % VOUCHER ===
let voucherPercent = Number(localStorage.getItem("voucherPercent")) || 0;

// ================================
// RENDER CART
// ================================
function renderCart() {
  tbody.innerHTML = "";
  total = 0;

  cart.forEach((item, index) => {
    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${item.price * item.quantity}</td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="removeItem(${index})">X</button>
      </td>
    `;
    tbody.appendChild(tr);

    total += item.price * item.quantity;
  });

  // ================================
  // TÍNH GIẢM GIÁ THEO TỔNG MỚI
  // ================================
  let discount = 0;

  if (voucherPercent > 0 && cart.length > 0) {
    discount = Math.round((total * voucherPercent) / 100);
  }

  // nếu giỏ trống → reset voucher
  if (cart.length === 0) {
    voucherPercent = 0;
    discount = 0;
    localStorage.removeItem("voucherPercent");
    localStorage.removeItem("voucherDiscount");
    localStorage.removeItem("voucherApplied");
  } else {
    // cập nhật lại tiền giảm mới
    localStorage.setItem("voucherDiscount", discount);
  }

  // ================================
  // HIỂN THỊ
  // ================================
  document.getElementById("total").innerText =
    total.toLocaleString("vi-VN");

  const discountEl = document.getElementById("discount");
  const finalTotalEl = document.getElementById("finaltotal");

  if (discountEl) {
    discountEl.innerText = discount.toLocaleString("vi-VN");
  }

  if (finalTotalEl) {
    const finalTotal = Math.max(total - discount, 0);
    finalTotalEl.innerText = finalTotal.toLocaleString("vi-VN");
  }
}

// ================================
// REMOVE ITEM
// ================================
function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// ================================
// PAY
// ================================
function pay() {
  if (cart.length === 0) {
    alert("Giỏ hàng trống!");
    return;
  }

  alert("✅ Thanh toán thành công!");

  localStorage.removeItem("voucherPercent");
  localStorage.removeItem("voucherDiscount");
  localStorage.removeItem("voucherApplied");
  localStorage.removeItem("cart");

  window.location.href = "menu.html";
}

// ================================
// INIT
// ================================
renderCart();