// BUTTONS — data-driven + null-safe. Ako neki gumb ne postoji u HTML-u, samo se
// preskoči (ranije je nedostajući #btn_portfolio bacao grešku i rušio cijeli skriptu).
const SOCIAL_LINKS = {
  btn_portfolio: 'https://www.behance.net/cristiarodrigu420/projects',
  btn_linkedin:  'https://www.linkedin.com/in/crodrigues93/',
  btn_twitter:   'https://twitter.com/cris_Leash',
  btn_github:    'https://github.com/CrisLeash',
  btn_IG:        'https://www.instagram.com/crisleash/',
};

Object.entries(SOCIAL_LINKS).forEach(([id, url]) => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('click', () => window.open(url, '_blank', 'noopener,noreferrer'));
});


// Function to copy text to clipboard
function copyToClipboard(text) {
    // Modern approach using Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Copied to clipboard! ✓');
        }).catch(err => {
            console.error('Failed to copy:', err);
            fallbackCopy(text);
        });
    } else {
        // Fallback for older browsers
        fallbackCopy(text);
    }
}

// Fallback copy method for older browsers
function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    
    try {
        document.execCommand('copy');
        showToast('Copied to clipboard! ✓');
    } catch (err) {
        console.error('Failed to copy:', err);
        showToast('Failed to copy');
    }
    
    document.body.removeChild(textarea);
}

// Show toast notification
function showToast(message) {
    // Check if toast already exists
    let toast = document.querySelector('.copy-toast');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'copy-toast';
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// Add click event listeners to copyable elements
document.addEventListener('DOMContentLoaded', function() {
    const copyables = document.querySelectorAll('.copyable');
    
    copyables.forEach(element => {
        element.addEventListener('click', function() {
            const textToCopy = this.getAttribute('data-copy');
            copyToClipboard(textToCopy);
        });
    });
});

// HORIZONTAL STRIPS — desktop edge-hover auto-scroll + mouse drag.
// Touch devices keep the native swipe behaviour.
document.addEventListener('DOMContentLoaded', function () {
  const strips = Array.from(document.querySelectorAll('.gallery-grid.strip'));
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  strips.forEach((strip) => {
    let hoverFrame = null;
    let hoverSpeed = 0;
    let pointerIsDown = false;
    let isDragging = false;
    let didDrag = false;
    let startX = 0;
    let startScrollLeft = 0;

    function stopHoverScroll() {
      hoverSpeed = 0;
      if (hoverFrame) cancelAnimationFrame(hoverFrame);
      hoverFrame = null;
      strip.classList.remove('is-interacting');
    }

    function animateHoverScroll() {
      if (!hoverSpeed) {
        stopHoverScroll();
        return;
      }
      strip.scrollLeft += hoverSpeed;
      hoverFrame = requestAnimationFrame(animateHoverScroll);
    }

    if (finePointer) {
      strip.addEventListener('mousemove', (event) => {
        if (isDragging) return;
        const rect = strip.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const edge = rect.width * 0.33;
        const maxSpeed = 7;

        if (x < edge) {
          hoverSpeed = -maxSpeed * ((edge - x) / edge);
        } else if (x > rect.width - edge) {
          hoverSpeed = maxSpeed * ((x - (rect.width - edge)) / edge);
        } else {
          hoverSpeed = 0;
        }

        if (hoverSpeed && !hoverFrame) {
          strip.classList.add('is-interacting');
          hoverFrame = requestAnimationFrame(animateHoverScroll);
        }
      });

      strip.addEventListener('mouseleave', stopHoverScroll);
    }

    strip.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'touch' || event.button !== 0) return;
      pointerIsDown = true;
      isDragging = false;
      didDrag = false;
      startX = event.clientX;
      startScrollLeft = strip.scrollLeft;
      stopHoverScroll();
    });

    strip.addEventListener('pointermove', (event) => {
      if (!pointerIsDown) return;
      const dx = event.clientX - startX;
      if (!isDragging && Math.abs(dx) > 4) {
        isDragging = true;
        didDrag = true;
        strip.classList.add('is-interacting');
      }
      if (!isDragging) return;
      strip.scrollLeft = startScrollLeft - dx;
    });

    function endDrag(event) {
      if (!pointerIsDown) return;
      pointerIsDown = false;
      isDragging = false;
      strip.classList.remove('is-interacting');
      if (didDrag) {
        strip.dataset.suppressClick = '1';
        window.setTimeout(() => delete strip.dataset.suppressClick, 150);
      }
    }

    strip.addEventListener('pointerup', endDrag);
    strip.addEventListener('pointercancel', endDrag);
    strip.addEventListener('pointerleave', endDrag);

    strip.addEventListener('click', (event) => {
      if (!strip.dataset.suppressClick) return;
      event.preventDefault();
      event.stopPropagation();
      delete strip.dataset.suppressClick;
    }, true);
  });
});


// GALLERY LIGHTBOX (vanilla, no library) — click an image to open it large.
// ESC or click on the backdrop closes; ← / → (or the bottom Prev/Next) navigate; focus is restored.
// Any image with class `.lightboxable` opts in (portfolio + SHANGO gallery). Caption comes from
// data-caption, falling back to alt (empty caption is fine — it just stays blank).
document.addEventListener('DOMContentLoaded', function () {
  const images = Array.from(document.querySelectorAll('.lightboxable'));
  if (images.length === 0) return;

  let currentIndex = -1;
  let lastFocused = null;

  // Build the lightbox shell once. Prev/Next live in a bottom control bar so they never
  // overlap the image (fixes the mobile "tap image jumps to next" bug).
  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <button class="lightbox-close" aria-label="Close">×</button>
    <img class="lightbox-img" alt="">
    <p class="lightbox-caption"></p>
    <div class="lightbox-nav">
      <button class="lightbox-prev" aria-label="Previous image">‹</button>
      <button class="lightbox-next" aria-label="Next image">›</button>
    </div>`;
  document.body.appendChild(overlay);

  const lbImg = overlay.querySelector('.lightbox-img');
  const lbCaption = overlay.querySelector('.lightbox-caption');
  const btnClose = overlay.querySelector('.lightbox-close');
  const btnPrev = overlay.querySelector('.lightbox-prev');
  const btnNext = overlay.querySelector('.lightbox-next');

  // Only show nav arrows when there's more than one image to move between.
  if (images.length < 2) overlay.querySelector('.lightbox-nav').style.display = 'none';

  function show(index) {
    currentIndex = (index + images.length) % images.length;
    const img = images[currentIndex];
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt || '';
    lbCaption.textContent = img.dataset.caption || img.alt || '';
  }

  function open(index) {
    lastFocused = document.activeElement;
    show(index);
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    btnClose.focus();
  }

  function close() {
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  images.forEach((img, i) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function (e) {
      e.preventDefault(); // images may sit inside links — keep the lightbox, not navigation
      open(i);
    });
  });

  btnClose.addEventListener('click', close);
  btnNext.addEventListener('click', () => show(currentIndex + 1));
  btnPrev.addEventListener('click', () => show(currentIndex - 1));
  // Tapping the image itself does nothing (no navigation, stays open); only the backdrop closes.
  lbImg.addEventListener('click', (e) => e.stopPropagation());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  document.addEventListener('keydown', function (e) {
    if (!overlay.classList.contains('show')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') show(currentIndex + 1);
    else if (e.key === 'ArrowLeft') show(currentIndex - 1);
  });
});
