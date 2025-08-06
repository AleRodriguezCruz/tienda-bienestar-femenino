document.addEventListener('DOMContentLoaded', () => {
  // ---------- Variables de UI ----------
  // Carrusel Beneficios
  const beneficiosContainer = document.querySelector('.beneficios .carousel-container');
  // Carrusel Productos
  const productosContainer = document.querySelector('.productos-carousel-container');

  // Carrito
  let cart = JSON.parse(localStorage.getItem('carrito')) || {};
  const cartCountEl = document.getElementById('cart-count');
  const cartModal = document.getElementById('cart-modal');
  const cartProductsList = document.getElementById('cart-products-list');
  const cartTotal = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');
  const closeCartBtn = document.getElementById('close-cart');
  const cartIcon = document.getElementById('cart-icon');

  // Modal producto
  const productModal = document.getElementById('product-modal');
  const modalCloseBtn = productModal?.querySelector('.close');
  const modalAddCartBtn = document.getElementById('modal-add-cart');

  // Menú mega dropdown Tienda
  const tiendaBtn = document.getElementById('tienda-btn');
  const megaMenu = document.getElementById('mega-menu');

  // ---------- FUNCIONES AUXILIARES ----------

  // Actualiza el contador carrito
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

      // Botón eliminar
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

  // Guarda en localStorage y actualiza interfaz carrito
  function saveAndRenderCart() {
    localStorage.setItem('carrito', JSON.stringify(cart));
    renderCart();
    updateCartCount();
  }

  // ---------- CARRUSEL BENEFICIOS ----------
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

    beneficiosNextBtn?.addEventListener('click', () => moveBeneficiosSlide(beneficiosSlideIndex + 1));
    beneficiosPrevBtn?.addEventListener('click', () => moveBeneficiosSlide(beneficiosSlideIndex - 1));

    moveBeneficiosSlide(0);
    window.addEventListener('resize', () => moveBeneficiosSlide(beneficiosSlideIndex));
  }

  // ---------- CARRUSEL PRODUCTOS ----------
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

    productosNextBtn?.addEventListener('click', () => moveProductosSlide(productosSlideIndex + 1));
    productosPrevBtn?.addEventListener('click', () => moveProductosSlide(productosSlideIndex - 1));

    moveProductosSlide(0);
    window.addEventListener('resize', () => moveProductosSlide(productosSlideIndex));

    // Evento para "Ver producto" (abre modal)
    productosContainer.querySelectorAll('.productos-carousel-slide .see-more-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const slide = e.target.closest('.productos-carousel-slide');
        if (!slide) return;
        document.getElementById('modal-img').src = slide.dataset.image || '';
        document.getElementById('modal-name').textContent = slide.dataset.name || '';
        document.getElementById('modal-desc').textContent = slide.dataset.desc || "Sin descripción.";
        document.getElementById('modal-price').textContent = slide.dataset.price ? `$${slide.dataset.price}` : '';
        document.getElementById('modal-qty').value = 1;
        productModal.style.display = 'flex';
      });
    });

    // Botón agregar carrito en cada producto
    productosContainer.querySelectorAll('.productos-carousel-slide .add-cart-btn').forEach(button => {
      button.addEventListener('click', e => {
        e.stopPropagation();
        const slide = e.target.closest('.productos-carousel-slide');
        if (!slide) {
          alert('Producto no encontrado');
          return;
        }
        const productName = slide.dataset.name || 'Producto desconocido';
        const productPrice = parseFloat(slide.dataset.price) || 0;
        const productImage = slide.dataset.image || '';

        if (cart[productName]) {
          cart[productName].qty++;
          cart[productName].price = productPrice;
          cart[productName].image = productImage;
        } else {
          cart[productName] = { name: productName, qty: 1, price: productPrice, image: productImage };
        }
        saveAndRenderCart();
        alert(`Producto "${productName}" agregado al carrito.`);
      });
    });
  }

  // ---------- MODAL PRODUCTO ----------

  // Cerrar modal producto con "X"
  modalCloseBtn?.addEventListener('click', () => {
    productModal.style.display = 'none';
  });

  // Cerrar modal clic fuera de contenido
  productModal?.addEventListener('click', e => {
    if (e.target === productModal) {
      productModal.style.display = 'none';
    }
  });

  // Agregar al carrito desde modal producto
  modalAddCartBtn?.addEventListener('click', () => {
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
    productModal.style.display = 'none';
  });

  // ---------- MODAL CARRITO ----------

  // Abrir modal carrito
  cartIcon?.addEventListener('click', () => {
    renderCart();
    cartModal.style.display = 'flex';
  });

  // Cerrar modal carrito con botón
  closeCartBtn?.addEventListener('click', () => {
    cartModal.style.display = 'none';
  });

  // Cerrar modal carrito clic fuera contenido
  cartModal?.addEventListener('click', e => {
    if (e.target === cartModal) {
      cartModal.style.display = 'none';
    }
  });

  // Checkout simulado
  checkoutBtn?.addEventListener('click', () => {
    if (Object.keys(cart).length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
    const selectedPayment = document.querySelector('input[name="payment-method"]:checked').value;
    alert(`Procesando pago por $${Object.values(cart).reduce((sum, p) => sum + p.price * p.qty, 0).toFixed(2)} con método: ${selectedPayment}`);

    // Aquí conectar con pasarela real o formulario de pago
    cart = {};
    saveAndRenderCart();
    cartModal.style.display = 'none';
  });

  // ---------- MENÚ HAMBURGUESA ----------
  const menuToggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('menu');
  menuToggle?.addEventListener('click', () => {
    const isActive = menu.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isActive);
  });

  // Cerrar menú al hacer click en enlace
  document.querySelectorAll('#menu a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const targetID = anchor.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetID);
      if (targetElement) {
        const headerOffset = 70; // altura del header fijo
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = window.pageYOffset + elementPosition - headerOffset;

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

  // ---------- FILTRO POR CATEGORÍA DESDE MEGA MENÚ ----------

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
          const slideCategory = slide.dataset.category || '';
          slide.style.display = slideCategory === category ? 'flex' : 'none';
        }
      });
      // Reiniciar posición carrusel productos
      const productosContainer_ = document.querySelector('.productos-carousel-container');
      if (productosContainer_) {
        const track = productosContainer_.querySelector('.productos-carousel-track');
        track.style.transform = 'translateX(0)';
      }
      // Scroll suave a tienda
      const tiendaSection = document.getElementById('tienda');
      tiendaSection?.scrollIntoView({ behavior: 'smooth' });
      // Cerrar mega menú si está abierto
      if (megaMenu?.classList.contains('open')) {
        megaMenu.classList.remove('open');
        tiendaBtn?.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // ---------- MEGA MENÚ TIENDA - toggling ----------

  if (tiendaBtn && megaMenu) {
    // Empieza oculto
    megaMenu.classList.remove('open');

    tiendaBtn.addEventListener('click', e => {
      e.stopPropagation();
      megaMenu.classList.toggle('open');
      const expanded = tiendaBtn.getAttribute('aria-expanded') === 'true';
      tiendaBtn.setAttribute('aria-expanded', !expanded);
    });

    document.addEventListener('click', e => {
      if (!megaMenu.contains(e.target) && e.target !== tiendaBtn) {
        megaMenu.classList.remove('open');
        tiendaBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Opcional cerrar con ESC
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        megaMenu.classList.remove('open');
        tiendaBtn.setAttribute('aria-expanded', 'false');
        tiendaBtn.focus();
      }
    });
  }

  // ---------- Inicializar contador carrito ----------
  updateCartCount();
});

document.addEventListener('DOMContentLoaded', () => {
  // --- Menú hamburguesa ---
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('menu');

  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('open');
  });

  // --- Dropdown mega menú Tienda ---
  const tiendaBtn = document.getElementById('tienda-btn');
  const dropdown = tiendaBtn.closest('.dropdown');
  const megaMenu = document.getElementById('mega-menu');

  tiendaBtn.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();

    const otherDropdowns = document.querySelectorAll('.dropdown');
    otherDropdowns.forEach(d => {
      if (d !== dropdown) d.classList.remove('open');
      if (d !== dropdown) d.querySelector('.dropbtn').setAttribute('aria-expanded', 'false');
    });

    dropdown.classList.toggle('open');
    tiendaBtn.setAttribute('aria-expanded', dropdown.classList.contains('open') ? 'true' : 'false');
  });

  // Cierra dropdown al hacer clic fuera
  document.addEventListener('click', e => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
      tiendaBtn.setAttribute('aria-expanded', 'false');
    }
    // Si menú móvil abierto y haces clic fuera, ciérralo
    if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && e.target !== menuToggle) {
      navMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Cierra con Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      dropdown.classList.remove('open');
      tiendaBtn.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('open');
    }
  });
});
