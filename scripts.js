// Filtrar productos por categoría
function filterProducts(category, event) {
  const cards = document.querySelectorAll('.products .card');
  cards.forEach(card => {
    if (category === 'all' || card.classList.contains(category)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });

  // Cambiar estado del botón activo
  document.querySelectorAll('.filters button').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
}

// Carrito avanzado
let cart = [];

function addToCart(productName) {
  // Si ya existe sumamos cantidad
  const index = cart.findIndex(item => item.name === productName);
  if (index !== -1) {
    cart[index].qty += 1;
  } else {
    // Obtener el precio real del producto
    const productCard = Array.from(document.querySelectorAll('.card'))
      .find(card => card.querySelector('h3').textContent === productName);
    const price = productCard ? parseFloat(productCard.querySelector('.price').textContent.replace('$','')) : 0;

    cart.push({ name: productName, qty: 1, price });
  }
  updateCartDisplay();
  alert(`Producto "${productName}" añadido al carrito.`);
}

// Mostrar carrito (modal)
function mostrarCarrito() {
  document.getElementById('cartModal').style.display = "block";
  renderCartItems();
}

// Cerrar carrito
function closeCart() {
  document.getElementById('cartModal').style.display = "none";
}

// Renderizar productos en carrito
function renderCartItems() {
  const cartItemsDiv = document.getElementById('cartItems');
  cartItemsDiv.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p style="color:#b57282;">Tu carrito está vacío.</p>';
  } else {
    cart.forEach((item, i) => {
      total += item.qty * item.price;
      cartItemsDiv.innerHTML += `
        <div class="cart-item">
          <span class="cart-item-name">${item.name}</span>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeQty(${i}, -1)">-</button>
            <span>${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${i}, 1)">+</button>
            <button class="remove-item" onclick="removeItem(${i})">&times;</button>
          </div>
        </div>
      `;
    });
  }
  document.getElementById('cartTotal').textContent = total ? `Total: $${total.toFixed(2)}` : '';
  document.querySelector('.carrito').textContent = `Carrito (${getCartCount()})`;
}

// Cambiar cantidad artículo
function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  renderCartItems();
}

// Eliminar producto
function removeItem(index) {
  cart.splice(index, 1);
  renderCartItems();
}

// Obtener total productos en carrito
function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

// Actualizar contador del carrito visible
function updateCartDisplay() {
  document.querySelector('.carrito').textContent = `Carrito (${getCartCount()})`;
}

// Finalizar compra (simulación)
function checkoutCart() {
  if (cart.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }
  alert("¡Gracias por tu compra!\n(Tu pedido ha sido registrado - funcionalidad demo)");
  cart = [];
  closeCart();
  updateCartDisplay();
}

// Formulario contacto
function enviarContacto(e) {
  e.preventDefault();
  alert("¡Mensaje enviado! Pronto te contactaremos.");
  e.target.reset();
}

// Inicializar contador carrito al cargar
document.addEventListener('DOMContentLoaded', updateCartDisplay);
