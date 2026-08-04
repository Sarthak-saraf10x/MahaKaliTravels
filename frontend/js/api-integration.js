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
    const galleryContainer = document.querySelector('#gallery .row.g-4');
    if (!galleryContainer) return;

    const res = await fetch(`${API_BASE}/gallery`);
    const data = await res.json();

    if (data.success && data.data && data.data.length > 0) {
      galleryContainer.innerHTML = '';
      data.data.forEach(item => {
        const itemHTML = `
          <div class="col-lg-4 col-md-6 gallery-item" data-category="${(item.category || 'all').toLowerCase()}">
            <div class="gallery-card">
              <img src="${item.imageUrl}" alt="${item.title}" class="img-fluid gallery-img" loading="lazy">
              <div class="gallery-overlay">
                <div class="gallery-info text-center text-white">
                  <h5 class="fw-bold mb-1">${item.title}</h5>
                  <span class="badge bg-gold text-dark mb-2">${item.category}</span>
                  <div>
                    <button class="btn btn-sm btn-light rounded-circle" onclick="openGalleryModal('${item.title}', '${item.imageUrl}')">
                      <i class="fa-solid fa-expand"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        galleryContainer.innerHTML += itemHTML;
      });
    }
  } catch (err) {
    console.warn('Gallery API warning:', err.message);
  }
}

// 3. Fetch & Render Upcoming Group Tours
async function fetchUpcomingTours() {
  try {
    const toursList = document.getElementById('group-tours-list');
    if (!toursList) return;

    const res = await fetch(`${API_BASE}/tours`);
    const data = await res.json();

    if (data.success && data.data && data.data.length > 0) {
      toursList.innerHTML = '';
      data.data.forEach(t => {
        const tourHTML = `
          <div class="col-lg-6" data-aos="fade-up">
            <div class="group-tour-card p-4 rounded-4 bg-dark-glass border border-secondary d-flex flex-column flex-md-row gap-3">
              <img src="${t.image}" alt="${t.name}" class="rounded-3 object-fit-cover" style="width: 140px; height: 140px;">
              <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-start">
                  <span class="badge bg-warning text-dark mb-2">${t.status}</span>
                  <span class="text-orange fw-bold fs-5">₹${t.price.toLocaleString()}</span>
                </div>
                <h5 class="fw-bold text-white mb-1">${t.name}</h5>
                <p class="small text-muted mb-2"><i class="fa-solid fa-calendar-days text-gold me-1"></i> ${t.startDate} - ${t.endDate}</p>
                <div class="d-flex justify-content-between align-items-center mt-2">
                  <span class="small text-light"><i class="fa-solid fa-chair text-warning me-1"></i> ${t.seatsAvailable} Seats Left</span>
                  <button class="btn btn-sm btn-gold rounded-pill" onclick="openBookingModal('${t.name}', ${t.price})">Reserve Seat</button>
                </div>
              </div>
            </div>
          </div>
        `;
        toursList.innerHTML += tourHTML;
      });
    }
  } catch (err) {
    console.warn('Tours API warning:', err.message);
  }
}

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
