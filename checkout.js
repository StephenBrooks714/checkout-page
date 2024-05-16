const cart = [];
// Select the form and add event listner when the user submit the form
document.querySelector("form").addEventListener("submit", addProduct);
document.addEventListener("click", clickHandler);

function clickHandler(e) {
  if (e.target.nodeName === "BUTTON") {
    if (e.target.className.includes("btn-danger")) deleteProduct(e.target);
    if (e.target.className.includes("increase")) increaseQty(e.target);
    if (e.target.className.includes("decrease")) decreaseQty(e.target);
  }
}

// Add a product
function addProduct(e) {
  e.preventDefault();

  const imagePattern =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const nameElement = document.getElementById("add-name");
  const priceElement = document.getElementById("add-price");
  const qtyElement = document.getElementById("add-quantity");
  const imgElement = document.getElementById("add-image");

  // Validate inputs
  // Clear previous errors
  nameElement.nextElementSibling.textContent = "";
  priceElement.nextElementSibling.textContent = "";
  qtyElement.nextElementSibling.textContent = "";
  imgElement.parentElement.nextElementSibling.textContent = "";

  if (!nameElement.value)
    nameElement.nextElementSibling.textContent = "Please provide product Name";
  else if (nameElement.value.length < 3)
    nameElement.nextElementSibling.textContent =
      "Product Name is 3 characters min.";

  if (!priceElement.value)
    priceElement.nextElementSibling.textContent =
      "Please provide product Price";
  else if (isNaN(priceElement.value))
    priceElement.nextElementSibling.textContent =
      "Please provide a numeric value";
  if (!qtyElement.value)
    qtyElement.nextElementSibling.textContent = "Please provide product Qty";
  else if (isNaN(qtyElement.value))
    qtyElement.nextElementSibling.textContent =
      "Please provide a numeric value";
  if (!imgElement.value)
    imgElement.parentElement.nextElementSibling.textContent =
      "Please provide the product image URL";
  if (!imagePattern.test(imgElement.value))
    imgElement.parentElement.nextElementSibling.textContent =
      "Please provide a valid URL";

  const salePrice = (Number(priceElement.value) * 0.7).toFixed(2);
  const product = {
    id: Date.now(),
    name: nameElement.value,
    originalPrice: priceElement.value,
    salePrice: salePrice,
    image: imgElement.value,
    qty: qtyElement.value,
    totalPrice: Number(qtyElement.value) * Number(salePrice),
  };

  // Add the product to the cart
  cart.unshift(product);

  // clear the form
  nameElement.value = "";
  priceElement.value = "";
  qtyElement.value = "";
  imgElement.value = "";

  // Reflect the change on cart to the DOM
  displayCart();
  // Calculate the cart total
  calculateTotal();
}

// Display cart to the Dom
function displayCart() {
  const productPanel = document.getElementById("product-panel");
  //   Remove all products
  Array.from(document.querySelectorAll(".product-card")).forEach((prod) =>
    prod.remove(),
  );

  const products = cart.map((prod) => {
    const card = document.createElement("div");
    card.className = "card d-flex flex-row m-3 shadow bg-light product-card";
    card.style.maxWidth = "390px";
    card.id = prod.id;
    card.innerHTML = `
        <img class="img-fluid" style="object-fit: contain; width: 40%;"src="${prod.image}"/>
        <div class="product details w-100 m-2">
          <h6 > ${prod.name}</h6>
           <h3 class="text-warning">$${prod.salePrice} <small class="text-decoration-line-through text-dark fs-6"> $${prod.originalPrice}</small></h3>
          <div class="bg-white w-100 border border-2 border-dark p-2 d-flex justify-content-center align-items-center">
            <button class="btn btn-secondary btn-sm decrease"> - </button>
            <input type="text" class="form-control border-0 " style="width:50px; background-color: white;" readonly value="${prod.qty}">
            <button class="btn btn-secondary btn-sm increase">+ </button>
          </div>
          <div class="d-grid my-2">
              <button class="btn btn-danger btn-sm">
              <i class="fa-solid fa-trash"></i> Remove
               </button>
          </div>
          <small class="fs-6">Product Total: 
            <span id="product-total" class="fw-bold">$${prod.totalPrice} </span>
          </small>
          </div>
        `;
    return card;
  });


  // Add products to the DOM.
  products.forEach((prod) => productPanel.appendChild(prod));
}

// Increase product quantity
function increaseQty(el) {
  // Get the product id from the card div
  const productId = el.parentElement.parentElement.parentElement.id;
  // find the product in cart
  const product = cart.find((prod) => prod.id == productId);
  // increase qty
  product.qty = Number(product.qty) + 1;
  // increse totalPrice
  product.totalPrice = Number(product.qty) * Number(product.salePrice);
  // Get the product location in the cart
  const productIndex = cart.findIndex((prod) => prod.id == productId);
  // replace the old product with the new one
  cart.splice(productIndex, 1, product);
  displayCart();
  calculateTotal();
}

// Decrease product quantity
function decreaseQty(el) {
  // Get the product id from the card div
  const productId = el.parentElement.parentElement.parentElement.id;
  // find the product in cart
  const product = cart.find((prod) => prod.id == productId);
  // increase qty
  if (product.qty == 1) {
    if (confirm("Do You want to remove the product from cart?")) {
      return deleteProduct(el);
    }else{
      return 
    }
  }

  product.qty = Number(product.qty) - 1;
  // increse totalPrice
  product.totalPrice = Number(product.qty) * Number(product.salePrice);
  // Get the product location in the cart
  const productIndex = cart.findIndex((prod) => prod.id == productId);
  // replace the old product with the new one
  cart.splice(productIndex, 1, product);
  displayCart();
  calculateTotal();
}

// Remove product from cart
function deleteProduct(el) {
  const productId = el.parentElement.parentElement.parentElement.id;
  // cart = cart.filter(prod=> prod.id !=productId)
  const productIndex = cart.findIndex((prod) => prod.id == productId);
  cart.splice(productIndex, 1);
  displayCart();
  calculateTotal();
}

// Adjust the card total price
function calculateTotal() {
  const shippingElement = document.querySelector(".shipping");
  const subtotalElement = document.querySelector(".subtotal");
  const taxElement = document.querySelector(".tax");
  const totalElement = document.querySelector(".total");

  const taxes = 8;
  const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const shippingPrice = subtotal ? 15 : 0;
  const total = subtotal
    ? Number(subtotal) * (1 + taxes / 100) + shippingPrice
    : 0;
  const taxAmount = Number(subtotal) * (taxes / 100);

  shippingElement.textContent = shippingPrice.toFixed(2);
  subtotalElement.textContent = subtotal.toFixed(2);
  taxElement.textContent = taxAmount.toFixed(2);
  totalElement.textContent = total.toFixed(2);
}
