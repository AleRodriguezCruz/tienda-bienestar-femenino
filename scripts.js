// Carrito global
let cart = [];

// FILTRO PRODUCTOS POR CATEGORÍA
function filterProducts(category, event) {
  const cards = document.querySelectorAll('.products .card');
  cards.forEach(card => {
    card.style.display = (category === 'all' || card.classList.contains(category)) ? 'flex' : 'none';
  });
  document.querySelectorAll('.filters button').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
}

// AGREGAR AL CARRITO
function addToCart(productName) {
  const index = cart.findIndex(item => item.name === productName);
  if (index !== -1) {
    cart[index].qty++;
  } else {
    const productCard = [...document.querySelectorAll('.card')].find(c => c.querySelector('h3').textContent === productName);
    const priceText = productCard.querySelector('.price').textContent;
    const price = parseFloat(priceText.replace('$',''));
    cart.push({ name: productName, qty: 1, price });
  }
  renderCart();
  updateCartIcon();
  alert(`Producto "${productName}" añadido al carrito.`);
}

function renderCart() {
  const cartItems = document.getElementById('cartItems');
  cartItems.innerHTML = '';
  let total = 0;
  
  if (cart.length === 0) {
    cartItems.innerHTML = '<p>El carrito está vacío.</p>';
  } else {
    cart.forEach((item, i) => {
      total += item.qty * item.price;
      cartItems.innerHTML += `
        <div class="cart-item">
          <span>${item.name} (${item.qty}) - $${(item.price * item.qty).toFixed(2)}</span>
          <button onclick="changeQty(${i}, -1)">-</button>
          <button onclick="changeQty(${i}, 1)">+</button>
          <button onclick="removeFromCart(${i})">×</button>
        </div>`;
    });
  }
  document.getElementById('cartTotal').textContent = `Total: $${total.toFixed(2)}`;
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  renderCart();
  updateCartIcon();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
  updateCartIcon();
}

function updateCartIcon() {
  document.getElementById('cartCount').textContent = cart.reduce((sum, item) => sum + item.qty, 0);
}

function mostrarCarrito() {
  document.getElementById('cartModal').style.display = 'block';
  renderCart();
}

function closeCart() {
  document.getElementById('cartModal').style.display = 'none';
}

function checkoutCart() {
  if (cart.length === 0) {
    alert('El carrito está vacío.');
    return;
  }
  alert('Gracias por tu compra! (Simulación)');
  cart = [];
  renderCart();
  updateCartIcon();
  closeCart();
}

// FORMULARIO CONTACTO
function enviarContacto(e) {
  e.preventDefault();
  alert('¡Mensaje enviado! Pronto nos pondremos en contacto.');
  e.target.reset();
}

// BLOG: posts y carrusel

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
  const post = posts[postKeys[carouselIndex]];
  const slide = document.createElement('div');
  slide.className = 'carousel-slide';
  slide.innerHTML = `
    <img src="${post.image}" alt="${post.title}">
    <h4>${post.title}</h4>
    <p>${post.excerpt}</p>
    <span class="leer-mas">Leer más →</span>
  `;
  slide.onclick = () => openBlog(postKeys[carouselIndex]);
  track.appendChild(slide);
}

function moveCarousel(dir) {
  carouselIndex += dir;
  if (carouselIndex < 0) carouselIndex = postKeys.length - 1;
  if (carouselIndex >= postKeys.length) carouselIndex = 0;
  renderCarousel();
}

function renderBlogList() {
  const blogList = document.querySelector('.blog-list');
  blogList.innerHTML = '';
  postKeys.forEach(key => {
    const post = posts[key];
    const preview = document.createElement('div');
    preview.className = 'blog-post-preview';
    preview.innerHTML = `
      <img src="${post.image}" alt="${post.title}" class="blog-img-preview" />
      <h3>${post.title}</h3>
      <span class="blog-date">${post.date}</span>
      <p>${post.excerpt}</p>
      <span class="leer-mas">Leer más →</span>
    `;
    preview.onclick = () => openBlog(key);
    blogList.appendChild(preview);
  });
}

function openBlog(key) {
  const post = posts[key];
  document.querySelector('.blog-list').style.display = 'none';
  document.getElementById('blogCarousel').style.display = 'none';
  const blogDetail = document.getElementById('blog-detail');
  blogDetail.innerHTML = `<h3>${post.title}</h3><span class="blog-date">${post.date}</span>${post.content}`;
  blogDetail.style.display = 'block';
  document.getElementById('volverBlog').style.display = 'block';
}

function closeBlog() {
  document.getElementById('blog-detail').style.display = 'none';
  document.getElementById('volverBlog').style.display = 'none';
  document.querySelector('.blog-list').style.display = 'flex';
  document.getElementById('blogCarousel').style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartIcon();
  renderCarousel();
  renderBlogList();
});
