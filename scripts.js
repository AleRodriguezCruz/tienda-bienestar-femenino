let cart = JSON.parse(localStorage.getItem('carrito')) || {};

document.addEventListener('DOMContentLoaded', () => {
  // Elementos UI
  const cartCountEl = document.getElementById('cart-count');
  const cartModal = document.getElementById('cart-modal');
  const cartProductsList = document.getElementById('cart-products-list');
  const cartTotal = document.getElementById('cart-total');
  const closeCartBtn = document.getElementById('close-cart');
  const cartIcon = document.getElementById('cart-icon');
  const modalAddCartBtn = document.getElementById('modal-add-cart');
  const productModal = document.getElementById('product-modal');
  const modalCloseBtn = productModal?.querySelector('.close');
  const modalCancelBtn = document.getElementById('modal-cancel');
  const productosContainer = document.querySelector('.productos-carousel-container');
  const tiendaBtn = document.getElementById('tienda-btn');
  const megaMenu = document.getElementById('mega-menu');
  const menuToggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('menu');
  const dropdown = tiendaBtn?.closest('.dropdown');
  const productosContenedor = document.getElementById('productos-seleccionados');

  if (productosContenedor) productosContenedor.style.display = 'none';

  // Actualizar contador carrito
  function updateCartCount() {
    if (!cartCountEl) return;
    const totalItems = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
    cartCountEl.textContent = totalItems;
    cartCountEl.style.display = totalItems > 0 ? 'inline-block' : 'none';
  }

  // Renderizar carrito
  function renderCart() {
    if (!cartProductsList) return;
    cartProductsList.innerHTML = '';
    let total = 0;

    Object.entries(cart).forEach(([key, product]) => {
      total += product.qty * product.price;

      const row = document.createElement('div');
      row.className = 'cart-product-row';
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.justifyContent = 'space-between';
      row.style.gap = '10px';
      row.style.padding = '16px 0';
      row.style.borderBottom = '1px solid #eee';

      const img = document.createElement('img');
      img.src = product.image || 'placeholder.jpg';
      img.alt = product.name;
      img.style.width = '48px';
      img.style.height = '48px';
      img.style.objectFit = 'cover';
      img.style.borderRadius = '6px';

      const info = document.createElement('div');
      info.style.flex = '1';
      info.style.marginLeft = '10px';
      info.innerHTML = `<strong>${product.name}</strong><br>Qty: ${product.qty} x $${product.price.toFixed(2)}`;

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

      row.appendChild(img);
      row.appendChild(info);
      row.appendChild(btnDelete);

      cartProductsList.appendChild(row);
    });

    if (cartTotal) {
      cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    }
  }

  // Almacena en localStorage y actualiza UI
  function saveAndRenderCart() {
    localStorage.setItem('carrito', JSON.stringify(cart));
    renderCart();
    updateCartCount();
  }

  // Abrir modal producto con datos
  productosContainer?.querySelectorAll('.productos-carousel-slide .see-more-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const slide = e.target.closest('.productos-carousel-slide');
      if (!slide) return;
      document.getElementById('modal-img').src = slide.dataset.image || '';
      document.getElementById('modal-name').textContent = slide.dataset.name || '';
      document.getElementById('modal-desc').textContent = slide.dataset.desc || 'Sin descripción.';
      document.getElementById('modal-price').textContent = slide.dataset.price ? `$${slide.dataset.price}` : '';
      document.getElementById('modal-qty').value = 1;
      productModal.style.display = 'flex';
    });
  });

  // Cerrar modal producto
  modalCloseBtn?.addEventListener('click', () => productModal.style.display = 'none');
  modalCancelBtn?.addEventListener('click', () => productModal.style.display = 'none');
  productModal?.addEventListener('click', e => { if (e.target === productModal) productModal.style.display = 'none'; });

  // Agregar al carrito desde modal producto
  modalAddCartBtn?.addEventListener('click', () => {
    const name = document.getElementById('modal-name').textContent.trim();
    let qty = parseInt(document.getElementById('modal-qty').value, 10);
    if (isNaN(qty) || qty < 1) qty = 1;
    const priceText = document.getElementById('modal-price').textContent.replace('$', '').trim();
    const productPrice = parseFloat(priceText) || 0;
    const productImage = document.getElementById('modal-img').src || '';

    if (cart[name]) {
      cart[name].qty += qty;
      cart[name].price = productPrice;
      cart[name].image = productImage;
    } else {
      cart[name] = { name, qty, price: productPrice, image: productImage };
    }
    saveAndRenderCart();
    alert(`Producto "${name}" agregado al carrito (${qty} pieza${qty > 1 ? 's' : ''}).`);
    productModal.style.display = 'none';
  });

  // Abrir modal carrito
  cartIcon?.addEventListener('click', () => {
    renderCart();
    cartModal.style.display = 'flex';
  });

  // Cerrar modal carrito
  closeCartBtn?.addEventListener('click', () => cartModal.style.display = 'none');
  cartModal?.addEventListener('click', e => { if (e.target === cartModal) cartModal.style.display = 'none'; });

  // Checkout simulado
  const checkoutBtn = document.getElementById('checkout-btn');
  checkoutBtn?.addEventListener('click', () => {
    if (Object.keys(cart).length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
    const selectedPaymentEl = document.querySelector('input[name="payment-method"]:checked');
    const selectedPayment = selectedPaymentEl ? selectedPaymentEl.value : 'sin método seleccionado';

    alert(`Procesando pago por $${Object.values(cart).reduce((sum, p) => sum + p.price * p.qty, 0).toFixed(2)} con método: ${selectedPayment}`);
    cart = {};
    saveAndRenderCart();
    cartModal.style.display = 'none';
  });

  // Menú hamburguesa toggle
  menuToggle?.addEventListener('click', () => {
    if (!menu || !dropdown || !tiendaBtn) return;
    const isOpen = menu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    if (isOpen) {
      dropdown.classList.remove('open');
      tiendaBtn.setAttribute('aria-expanded', 'false');
      megaMenu.classList.remove('open');
    }
  });

  // Mega menú toggle
  tiendaBtn?.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    if (!dropdown || !megaMenu || !menu || !menuToggle) return;
    const isOpen = dropdown.classList.toggle('open');
    megaMenu.classList.toggle('open', isOpen);
    tiendaBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    if (isOpen) {
      menu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Cerrar menús al click fuera
  document.addEventListener('click', e => {
    if (dropdown && !dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
      megaMenu?.classList.remove('open');
      tiendaBtn?.setAttribute('aria-expanded', 'false');
    }
    if (menu && menuToggle && !menu.contains(e.target) && e.target !== menuToggle && menu.classList.contains('open')) {
      menu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Tecla Escape cierra menús y modales
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (dropdown?.classList.contains('open')) {
        dropdown.classList.remove('open');
        megaMenu?.classList.remove('open');
        tiendaBtn?.setAttribute('aria-expanded', 'false');
      }
      if (menu?.classList.contains('open')) {
        menu.classList.remove('open');
        menuToggle?.setAttribute('aria-expanded', 'false');
      }
      if (productModal?.style.display === 'flex') productModal.style.display = 'none';
      if (cartModal?.style.display === 'flex') cartModal.style.display = 'none';
    }
  });

  // Filtrar productos por categoría
  const productosSlides = document.querySelectorAll('.productos-carousel-slide');
  const dropdownLinks = document.querySelectorAll('.dropdown-content a[data-category]');

  dropdownLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const category = link.dataset.category;

      productosSlides.forEach(slide => {
        if (!category || category === 'todos') {
          slide.style.display = 'flex';
        } else {
          slide.style.display = (slide.dataset.category === category) ? 'flex' : 'none';
        }
      });

      // Reset carrusel productos
      const productosContainer_ = document.querySelector('.productos-carousel-container');
      if (productosContainer_) {
        const track = productosContainer_.querySelector('.productos-carousel-track');
        if(track) track.style.transform = 'translateX(0)';
      }

      // Mostrar productos filtrados destacados en sección aparte
      if (productosContenedor) {
        const filtrados = Array.from(productosSlides).filter(slide => slide.style.display === 'flex').slice(0, 4);
        if (filtrados.length && category !== 'todos') {
          productosContenedor.style.display = 'flex';
          productosContenedor.innerHTML = '';
          filtrados.forEach(slide => {
            const nombre = slide.dataset.name || '';
            const desc = slide.dataset.desc || '';
            const precio = slide.dataset.price || '';
            const img = slide.dataset.image || '';
            productosContenedor.insertAdjacentHTML('beforeend', `
              <div class="producto-card">
                <img src="${img}" alt="${nombre}" />
                <h4>${nombre}</h4>
                <p>${desc}</p>
                <strong>$${precio}</strong>
              </div>
            `);
          });
          productosContenedor.scrollIntoView({behavior:'smooth'});
        } else {
          productosContenedor.style.display = 'none';
          productosContenedor.innerHTML = '';
        }
      }

      // Scroll a sección tienda principal
      const tiendaSection = document.getElementById('tienda');
      tiendaSection?.scrollIntoView({ behavior: 'smooth' });

      // Cerrar mega menú
      if (megaMenu?.classList.contains('open')) {
        megaMenu.classList.remove('open');
        tiendaBtn?.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Inicia el contador carrito
  updateCartCount();
});
document.addEventListener('DOMContentLoaded', () => {
  // -- CARRUSEL BENEFICIOS --
  const carouselContainer = document.querySelector('.carousel-container');
  if (carouselContainer) {
    const track = carouselContainer.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const btnNext = carouselContainer.querySelector('.carousel-btn.next');
    const btnPrev = carouselContainer.querySelector('.carousel-btn.prev');

    let currentIndex = 0;

    function getSlidesToShow() {
      return window.innerWidth <= 500 ? 1 : 5;
    }

    function getSlideWidth() {
      return slides[0].getBoundingClientRect().width + 18; // width + margin-right
    }

    function moveToSlide(index) {
      const slidesToShow = getSlidesToShow();
      if (index < 0) index = 0;
      if (index > slides.length - slidesToShow) index = slides.length - slidesToShow;
      track.style.transform = `translateX(-${getSlideWidth() * index}px)`;
      currentIndex = index;
      btnPrev.disabled = currentIndex === 0;
      btnNext.disabled = currentIndex >= slides.length - slidesToShow;
    }

    btnPrev.addEventListener('click', () => moveToSlide(currentIndex - 1));
    btnNext.addEventListener('click', () => moveToSlide(currentIndex + 1));
    moveToSlide(0);

    window.addEventListener('resize', () => moveToSlide(0));
  }

  // -- CARRUSEL PRODUCTOS --
  const productosCarousel = document.querySelector('.productos-carousel-container');
  if (productosCarousel) {
    const track = productosCarousel.querySelector('.productos-carousel-track');
    const slides = Array.from(track.children);
    const btnNext = productosCarousel.querySelector('.productos-carousel-btn.next');
    const btnPrev = productosCarousel.querySelector('.productos-carousel-btn.prev');

    let currentIndex = 0;

    function getSlidesToShow() {
      return window.innerWidth <= 480 ? 1 : 4;
    }

    function getSlideWidth() {
      return slides[0].getBoundingClientRect().width + 18;
    }

    function moveToSlide(index) {
      const slidesToShow = getSlidesToShow();
      if (index < 0) index = 0;
      if (index > slides.length - slidesToShow) index = slides.length - slidesToShow;
      track.style.transform = `translateX(-${getSlideWidth() * index}px)`;
      currentIndex = index;
      btnPrev.disabled = currentIndex === 0;
      btnNext.disabled = currentIndex >= slides.length - slidesToShow;
    }

    btnPrev.addEventListener('click', () => moveToSlide(currentIndex - 1));
    btnNext.addEventListener('click', () => moveToSlide(currentIndex + 1));
    moveToSlide(0);

    window.addEventListener('resize', () => moveToSlide(0));
  }
});

// En respuesta al tamaño pantalla, solo usar transform en desktop, en móvil usar scroll natural

function isMobile() {
  return window.innerWidth <= 768;
}

// Ejemplo en función moveToSlide:

if (!isMobile()) {
  track.style.transform = `translateX(-${slideWidth * index}px)`;
} else {
  // En móvil no aplicar transform, navegación por scroll natural
}
