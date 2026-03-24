const pages = document.querySelectorAll('.page');
const pageButtons = document.querySelectorAll('[data-page-target]');
const navLinks = document.querySelectorAll('.nav-link');
const footerLinks = document.querySelectorAll('.footer-link');
const brandLink = document.querySelector('.brand');
const siteNav = document.querySelector('.site-nav');
const menuToggle = document.querySelector('.menu-toggle');
const revealItems = document.querySelectorAll('.reveal');

function setActiveNav(targetId) {
  navLinks.forEach(link => link.classList.toggle('active', link.dataset.pageTarget === targetId));
}

function showPage(targetId) {
  pages.forEach(page => page.classList.toggle('active', page.id === targetId));
  setActiveNav(targetId);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  siteNav.classList.remove('open');
}

pageButtons.forEach(button => {
  button.addEventListener('click', () => showPage(button.dataset.pageTarget));
});

if (brandLink) {
  brandLink.addEventListener('click', (event) => {
    event.preventDefault();
    showPage('home-page');
  });
}

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    siteNav.classList.toggle('open');
  });
}

const orgTabs = document.querySelectorAll('.org-tab');
const orgPanels = document.querySelectorAll('.org-panel');
orgTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    orgTabs.forEach(item => item.classList.remove('active'));
    orgPanels.forEach(panel => panel.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.orgTarget)?.classList.add('active');
  });
});

const galleryCards = document.querySelectorAll('.gallery-card');
const filterButtons = document.querySelectorAll('.filter-btn');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;

    galleryCards.forEach(card => {
      const category = card.dataset.category;
      const isMatch = filter === 'all' || category === filter;
      card.classList.toggle('hidden-by-filter', !isMatch);
    });
  });
});

