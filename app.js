let memories = [
  {
    id: 1,
    name: 'Ahmad Faiz',
    date: '15 Mac 2026',
    images: [
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800'
    ],
    desc: 'Seorang rakan yang sentiasa ceria. Memori sewaktu perjumpaan kelas terakhir kita.'
  },
  {
    id: 2,
    name: 'Siti Nurhaliza',
    date: '2 April 2026',
    images: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800'
    ],
    desc: 'Ketua kelas yang penuh dedikasi.'
  },
  {
    id: 3,
    name: 'Muhammad Ali',
    date: '12 Ogos 2026',
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=800'
    ],
    desc: 'Kenangan manis sewaktu perkhemahan tahunan tidak akan dilupakan.'
  }
];

const moderatorAccount = { username: 'GlacianDigital', password: 'GunungGlobal' };
let currentSelectedMemory = null;
let currentSlide = 0;
let tempImagesBase64 = [];

document.addEventListener('DOMContentLoaded', () => {
  renderGallery();
  renderDashboard();
});

// Tukar Paparan (View Switcher)
function switchView(viewName) {
  document.getElementById('galleryView').classList.add('hidden');
  document.getElementById('loginView').classList.add('hidden');
  document.getElementById('dashboardView').classList.add('hidden');
  document.getElementById('navGalleryBtn').classList.add('hidden');
  document.getElementById('navLoginBtn').classList.add('hidden');

  if (viewName === 'gallery') {
    document.getElementById('galleryView').classList.remove('hidden');
    document.getElementById('navLoginBtn').classList.remove('hidden');
  } else if (viewName === 'login') {
    document.getElementById('loginView').classList.remove('hidden');
    document.getElementById('navGalleryBtn').classList.remove('hidden');
  } else if (viewName === 'dashboard') {
    document.getElementById('dashboardView').classList.remove('hidden');
    document.getElementById('navGalleryBtn').classList.remove('hidden');
  }
}

