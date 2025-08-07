let cart = JSON.parse(localStorage.getItem('carrito')) || {};

document.addEventListener('DOMContentLoaded', () => {
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

  function updateCartCount() {
    if (!cartCountEl) return;
    const totalItems = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
    cartCountEl.textContent = totalItems;
    cartCountEl.style.display = totalItems > 0 ? 'inline-block' : 'none';
  }

  function renderCart() {
    if (!cartProductsList) return;
    cartProductsList.innerHTML = '';
    let total = 0;

    Object.entries(cart).forEach(([key, product]) => {
      total += product.qty * product.price;

      const row = document.createElement('div');
      row.className = 'cart-product-row';

      const img = document.createElement('img');
      img.src = product.image || 'placeholder.jpg';
      img.alt = product.name;

      const info = document.createElement('div');
      info.className = 'cart-product-info';
      info.innerHTML = `<strong>${product.name}</strong><br>Qty: ${product.qty} x $${product.price.toFixed(2)}`;

      const btnDelete = document.createElement('button');
      btnDelete.textContent = 'Eliminar';
      btnDelete.className = 'eliminar';
      btnDelete.onclick = () => {
        delete cart[key];
        saveAndRenderCart();
      };

      const priceEl = document.createElement('div');
      priceEl.className = 'cart-product-price';
      priceEl.textContent = `$${(product.qty * product.price).toFixed(2)}`;

      row.appendChild(img);
      row.appendChild(info);
      row.appendChild(btnDelete);
      row.appendChild(priceEl);

      cartProductsList.appendChild(row);
    });

    if (cartTotal) {
      cartTotal.textContent = `$${total.toFixed(2)}`;
    }
  }

  function saveAndRenderCart() {
    localStorage.setItem('carrito', JSON.stringify(cart));
    renderCart();
    updateCartCount();
  }

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

  modalCloseBtn?.addEventListener('click', () => productModal.style.display = 'none');
  modalCancelBtn?.addEventListener('click', () => productModal.style.display = 'none');
  productModal?.addEventListener('click', e => { if (e.target === productModal) productModal.style.display = 'none'; });

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

  cartIcon?.addEventListener('click', () => {
    renderCart();
    cartModal.style.display = 'flex';
  });

  closeCartBtn?.addEventListener('click', () => cartModal.style.display = 'none');
  cartModal?.addEventListener('click', e => { if (e.target === cartModal) cartModal.style.display = 'none'; });

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

      const productosContainer_ = document.querySelector('.productos-carousel-container');
      if (productosContainer_) {
        const track = productosContainer_.querySelector('.productos-carousel-track');
        if(track) track.style.transform = 'translateX(0)';
      }

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

      const tiendaSection = document.getElementById('tienda');
      tiendaSection?.scrollIntoView({ behavior: 'smooth' });

      if (megaMenu?.classList.contains('open')) {
        megaMenu.classList.remove('open');
        tiendaBtn?.setAttribute('aria-expanded', 'false');
      }
    });
  });

  updateCartCount();
});

// Carruseles JS separados para mejor claridad y funcionamiento móvil

document.addEventListener('DOMContentLoaded', () => {
  // Carrusel beneficios
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

  // Carrusel productos
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