galleryCards.forEach(card => {
  card.addEventListener('click', () => {
    const img = card.querySelector('img');
    const title = card.querySelector('h3')?.textContent || 'Gallery Image';
    lightboxImage.src = img.src;
    lightboxCaption.textContent = title;
    lightbox.classList.add('open');
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  lightboxImage.src = '';
}

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox();
});

const featuredImages = [
  {
    src: 'assets/gallery-1.svg',
    title: 'Federation Event',
    text: 'A premium featured showcase area for boxing events, training, awards, and official activities.'
  },
  {
    src: 'assets/gallery-2.svg',
    title: 'Elite Training Camp',
    text: 'Focused skill development, discipline, endurance, and champion preparation.'
  },
  {
    src: 'assets/gallery-3.svg',
    title: 'Awards Ceremony',
    text: 'Celebrating athletes, officials, and federation milestones with pride.'
  },
  {
    src: 'assets/gallery-4.svg',
    title: 'Federation Activities',
    text: 'Official programs, technical meetings, and organized growth activity.'
  }
];

const featuredGalleryImage = document.getElementById('featured-gallery-image');
const featuredGalleryTitle = document.getElementById('featured-gallery-title');
const featuredGalleryText = document.getElementById('featured-gallery-text');
let featuredIndex = 0;

function rotateFeaturedGallery() {
  if (!featuredGalleryImage || !featuredGalleryTitle || !featuredGalleryText) return;
  featuredIndex = (featuredIndex + 1) % featuredImages.length;
  const current = featuredImages[featuredIndex];
  featuredGalleryImage.src = current.src;
  featuredGalleryTitle.textContent = current.title;
  featuredGalleryText.textContent = current.text;
}
setInterval(rotateFeaturedGallery, 3500);

const championTrack = document.getElementById('champion-track');
const championPrev = document.getElementById('champion-prev');
const championNext = document.getElementById('champion-next');
let championStep = 0;

function updateChampionSlide() {
  if (!championTrack) return;
  const offset = window.innerWidth <= 640 ? championStep * 100 : window.innerWidth <= 1080 ? championStep * 50 : championStep * 25;
  championTrack.style.transform = `translateX(-${offset}%)`;
  championTrack.style.transition = 'transform 400ms ease';
}

championPrev?.addEventListener('click', () => {
  const max = window.innerWidth <= 640 ? 3 : window.innerWidth <= 1080 ? 2 : 0;
  championStep = Math.max(0, championStep - 1);
  if (max === 0) championStep = 0;
  updateChampionSlide();
});

championNext?.addEventListener('click', () => {
  const max = window.innerWidth <= 640 ? 3 : window.innerWidth <= 1080 ? 2 : 0;
  championStep = Math.min(max, championStep + 1);
  updateChampionSlide();
});

window.addEventListener('resize', () => {
  championStep = 0;
  updateChampionSlide();
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach(item => observer.observe(item));

const contactForm = document.querySelector('.contact-form');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  alert('Demo form only. Connect this form to email or backend later.');
});

footerLinks.forEach(button => {
  button.addEventListener('click', () => showPage(button.dataset.pageTarget));
});

/* --- Premium Carousel Logic --- */
class PremiumCarousel {
  constructor(element) {
    this.carousel = element;
    this.track = element.querySelector('.carousel-track');
    this.slides = Array.from(this.track.children);
    this.prevBtn = element.querySelector('.carousel-arrow.prev');
    this.nextBtn = element.querySelector('.carousel-arrow.next');
    this.dotsContainer = element.querySelector('.carousel-dots');
    
    this.currentIndex = 0;
    this.isDragging = false;
    this.startX = 0;
    this.currentTranslate = 0;
    this.prevTranslate = 0;
    this.animationID = 0;
    
    this.init();
  }

  get slidesPerView() {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 1080) return 2;
    return 3;
  }

  get maxIndex() {
    return Math.max(0, this.slides.length - this.slidesPerView);
  }

  init() {
    // Create dots
    this.slides.forEach((_, i) => {
      if (i > this.maxIndex) return;
      const dot = document.createElement('button');
      dot.classList.add('dot');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => this.goTo(i));
      this.dotsContainer.appendChild(dot);
    });
    this.dots = Array.from(this.dotsContainer.children);

    // Buttons
    if(this.prevBtn) this.prevBtn.addEventListener('click', () => this.goTo(this.currentIndex - 1));
    if(this.nextBtn) this.nextBtn.addEventListener('click', () => this.goTo(this.currentIndex + 1));

    // Touch events
    this.track.addEventListener('mousedown', this.dragStart.bind(this));
    this.track.addEventListener('touchstart', this.dragStart.bind(this), {passive: true});
    this.track.addEventListener('mouseup', this.dragEnd.bind(this));
    this.track.addEventListener('mouseleave', () => { if(this.isDragging) this.dragEnd() });
    this.track.addEventListener('touchend', this.dragEnd.bind(this));
    this.track.addEventListener('mousemove', this.drag.bind(this));
    this.track.addEventListener('touchmove', this.drag.bind(this), {passive: true});

    // Resize
    window.addEventListener('resize', () => {
      this.goTo(Math.min(this.currentIndex, this.maxIndex));
      this.updateDots();
    });

    this.updateControls();
    this.startAutoplay();
  }

  startAutoplay() {
    this.stopAutoplay();
    this.autoplayInterval = setInterval(() => {
      if (this.isDragging) return;
      let nextIndex = this.currentIndex + 1;
      if (nextIndex > this.maxIndex) {
        nextIndex = 0;
      }
      this.goTo(nextIndex);
    }, 4500); // 4.5 seconds for billion-dollar pacing
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
  }

  dragStart(e) {
    this.isDragging = true;
    this.stopAutoplay();
    this.startX = this.getPositionX(e);
    this.animationID = requestAnimationFrame(this.animation.bind(this));
    this.track.style.transition = 'none';
  }

  drag(e) {
    if (this.isDragging) {
      const currentPosition = this.getPositionX(e);
      this.currentTranslate = this.prevTranslate + currentPosition - this.startX;
    }
  }

  dragEnd() {
    this.isDragging = false;
    cancelAnimationFrame(this.animationID);
    
    const movedBy = this.currentTranslate - this.prevTranslate;
    
    if (movedBy < -100 && this.currentIndex < this.maxIndex) {
      this.currentIndex += 1;
    } else if (movedBy > 100 && this.currentIndex > 0) {
      this.currentIndex -= 1;
    }
    
    this.goTo(this.currentIndex);
    this.startAutoplay();
  }

  getPositionX(e) {
    return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
  }

  animation() {
    if (this.isDragging) {
      this.track.style.transform = `translateX(${this.currentTranslate}px)`;
      requestAnimationFrame(this.animation.bind(this));
    }
  }

  goTo(index) {
    if (index < 0) index = 0;
    if (index > this.maxIndex) index = this.maxIndex;
    
    this.currentIndex = index;
    // Calculate gap based on CSS (20px)
    const gap = 20; 
    const slideWidth = this.slides[0].clientWidth;
    const offset = this.currentIndex * (slideWidth + gap);
    
    this.currentTranslate = -offset;
    this.prevTranslate = this.currentTranslate;
    
    this.track.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
    this.track.style.transform = `translateX(${this.currentTranslate}px)`;
    
    this.updateControls();
    
    // Also reset autoplay timer if navigating manually
    if (!this.isDragging) {
      this.startAutoplay();
    }
  }

  updateControls() {
    if(this.prevBtn) this.prevBtn.disabled = this.currentIndex === 0;
    if(this.nextBtn) this.nextBtn.disabled = this.currentIndex >= this.maxIndex;
    this.updateDots();
  }

  updateDots() {
    this.dots.forEach((dot, i) => {
      dot.style.display = i > this.maxIndex ? 'none' : 'block';
      dot.classList.toggle('active', i === this.currentIndex);
    });
  }
}

