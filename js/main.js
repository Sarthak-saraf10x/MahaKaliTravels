/* ==========================================================================
   Mahakali Tours & Travels - Master JavaScript (ES6)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ------------------------------------------------------------------
  // 1. Preloader & Page Initialization
  // ------------------------------------------------------------------
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
      }, 800);
    });
    // Fallback if load fires early or delayed
    setTimeout(() => {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
    }, 2000);
  }

  // Initialize AOS (Animate On Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 80
    });
  }

  // ------------------------------------------------------------------
  // 2. Sticky Navbar & Mobile Drawer
  // ------------------------------------------------------------------
  const headerArea = document.querySelector('.header-area');
  const backToTopBtn = document.querySelector('.back-to-top');
  const sections = document.querySelectorAll('section[id]');
  const mainNavLinks = document.querySelectorAll('.header-area .nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      headerArea?.classList.add('sticky');
    } else {
      headerArea?.classList.remove('sticky');
    }

    if (window.scrollY > 400) {
      backToTopBtn?.classList.add('active');
    } else {
      backToTopBtn?.classList.remove('active');
    }

    // Scrollspy active section highlighting
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 160;
    const isAtBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50;

    if (isAtBottom) {
      currentSectionId = 'contact';
    } else if (window.scrollY < 100) {
      currentSectionId = 'home';
    } else {
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          currentSectionId = section.getAttribute('id');
        }
      });
    }

    if (currentSectionId) {
      mainNavLinks.forEach(link => {
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  });

  // Handle click active highlighting
  mainNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mainNavLinks.forEach(item => item.classList.remove('active'));
      link.classList.add('active');
    });
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Mobile Nav Drawer Toggle
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const navCollapse = document.querySelector('.navbar-collapse');

  if (navToggle && navCollapse) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !navCollapse.classList.contains('show');
      if (isOpen) {
        navCollapse.classList.add('show');
        document.body.classList.add('mobile-nav-active');
        const icon = navToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        }
      } else {
        navCollapse.classList.remove('show');
        document.body.classList.remove('mobile-nav-active');
        const icon = navToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    };

    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close when clicking any link inside the mobile drawer
    const drawerLinks = navCollapse.querySelectorAll('a');
    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleMenu(false);
      });
    });

    // Close when clicking outside of the drawer & toggle button
    document.addEventListener('click', (e) => {
      if (navCollapse.classList.contains('show')) {
        if (!navCollapse.contains(e.target) && !navToggle.contains(e.target)) {
          toggleMenu(false);
        }
      }
    });
  }

  // ------------------------------------------------------------------
  // 3. GSAP Hero Entrance Animations & Floating Parallax
  // ------------------------------------------------------------------
  if (typeof gsap !== 'undefined') {
    gsap.from('.hero-badge', { opacity: 0, y: -20, duration: 0.8, delay: 0.5 });
    gsap.from('.hero-title', { opacity: 0, y: 30, duration: 1, delay: 0.7 });
    gsap.from('.hero-subtitle', { opacity: 0, y: 25, duration: 1, delay: 0.9 });
    gsap.from('.hero-btns', { opacity: 0, y: 20, duration: 0.8, delay: 1.1 });
    gsap.from('.hero-features-list', { opacity: 0, y: 20, duration: 0.8, delay: 1.3 });

    // Parallax effect on Hero Shapes
    document.addEventListener('mousemove', (e) => {
      const mouseX = (e.clientX / window.innerWidth - 0.5) * 30;
      const mouseY = (e.clientY / window.innerHeight - 0.5) * 30;

      gsap.to('.shape-1', { x: mouseX, y: mouseY, duration: 1, ease: 'power1.out' });
      gsap.to('.shape-2', { x: -mouseX, y: -mouseY, duration: 1, ease: 'power1.out' });
    });
  }

  // ------------------------------------------------------------------
  // 4. Trending Destinations Swiper Slider
  // ------------------------------------------------------------------
  if (typeof Swiper !== 'undefined' && document.querySelector('.dest-swiper')) {
    new Swiper('.dest-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        640: { slidesPerView: 2, spaceBetween: 24 },
        992: { slidesPerView: 3, spaceBetween: 24 },
        1200: { slidesPerView: 4, spaceBetween: 24 }
      }
    });
  }

  // ------------------------------------------------------------------
  // 5. Featured Tour Packages Dynamic Data & Filtering
  // ------------------------------------------------------------------
  const tourPackagesData = [
    {
      id: 1,
      title: "Mahabaleshwar Strawberry Escape",
      category: "weekend",
      destination: "Mahabaleshwar",
      image: "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=800&q=80",
      price: 4999,
      duration: "3 Days / 2 Nights",
      inclusions: ["3 Star Resort", "Strawberry Farm Tour", "AC Private Cab", "Breakfast & Dinner"],
      tag: "Best Seller"
    },
    {
      id: 2,
      title: "Lonavala Waterfall & Cave Trek",
      category: "monsoon",
      destination: "Lonavala",
      image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
      price: 2999,
      duration: "2 Days / 1 Night",
      inclusions: ["Villa Stay", "Bhushi Dam Visit", "Fort Trek Guide", "All Meals"],
      tag: "Trending"
    },
    {
      id: 3,
      title: "Alibaug Luxury Beach Resort Retreat",
      category: "beach",
      destination: "Alibaug",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      price: 6499,
      duration: "3 Days / 2 Nights",
      inclusions: ["Beachfront Resort", "Speedboat Ride", "Seafood Special", "Private Transport"],
      tag: "Luxury"
    },
    {
      id: 4,
      title: "Tarkarli Scuba & Sindhudurg Fort",
      category: "adventure",
      destination: "Tarkarli",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
      price: 7999,
      duration: "4 Days / 3 Nights",
      inclusions: ["Scuba Diving + Video", "Water Sports Package", "Home Stay", "Malvani Cuisine"],
      tag: "Water Adventure"
    },
    {
      id: 5,
      title: "Kolad White Water Rafting Expedition",
      category: "adventure",
      destination: "Kolad",
      image: "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=800&q=80",
      price: 3499,
      duration: "2 Days / 1 Night",
      inclusions: ["12km River Rafting", "Riverside Camping", "BBQ Night", "Safety Gear"],
      tag: "Thrill Special"
    },
    {
      id: 6,
      title: "Bhandardara Lakeside Camping & Fireflies",
      category: "weekend",
      destination: "Bhandardara",
      image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80",
      price: 2499,
      duration: "2 Days / 1 Night",
      inclusions: ["Dome Tents", "Stargazing", "Campfire & Music", "Arthur Lake Boating"],
      tag: "Popular"
    }
  ];

  const packagesGrid = document.getElementById('packages-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');

  function renderPackages(items) {
    if (!packagesGrid) return;
    packagesGrid.innerHTML = items.map(pkg => `
      <div class="col-lg-4 col-md-6" data-aos="fade-up">
        <div class="premium-card package-card">
          <div class="package-img-wrap">
            <img src="${pkg.image}" alt="${pkg.title}" class="package-img" loading="lazy">
            <span class="package-tag">${pkg.tag}</span>
            <span class="package-duration"><i class="fa-regular fa-clock me-1"></i>${pkg.duration}</span>
          </div>
          <div class="package-body">
            <span class="package-dest"><i class="fa-solid fa-location-dot me-1"></i>${pkg.destination}</span>
            <h3 class="package-title">${pkg.title}</h3>
            <div class="package-inclusions">
              ${pkg.inclusions.map(inc => `<span class="inclusion-item"><i class="fa-solid fa-circle-check"></i>${inc}</span>`).join('')}
            </div>
            <div class="package-footer">
              <div class="package-price-wrap">
                <span class="package-price-label">Starting From</span>
                <div class="package-price">₹${pkg.price.toLocaleString('en-IN')} <span>/ person</span></div>
              </div>
              <a href="https://wa.me/917517685951?text=${encodeURIComponent(`Hello Mahakali Tours & Travels, I want to book the *${pkg.title}* package (Price: ₹${pkg.price.toLocaleString('en-IN')} / person). Please provide details.`)}" target="_blank" class="btn-custom btn-primary-custom">
                Book Now <i class="fa-solid fa-arrow-right ms-1"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  renderPackages(tourPackagesData);

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-filter');
      if (category === 'all') {
        renderPackages(tourPackagesData);
      } else {
        const filtered = tourPackagesData.filter(p => p.category === category);
        renderPackages(filtered);
      }
    });
  });

  // ------------------------------------------------------------------
  // 6. Why Choose Us Counter Animation
  // ------------------------------------------------------------------
  const counters = document.querySelectorAll('.counter-number');
  let animated = false;

  function runCounters() {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      let count = 0;
      const speed = target / 60;

      const updateCount = () => {
        count += speed;
        if (count < target) {
          counter.innerText = Math.ceil(count) + '+';
          setTimeout(updateCount, 25);
        } else {
          counter.innerText = target + '+';
        }
      };
      updateCount();
    });
  }

  window.addEventListener('scroll', () => {
    const counterSection = document.querySelector('.counter-wrapper');
    if (counterSection && !animated) {
      const pos = counterSection.getBoundingClientRect().top;
      if (pos < window.innerHeight - 100) {
        runCounters();
        animated = true;
      }
    }
  });

  // ------------------------------------------------------------------
  // 7. Gallery Pinterest Masonry & Lightbox Modal
  // ------------------------------------------------------------------
  const galleryCatBtns = document.querySelectorAll('.gallery-cat-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryCatBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryCatBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-gallery-filter');
      galleryItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Gallery Modal Handler
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const imgSrc = item.querySelector('img')?.src;
      const title = item.querySelector('.gallery-title')?.innerText || 'Maharashtra Travel Highlight';
      const isVideo = item.getAttribute('data-type') === 'video';

      const modalTitle = document.getElementById('galleryModalTitle');
      const modalBody = document.getElementById('galleryModalBody');

      if (modalTitle && modalBody) {
        modalTitle.innerText = title;
        if (isVideo) {
          modalBody.innerHTML = `
            <div class="ratio ratio-16x9">
              <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" title="YouTube video" allowfullscreen></iframe>
            </div>
          `;
        } else {
          modalBody.innerHTML = `<img src="${imgSrc}" class="img-fluid rounded-4 w-100" alt="${title}">`;
        }

        const galleryModal = new bootstrap.Modal(document.getElementById('galleryModal'));
        galleryModal.show();
      }
    });
  });

  // ------------------------------------------------------------------
  // 8. Upcoming Group Tours Load Dynamically
  // ------------------------------------------------------------------
  const groupToursData = [
    {
      destination: "Kalsubai Peak Monsoon Night Trek",
      date: "15 Aug 2026",
      seats: 8,
      price: 1499,
      duration: "1 Day / 1 Night",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"
    },
    {
      destination: "Kaas Plateau Flower Valley Expedition",
      date: "28 Aug 2026",
      seats: 12,
      price: 2999,
      duration: "2 Days / 1 Night",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80"
    },
    {
      destination: "Scuba Diving & Coral Reef Trip Tarkarli",
      date: "05 Sep 2026",
      seats: 5,
      price: 6999,
      duration: "3 Days / 2 Nights",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const groupToursContainer = document.getElementById('group-tours-list');
  if (groupToursContainer) {
    groupToursContainer.innerHTML = groupToursData.map(tour => `
      <div class="col-12" data-aos="fade-up">
        <div class="premium-card group-tour-card">
          <div class="gt-img-wrap">
            <img src="${tour.image}" alt="${tour.destination}" class="gt-img" loading="lazy">
          </div>
          <div class="gt-info">
            <div class="gt-meta">
              <span><i class="fa-regular fa-calendar-check me-1"></i>Departure: ${tour.date}</span>
              <span><i class="fa-solid fa-user-group me-1"></i>${tour.seats} Seats Left</span>
            </div>
            <h4 class="gt-title">${tour.destination}</h4>
            <div class="gt-details-row">
              <span><i class="fa-regular fa-clock"></i>${tour.duration}</span>
              <span><i class="fa-solid fa-bus"></i>AC Bus Pickup from Mumbai / Pune</span>
            </div>
            <div class="gt-action">
              <div class="gt-price">₹${tour.price.toLocaleString('en-IN')} <span class="fs-6 fw-normal text-muted">/ person</span></div>
              <a href="https://wa.me/917517685951?text=${encodeURIComponent(`Hello Mahakali Tours & Travels, I would like to reserve a seat for the upcoming *${tour.destination}* on *${tour.date}* (Price: ₹${tour.price.toLocaleString('en-IN')} / person). Please confirm availability.`)}" target="_blank" class="btn-custom btn-primary-custom">
                Reserve Seat <i class="fa-solid fa-bolt ms-1"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // ------------------------------------------------------------------
  // 9. Testimonials Auto Slider
  // ------------------------------------------------------------------
  if (typeof Swiper !== 'undefined' && document.querySelector('.testi-swiper')) {
    new Swiper('.testi-swiper', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.testi-pagination',
        clickable: true,
      },
      breakpoints: {
        768: { slidesPerView: 2 },
        1200: { slidesPerView: 3 }
      }
    });
  }

  // ------------------------------------------------------------------
  // 10. Form Validation & Booking Modal Logic
  // ------------------------------------------------------------------

  // Booking Modal Handler
  const bookingModalElem = document.getElementById('bookingModal');
  let bookingModalInstance;
  if (bookingModalElem) {
    bookingModalInstance = new bootstrap.Modal(bookingModalElem);
  }

  function openBookingModal(pkgTitle, pkgPrice) {
    const modalTitle = document.getElementById('modalPkgTitle');
    const modalPrice = document.getElementById('modalPkgPrice');
    const priceInput = document.getElementById('pkgPriceHidden');
    const totalDisplay = document.getElementById('modalTotalPrice');

    if (modalTitle) modalTitle.innerText = pkgTitle;
    if (modalPrice) modalPrice.innerText = `₹${parseInt(pkgPrice).toLocaleString('en-IN')}`;
    if (priceInput) priceInput.value = pkgPrice;
    if (totalDisplay) totalDisplay.innerText = `₹${parseInt(pkgPrice).toLocaleString('en-IN')}`;

    if (bookingModalInstance) {
      bookingModalInstance.show();
    }
  }

  // Calculate total price based on travelers
  const travelersInput = document.getElementById('bookingTravelers');
  if (travelersInput) {
    travelersInput.addEventListener('input', () => {
      const price = parseInt(document.getElementById('pkgPriceHidden')?.value || 0);
      const count = parseInt(travelersInput.value || 1);
      const total = price * count;
      const totalDisplay = document.getElementById('modalTotalPrice');
      if (totalDisplay) {
        totalDisplay.innerText = `₹${total.toLocaleString('en-IN')}`;
      }
    });
  }

  // Booking Form Submit
  const bookingForm = document.getElementById('modal-booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('bookingName')?.value;
      const phone = document.getElementById('bookingPhone')?.value;

      if (!name || !phone) {
        showToast("Please complete all required fields.", "error");
        return;
      }

      bookingModalInstance.hide();
      showToast(`🎉 Thank you ${name}! Your booking enquiry has been received. Our team will call you at ${phone} shortly.`, "success");
      bookingForm.reset();
    });
  }

  // Contact Form Submission Validation
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name')?.value;
      const email = document.getElementById('contact-email')?.value;
      const msg = document.getElementById('contact-msg')?.value;

      if (!name || !email || !msg) {
        showToast("Please fill in your name, email and message.", "error");
        return;
      }

      showToast(`Thank you ${name}! Your message has been sent to Mahakali Tours team.`, "success");
      contactForm.reset();
    });
  }

  // Newsletter Subscription Form (Store in LocalStorage simulation)
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletter-email');
      const email = emailInput?.value;

      if (!email || !email.includes('@')) {
        showToast("Please enter a valid email address.", "error");
        return;
      }

      // Save to localStorage simulation for MongoDB persistence UI feedback
      const subscribers = JSON.parse(localStorage.getItem('mahakali_subscribers') || '[]');
      subscribers.push({ email: email, subscribedAt: new Date().toISOString() });
      localStorage.setItem('mahakali_subscribers', JSON.stringify(subscribers));

      showToast("✨ Subscribed successfully! Exclusive tour offers sent to " + email, "success");
      newsletterForm.reset();
    });
  }

  // ------------------------------------------------------------------
  // 11. Custom Toast System
  // ------------------------------------------------------------------
  function showToast(message, type = "success") {
    let container = document.querySelector('.toast-container-custom');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container-custom';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-custom';
    
    let icon = '<i class="fa-solid fa-circle-check text-success fs-5"></i>';
    if (type === 'error') icon = '<i class="fa-solid fa-circle-exclamation text-danger fs-5"></i>';
    if (type === 'info') icon = '<i class="fa-solid fa-compass text-warning fs-5"></i>';

    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-30px)';
      toast.style.transition = '0.4s ease';
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }

  // ------------------------------------------------------------------
  // 11b. Corporate Travel Solutions Section Logic
  // ------------------------------------------------------------------
  
  // Corporate Modal Handler
  const corporateModalElem = document.getElementById('corporateModal');
  let corporateModalInstance;
  if (corporateModalElem) {
    corporateModalInstance = new bootstrap.Modal(corporateModalElem);
  }

  // Globally scope openCorporateModal so onclick event can fire it
  window.openCorporateModal = function() {
    if (corporateModalInstance) {
      corporateModalInstance.show();
    }
  };

  // Corporate Booking Form Handler
  const corpBookingForm = document.getElementById('corp-booking-form');
  if (corpBookingForm) {
    corpBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const company = document.getElementById('corpCompanyName')?.value;
      const contact = document.getElementById('corpContactName')?.value;
      const email = document.getElementById('corpEmail')?.value;
      const phone = document.getElementById('corpPhone')?.value;
      const service = document.getElementById('corpServiceType')?.value;
      const message = document.getElementById('corpMsg')?.value;

      if (!company || !contact || !email || !phone || !message) {
        showToast("Please fill in all required fields.", "error");
        return;
      }

      // Hide Modal
      if (corporateModalInstance) {
        corporateModalInstance.hide();
      }

      // Success Notification
      showToast(`💼 Thank you ${contact}! Your RFP for ${company} has been received. Our B2B Account Manager will reach out to you within 2 hours.`, "success");
      corpBookingForm.reset();
    });
  }

  // Corporate Statistics Counter Animation
  const corpCounters = document.querySelectorAll('.corp-stat-number');
  let corpAnimated = false;

  function runCorpCounters() {
    corpCounters.forEach(counter => {
      const target = +counter.getAttribute('data-corp-target');
      const suffix = counter.getAttribute('data-suffix') || '';
      let count = 0;
      const speed = target / 60; // Run in 60 steps

      const updateCount = () => {
        count += speed;
        if (count < target) {
          counter.innerText = Math.ceil(count).toLocaleString('en-IN') + suffix;
          setTimeout(updateCount, 25);
        } else {
          counter.innerText = target.toLocaleString('en-IN') + suffix;
        }
      };
      updateCount();
    });
  }

  function checkCorpCounters() {
    const corpCounterSection = document.querySelector('.corp-stats-wrapper');
    if (corpCounterSection && !corpAnimated) {
      const pos = corpCounterSection.getBoundingClientRect().top;
      if (pos < window.innerHeight - 50) {
        runCorpCounters();
        corpAnimated = true;
      }
    }
  }

  window.addEventListener('scroll', checkCorpCounters);
  // Also check immediately in case the section is already in view on load
  setTimeout(checkCorpCounters, 1500);

  // ------------------------------------------------------------------
  // 12. Floating WhatsApp Direct Chat Widget
  // ------------------------------------------------------------------
  const whatsappWidget = document.querySelector('.whatsapp-float');
  if (whatsappWidget) {
    whatsappWidget.addEventListener('click', () => {
      const phoneNumber = "917517685951";
      const defaultText = encodeURIComponent("Hello Mahakali Tours & Travels, I would like to inquire about Maharashtra tour packages.");
      window.open(`https://wa.me/${phoneNumber}?text=${defaultText}`, '_blank');
    });
  }

});
