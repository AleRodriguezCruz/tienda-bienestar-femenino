let cart = JSON.parse(localStorage.getItem('carrito')) || {}; // carrito persistente

document.addEventListener('DOMContentLoaded', () => {
  const beneficiosContainer = document.querySelector('.beneficios .carousel-container');
  const productosContainer = document.querySelector('.productos-carousel-container');
  const cartCountEl = document.getElementById('cart-count');
  const cartModal = document.getElementById('cart-modal');
  const cartProductsList = document.getElementById('cart-products-list');
  const cartTotal = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');
  const closeCartBtn = document.getElementById('close-cart');
  const cartIcon = document.getElementById('cart-icon');
  const productModal = document.getElementById('product-modal');
  const modalCloseBtn = productModal?.querySelector('.close');
  const modalAddCartBtn = document.getElementById('modal-add-cart');
  const modalCancelBtn = document.getElementById('modal-cancel');
  const tiendaBtn = document.getElementById('tienda-btn');
  const megaMenu = document.getElementById('mega-menu');
  const menuToggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('menu');
  const dropdown = tiendaBtn.closest('.dropdown');
  const productosContenedor = document.getElementById('productos-seleccionados');

  // Ocultar sección productos seleccionados por defecto
  if (productosContenedor) productosContenedor.style.display = 'none';

  // Actualiza el contador carrito
  function updateCartCount() {
    const totalItems = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
    if (cartCountEl) {
      cartCountEl.textContent = totalItems;
      cartCountEl.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }
  }

  // Renderiza carrito en modal, con productos y total
  function renderCart() {
    if (!cartProductsList) return;
    cartProductsList.innerHTML = '';
    let total = 0;
    Object.entries(cart).forEach(([key, product]) => {
      total += product.qty * product.price;

      // Crear fila del producto
      const row = document.createElement('div');
      row.className = 'cart-product-row';
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.justifyContent = 'space-between';
      row.style.gap = '10px';
      row.style.padding = '16px 0';
      row.style.borderBottom = '1px solid #eee';

      // Imagen producto
      const img = document.createElement('img');
      img.src = product.image || 'placeholder.jpg';
      img.alt = product.name;
      img.style.width = '48px';
      img.style.height = '48px';
      img.style.objectFit = 'cover';
      img.style.borderRadius = '6px';

      // Info producto (nombre, cantidad, precio)
      const info = document.createElement('div');
      info.style.flex = '1';
      info.style.marginLeft = '10px';
      info.innerHTML = `<strong>${product.name}</strong><br>Qty: ${product.qty} x $${product.price.toFixed(2)}`;

      // Botón eliminar producto
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

      // Append elementos a fila
      row.appendChild(img);
      row.appendChild(info);
      row.appendChild(btnDelete);

      // Añadir fila al contenedor del carrito
      cartProductsList.appendChild(row);
    });

    // Actualizar total en modal
    if (cartTotal) {
      cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    }
  }

  // Guarda en localStorage y actualiza UI carrito
  function saveAndRenderCart() {
    localStorage.setItem('carrito', JSON.stringify(cart));
    renderCart();
    updateCartCount();
  }

  // Inicializa carruseles (debes agregar tu código para carruseles aquí)
  // ejemplo: initBeneficiosCarousel(), initProductosCarousel();

  // Abrir modal producto con datos dinámicos
  productosContainer?.querySelectorAll('.productos-carousel-slide .see-more-btn').forEach(btn => {
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

  // Cerrar modal producto
  modalCloseBtn?.addEventListener('click', () => {
    productModal.style.display = 'none';
  });
  modalCancelBtn?.addEventListener('click', () => {
    productModal.style.display = 'none';
  });
  productModal?.addEventListener('click', e => {
    if (e.target === productModal) productModal.style.display = 'none';
  });

  // Agregar productos al carrito desde modal
  modalAddCartBtn?.addEventListener('click', () => {
    const name = document.getElementById('modal-name').textContent;
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
    alert(`Producto "${name}" agregado al carrito (${qty} piezas).`);
    productModal.style.display = 'none';
  });

  // Abrir modal carrito al hacer click en icono carrito
  cartIcon?.addEventListener('click', () => {
    renderCart();
    cartModal.style.display = 'flex';
  });
  // Cerrar modal carrito botón cerrar
  closeCartBtn?.addEventListener('click', () => {
    cartModal.style.display = 'none';
  });
  // Cerrar modal carrito clic fuera contenido
  cartModal?.addEventListener('click', e => {
    if (e.target === cartModal) cartModal.style.display = 'none';
  });

  // Checkout simulado
  checkoutBtn?.addEventListener('click', () => {
    if (Object.keys(cart).length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
    const selectedPayment = document.querySelector('input[name="payment-method"]:checked').value;
    alert(`Procesando pago por $${Object.values(cart).reduce((sum, p) => sum + p.price * p.qty, 0).toFixed(2)} con método: ${selectedPayment}`);
    cart = {};
    saveAndRenderCart();
    cartModal.style.display = 'none';
  });

  // Toggle menú hamburguesa móvil
  menuToggle.addEventListener('click', () => {
    const isActive = menu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isActive);

    if (isActive) {
      dropdown.classList.remove('open');
      tiendaBtn.setAttribute('aria-expanded', 'false');
      megaMenu.classList.remove('open');
    }
  });

  // Toggle mega menú Tienda
  tiendaBtn.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();

    const isOpenNow = dropdown.classList.toggle('open');
    megaMenu.classList.toggle('open', isOpenNow);
    tiendaBtn.setAttribute('aria-expanded', isOpenNow);

    if (isOpenNow) {
      menu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Cerrar menús al hacer clic fuera
  document.addEventListener('click', e => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
      megaMenu.classList.remove('open');
      tiendaBtn.setAttribute('aria-expanded', 'false');
    }
    if (!menu.contains(e.target) && e.target !== menuToggle && menu.classList.contains('open')) {
      menu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Cerrar menús con tecla Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (dropdown.classList.contains('open')) {
        dropdown.classList.remove('open');
        megaMenu.classList.remove('open');
        tiendaBtn.setAttribute('aria-expanded', 'false');
      }
      if (menu.classList.contains('open')) {
        menu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
      if (productModal.style.display === 'flex') {
        productModal.style.display = 'none';
      }
      if (cartModal.style.display === 'flex') {
        cartModal.style.display = 'none';
      }
    }
  });

  // Filtrar productos por categoría desde mega menú
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

      // Reiniciar posición de carrusel productos si tienes lógica para ello (opcional)
      const productosContainer_ = document.querySelector('.productos-carousel-container');
      if (productosContainer_) {
        const track = productosContainer_.querySelector('.productos-carousel-track');
        track.style.transform = 'translateX(0)';
      }

      // Mostrar sección productos filtrados solo si hay productos
      let filtradosCount = Array.from(productosSlides).filter(slide => slide.style.display === 'flex').length;
      if (productosContenedor) {
        if (filtradosCount > 0 && category !== 'todos') {
          productosContenedor.style.display = 'flex';
          // Mostrar solo 4 productos de la categoría en ese contenedor (si quieres puedes hacer aqui un render más complejo)
          mostrarProductosFiltrados(category);
          productosContenedor.scrollIntoView({ behavior: 'smooth' });
        } else {
          productosContenedor.style.display = 'none';
        }
      }

      // Scroll a sección productos
      const tiendaSection = document.getElementById('tienda');
      tiendaSection?.scrollIntoView({ behavior: 'smooth' });

      // Cerrar mega menú
      if (megaMenu?.classList.contains('open')) {
        megaMenu.classList.remove('open');
        tiendaBtn?.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Función para mostrar productos filtrados limitada a 4 en #productos-seleccionados
  function mostrarProductosFiltrados(categoria) {
    // Requiere definir 'productos' array con todos los productos con 'categoria' entre sus datos
    if (!window.productos) return; // si no está definido, no hace nada

    const filtrados = window.productos.filter(p => p.categoria === categoria).slice(0,4);
    productosContenedor.innerHTML = '';

    filtrados.forEach(prod => {
      const productoHTML = `
        <div class="producto-card">
          <img src="${prod.imagen}" alt="${prod.nombre}" />
          <h4>${prod.nombre}</h4>
          <p>${prod.descripcion}</p>
          <strong>$${prod.precio}</strong>
        </div>
      `;
      productosContenedor.insertAdjacentHTML('beforeend', productoHTML);
    });

    if (filtrados.length === 0) {
      productosContenedor.innerHTML = `<p>No hay productos disponibles para esta categoría</p>`;
    }
  }

  // Inicializar contador carrito al cargar
  updateCartCount();
});

categoryLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const categoria = link.getAttribute('data-category');
    const filtrados = productos.filter(p => p.categoria === categoria);

    mostrarProductos(filtrados);

    if (productosContenedor) {
      productosContenedor.style.display = filtrados.length ? 'flex' : 'none';
      if (filtrados.length) productosContenedor.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const cartIcon = document.getElementById('cart-icon');
  const cartModal = document.getElementById('cart-modal');
  const closeCartBtn = document.getElementById('close-cart');
  const cartProductsList = document.getElementById('cart-products-list');
  const cartTotal = document.getElementById('cart-total');

  let cart = JSON.parse(localStorage.getItem('carrito')) || {};

  function updateCartCount() {
    const cartCountEl = document.getElementById('cart-count');
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
      // Aquí rellenas row con imagen, nombre, qty y delete...

      // Ejemplo simplificado:
      row.innerHTML = `
        <img src="${product.image}" alt="${product.name}" style="width:48px;height:48px;object-fit:cover;border-radius:6px;">
        <div style="flex:1; margin-left:10px;">
          <strong>${product.name}</strong><br>Qty: ${product.qty} x $${product.price.toFixed(2)}
        </div>
        <button style="margin-left:10px;background:#cc3333;color:#fff;border:none;border-radius:6px;cursor:pointer;padding:4px 8px;">Eliminar</button>
      `;
      const btnDelete = row.querySelector('button');
      btnDelete.addEventListener('click', () => {
        delete cart[key];
        saveAndRenderCart();
      });

      cartProductsList.appendChild(row);
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

  cartIcon.addEventListener('click', () => {
    renderCart();
    cartModal.style.display = 'flex'; // muestra modal
  });

  closeCartBtn.addEventListener('click', () => {
    cartModal.style.display = 'none'; // oculta modal
  });

  cartModal.addEventListener('click', e => {
    if (e.target === cartModal) {
      cartModal.style.display = 'none';
    }
  });

  // Inicializa contador carrito al cargar
  updateCartCount();

  // Aquí el resto de tu JS...
});
