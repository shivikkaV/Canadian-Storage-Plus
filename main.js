/* =====================================================
   CANADIAN STORAGE PLUS — main.js
   One script file for all pages
   ===================================================== */

document.addEventListener('DOMContentLoaded', function () {

  // ── Navbar scroll shadow ──────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  // ── Mark active nav link ──────────────────────────────
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── Hamburger toggle ──────────────────────────────────
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
    // Close on link click
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });
  }

  // ── Scroll reveal ─────────────────────────────────────
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach(function (el) { io.observe(el); });
  }

  // ── FAQ accordion ─────────────────────────────────────
  document.querySelectorAll('.faq-item').forEach(function (item) {
    const btn = item.querySelector('.faq-q');
    if (btn) {
      btn.addEventListener('click', function () {
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(function (o) {
          o.classList.remove('open');
        });
        if (!isOpen) item.classList.add('open');
      });
    }
  });

  // ── Reservation form ──────────────────────────────────
  const reserveForm = document.getElementById('reserveForm');
  if (reserveForm) {
    // Dynamic price update
    const serviceSelect  = document.getElementById('serviceType');
    const unitSelect     = document.getElementById('unitSize');
    const durationSelect = document.getElementById('duration');
    const summaryService = document.getElementById('summaryService');
    const summaryUnit    = document.getElementById('summaryUnit');
    const summaryDuration = document.getElementById('summaryDuration');
    const summaryTotal   = document.getElementById('summaryTotal');

    const pricing = {
      container:  { small: 89, medium: 129, large: 169 },
      self:       { small: 59, medium: 99,  large: 139 },
      boat:       { medium: 149, large: 199 }
    };

    function updateUnitOptions() {
      if (!serviceSelect || !unitSelect) return;
      const svc = serviceSelect.value;
      const units = {
        container: [
          { v: 'small',  l: '10ft Container' },
          { v: 'medium', l: '20ft Container' },
          { v: 'large',  l: '40ft Container' }
        ],
        self: [
          { v: 'small',  l: "5x5 Unit (25 sq ft)" },
          { v: 'medium', l: "10x10 Unit (100 sq ft)" },
          { v: 'large',  l: "10x20 Unit (200 sq ft)" }
        ],
        boat: [
          { v: 'medium', l: 'Boat / Watercraft (up to 24ft)' },
          { v: 'large',  l: 'RV / Trailer (25ft+)' }
        ]
      };
      unitSelect.innerHTML = '<option value="">Select size</option>';
      (units[svc] || []).forEach(function (u) {
        unitSelect.innerHTML += '<option value="' + u.v + '">' + u.l + '</option>';
      });
      updateSummary();
    }

    function updateSummary() {
      if (!serviceSelect) return;
      const svc  = serviceSelect.value;
      const unit = unitSelect ? unitSelect.value : '';
      const dur  = durationSelect ? parseInt(durationSelect.value) || 1 : 1;

      const serviceLabel = {
        container: 'Container Storage',
        self:      'Self-Storage Unit',
        boat:      'Boat and RV Storage'
      };
      if (summaryService) summaryService.textContent = serviceLabel[svc] || '--';
      if (summaryUnit)    summaryUnit.textContent    = unitSelect ? (unitSelect.options[unitSelect.selectedIndex] ? unitSelect.options[unitSelect.selectedIndex].text : '--') : '--';
      if (summaryDuration) summaryDuration.textContent = dur + ' month' + (dur > 1 ? 's' : '');

      const rate = (pricing[svc] && unit) ? pricing[svc][unit] : 0;
      const total = rate * dur;
      if (summaryTotal) summaryTotal.textContent = total > 0 ? '$' + total.toFixed(2) : '--';
    }

    if (serviceSelect) {
      serviceSelect.addEventListener('change', updateUnitOptions);
    }
    if (unitSelect)    unitSelect.addEventListener('change', updateSummary);
    if (durationSelect) durationSelect.addEventListener('change', updateSummary);

    // Form submit
    reserveForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(reserveForm)) return;

      const formContent = reserveForm.querySelector('.form-content');
      const formSuccess = reserveForm.querySelector('.form-success');
      const refEl = reserveForm.querySelector('.ref');

      if (formContent) formContent.style.display = 'none';
      if (formSuccess) formSuccess.style.display = 'block';
      if (refEl) {
        const ref = 'CSP-' + Math.random().toString(36).substr(2, 8).toUpperCase();
        refEl.textContent = 'Reservation Reference: ' + ref;
      }
    });
  }

  // ── Payment form ──────────────────────────────────────
  const paymentForm = document.getElementById('paymentForm');
  if (paymentForm) {
    // Format card number with spaces
    const cardInput = document.getElementById('cardNumber');
    if (cardInput) {
      cardInput.addEventListener('input', function () {
        let v = this.value.replace(/\D/g, '').substring(0, 16);
        this.value = v.replace(/(.{4})/g, '$1 ').trim();
      });
    }
    // Format expiry
    const expiryInput = document.getElementById('expiry');
    if (expiryInput) {
      expiryInput.addEventListener('input', function () {
        let v = this.value.replace(/\D/g, '').substring(0, 4);
        if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2);
        this.value = v;
      });
    }
    // CVV digits only
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
      cvvInput.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').substring(0, 4);
      });
    }

    paymentForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(paymentForm)) return;

      const formContent = paymentForm.querySelector('.form-content');
      const formSuccess = paymentForm.querySelector('.form-success');
      const refEl = paymentForm.querySelector('.ref');

      if (formContent) formContent.style.display = 'none';
      if (formSuccess) formSuccess.style.display = 'block';
      if (refEl) {
        const ref = 'PAY-' + Math.random().toString(36).substr(2, 10).toUpperCase();
        refEl.textContent = 'Transaction ID: ' + ref;
      }
    });
  }

  // ── Simple form validation ────────────────────────────
  function validateForm(form) {
    let valid = true;
    form.querySelectorAll('[required]').forEach(function (field) {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = '#e85520';
        valid = false;
      }
    });
    if (!valid) {
      const first = form.querySelector('[required]:invalid, [required][style*="e85520"]');
      if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return valid;
  }