// Render Kad Galeri Utama
function renderGallery() {
  const grid = document.getElementById('memoriesGrid');
  grid.innerHTML = '';

  memories.forEach(m => {
    const card = document.createElement('div');
    card.className = 'group relative cursor-pointer';
    card.onclick = () => openLightbox(m);

    card.innerHTML = `
      <div class="relative overflow-hidden rounded-lg aspect-[4/5] bg-slate-900 border border-slate-800 transition-all duration-500 group-hover:border-slate-500 group-hover:shadow-2xl">
        <img src="${m.images[0]}" alt="${m.name}" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
        ${m.images.length > 1 ? `<div class="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-[10px] px-2 py-1 rounded uppercase tracking-wider text-white">${m.images.length} Gambar</div>` : ''}
      </div>
      <div class="mt-6 text-center">
        <h3 class="text-lg font-light tracking-widest group-hover:text-white transition-colors">${m.name}</h3>
        <p class="text-[10px] text-slate-500 tracking-widest mt-1 uppercase">${m.date}</p>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Render Senarai Papan Pemuka Moderator
function renderDashboard() {
  const list = document.getElementById('dashboardList');
  list.innerHTML = '';

  memories.forEach(m => {
    const item = document.createElement('div');
    item.className = 'bg-slate-900/40 border border-slate-800 p-4 rounded-xl flex items-center gap-6';
    item.innerHTML = `
      <div class="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 relative">
        <img src="${m.images[0]}" class="w-full h-full object-cover" />
        ${m.images.length > 1 ? `<div class="absolute inset-0 bg-black/40 flex items-center justify-center text-[8px] font-bold text-white">+${m.images.length - 1}</div>` : ''}
      </div>
      <div class="flex-1">
        <h4 class="font-medium text-white">${m.name}</h4>
        <p class="text-xs text-slate-500">${m.date} • ${m.images.length} Gambar</p>
      </div>
      <div class="flex gap-2">
        <button onclick="openEditModal(${m.id})" class="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer text-xs transition">Sunting</button>
        <button onclick="openDeleteModal(${m.id})" class="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg cursor-pointer text-xs transition">Padam</button>
      </div>
    `;
    list.appendChild(item);
  });
}

// Log Masuk Handler
function handleLoginSubmit(e) {
  e.preventDefault();
  const u = document.getElementById('loginUser').value;
  const p = document.getElementById('loginPass').value;
  if (u === moderatorAccount.username && p === moderatorAccount.password) {
    showNotification('Log masuk berjaya!', 'success');
    switchView('dashboard');
    document.getElementById('loginUser').value = '';
    document.getElementById('loginPass').value = '';
  } else {
    showNotification('Akses ditolak. Maklumat salah.', 'error');
  }
}

// Lightbox & Carousel Slaid
function openLightbox(memory) {
  currentSelectedMemory = memory;
  currentSlide = 0;
  updateSlideView();
  document.getElementById('lightboxModal').classList.remove('hidden');
  document.getElementById('lightboxModal').classList.add('flex');
}

function closeLightbox() {
  document.getElementById('lightboxModal').classList.remove('flex');
  document.getElementById('lightboxModal').classList.add('hidden');
}

function updateSlideView() {
  if (!currentSelectedMemory) return;
  document.getElementById('lightboxImage').src = currentSelectedMemory.images[currentSlide];
  document.getElementById('lightboxName').textContent = currentSelectedMemory.name;
  document.getElementById('lightboxDate').textContent = currentSelectedMemory.date;
  document.getElementById('lightboxDesc').textContent = `"${currentSelectedMemory.desc}"`;

  const prevBtn = document.getElementById('prevSlideBtn');
  const nextBtn = document.getElementById('nextSlideBtn');
  if (currentSelectedMemory.images.length > 1) {
    prevBtn.classList.remove('hidden');
    nextBtn.classList.remove('hidden');
  } else {
    prevBtn.classList.add('hidden');
    nextBtn.classList.add('hidden');
  }
}

function nextSlide() {
  if (!currentSelectedMemory) return;
  currentSlide = (currentSlide + 1) % currentSelectedMemory.images.length;
  updateSlideView();
}

function prevSlide() {
  if (!currentSelectedMemory) return;
  currentSlide = (currentSlide - 1 + currentSelectedMemory.images.length) % currentSelectedMemory.images.length;
  updateSlideView();
}

// Pengurusan Borang (Tambah & Edit)
function openAddModal() {
  document.getElementById('formModalTitle').textContent = 'Bina Memori Baru';
  document.getElementById('editMemoryId').value = '';
  document.getElementById('inputName').value = '';
  document.getElementById('inputDate').value = '';
  document.getElementById('inputDesc').value = '';
  document.getElementById('inputFile').value = '';
  document.getElementById('previewBox').innerHTML = 'Pilih gambar-gambar memori';
  tempImagesBase64 = [];
  document.getElementById('formModal').classList.remove('hidden');
  document.getElementById('formModal').classList.add('flex');
}

function openEditModal(id) {
  const m = memories.find(item => item.id === id);
  if (!m) return;
  document.getElementById('formModalTitle').textContent = 'Sunting Memori';
  document.getElementById('editMemoryId').value = m.id;
  document.getElementById('inputName').value = m.name;
  document.getElementById('inputDate').value = m.date;
  document.getElementById('inputDesc').value = m.desc;
  tempImagesBase64 = [...m.images];

  const box = document.getElementById('previewBox');
  box.innerHTML = '';
  tempImagesBase64.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.className = 'w-12 h-12 object-cover rounded shadow';
    box.appendChild(img);
  });

  document.getElementById('formModal').classList.remove('hidden');
  document.getElementById('formModal').classList.add('flex');
}

function closeFormModal() {
  document.getElementById('formModal').classList.remove('flex');
  document.getElementById('formModal').classList.add('hidden');
}

function handleMultipleImages(event) {
  const files = Array.from(event.target.files);
  tempImagesBase64 = [];
  const box = document.getElementById('previewBox');
  box.innerHTML = '';

  files.forEach(file => {
    const reader = new FileReader();
    reader.onloadend = (e) => {
      tempImagesBase64.push(e.target.result);
      const img = document.createElement('img');
      img.src = e.target.result;
      img.className = 'w-12 h-12 object-cover rounded shadow';
      box.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
}

function handleFormSubmit(e) {
  e.preventDefault();
  const editId = document.getElementById('editMemoryId').value;
  const name = document.getElementById('inputName').value;
  const date = document.getElementById('inputDate').value;
  const desc = document.getElementById('inputDesc').value;

  if (tempImagesBase64.length === 0) {
    showNotification('Sila pilih sekurang-kurangnya satu gambar.', 'error');
    return;
  }

  if (editId) {
    memories = memories.map(m => m.id == editId ? { ...m, name, date, desc, images: tempImagesBase64 } : m);
    showNotification('Kenangan dikemas kini.', 'success');
  } else {
    const newItem = { id: Date.now(), name, date, images: tempImagesBase64, desc: desc || 'Tiada keterangan.' };
    memories.unshift(newItem);
    showNotification('Kenangan baharu disimpan.', 'success');
  }

  closeFormModal();
  renderGallery();
  renderDashboard();
}

// Pengesahan Padam
function openDeleteModal(id) {
  document.getElementById('deleteTargetId').value = id;
  document.getElementById('deleteModal').classList.remove('hidden');
  document.getElementById('deleteModal').classList.add('flex');
}

function closeDeleteModal() {
  document.getElementById('deleteModal').classList.remove('flex');
  document.getElementById('deleteModal').classList.add('hidden');
}

function confirmExecuteDelete() {
  const id = document.getElementById('deleteTargetId').value;
  memories = memories.filter(m => m.id != id);
  closeDeleteModal();
  showNotification('Kenangan dipadam.', 'success');
  renderGallery();
  renderDashboard();
}

// Sistem Notifikasi Banner
function showNotification(message, type = 'success') {
  const banner = document.getElementById('notificationBanner');
  document.getElementById('notifText').textContent = message;
  banner.classList.remove('hidden');
  banner.classList.add('flex');
  setTimeout(() => {
    banner.classList.remove('flex');
    banner.classList.add('hidden');
  }, 3000);
}
