let memories = [
  {
    id: 1,
    name: 'Ahmad Faiz',
    date: '15 Mac 2026',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800',
    desc: 'Seorang rakan yang sentiasa ceria, membawa senyuman dalam setiap perjumpaan kelas.'
  },
  {
    id: 2,
    name: 'Siti Nurhaliza',
    date: '2 April 2026',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800',
    desc: 'Ketua kelas yang penuh dedikasi. Sentiasa memastikan semua orang tidak ketinggalan.'
  },
  {
    id: 3,
    name: 'Muhammad Ali',
    date: '12 Ogos 2026',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
    desc: 'Kenangan manis sewaktu perkhemahan tahunan tidak akan dilupakan.'
  }
];

const moderatorAccount = { username: 'GlacianDigital', password: 'GunungGlobal' };
let isLoggedIn = false;
let tempImageBase64 = null;

document.addEventListener('DOMContentLoaded', () => {
  renderGallery();
  renderDashboard();
});

// Paparan Navigasi (View Switcher)
function switchView(viewName) {
  document.getElementById('galleryView').classList.add('hidden');
  document.getElementById('loginView').classList.add('hidden');
  document.getElementById('dashboardView').classList.add('hidden');

  if (viewName === 'gallery') {
    document.getElementById('galleryView').classList.remove('hidden');
    document.getElementById('navLoginBtn').classList.remove('hidden');
    document.getElementById('navLogoutBtn').classList.add('hidden');
  } else if (viewName === 'login') {
    document.getElementById('loginView').classList.remove('hidden');
    document.getElementById('navLoginBtn').classList.add('hidden');
    document.getElementById('navLogoutBtn').classList.add('hidden');
  } else if (viewName === 'dashboard') {
    document.getElementById('dashboardView').classList.remove('hidden');
    document.getElementById('navLoginBtn').classList.add('hidden');
    document.getElementById('navLogoutBtn').classList.remove('hidden');
  }
}