// ── Container catalogue: sidebar filter ───────────────
  const catalogue = document.getElementById('containerCatalogue');
  if (catalogue) {
 
    const cards      = Array.from(catalogue.querySelectorAll('.container-card'));
    const noResults  = document.getElementById('noResults');
    const countEl    = document.getElementById('catalogueCount');
    const activeTagsEl = document.getElementById('activeTags');
    const sortSelect = document.getElementById('catalogueSort');
 
    // Collect all checkbox groups
    function getChecked(name) {
      return Array.from(document.querySelectorAll('input[name="' + name + '"]:checked'))
        .map(function (el) { return el.value; });
    }
 
    function applyFilters() {
      const types   = getChecked('filterType');
      const sizes   = getChecked('filterSize');
      const conds   = getChecked('filterCond');
      const sort    = sortSelect ? sortSelect.value : 'default';
 
      let visible = 0;
 
      cards.forEach(function (card) {
        const t = card.dataset.type;
        const s = card.dataset.size;
        const c = card.dataset.cond;
 
        const matchType = types.length === 0 || types.indexOf(t) !== -1;
        const matchSize = sizes.length === 0 || sizes.indexOf(s) !== -1;
        const matchCond = conds.length === 0 || conds.indexOf(c) !== -1;
 
        if (matchType && matchSize && matchCond) {
          card.classList.remove('hidden');
          visible++;
        } else {
          card.classList.add('hidden');
        }
      });
 
      // Sort visible cards
      const grid = document.getElementById('containerGrid');
      if (grid && sort !== 'default') {
        const visCards = cards.filter(function (c) { return !c.classList.contains('hidden'); });
        visCards.sort(function (a, b) {
          const pa = parseFloat(a.dataset.price) || 0;
          const pb = parseFloat(b.dataset.price) || 0;
          const sa = parseInt(a.dataset.sizeNum) || 0;
          const sb = parseInt(b.dataset.sizeNum) || 0;
          if (sort === 'price-asc')  return pa - pb;
          if (sort === 'price-desc') return pb - pa;
          if (sort === 'size-asc')   return sa - sb;
          if (sort === 'size-desc')  return sb - sa;
          return 0;
        });
        visCards.forEach(function (c) { grid.appendChild(c); });
      }
 
      // Update count
      if (countEl) {
        countEl.innerHTML = 'Showing <strong>' + visible + '</strong> of <strong>' + cards.length + '</strong> containers';
      }
 
      // No results
      if (noResults) {
        noResults.classList.toggle('visible', visible === 0);
      }
 
      // Active filter tags
      renderActiveTags(types, sizes, conds);
    }
 
    // Labels for display
    const typeLabels = { 'side-door': 'Side Door', 'front-door': 'Front Door', 'wwt': 'Wind and Watertight' };
    const sizeLabels = { '10ft': '10ft', '20ft': '20ft', '40ft': '40ft' };
    const condLabels = { 'new': 'New', 'used': 'Used' };
 
    function renderActiveTags(types, sizes, conds) {
      if (!activeTagsEl) return;
      activeTagsEl.innerHTML = '';
 
      function addTag(value, label, name) {
        const tag = document.createElement('span');
        tag.className = 'active-filter-tag';
        tag.innerHTML = label + ' <button aria-label="Remove filter">&times;</button>';
        tag.querySelector('button').addEventListener('click', function () {
          const cb = document.querySelector('input[name="' + name + '"][value="' + value + '"]');
          if (cb) { cb.checked = false; applyFilters(); }
        });
        activeTagsEl.appendChild(tag);
      }
 
      types.forEach(function (v) { addTag(v, typeLabels[v] || v, 'filterType'); });
      sizes.forEach(function (v) { addTag(v, sizeLabels[v] || v, 'filterSize'); });
      conds.forEach(function (v) { addTag(v, condLabels[v] || v, 'filterCond'); });
    }
 
    // Attach change listeners to all filter checkboxes
    document.querySelectorAll('.filter-option input[type="checkbox"]').forEach(function (cb) {
      cb.addEventListener('change', applyFilters);
    });
 
    if (sortSelect) sortSelect.addEventListener('change', applyFilters);
 
    // Clear all filters
    const clearBtn = document.getElementById('clearFilters');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        document.querySelectorAll('.filter-option input[type="checkbox"]').forEach(function (cb) {
          cb.checked = false;
        });
        applyFilters();
      });
    }
 
    // Mobile filter toggle
    const filterToggle = document.getElementById('filterToggle');
    const filterPanel  = document.querySelector('.filter-panel');
    if (filterToggle && filterPanel) {
      filterToggle.addEventListener('click', function () {
        filterToggle.classList.toggle('open');
        filterPanel.classList.toggle('mobile-open');
      });
    }
 
    // Initial render
    applyFilters();
  }
 
  // ── Contact modal (containers page only) ─────────────
  const modalOverlay = document.getElementById('contactModal');
  if (modalOverlay) {
 
    // Open modal
    document.querySelectorAll('[data-modal-open]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        // Pre-fill container type if the button carries a data-container attribute
        const preset = btn.getAttribute('data-container');
        const typeField = document.getElementById('modalContainerType');
        if (typeField && preset) {
          typeField.value = preset;
        }
        modalOverlay.classList.add('open');
        document.body.classList.add('modal-open');
      });
    });
 
    // Close modal on overlay click
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) closeModal();
    });
 
    // Close button
    const closeBtn = document.getElementById('modalClose');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
 
    // ESC key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
    });
 
    function closeModal() {
      modalOverlay.classList.remove('open');
      document.body.classList.remove('modal-open');
    }
 
    // Modal form submit
    const modalForm = document.getElementById('contactModalForm');
    if (modalForm) {
      modalForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validateForm(modalForm)) return;
 
        const formBody  = modalForm.querySelector('.modal__form-body');
        const successEl = document.getElementById('modalSuccess');
        const refEl     = document.getElementById('modalRef');
 
        if (formBody)  formBody.style.display  = 'none';
        if (successEl) successEl.classList.add('visible');
        if (refEl) {
          const ref = 'INQ-' + Math.random().toString(36).substr(2, 8).toUpperCase();
          refEl.textContent = 'Reference: ' + ref;
        }
      });
    }
  }

  // ── Contact page form ─────────────────────────────────
  const contactForm = document.getElementById('contactPageForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(contactForm)) return;
 
      const formBody  = document.getElementById('contactFormBody');
      const successEl = document.getElementById('contactSuccess');
 
      if (formBody)  formBody.style.display = 'none';
      if (successEl) successEl.classList.add('visible');
    });
  }
 
});
 
