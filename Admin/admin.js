const userData = JSON.parse(localStorage.getItem("userData"));

if (!userData) {
  alert("Please Login!");

  window.location.href = "/index.html";
}

const addBtn = document.getElementById("add-btn");

const saveBtn = document.getElementById("save-btn");

const productList = document.getElementById("product-list");

let products = JSON.parse(localStorage.getItem("adminProducts")) || [];

function renderProducts() {
  productList.innerHTML = "";

  products.forEach((product, index) => {
    const div = document.createElement("div");

    div.className = "product";

    div.innerHTML = `
      <img src="${product.image}">

      <div>
        <h3>${product.name}</h3>

        <p>${product.price}đ</p>
      </div>

      <button onclick="deleteProduct(${index})">
        Delete
      </button>
    `;

    productList.appendChild(div);
  });
}

window.deleteProduct = function (index) {
  products.splice(index, 1);

  renderProducts();
};

addBtn.addEventListener("click", () => {
  const name = document.getElementById("name").value;

  const price = document.getElementById("price").value;

  const image = document.getElementById("image").value;

  if (!name || !price || !image) {
    alert("Please Fill All Fields!");

    return;
  }

  products.push({
    name,
    price,
    image,
  });

  renderProducts();
});

saveBtn.addEventListener("click", () => {
  localStorage.setItem("adminProducts", JSON.stringify(products));

  alert("Products Saved!");
});

renderProducts();
