function addToShopCart(name, price) {
  const userData = JSON.parse(localStorage.getItem("userData"));

  if (!userData) {
    alert("Please Login First!");

    window.location.href = "/Register/Log in/login.html";

    return;
  }
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let item = cart.find((p) => p.name === name);
  if (item) {
    item.quantity++;
    item.total = item.price * item.quantity;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
      total: price,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("✅ Added to Cart!");
}
