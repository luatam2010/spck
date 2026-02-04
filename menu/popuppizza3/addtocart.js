/* ================================
   POPUP JS
================================ */
let qty = 1;
let totalPrice = 0;

const qtyEl = document.getElementById("qty");
const totalEl = document.getElementById("total");

const sizeRadios = document.querySelectorAll('input[name="size"]');
const toppingCheckboxes = document.querySelectorAll('input[type="checkbox"]');

/* EVENT */
sizeRadios.forEach(r => r.addEventListener("change", updateTotal));
toppingCheckboxes.forEach(c => c.addEventListener("change", updateTotal));

/* +/- SỐ LƯỢNG */
function changeQty(step) {
  qty += step;
  if (qty < 1) qty = 1;
  qtyEl.innerText = qty;
  updateTotal();
}

/* TÍNH TỔNG TIỀN MÓN */
function updateTotal() {
  const sizeChecked = document.querySelector('input[name="size"]:checked');
  if (!sizeChecked) return;

  let basePrice = Number(sizeChecked.dataset.price);
  let toppingTotal = 0;

  toppingCheckboxes.forEach(cb => {
    if (cb.checked) toppingTotal += Number(cb.dataset.price);
  });

  totalPrice = (basePrice + toppingTotal) * qty;
  totalEl.innerText = totalPrice.toLocaleString("vi-VN") + "₫";
}

/* ADD TO CART */
function addToCart() {
  const sizeChecked = document.querySelector('input[name="size"]:checked');
  if (!sizeChecked) {
    alert("Vui lòng chọn size!");
    return;
  }

  const toppings = [];
  toppingCheckboxes.forEach(cb => {
    if (cb.checked) toppings.push(cb.parentElement.innerText.trim());
  });

  const cartItem = {
    name: document.getElementById("popup-name").innerText,
    size: sizeChecked.value,
    toppings,
    quantity: qty,
    total: totalPrice // 🔥 TỔNG TIỀN MÓN
  };

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const exist = cart.find(item =>
    item.name === cartItem.name &&
    item.size === cartItem.size &&
    JSON.stringify(item.toppings) === JSON.stringify(cartItem.toppings)
  );

  if (exist) {
    exist.quantity += cartItem.quantity;
    exist.total += cartItem.total;
  } else {
    cart.push(cartItem);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("✅ Đã thêm vào giỏ hàng!");
}

updateTotal();