// Render Galeri
function renderGallery() {
  const grid = document.getElementById('memoriesGrid');
  grid.innerHTML = '';

  memories.forEach(m => {
    const card = document.createElement('div');
    card.className = 'group relative flex flex-col gap-4 cursor-pointer';
    card.onclick = () => openLightbox(m);

    card.innerHTML = `
      <div class="relative overflow-hidden rounded-sm aspect-[4/5] bg-slate-900 border border-slate-800 transition-all duration-500 group-hover:border-slate-600">
        <img src="${m.image}" alt="${m.name}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
      </div>
      <div class="flex flex-col items-center text-center opacity-70 group-hover:opacity-100">
        <h3 class="text-lg font-medium tracking-wide">${m.name}</h3>
        <p class="text-xs text-slate-400 tracking-wider mt-1">${m.date}</p>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Render Dashboard Papan Pemuka
function renderDashboard() {
  const list = document.getElementById('dashboardList');
  list.innerHTML = '';

  memories.forEach(m => {
    const item = document.createElement('div');
    item.className = 'flex items-center gap-6 bg-slate-900/50 border border-slate-800 p-4 rounded-xl';

    item.innerHTML = `
      <img src="${m.image}" alt="${m.name}" class="w-20 h-20 object-cover rounded-lg" />
      <div class="flex-1">
        <h4 class="text-lg font-medium">${m.name}</h4>
        <p class="text-slate-400 text-sm mt-1">${m.date}</p>
      </div>
      <div class="flex gap-2">
        <button onclick="openEditModal(${m.id})" class="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer">Sunting</button>
        <button onclick="openDeleteModal(${m.id})" class="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition cursor-pointer">Padam</button>
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
    isLoggedIn = true;
    showNotification(`Selamat datang Moderator, ${u}!`, 'success');
    switchView('dashboard');
    document.getElementById('loginUser').value = '';
    document.getElementById('loginPass').value = '';
  } else {
    showNotification('Kata nama atau kata laluan moderator tidak sah.', 'error');
  }
}

function handleLogout() {
  isLoggedIn = false;
  showNotification('Log keluar berjaya.', 'success');
  switchView('gallery');
}

// Lightbox Penuh
function openLightbox(memory) {
  document.getElementById('lightboxImg').src = memory.image;
  document.getElementById('lightboxTitle').textContent = memory.name;
  document.getElementById('lightboxDate').textContent = memory.date;
  document.getElementById('lightboxDesc').textContent = `"${memory.desc}"`;
  document.getElementById('lightboxModal').classList.remove('hidden');
}

function closeLightbox() {
  document.getElementById('lightboxModal').classList.add('hidden');
}

// Modal Tambah / Edit
function openAddModal() {
  document.getElementById('formModalTitle').textContent = 'Tambah Kenangan Baharu';
  document.getElementById('editMemoryId').value = '';
  document.getElementById('inputName').value = '';
  document.getElementById('inputDate').value = '';
  document.getElementById('inputDesc').value = '';
  document.getElementById('inputFile').value = '';
  document.getElementById('previewContainer').classList.add('hidden');
  tempImageBase64 = null;
  document.getElementById('formModal').classList.remove('hidden');
}

function openEditModal(id) {
  const m = memories.find(item => item.id === id);
  if (!m) return;

  document.getElementById('formModalTitle').textContent = 'Sunting Kenangan';
  document.getElementById('editMemoryId').value = m.id;
  document.getElementById('inputName').value = m.name;
  document.getElementById('inputDate').value = m.date;
  document.getElementById('inputDesc').value = m.desc;
  tempImageBase64 = m.image;

  document.getElementById('imagePreviewTag').src = m.image;
  document.getElementById('previewContainer').classList.remove('hidden');
  document.getElementById('formModal').classList.remove('hidden');
}

function closeFormModal() {
  document.getElementById('formModal').classList.add('hidden');
}

function previewImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      tempImageBase64 = reader.result;
      document.getElementById('imagePreviewTag').src = tempImageBase64;
      document.getElementById('previewContainer').classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  }
}

function handleFormSubmit(e) {
  e.preventDefault();
  const editId = document.getElementById('editMemoryId').value;
  const name = document.getElementById('inputName').value;
  const date = document.getElementById('inputDate').value;
  const desc = document.getElementById('inputDesc').value;

  if (!tempImageBase64) {
    showNotification('Sila pilih gambar.', 'error');
    return;
  }

  if (editId) {
    // Kemaskini
    memories = memories.map(m => m.id == editId ? { ...m, name, date, desc, image: tempImageBase64 } : m);
    showNotification('Kenangan berjaya dikemas kini.', 'success');
  } else {
    // Tambah baru
    const newItem = { id: Date.now(), name, date, image: tempImageBase64, desc: desc || 'Tiada keterangan.' };
    memories.unshift(newItem);
    showNotification('Kenangan baharu berjaya dimuat naik.', 'success');
  }

  closeFormModal();
  renderGallery();
  renderDashboard();
}

// Modal Padam
function openDeleteModal(id) {
  document.getElementById('deleteTargetId').value = id;
  document.getElementById('deleteModal').classList.remove('hidden');
}

function closeDeleteModal() {
  document.getElementById('deleteModal').classList.add('hidden');
}

function confirmExecuteDelete() {
  const id = document.getElementById('deleteTargetId').value;
  memories = memories.filter(m => m.id != id);
  closeDeleteModal();
  showNotification('Kenangan berjaya dipadam.', 'success');
  renderGallery();
  renderDashboard();
}

// Sistem Notifikasi Pop-up
function showNotification(message, type = 'success') {
  const banner = document.getElementById('notificationBanner');
  const txt = document.getElementById('notifText');
  txt.textContent = message;
  
  banner.classList.remove('hidden');
  banner.classList.add('flex');

  setTimeout(() => {
    banner.classList.remove('flex');
    banner.classList.add('hidden');
  }, 3500);
}
