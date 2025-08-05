document.addEventListener('DOMContentLoaded', () => {
  // Carrusel Beneficios
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

  // Carrusel Productos
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

    // Carrito
    let cart = JSON.parse(localStorage.getItem('carrito')) || {};
    const cartCountEl = document.getElementById('cart-count');
    const cartModal = document.getElementById('cart-modal');
    const cartProductsList = document.getElementById('cart-products-list');
    const cartEmptyMsg = document.getElementById('cart-empty-msg');
    const cartIcon = document.getElementById('cart-icon');
    const closeCartBtn = document.getElementById('close-cart');

    function updateCartCount() {
      const totalItems = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
      if (cartCountEl) {
        cartCountEl.textContent = totalItems;
        cartCountEl.style.display = totalItems > 0 ? 'inline-block' : 'none';
      }
    }

    function renderCart() {
      if (!cartProductsList || !cartEmptyMsg) return;
      cartProductsList.innerHTML = '';
      const entries = Object.entries(cart);
      if (entries.length === 0) {
        cartEmptyMsg.style.display = 'block';
        cartProductsList.style.display = 'none';
      } else {
        cartEmptyMsg.style.display = 'none';
        cartProductsList.style.display = 'block';
        entries.forEach(([name, item]) => {
          const li = document.createElement('li');
          li.textContent = `${item.name} x ${item.qty}`;
          cartProductsList.appendChild(li);
        });
      }
    }

    if (cartIcon) {
      cartIcon.addEventListener('click', () => {
        renderCart();
        if (cartModal) cartModal.classList.add('active');
      });
    }

    if (closeCartBtn) {
      closeCartBtn.addEventListener('click', () => {
        if (cartModal) cartModal.classList.remove('active');
      });
    }

    if (cartModal) {
      cartModal.addEventListener('click', e => {
        if (e.target === cartModal) cartModal.classList.remove('active');
      });
    }

    productosContainer.querySelectorAll('.productos-carousel-slide .add-cart-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const slide = e.target.closest('.productos-carousel-slide');
        if (!slide) {
          alert('Producto no encontrado');
          return;
        }
        const productNameEl = slide.querySelector('.product-name');
        const productName = productNameEl ? productNameEl.textContent.trim() : 'Producto desconocido';

        if (cart[productName]) {
          cart[productName].qty++;
        } else {
          cart[productName] = { name: productName, qty: 1 };
        }
        localStorage.setItem('carrito', JSON.stringify(cart));
        updateCartCount();
        alert(`Producto "${productName}" agregado al carrito.`);
      });
    });

    updateCartCount();
  }
});

// Modal abrir con datos producto
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.productos-carousel-slide .see-more-btn').forEach(btn => {
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

  // Cerrar modal
  document.querySelector('#product-modal .close').addEventListener('click', () => {
    document.getElementById('product-modal').style.display = 'none';
  });

  // Cerrar modal al click afuera
  document.getElementById('product-modal').addEventListener('click', (e) => {
    if (e.target.id === 'product-modal') {
      document.getElementById('product-modal').style.display = 'none';
    }
  });

  // Añadir producto desde modal al carrito
  document.getElementById('modal-add-cart').addEventListener('click', () => {
    const name = document.getElementById('modal-name').textContent;
    let qty = parseInt(document.getElementById('modal-qty').value, 10);
    if (isNaN(qty) || qty < 1) qty = 1;
    
    let cart = JSON.parse(localStorage.getItem('carrito')) || {};

    if (cart[name]) {
      cart[name].qty += qty;
    } else {
      cart[name] = { name, qty };
    }

    localStorage.setItem('carrito', JSON.stringify(cart));
    alert(`Producto "${name}" agregado al carrito (${qty} piezas).`);
    document.getElementById('product-modal').style.display = 'none';

    // Usar función para actualizar contador
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
      const totalItems = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
      cartCountEl.textContent = totalItems;
      cartCountEl.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }
  });
});


function updateCartCount() {
  const totalItems = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
  console.log('Total items en carrito:', totalItems); // <-- depurar
  if (cartCountEl) {
    cartCountEl.textContent = totalItems;
    cartCountEl.style.display = totalItems > 0 ? 'inline-block' : 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('menu');

  menuToggle.addEventListener('click', () => {
    const isActive = menu.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isActive);
  });
});
