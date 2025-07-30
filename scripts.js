// Variable global para carrito
let cart = [];

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

// --- Carrito ---

// Agregar producto al carrito
function addToCart(productName) {
  const index = cart.findIndex(item => item.name === productName);
  if (index !== -1) {
    cart[index].qty += 1;
  } else {
    const productCard = Array.from(document.querySelectorAll('.card'))
      .find(card => card.querySelector('h3').textContent === productName);
    const price = productCard ? parseFloat(productCard.querySelector('.price').textContent.replace('$','')) : 0;

    cart.push({ name: productName, qty: 1, price });
  }
  renderCartItems();
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
  updateCartDisplay(); // Mantiene sincronizado contador visual
}

// Cambiar cantidad de un artículo en el carrito
function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  renderCartItems();
}

// Eliminar producto del carrito
function removeItem(index) {
  cart.splice(index, 1);
  renderCartItems();
}

// Obtener cantidad total de productos en carrito
function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

// Actualizar el contador del carrito visible (solo número)
function updateCartDisplay() {
  document.getElementById('cartCount').textContent = getCartCount();
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

// --- Formulario contacto ---
function enviarContacto(e) {
  e.preventDefault();
  alert("¡Mensaje enviado! Pronto te contactaremos.");
  e.target.reset();
}

// --- Blog con imágenes y carrusel ---

const posts = {
  'bienestar': {
    title: '5 Consejos de Bienestar Femenino',
    date: '24/07/2025',
    image: 'img/blog_bienestar.jpg',
    excerpt: 'Mantener y potenciar tu bienestar físico y emocional es clave para una vida plena.',
    content: `
      <img src="img/blog_bienestar.jpg" class="blog-img-detalle" alt="Bienestar femenino">
      <p><b>1. Escucha a tu cuerpo.</b> Aprende a reconocer tus necesidades físicas y emocionales.<br>
      <b>2. Prioriza el descanso.</b> El sueño adecuado regenera tu energía.<br>
      <b>3. Alimentación balanceada.</b> Integra productos naturales y alimentos frescos.<br>
      <b>4. Haz ejercicio suave.</b> Yoga o caminatas breves son ideales.<br>
      <b>5. Crea rituales de autocuidado.</b> Un baño, aromaterapia o leer, dedica tiempo solo para ti.</p>
      <p>Recuerda que el bienestar femenino es integral y valioso para tu día a día.<br>
      <i>¿Tienes preguntas sobre cómo mejorar tu bienestar? ¡Contáctanos!</i></p>
    `
  },
  'aromaterapia': {
    title: 'Beneficios de la Aromaterapia en Casa',
    date: '15/07/2025',
    image: 'img/blog_aromaterapia.jpg',
    excerpt: 'La aromaterapia ayuda a relajarte, dormir mejor e incluso mejorar tu humor.',
    content: `
      <img src="img/blog_aromaterapia.jpg" class="blog-img-detalle" alt="Aromaterapia">
      <p>Los aceites esenciales pueden ayudarte a:<br>
      <b>• Relajarte</b> después de un día intenso.<br>
      <b>• Dormir mejor</b> usando lavanda en tu habitación.<br>
      <b>• Mejorar el estado de ánimo</b> con cítricos o flores.<br>
      Usa difusores, pequeños masajes o agrega gotas a tu baño.<br></p>
      <p>Siempre compra aceites de calidad y consúltanos si quieres saber cuál es ideal para ti o para cada ocasión.</p>
    `
  }
};

let carouselIndex = 0;
const postKeys = Object.keys(posts);

function renderCarousel() {
  const track = document.getElementById('carouselTrack');
  track.innerHTML = '';
  const key = postKeys[carouselIndex];
  const post = posts[key];
  const slide = document.createElement('div');
  slide.className = 'carousel-slide';
  slide.onclick = () => openBlog(key);
  slide.innerHTML = `
    <img src="${post.image}" alt="${post.title}">
    <h4>${post.title}</h4>
    <p>${post.excerpt}</p>
    <span class="leer-mas">Leer más →</span>
  `;
  track.appendChild(slide);
}

function moveCarousel(dir) {
  carouselIndex += dir;
  if (carouselIndex < 0) carouselIndex = postKeys.length - 1;
  if (carouselIndex >= postKeys.length) carouselIndex = 0;
  renderCarousel();
}

// Renderizar listado de previews con imágenes
function renderBlogList() {
  const blogList = document.querySelector('.blog-list');
  blogList.innerHTML = '';
  for (const key of postKeys) {
    const post = posts[key];
    const previewDiv = document.createElement('div');
    previewDiv.className = 'blog-post-preview';
    previewDiv.onclick = () => openBlog(key);
    previewDiv.innerHTML = `
      <img src="${post.image}" alt="${post.title}" class="blog-img-preview" />
      <h3>${post.title}</h3>
      <span class="blog-date">${post.date}</span>
      <p>${post.excerpt}</p>
      <span class="leer-mas">Leer más →</span>
    `;
    blogList.appendChild(previewDiv);
  }
}

// Mostrar un post individual en el blog
function openBlog(postKey) {
  const post = posts[postKey];
  if (!post) return;
  document.querySelector('.blog-list').style.display = 'none';
  document.getElementById('blogCarousel').style.display = 'none';
  const blogDetail = document.getElementById('blog-detail');
  blogDetail.innerHTML = `<h3>${post.title}</h3><span class="blog-date">${post.date}</span>${post.content}`;
  blogDetail.style.display = 'block';
  document.getElementById('volverBlog').style.display = 'block';
}

// Volver al listado de posts y carrusel
function closeBlog() {
  document.getElementById('blog-detail').style.display = 'none';
  document.getElementById('volverBlog').style.display = 'none';
  document.querySelector('.blog-list').style.display = 'flex';
  document.getElementById('blogCarousel').style.display = 'flex';
}

// Al cargar la página inicializar contador, carrusel y lista blog
document.addEventListener('DOMContentLoaded', () => {
  updateCartDisplay();
  renderCarousel();
  renderBlogList();
});
