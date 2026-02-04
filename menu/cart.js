/* ================================
   CART JS
================================ */
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let tbody = document.getElementById("cart-body");
let total = 0;

let voucherPercent = Number(localStorage.getItem("voucherPercent")) || 0;

/* RENDER CART */
function renderCart() {
  tbody.innerHTML = "";
  total = 0;

  cart.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>
        ${item.name}<br>
        <small>Size: ${item.size}</small><br>
        <small>Topping: ${item.toppings.join(", ") || "Không"}</small>
      </td>
      <td>${item.quantity}</td>
      <td>${item.total.toLocaleString("vi-VN")}₫</td>
      <td>
        <button onclick="removeItem(${index})">X</button>
      </td>
    `;
    tbody.appendChild(tr);

    // 🔥 TỔNG TIỀN GỐC
    total += item.total;
  });

  let discount = 0;
  if (voucherPercent > 0 && cart.length > 0) {
    discount = Math.round(total * voucherPercent / 100);
    localStorage.setItem("voucherDiscount", discount);
  }

  document.getElementById("total").innerText =
    total.toLocaleString("vi-VN") + "₫";

  const discountEl = document.getElementById("discount");
  const finalTotalEl = document.getElementById("finaltotal");

  if (discountEl) discountEl.innerText = discount.toLocaleString("vi-VN") + "₫";
  if (finalTotalEl)
    finalTotalEl.innerText =
      Math.max(total - discount, 0).toLocaleString("vi-VN") + "₫";
}

/* REMOVE */
function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

/* PAY */
function pay() {
  if (cart.length === 0) {
    alert("Giỏ hàng trống!");
    return;
  }

  alert("✅ Thanh toán thành công!");
  localStorage.clear();
  window.location.href = "menu.html";
}

renderCart();
