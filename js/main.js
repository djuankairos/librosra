// Reinita Amarilla Librería — main.js

// ─── Utilidades ──────────────────────────────────────────────

function formatPrice(amount) {
  return '₡' + amount.toLocaleString('es-CR');
}

function buildWhatsAppUrl(message) {
  const phone = '50687765222';
  const text = message || '¡Hola! Me gustaría consultar sobre sus libros disponibles.';
  return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(text);
}

function buildBookWAUrl(bookTitle) {
  return buildWhatsAppUrl('¡Hola! Me interesa el libro "' + bookTitle + '". ¿Está disponible y cuál es el precio final?');
}

// Determina si un color hexadecimal requiere texto oscuro (WCAG)
function needsDarkText(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5;
}

// ─── Menú móvil ──────────────────────────────────────────────

(function initMobileMenu() {
  const btn = document.getElementById('menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', function () {
    const open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });

  // Cerrar al hacer click en un link del menú
  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
})();

// ─── Drawer de Categorías ────────────────────────────────────

(function initCategoryDrawer() {
  var btn     = document.getElementById('cat-drawer-btn');
  var overlay = document.getElementById('cat-drawer-overlay');
  var panel   = document.getElementById('cat-panel');
  var closeBtn = document.getElementById('cat-panel-close');
  if (!btn || !overlay || !panel) return;

  function openDrawer() {
    overlay.classList.add('open');
    panel.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    overlay.classList.remove('open');
    panel.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', function () {
    panel.classList.contains('open') ? closeDrawer() : openDrawer();
  });
  overlay.addEventListener('click', closeDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); });
  panel.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeDrawer);
  });
})();

// ─── Header Search Redirect ───────────────────────────────────

(function initHeaderSearch() {
  var form = document.getElementById('header-search-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var q = (document.getElementById('header-search').value || '').trim();
    if (q) window.location.href = 'catalogo.html?q=' + encodeURIComponent(q);
    else    window.location.href = 'catalogo.html';
  });
})();

// ─── FAQ Acordeón ─────────────────────────────────────────────

(function initFAQ() {
  var items = document.querySelectorAll('.faq-item');
  if (!items.length) return;
  items.forEach(function (item) {
    var btn    = item.querySelector('.faq-btn');
    var answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;
    btn.addEventListener('click', function () {
      var isOpen = btn.classList.contains('open');
      items.forEach(function (i) {
        i.querySelector('.faq-btn').classList.remove('open');
        i.querySelector('.faq-answer').classList.remove('open');
      });
      if (!isOpen) {
        btn.classList.add('open');
        answer.classList.add('open');
      }
    });
  });
})();

// ─── Página de Catálogo ──────────────────────────────────────

