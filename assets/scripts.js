document.addEventListener("DOMContentLoaded", function () {
  const gallery = document.querySelector('.gallery');
  if (!gallery) return;

  // 1. Créer les colonnes (3 par ligne)
  const images = Array.from(gallery.querySelectorAll('.gallery-item'));
  gallery.innerHTML = '';
  let row;
  images.forEach((img, i) => {
    if (i % 3 === 0) {
      row = document.createElement('div');
      row.className = 'gallery-items-row row';
      gallery.appendChild(row);
    }
    const col = document.createElement('div');
    col.className = 'item-column mb-4 col-4';
    col.appendChild(img);
    row.appendChild(col);
    img.classList.add('img-fluid');
  });

  // 2. Générer les tags uniques
  const tags = Array.from(new Set(images.map(img => img.dataset.galleryTag).filter(Boolean)));
  if (tags.length) {
    const ul = document.createElement('ul');
    ul.className = 'my-4 tags-bar nav nav-pills';
    ul.innerHTML = `<li class="nav-item"><span class="nav-link active active-tag" data-images-toggle="all">Tous</span></li>` +
      tags.map(tag =>
        `<li class="nav-item"><span class="nav-link" data-images-toggle="${tag}">${tag}</span></li>`
      ).join('');
    gallery.parentNode.insertBefore(ul, gallery);

    // Filtrage
    ul.addEventListener('click', e => {
      const btn = e.target.closest('.nav-link');
      if (!btn || btn.classList.contains('active-tag')) return;
      ul.querySelectorAll('.active, .active-tag').forEach(el => el.classList.remove('active', 'active-tag'));
      btn.classList.add('active', 'active-tag');
      const tag = btn.dataset.imagesToggle;
      images.forEach(img => {
        const col = img.closest('.item-column');
        if (tag === 'all' || img.dataset.galleryTag === tag) {
          col.style.display = '';
        } else {
          col.style.display = 'none';
        }
      });
    });
  }

  // 3. LIGHTBOX
  let lightbox = document.createElement('div');
  lightbox.className = 'modal fade';
  lightbox.id = 'galleryLightbox';
  lightbox.style.position = 'fixed';
  lightbox.style.top = '0';
  lightbox.style.left = '0';
  lightbox.style.width = '100vw';
  lightbox.style.height = '100vh';
  lightbox.style.background = 'rgba(0,0,0,0.8)';
  lightbox.style.display = 'none';
  lightbox.style.justifyContent = 'center';
  lightbox.style.alignItems = 'center';
  lightbox.style.zIndex = '9999';
  lightbox.innerHTML = `
    <div class="modal-dialog" role="document" style="max-width:90vw;max-height:90vh;">
      <div class="modal-content" style="background:none;border:none;box-shadow:none;">
        <div class="modal-body" style="position:relative;display:flex;align-items:center;justify-content:center;">
          <button class="mg-prev" aria-label="Image précédente" style="cursor:pointer;position:absolute;top:50%;left:0;transform:translateY(-50%);background:white;border:none;border-radius:50%;width:40px;height:40px;font-size:2rem;">&lt;</button>
          <img class="lightboxImage img-fluid" alt="Image affichée dans la modale" style="max-width:80vw;max-height:80vh;box-shadow:0 0 20px #222;" />
          <button class="mg-next" aria-label="Image suivante" style="cursor:pointer;position:absolute;top:50%;right:0;transform:translateY(-50%);background:white;border:none;border-radius:50%;width:40px;height:40px;font-size:2rem;">&gt;</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(lightbox);

  // Ouvre la lightbox au clic sur une image
  gallery.addEventListener('click', function (e) {
    const img = e.target.closest('.gallery-item');
    if (img && img.tagName === 'IMG') {
      document.querySelector('.lightboxImage').src = img.src;
      lightbox.style.display = 'flex';
      lightbox.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  });

  // Ferme la lightbox en cliquant sur le fond noir
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) {
      lightbox.style.display = 'none';
      lightbox.classList.remove('show');
      document.body.style.overflow = '';
    }
  });

  // Navigation lightbox
  function getVisibleImages() {
    return Array.from(gallery.querySelectorAll('.gallery-item'))
      .filter(img => {
        const col = img.closest('.item-column');
        return !col || col.style.display !== 'none';
      });
  }
  function showImage(offset) {
    const images = getVisibleImages();
    const currentSrc = document.querySelector('.lightboxImage').src;
    const idx = images.findIndex(img => img.src === currentSrc);
    let nextIdx = (idx + offset + images.length) % images.length;
    document.querySelector('.lightboxImage').src = images[nextIdx].src;
  }
  lightbox.querySelector('.mg-prev').addEventListener('click', function (e) {
    e.stopPropagation();
    showImage(-1);
  });
  lightbox.querySelector('.mg-next').addEventListener('click', function (e) {
    e.stopPropagation();
    showImage(1);
  });

  // Fermer la lightbox avec la touche Échap
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('show')) {
      lightbox.style.display = 'none';
      lightbox.classList.remove('show');
      document.body.style.overflow = '';
    }
  });
});
// --- CARROUSEL D'ACCUEIL ---
document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;

  const items = carousel.querySelectorAll('.carousel-item');
  const indicators = carousel.querySelectorAll('.carousel-indicators button');
  let current = 0;
  let interval = null;

  function showSlide(index) {
    items.forEach((item, i) => {
      item.classList.toggle('active', i === index);
      if (indicators[i]) indicators[i].classList.toggle('active', i === index);
    });
    current = index;
  }

  function nextSlide() {
    showSlide((current + 1) % items.length);
  }

  function prevSlide() {
    showSlide((current - 1 + items.length) % items.length);
  }

  // Auto défilement
  function startAuto() {
    interval = setInterval(nextSlide, 4000);
  }
  function stopAuto() {
    clearInterval(interval);
  }

  // Boutons
  const prevBtn = carousel.querySelector('.carousel-control-prev');
  const nextBtn = carousel.querySelector('.carousel-control-next');
  if (prevBtn) prevBtn.addEventListener('click', function(e) { e.preventDefault(); prevSlide(); stopAuto(); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', function(e) { e.preventDefault(); nextSlide(); stopAuto(); startAuto(); });

  // Indicateurs
  indicators.forEach((btn, i) => {
    btn.addEventListener('click', function() {
      showSlide(i);
      stopAuto();
      startAuto();
    });
  });

  // Initialisation
  showSlide(0);
  startAuto();
});