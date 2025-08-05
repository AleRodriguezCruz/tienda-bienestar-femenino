document.addEventListener('DOMContentLoaded', () => {

  // ---------------- Carrusel Beneficios ----------------
  const beneficiosContainer = document.querySelector('.beneficios .carousel-container');
  if (beneficiosContainer) {
    const beneficiosTrack = beneficiosContainer.querySelector('.carousel-track');
    const beneficiosSlides = Array.from(beneficiosTrack.children);
    const beneficiosNextBtn = beneficiosContainer.querySelector('.carousel-btn.next');
    const beneficiosPrevBtn = beneficiosContainer.querySelector('.carousel-btn.prev');
    const beneficiosSlidesToShow = 5;

    let beneficiosSlideIndex = 0;

    function moveBeneficiosSlide(index) {
      const slideWidth = beneficiosSlides[0].getBoundingClientRect().width + 18;
      const maxIndex = beneficiosSlides.length - beneficiosSlidesToShow;
      if (index < 0) index = maxIndex;
      if (index > maxIndex) index = 0;
      beneficiosTrack.style.transform = `translateX(-${slideWidth * index}px)`;
      beneficiosSlideIndex = index;
    }

    beneficiosNextBtn.addEventListener('click', () => moveBeneficiosSlide(beneficiosSlideIndex + 1));
    beneficiosPrevBtn.addEventListener('click', () => moveBeneficiosSlide(beneficiosSlideIndex - 1));

    moveBeneficiosSlide(0);
    window.addEventListener('resize', () => moveBeneficiosSlide(beneficiosSlideIndex));
  }

  // ---------------- Carrusel Productos ----------------
  const productosContainer = document.querySelector('.productos-carousel-container');
  if (productosContainer) {
    const productosTrack = productosContainer.querySelector('.productos-carousel-track');
    const productosSlides = Array.from(productosTrack.children);
    const productosNextBtn = productosContainer.querySelector('.productos-carousel-btn.next');
    const productosPrevBtn = productosContainer.querySelector('.productos-carousel-btn.prev');
    const productosSlidesToShow = 4;

    let productosSlideIndex = 0;

    function moveProductosSlide(index) {
      const slideWidth = productosSlides[0].getBoundingClientRect().width + 18;
      const maxIndex = productosSlides.length - productosSlidesToShow;
      if (index < 0) index = maxIndex;
      if (index > maxIndex) index = 0;
      productosTrack.style.transform = `translateX(-${slideWidth * index}px)`;
      productosSlideIndex = index;
    }

    productosNextBtn.addEventListener('click', () => moveProductosSlide(productosSlideIndex + 1));
    productosPrevBtn.addEventListener('click', () => moveProductosSlide(productosSlideIndex - 1));

    moveProductosSlide(0);
    window.addEventListener('resize', () => moveProductosSlide(productosSlideIndex));

    // ---------------- Carrito ----------------
    let cart = JSON.parse(localStorage.getItem('carrito')) || {};
    const cartCountEl = document.getElementById('cart-count');
    const cartModal = document.getElementById('cart-modal');
    const cartProductsList = document.getElementById('cart-products-list');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const closeCartBtn = document.getElementById('close-cart');
    const cartIcon = document.getElementById('cart-icon');

    function updateCartCount() {
      const totalItems = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
      if (cartCountEl) {
        cartCountEl.textContent = totalItems;
        cartCountEl.style.display = totalItems > 0 ? 'inline-block' : 'none';
      }
    }

    function renderCart() {
      if (!cartProductsList) return;
      cartProductsList.innerHTML = '';
      let total = 0;
      Object.entries(cart).forEach(([key, product]) => {
        total += product.qty * product.price;

        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.alignItems = 'center';
        li.style.marginBottom = '12px';

        li.textContent = `${product.name} x ${product.qty} - $${(product.price * product.qty).toFixed(2)}`;

        const btnDelete = document.createElement('button');
        btnDelete.textContent = 'Eliminar';
        btnDelete.style.marginLeft = '10px';
        btnDelete.style.background = '#cc3333';
        btnDelete.style.color = 'white';
        btnDelete.style.border = 'none';
        btnDelete.style.borderRadius = '6px';
        btnDelete.style.cursor = 'pointer';
        btnDelete.style.padding = '4px 8px';
        btnDelete.onclick = () => {
          delete cart[key];
          saveAndRenderCart();
        };

        li.appendChild(btnDelete);
        cartProductsList.appendChild(li);
      });

      if (cartTotal) {
        cartTotal.textContent = `Total: $${total.toFixed(2)}`;
      }
    }

    function saveAndRenderCart() {
      localStorage.setItem('carrito', JSON.stringify(cart));
      renderCart();
      updateCartCount();
    }

    if (cartIcon) {
      cartIcon.addEventListener('click', () => {
        renderCart();
        if (cartModal) cartModal.style.display = 'flex';
      });
    }

    if (closeCartBtn) {
      closeCartBtn.addEventListener('click', () => {
        if (cartModal) cartModal.style.display = 'none';
      });
    }

    if (cartModal) {
      cartModal.addEventListener('click', e => {
        if (e.target === cartModal) cartModal.style.display = 'none';
      });
    }

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        alert('Aquí deberías integrar la pasarela de pago o formulario de compra.');
        // Implementar aquí la integración de pago o formulario.
      });
    }

    // Botón "Ver producto"
    productosContainer.querySelectorAll('.productos-carousel-slide .see-more-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const slide = e.target.closest('.productos-carousel-slide');
        if (!slide) return;
        document.getElementById('modal-img').src = slide.dataset.image || '';
        document.getElementById('modal-name').textContent = slide.dataset.name || '';
        document.getElementById('modal-desc').textContent = slide.dataset.desc || "Sin descripción.";
        document.getElementById('modal-price').textContent = slide.dataset.price ? `$${slide.dataset.price}` : '';
        document.getElementById('modal-qty').value = 1;
        document.getElementById('product-modal').style.display = 'flex';
      });
    });

    // Botón "Agregar al carrito" en carrusel
    productosContainer.querySelectorAll('.productos-carousel-slide .add-cart-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const slide = e.target.closest('.productos-carousel-slide');
        if (!slide) {
          alert('Producto no encontrado');
          return;
        }
        const productName = slide.dataset.name || 'Producto desconocido';
        const productPrice = parseFloat(slide.dataset.price) || 0;

        if (cart[productName]) {
          cart[productName].qty++;
          cart[productName].price = productPrice;
        } else {
          cart[productName] = { name: productName, qty: 1, price: productPrice };
        }
        saveAndRenderCart();
        alert(`Producto "${productName}" agregado al carrito.`);
      });
    });

    // Botón "Agregar al carrito" en modal producto
    const modalAddCartBtn = document.getElementById('modal-add-cart');
    if (modalAddCartBtn) {
      modalAddCartBtn.addEventListener('click', () => {
        const name = document.getElementById('modal-name').textContent;
        let qty = parseInt(document.getElementById('modal-qty').value, 10);
        if (isNaN(qty) || qty < 1) qty = 1;

        const priceText = document.getElementById('modal-price').textContent.replace('$', '').trim();
        const productPrice = parseFloat(priceText) || 0;

        if (cart[name]) {
          cart[name].qty += qty;
          cart[name].price = productPrice;
        } else {
          cart[name] = { name, qty, price: productPrice };
        }

        saveAndRenderCart();
        alert(`Producto "${name}" agregado al carrito (${qty} piezas).`);
        document.getElementById('product-modal').style.display = 'none';
      });
    }

    updateCartCount();
  }

  // ---------------- Menu hamburguesa ----------------
  const menuToggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('menu');
  if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
      const isActive = menu.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', isActive);
    });
  }

  // ---------------- Scroll suave con compensación header fijo ----------------
  document.querySelectorAll('nav#menu a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetID = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetID);
      if (targetElement) {
        const headerOffset = 70; // altura del header fijo
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
      if (menu.classList.contains('active')) {
        menu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', false);
      }
    });
  });

});