(function initCatalog() {
  const grid = document.getElementById('catalog-grid');
  if (!grid || typeof BOOKS === 'undefined') return;

  let activeCategory = 'all';
  let searchQuery = '';
  let sortOrder = 'catalogo';

  // Leer parámetros de URL
  var urlParams = new URLSearchParams(window.location.search);
  var catParam = urlParams.get('cat');
  var qParam   = urlParams.get('q');
  if (catParam) activeCategory = catParam;

  var filterBtns = document.querySelectorAll('[data-category-filter]');
  var searchInput = document.getElementById('search-input');
  var sortSelect = document.getElementById('sort-select');
  var resultCount = document.getElementById('result-count');
  var emptyState = document.getElementById('empty-state');

  // Pre-fill search from ?q= param
  if (qParam && searchInput) {
    searchInput.value = qParam;
    searchQuery = qParam;
  }

  // Marcar el filtro activo inicial
  filterBtns.forEach(function (btn) {
    if (btn.dataset.categoryFilter === activeCategory) {
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
    }
  });

  function filterAndSort() {
    return BOOKS
      .filter(function (b) {
        if (activeCategory !== 'all' && b.category !== activeCategory) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          return b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
        }
        return true;
      })
      .sort(function (a, b) {
        if (sortOrder === 'precio-asc')  return a.price - b.price;
        if (sortOrder === 'precio-desc') return b.price - a.price;
        if (sortOrder === 'nuevo') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        if (sortOrder === 'nombre') return a.title.localeCompare(b.title, 'es');
        return 0;
      });
  }

  function buildBadge(bg, text, textColor) {
    return '<span class="badge" style="background:' + bg + ';color:' + textColor + ';">' + text + '</span>';
  }

  function buildCatBadge(catColor, text) {
    return '<span class="badge-cat" style="--cat-color:' + catColor + ';">' + text + '</span>';
  }

  function renderBookCard(book) {
    const cat = CATEGORIES.find(function (c) { return c.id === book.category; });
    const catColor = cat ? cat.color : '#9E9E9E';
    const catLabel = cat ? cat.label.toUpperCase() : book.category.toUpperCase();
    const textColor = needsDarkText(catColor) ? '#1A1A1A' : '#FFFEF7';

    const priceHtml = book.originalPrice
      ? '<span class="price-original">' + formatPrice(book.originalPrice) + '</span>'
        + '<div style="display:flex;align-items:center;gap:6px;">'
        + '<span class="price-current sale">' + formatPrice(book.price) + '</span>'
        + buildBadge('#5AAB4B', 'MEJOR PRECIO', '#FFFEF7')
        + '</div>'
      : '<span class="price-current">' + formatPrice(book.price) + '</span>';

    const badges = [];
    if (book.isLaunch) badges.push(buildBadge('#F07020', 'LANZAMIENTO', '#FFFEF7'));
    if (book.isNew)   badges.push(buildBadge('#1A1A1A', 'NUEVO', '#F5C800'));
    if (!book.isLaunch && !book.inStock) badges.push(buildBadge('#9E9E9E', 'AGOTADO', '#1A1A1A'));
    const badgesHtml = badges.length ? '<div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:8px;">' + badges.join('') + '</div>' : '';

    const waBtn = book.inStock
      ? '<a href="' + buildBookWAUrl(book.title) + '" target="_blank" rel="noopener noreferrer" '
        + 'class="wa-btn" style="display:block;text-align:center;background:#25D366;color:#FFFEF7;'
        + 'font-family:\'Lato\',sans-serif;font-weight:700;font-size:0.875rem;padding:12px 16px;'
        + 'border-radius:12px;text-decoration:none;cursor:pointer;transition:background 200ms;">'
        + '<svg style="display:inline;vertical-align:middle;margin-right:6px;" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>'
        + (book.isLaunch ? 'Apartar mi guía' : 'Consultar por WhatsApp') + '</a>'
      : '<span style="display:block;text-align:center;background:#e5e7eb;color:#9E9E9E;'
        + 'font-family:\'Lato\',sans-serif;font-weight:700;font-size:0.875rem;padding:12px 16px;'
        + 'border-radius:12px;">No disponible</span>';

    return '<article class="book-card" style="background:#FFFEF7;border-radius:16px;overflow:hidden;'
      + 'border:1px solid rgba(26,26,26,0.08);display:flex;flex-direction:column;">'

      // Top color strip (category color)
      + '<div style="height:4px;background:' + catColor + ';flex-shrink:0;"></div>'

      // Cover area
      + (book.image
        ? '<div style="height:180px;flex-shrink:0;background:' + catColor + '22;overflow:hidden;">'
            + '<img src="' + escHtml(book.image) + '" alt="Portada: ' + escHtml(book.title) + '"'
            + ' loading="lazy" style="width:100%;height:100%;object-fit:contain;padding:8px;display:block;"'
            + ' onerror="this.parentNode.style.background=\'' + catColor + '\';this.style.display=\'none\'">'
            + '</div>'
        : '<div style="height:180px;flex-shrink:0;background:' + catColor + '22;"></div>')

      // Content
      + '<div style="flex:1;display:flex;flex-direction:column;padding:18px;">'

      // Top row: category badge + language
      + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">'
      + buildCatBadge(catColor, catLabel)
      + (book.language ? buildBadge('#FFF8E7', book.language.toUpperCase(), '#1A1A1A') + '' : '')
      + '</div>'

      // Title
      + '<h3 class="font-display" style="font-family:\'Playfair Display\',Georgia,serif;font-weight:700;'
      + 'font-size:1.0625rem;line-height:1.3;color:#1A1A1A;margin:0 0 4px;">' + escHtml(book.title) + '</h3>'

      // Subtitle
      + (book.subtitle ? '<p class="font-display" style="font-family:\'Playfair Display\',Georgia,serif;'
        + 'font-style:italic;font-size:0.8125rem;color:rgba(26,26,26,0.65);margin:0 0 4px;">' + escHtml(book.subtitle) + '</p>' : '')

      // Author
      + '<p style="font-style:italic;font-size:0.8125rem;color:rgba(26,26,26,0.65);margin:0 0 10px;">' + escHtml(book.author) + '</p>'

      // Description
      + '<p class="line-clamp-3" style="font-size:0.875rem;color:rgba(26,26,26,0.7);line-height:1.55;'
      + 'margin:0 0 10px;flex:1;">' + escHtml(book.description) + '</p>'

      // Meta
      + '<p class="font-mono" style="font-family:\'Space Mono\',monospace;font-size:0.625rem;'
      + 'letter-spacing:0.08em;color:rgba(26,26,26,0.4);text-transform:uppercase;margin:0 0 10px;">'
      + catLabel + (book.year ? ' · ' + book.year : '') + (book.language ? ' · ' + book.language.toUpperCase() : '') + '</p>'

      // Badges
      + badgesHtml

      // Price
      + (book.isLaunch ? '' : '<div style="margin-bottom:14px;">' + priceHtml + '</div>')

      // WhatsApp button
      + waBtn

      + '</div>'
      + '</article>';
  }

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function render() {
    const filtered = filterAndSort();

    if (resultCount) {
      resultCount.textContent = filtered.length + ' libro' + (filtered.length !== 1 ? 's' : '');
    }

    if (filtered.length === 0) {
      grid.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
    } else {
      if (emptyState) emptyState.style.display = 'none';
      grid.innerHTML = filtered.map(renderBookCard).join('');
    }
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      activeCategory = btn.dataset.categoryFilter;
      if (window.innerWidth < 768) {
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      if (typeof syncSidebar === 'function') syncSidebar();
      render();
    });
  });

  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', function (e) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        searchQuery = e.target.value.trim();
        render();
      }, 250);
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', function (e) {
      sortOrder = e.target.value;
      render();
    });
  }

  // Sidebar category buttons (desktop)
  var sidebarBtns = document.querySelectorAll('[data-sidebar-filter]');
  function syncSidebar() {
    sidebarBtns.forEach(function (b) {
      b.classList.toggle('active', b.dataset.sidebarFilter === activeCategory);
    });
    filterBtns.forEach(function (b) {
      b.classList.toggle('active', b.dataset.categoryFilter === activeCategory);
      b.setAttribute('aria-pressed', String(b.dataset.categoryFilter === activeCategory));
    });
  }
  sidebarBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      activeCategory = btn.dataset.sidebarFilter;
      syncSidebar();
      render();
    });
  });
  syncSidebar();

  render();
})();

