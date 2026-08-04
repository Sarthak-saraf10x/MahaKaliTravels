/**
 * Mahakali Tours & Travels - API Integration Layer
 * Connects index.html frontend directly to the Node.js + Express + MongoDB backend REST APIs.
 */

const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
  ? 'http://localhost:5000/api' 
  : 'https://mahakalibackend.onrender.com/api';


document.addEventListener('DOMContentLoaded', () => {
  fetchFeaturedPackages();
  fetchGalleryItems();
  fetchUpcomingTours();
  initFormListeners();
});

// 1. Fetch & Render Featured Tour Packages
async function fetchFeaturedPackages() {
  try {
    const packagesGrid = document.getElementById('packages-grid');
    if (!packagesGrid) return;

    const res = await fetch(`${API_BASE}/packages`);
    const data = await res.json();

    if (data.success && data.data && data.data.length > 0) {
      packagesGrid.innerHTML = '';
      data.data.forEach(pkg => {
        const discountTag = pkg.discountPrice ? `<span class="badge-discount">${Math.round(((pkg.price - pkg.discountPrice)/pkg.price)*100)}% OFF</span>` : '';
        const priceDisplay = pkg.discountPrice ? `₹${pkg.discountPrice.toLocaleString()} <span class="text-decoration-line-through text-muted fs-6">₹${pkg.price.toLocaleString()}</span>` : `₹${pkg.price.toLocaleString()}`;
        const categoryBadge = pkg.category ? `<span class="badge bg-gold text-dark mb-2">${pkg.category}</span>` : '';

        const cardHTML = `
          <div class="col-lg-4 col-md-6" data-aos="fade-up">
            <div class="package-card">
              <div class="package-img-wrapper">
                <img src="${pkg.image}" alt="${pkg.name}" class="package-img" loading="lazy">
                ${discountTag}
                <div class="package-overlay-badge">
                  <i class="fa-solid fa-clock me-1"></i> ${pkg.duration}
                </div>
              </div>
              <div class="package-content p-4">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  ${categoryBadge}
                  <span class="small text-warning fw-bold"><i class="fa-solid fa-star me-1"></i> ${pkg.rating || 4.8}</span>
                </div>
                <h4 class="package-title">${pkg.name}</h4>
                <p class="package-desc text-muted small">${pkg.description}</p>
                <div class="package-footer d-flex justify-content-between align-items-center pt-3 border-top border-secondary">
                  <div>
                    <span class="small text-muted d-block">Starting from</span>
                    <span class="package-price">${priceDisplay}</span>
                  </div>
                  <button class="btn btn-outline-gold rounded-pill px-3 py-2 btn-sm" onclick="openBookingModal('${pkg.name}', ${pkg.discountPrice || pkg.price})">
                    Book Now <i class="fa-solid fa-arrow-right ms-1"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
        packagesGrid.innerHTML += cardHTML;
      });
    }
  } catch (err) {
    console.warn('API fetch warning (using default package markup if server connecting):', err.message);
  }
}

// 2. Fetch & Render Gallery Images
async function fetchGalleryItems() {
  try {
    const galleryContainer = document.querySelector('#gallery .gallery-grid') || document.querySelector('#gallery .row.g-4');
    if (!galleryContainer) return;

    const res = await fetch(`${API_BASE}/gallery`);
    const data = await res.json();

    if (data.success) {
      if (data.data && data.data.length > 0) {
        galleryContainer.innerHTML = '';
        data.data.forEach((item, index) => {
          let sizeClass = '';
          if (index % 5 === 0) sizeClass = 'tall';
          else if (index % 4 === 0) sizeClass = 'wide';

          const catSlug = (item.category || 'all').toLowerCase().replace(/\s+/g, '-');

          const itemHTML = `
            <div class="gallery-item ${sizeClass}" data-category="${catSlug}" data-type="image">
              <img src="${item.imageUrl || item.url}" alt="${item.title || 'Mahakali Travel'}" class="gallery-img" loading="lazy">
              <div class="gallery-hover-overlay">
                <div class="gallery-icon-btn"><i class="fa-solid fa-expand"></i></div>
                <h4 class="gallery-title">${item.title || 'Mahakali Travel'}</h4>
                <span class="gallery-cat">${item.category || 'Mahakali Tours'}</span>
              </div>
            </div>
          `;
          galleryContainer.innerHTML += itemHTML;
        });

        // Attach modal handlers to dynamically created gallery items
        initDynamicGalleryLightbox();
      } else {
        galleryContainer.innerHTML = `
          <div class="col-12 text-center text-muted py-5 w-100">
            <i class="fa-solid fa-images fa-3x mb-3 text-secondary"></i>
            <p class="fs-5 text-light">No gallery images available right now.</p>
          </div>
        `;
      }
    }
  } catch (err) {
    console.warn('Gallery API warning:', err.message);
  }
}

// Lightbox handler for dynamic gallery items
function initDynamicGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
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

        const galleryModalEl = document.getElementById('galleryModal');
        if (galleryModalEl && window.bootstrap) {
          const galleryModal = new bootstrap.Modal(galleryModalEl);
          galleryModal.show();
        }
      }
    });
  });
}

// 3. Fetch & Render Daily Bus Routes (Bookings Redirect to WhatsApp)
async function fetchBusRoutes() {
  try {
    const toursList = document.getElementById('group-tours-list');
    if (!toursList) return;

    let routes = [];
    try {
      const res = await fetch(`${API_BASE}/bus-routes`);
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        routes = data.data;
      }
    } catch (e) {
      console.warn("Falling back to /tours endpoint");
      const res = await fetch(`${API_BASE}/tours`);
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        routes = data.data;
      }
    }

    // Default Fallback Bus Routes if DB has 0 records
    if (routes.length === 0) {
      routes = [
        {
          source: 'Nagpur',
          destination: 'Pune',
          busType: 'AC Sleeper (2+1)',
          departureTime: '09:00 PM',
          arrivalTime: '07:30 AM',
          price: 950,
          seatsAvailable: 24,
          frequency: 'Daily Service',
          image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
          whatsappNumber: '919876543210'
        },
        {
          source: 'Nagpur',
          destination: 'Hyderabad',
          busType: 'Volvo Multi-Axle AC',
          departureTime: '08:30 PM',
          arrivalTime: '06:00 AM',
          price: 1100,
          seatsAvailable: 18,
          frequency: 'Daily Service',
          image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
          whatsappNumber: '919876543210'
        },
        {
          source: 'Nagpur',
          destination: 'Indore',
          busType: 'Non-AC Sleeper Coach',
          departureTime: '10:00 PM',
          arrivalTime: '08:00 AM',
          price: 750,
          seatsAvailable: 32,
          frequency: 'Daily Service',
          image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
          whatsappNumber: '919876543210'
        },
        {
          source: 'Nagpur',
          destination: 'Pachmarhi',
          busType: 'Tourist Express AC',
          departureTime: '06:00 AM',
          arrivalTime: '12:30 PM',
          price: 650,
          seatsAvailable: 15,
          frequency: 'Mon, Wed, Fri',
          image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
          whatsappNumber: '919876543210'
        }
      ];
    }

    toursList.innerHTML = '';
    routes.forEach(b => {
      const src = b.source || 'Nagpur';
      const dest = b.destination || b.name || 'Destination';
      const busType = b.busType || 'AC Sleeper';
      const dep = b.departureTime || b.startDate || '09:00 PM';
      const arr = b.arrivalTime || b.endDate || '06:00 AM';
      const price = b.price ? Number(b.price) : 850;
      const seats = b.seatsAvailable || 30;
      const freq = b.frequency || 'Daily Service';
      const phone = b.whatsappNumber || '919876543210';
      const img = b.image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80';

      const waMsg = encodeURIComponent(`Hi Mahakali Travels, I want to book a seat for the bus route from ${src} to ${dest} (${busType}, Departure: ${dep}, Price: ₹${price}). Please provide seat availability details.`);
      const waUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${waMsg}`;

      const cardHTML = `
        <div class="col-lg-6" data-aos="fade-up">
          <div class="bus-route-card p-4 rounded-4 bg-dark text-white border border-secondary shadow-lg d-flex flex-column flex-sm-row gap-3 align-items-center">
            <img src="${img}" alt="${src} to ${dest}" class="rounded-3 object-fit-cover flex-shrink-0" style="width: 140px; height: 140px;">
            <div class="flex-grow-1 w-100">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="badge bg-warning text-dark fw-bold px-2 py-1">${freq}</span>
                <span class="text-warning fw-bold fs-5">₹${price.toLocaleString()}</span>
              </div>
              <h5 class="fw-bold text-white mb-1">
                ${src} <i class="fa-solid fa-arrow-right text-warning mx-2"></i> ${dest}
              </h5>
              <p class="small text-light mb-1"><i class="fa-solid fa-bus text-warning me-1"></i> ${busType}</p>
              <p class="small text-muted mb-2"><i class="fa-solid fa-clock text-warning me-1"></i> Departs: ${dep} | Arrives: ${arr}</p>
              <div class="d-flex justify-content-between align-items-center mt-2 pt-2 border-top border-secondary">
                <span class="small text-success fw-semibold"><i class="fa-solid fa-chair me-1"></i> ${seats} Seats Left</span>
                <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-success rounded-pill px-3 py-2 fw-bold d-inline-flex align-items-center gap-1">
                  <i class="fa-brands fa-whatsapp fs-6"></i> Book Now
                </a>
              </div>
            </div>
          </div>
        </div>
      `;
      toursList.innerHTML += cardHTML;
    });

  } catch (err) {
    console.warn('Bus Routes API warning:', err.message);
  }
}

// Alias for backwards compatibility
const fetchUpcomingTours = fetchBusRoutes;

// 4. Form Submission Listeners
function initFormListeners() {
  // Contact Form Interceptor
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const fullName = document.getElementById('contact-name')?.value;
      const email = document.getElementById('contact-email')?.value;
      const phone = document.getElementById('contact-phone')?.value;
      const subject = document.getElementById('contact-dest-pref')?.value || 'General Enquiry';
      const message = document.getElementById('contact-msg')?.value;

      try {
        const res = await fetch(`${API_BASE}/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullName, email, phone, subject, message })
        });
        const data = await res.json();

        if (data.success) {
          if (typeof showToast === 'function') {
            showToast('📩 ' + data.message, 'success');
          } else {
            alert(data.message);
          }
          contactForm.reset();
        } else {
          alert('Submission Failed: ' + data.message);
        }
      } catch (err) {
        alert('Network Error submitting contact request: ' + err.message);
      }
    });
  }

  // Corporate B2B Form Interceptor
  const corpForm = document.getElementById('corp-booking-form');
  if (corpForm) {
    corpForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const companyName = document.getElementById('corpCompanyName')?.value;
      const contactPerson = document.getElementById('corpContactName')?.value;
      const email = document.getElementById('corpEmail')?.value;
      const phone = document.getElementById('corpPhone')?.value;
      const busSize = document.getElementById('corpBusSize')?.value;
      const serviceType = document.getElementById('corpServiceType')?.value;
      const requirements = document.getElementById('corpMsg')?.value;

      try {
        const res = await fetch(`${API_BASE}/corporate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            companyName,
            contactPerson,
            email,
            phone,
            busSize,
            serviceType,
            requirements
          })
        });
        const data = await res.json();

        if (data.success) {
          // Hide Bootstrap Modal if open
          const corpModalEl = document.getElementById('corporateModal');
          if (corpModalEl && window.bootstrap) {
            const modalInstance = bootstrap.Modal.getInstance(corpModalEl);
            if (modalInstance) modalInstance.hide();
          }

          if (typeof showToast === 'function') {
            showToast('💼 ' + data.message, 'success');
          } else {
            alert(data.message);
          }
          corpForm.reset();
        } else {
          alert('Corporate Request Error: ' + data.message);
        }
      } catch (err) {
        alert('Network Error submitting corporate request: ' + err.message);
      }
    });
  }
}