// Lista vacía o con productos en localStorage
let cart = JSON.parse(localStorage.getItem('carrito')) || {};
const cartCountEl = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const cartProductsList = document.getElementById('cart-products-list');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const closeCartBtn = document.getElementById('close-cart');
const cartIcon = document.getElementById('cart-icon');

// Actualiza el número en el icono carrito
function updateCartCount() {
  const totalItems = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
  if (cartCountEl) {
    cartCountEl.textContent = totalItems;
    cartCountEl.style.display = totalItems > 0 ? 'inline-block' : 'none';
  }
}

// Renderiza productos en modal carrito y total
function renderCart() {
  if (!cartProductsList) return;
  cartProductsList.innerHTML = '';
  let total = 0;
  Object.entries(cart).forEach(([key, product]) => {
    total += product.qty * product.price;

    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';
    li.style.alignItems = 'center';
    li.style.marginBottom = '12px';
    li.style.gap = '15px';

    // Imagen producto
    const img = document.createElement('img');
    img.src = product.image || '';
    img.alt = product.name;
    img.style.width = '50px';
    img.style.height = '50px';
    img.style.objectFit = 'contain';
    img.style.borderRadius = '6px';

    // Texto con nombre, cantidad y precio
    const productInfo = document.createElement('span');
    productInfo.textContent = `${product.name} x ${product.qty} - $${(product.price * product.qty).toFixed(2)}`;
    productInfo.style.flexGrow = '1';

    const btnDelete = document.createElement('button');
    btnDelete.textContent = 'Eliminar';
    btnDelete.style.marginLeft = '10px';
    btnDelete.style.background = '#cc3333';
    btnDelete.style.color = 'white';
    btnDelete.style.border = 'none';
    btnDelete.style.borderRadius = '6px';
    btnDelete.style.cursor = 'pointer';
    btnDelete.style.padding = '4px 8px';
    btnDelete.onclick = () => {
      delete cart[key];
      saveAndRenderCart();
    };

    li.appendChild(img);
    li.appendChild(productInfo);
    li.appendChild(btnDelete);
    cartProductsList.appendChild(li);
  });

  if (cartTotal) {
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
  }
}