// ─── Formulario de contacto → WhatsApp ─────────────────────

(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    const existing = field.parentNode.querySelector('.field-error');
    if (existing) existing.remove();
    const err = document.createElement('p');
    err.className = 'field-error';
    err.setAttribute('role', 'alert');
    err.style.cssText = "color:#F07020;font-size:0.8125rem;margin:5px 0 0;font-family:'Lato',sans-serif;";
    err.textContent = message;
    field.parentNode.appendChild(err);
    field.style.borderColor = '#F07020';
    field.addEventListener('input', function () {
      err.remove();
      field.style.borderColor = '';
    }, { once: true });
    field.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Clear previous errors
    form.querySelectorAll('.field-error').forEach(function (el) { el.remove(); });
    form.querySelectorAll('.form-input').forEach(function (el) { el.style.borderColor = ''; });

    const data = new FormData(form);
    const nombre  = (data.get('nombre')  || '').trim();
    const libro   = (data.get('libro')   || '').trim();
    const mensaje = (data.get('mensaje') || '').trim();

    let hasError = false;
    if (!mensaje) { showFieldError('mensaje', 'Por favor escribí tu consulta.'); hasError = true; }
    if (!nombre)  { showFieldError('nombre',  'Por favor ingresá tu nombre.');   hasError = true; }
    if (hasError) return;

    let text = '¡Hola! Soy ' + nombre + '.';
    if (libro)   text += ' Me interesa el libro "' + libro + '".';
    text += ' ' + mensaje;

    window.open(buildWhatsAppUrl(text), '_blank');
  });
})();
