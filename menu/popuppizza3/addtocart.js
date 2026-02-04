let qty = 1;
let basePrice = 160000;
let totalPrice = 160000;

const qtyEl = document.getElementById("qty");
const totalEl = document.getElementById("total");
const sizeRadios = document.querySelectorAll('input[name="size"]');
const toppingCheckboxes = document.querySelectorAll('.topping-box input');

init();

/* INIT */
function init() {
    sizeRadios.forEach(r => r.addEventListener("change", updateTotal));
    toppingCheckboxes.forEach(cb => cb.addEventListener("change", updateTotal));
    updateTotal();
}

/* QUANTITY */
function changeQty(step) {
    qty += step;
    if (qty < 1) qty = 1;
    qtyEl.innerText = qty;
    updateTotal();
}

/* TOTAL */
function updateTotal() {
    basePrice = parseInt(document.querySelector('input[name="size"]:checked').dataset.price);

    let toppingTotal = 0;
    toppingCheckboxes.forEach(cb => {
        if (cb.checked) toppingTotal += parseInt(cb.dataset.price);
    });

    totalPrice = (basePrice + toppingTotal) * qty;
    totalEl.innerText = totalPrice.toLocaleString("vi-VN");
}

/* ADD TO CART */
function addToCart() {
    const toppings = [];
    toppingCheckboxes.forEach(cb => {
        if (cb.checked) {
            toppings.push(cb.parentElement.querySelector(".topping-name").innerText);
        }
    });

    const data = {
        name: document.getElementById("popup-name").innerText,
        qty,
        size: document.querySelector('input[name="size"]:checked')
                .parentElement.querySelector(".size-name").innerText,
        toppings,
        total: totalPrice
    };

    console.log("Giỏ hàng:", data);
    saveToShoppingCart(data);
    alert("Đã thêm vào giỏ hàng!");
}

/* CLOSE */
function closePopup() {
    document.getElementById("popup").style.display = "none";
}


function saveToShoppingCart(data) {
    let cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];

    const exist = cart.find(item =>
        item.name === data.name &&
        item.size === data.size &&
        JSON.stringify(item.toppings) === JSON.stringify(data.toppings)
    );

    if (exist) {
        exist.qty += data.qty;
        exist.total += data.total;
    } else {
        cart.push({
            name: data.name,
            qty: data.qty,
            size: data.size,
            toppings: data.toppings,
            total: data.total
        });
    }

    localStorage.setItem("shoppingCart", JSON.stringify(cart));
}