// ejemplo de agregar, adapted para incluir imagen
const productImage = slide.dataset.image || ''; // ruta imagen del producto

if (cart[productName]) {
  cart[productName].qty++;
  cart[productName].price = productPrice;
  cart[productName].image = productImage;
} else {
  cart[productName] = { name: productName, qty: 1, price: productPrice, image: productImage };
}


// Guarda en localStorage y actualiza interfaz
function saveAndRenderCart() {
  localStorage.setItem('carrito', JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

// Abre modal carrito al hacer clic en icono
if (cartIcon) {
  cartIcon.addEventListener('click', () => {
    renderCart();
    if (cartModal) cartModal.style.display = 'flex';
  });
}

// Cierra modal carrito
if (closeCartBtn) {
  closeCartBtn.addEventListener('click', () => {
    if (cartModal) cartModal.style.display = 'none';
  });
}
// Cierra modal al dar clic fuera del contenido
if (cartModal) {
  cartModal.addEventListener('click', e => {
    if (e.target === cartModal) cartModal.style.display = 'none';
  });
}
// Botón de pagar ahora - simula proceso
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (Object.keys(cart).length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
    const selectedPayment = document.querySelector('input[name="payment-method"]:checked').value;
    alert(`Procesando pago por $${Object.values(cart).reduce((sum, p) => sum + p.price * p.qty, 0).toFixed(2)} con método: ${selectedPayment}`);
    // Aquí puedes conectar con pasarela real o formulario de pago

    cart = {};
    saveAndRenderCart();
    cartModal.style.display = 'none';
  });
}

// Botón "Agregar al carrito" en modal producto
const modalAddCartBtn = document.getElementById('modal-add-cart');
if (modalAddCartBtn) {
  modalAddCartBtn.addEventListener('click', () => {
    const name = document.getElementById('modal-name').textContent;
    let qty = parseInt(document.getElementById('modal-qty').value, 10);
    if (isNaN(qty) || qty < 1) qty = 1;

    const priceText = document.getElementById('modal-price').textContent.replace('$', '').trim();
    const productPrice = parseFloat(priceText) || 0;

    if (cart[name]) {
      cart[name].qty += qty;
      cart[name].price = productPrice;
    } else {
      cart[name] = { name, qty, price: productPrice };
    }

    saveAndRenderCart();
    alert(`Producto "${name}" agregado al carrito (${qty} piezas).`);
    document.getElementById('product-modal').style.display = 'none';
  });
}

// Ya estaba la parte para agregar productos desde los botones "Agregar al carrito" de cada producto directamente, asegúrate que class="add-cart-btn" exista en cada producto.

// Inicializar contador carrito
updateCartCount();
