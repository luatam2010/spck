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
  alert("✅Đã thêm vào giỏ hàng!");
}