// Initialize all premium carousels
document.querySelectorAll('.premium-carousel').forEach(el => new PremiumCarousel(el));

/* --- Scroll Sequence Logic --- */
const sequenceFrameCount = 160;
const sequenceImages = [];
let sequenceImagesLoaded = 0;
const sequenceCanvas = document.getElementById('champion-scroll-canvas');
let sequenceCtx;

if (sequenceCanvas) {
  sequenceCtx = sequenceCanvas.getContext('2d');
  
  // Preload frames
  for (let i = 0; i < sequenceFrameCount; i++) {
    const img = new Image();
    const frameIndex = i.toString().padStart(3, '0');
    // Adjusting for the correct path
    img.src = `sequence/frame_${frameIndex}_delay-0.05s.webp`;
    img.onload = () => {
      sequenceImagesLoaded++;
      // Draw first frame ASAP
      if (sequenceImagesLoaded === 1 || i === 0) {
        if (!sequenceCanvas.width && img.naturalWidth) {
          sequenceCanvas.width = img.naturalWidth;
          sequenceCanvas.height = img.naturalHeight;
        }
        if (i === 0) {
          sequenceCtx.drawImage(img, 0, 0, sequenceCanvas.width, sequenceCanvas.height);
          sequenceCanvas.classList.add('loaded');
        }
      }
    };
    sequenceImages.push(img);
  }

  // Handle scroll to scrub sequence
  window.addEventListener('scroll', () => {
    const championPage = document.getElementById('champion-page');
    // Only process if we are on the champion page
    if (!championPage || !championPage.classList.contains('active')) return;

    const wrapper = document.getElementById('champion-sequence-wrapper');
    if (!wrapper) return;

    const rect = wrapper.getBoundingClientRect();
    const scrollableHeight = rect.height - window.innerHeight;
    
    // Calculate progress based on how far the wrapper has scrolled past viewport top
    let rawProgress = -rect.top / scrollableHeight;
    // Map progress exactly to scroll distance with no multiplier to eliminate frozen "gaps"
    let progress = Math.max(0, Math.min(1, rawProgress));

    // Determine current frame
    const frameIndex = Math.floor(progress * (sequenceFrameCount - 1));
    
    requestAnimationFrame(() => {
      // Draw frame if fully loaded
      const currentImg = sequenceImages[frameIndex];
      if (currentImg && currentImg.complete && currentImg.naturalWidth) {
        if (!sequenceCanvas.width) {
          sequenceCanvas.width = currentImg.naturalWidth;
          sequenceCanvas.height = currentImg.naturalHeight;
        }
        sequenceCtx.clearRect(0, 0, sequenceCanvas.width, sequenceCanvas.height);
        sequenceCtx.drawImage(currentImg, 0, 0, sequenceCanvas.width, sequenceCanvas.height);
      }
      
      // Handle text overlays based on scroll progress milestones
      const t1 = document.getElementById('sequence-text-1');
      const t2 = document.getElementById('sequence-text-2');
      const t3 = document.getElementById('sequence-text-3');
      
      if (t1) t1.classList.toggle('active', progress > 0.1 && progress < 0.35);
      if (t2) t2.classList.toggle('active', progress > 0.45 && progress < 0.7);
      if (t3) t3.classList.toggle('active', progress >= 0.8 && progress <= 1.0);
    });
  }, { passive: true });
}

/* --- Sticky Header Scroll Animation --- */
const siteHeader = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  if (siteHeader) {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }
}, { passive: true });

