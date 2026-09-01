const { useState, useEffect } = React;
const { X, Plus, Trash2, Edit2, LogIn, LogOut, AlertCircle, CheckCircle, Shield, Upload, ImageIcon } = lucide;

// --- MOCK DATA ---
const initialMemories = [
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

function App() {
  const [view, setView] = useState('gallery'); // 'gallery', 'login', 'dashboard'
  const [memories, setMemories] = useState(initialMemories);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMemory, setEditingMemory] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Akaun Moderator Rasmi (Hanya satu)
  const moderatorAccount = { username: 'GlacianDigital', password: 'GunungGlobal' };

  // Borang Login State
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  
  // Borang Tambah Kenangan State
  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newImagePreview, setNewImagePreview] = useState(null);

  // Borang Edit Kenangan State
  const [editName, setEditName] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editImagePreview, setEditImagePreview] = useState(null);

  // Notifikasi Sistem
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Log Masuk (Hanya Moderator Rasmi)
  const handleLogin = (e) => {
    e.preventDefault();
    
    if (loginUser === moderatorAccount.username && loginPass === moderatorAccount.password) {
      showNotification(`Selamat datang Moderator, ${loginUser}!`, 'success');
      setIsLoaded(false);
      setTimeout(() => {
        setView('dashboard');
        setIsLoaded(true);
        setLoginUser('');
        setLoginPass('');
      }, 400);
    } else {
      showNotification('Kata nama atau kata laluan moderator tidak sah.', 'error');
    }
  };

  // Handle Pilih Fail Gambar Baru (Tambah)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Pilih Fail Gambar Sunting (Edit)
  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Tambah Kenangan Baru
  const handleAddMemory = (e) => {
    e.preventDefault();
    if (!newName || !newDate || !newImagePreview) {
      showNotification('Sila lengkapkan maklumat dan pilih gambar.', 'error');
      return;
    }

    const newMemoryItem = {
      id: Date.now(),
      name: newName,
      date: newDate,
      image: newImagePreview,
      desc: newDesc || 'Tiada keterangan tambahan.'
    };

    setMemories([newMemoryItem, ...memories]);
    setShowAddModal(false);
    setNewName('');
    setNewDate('');
    setNewDesc('');
    setNewImagePreview(null);
    showNotification('Kenangan baharu berjaya dimuat naik.', 'success');
  };

  // Buka Modal Edit dengan Data Sedia Ada
  const openEditModal = (memory) => {
    setEditingMemory(memory);
    setEditName(memory.name);
    setEditDate(memory.date);
    setEditDesc(memory.desc);
    setEditImagePreview(memory.image);
    setShowEditModal(true);
  };

  // Simpan Suntingan Kenangan
  const handleUpdateMemory = (e) => {
    e.preventDefault();
    if (!editName || !editDate || !editImagePreview) {
      showNotification('Sila lengkapkan maklumat.', 'error');
      return;
    }

    setMemories(memories.map(m => m.id === editingMemory.id ? {
      ...m,
      name: editName,
      date: editDate,
      image: editImagePreview,
      desc: editDesc
    } : m));

    setShowEditModal(false);
    setEditingMemory(null);
    showNotification('Kenangan berjaya dikemas kini.', 'success');
  };

  // Scroll Animation Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-12');
          }
        });
      },
      { threshold: 0.15 }
    );

    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [memories, view]);

  const executeDelete = () => {
    if (!confirmDeleteId) return;
    setDeletingId(confirmDeleteId);
    setConfirmDeleteId(null);
    setTimeout(() => {
      setMemories(memories.filter(m => m.id !== confirmDeleteId));
      setDeletingId(null);
      showNotification('Kenangan berjaya dipadam.', 'success');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans overflow-x-hidden selection:bg-slate-700 selection:text-white relative">
      <BackgroundEffects />

      {/* Notifikasi Pop-up */}
      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-slate-900/90 border border-slate-700 backdrop-blur-md px-5 py-3 rounded-xl shadow-2xl transition-all animate-bounce">
          {notification.type === 'success' ? (
            <CheckCircle className="text-emerald-400" size={20} />
          ) : (
            <AlertCircle className="text-red-400" size={20} />
          )}
          <span className="text-sm font-light tracking-wide text-slate-200">{notification.message}</span>
        </div>
      )}

      {/* Navigasi Atas */}
      <nav className="fixed top-0 w-full p-6 z-40 flex justify-end pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-4">
          {view === 'gallery' && (
            <button 
              onClick={() => setView('login')}
              className="text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-1.5 text-xs uppercase tracking-widest bg-slate-900/50 border border-slate-800 px-3 py-1.5 rounded-full cursor-pointer"
            >
              <LogIn size={14} /> Log Masuk Moderator
            </button>
          )}
          {view === 'dashboard' && (
            <button 
              onClick={() => { setView('gallery'); showNotification('Log keluar berjaya.', 'success'); }}
              className="text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-2 text-sm uppercase tracking-widest bg-slate-900/50 border border-slate-800 px-3 py-1.5 rounded-full cursor-pointer"
            >
              <LogOut size={16} /> Keluar
            </button>
          )}
          {view === 'login' && (
            <button 
              onClick={() => setView('gallery')}
              className="text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-2 text-sm uppercase tracking-widest cursor-pointer"
            >
              Kembali ke Galeri
            </button>
          )}
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-6 py-24 min-h-screen flex flex-col items-center">
        
        {/* PAPARAN: GALERI UTAMA */}
        {view === 'gallery' && (
          <div className="w-full max-w-6xl flex flex-col items-center">
            <div className="text-center mb-24 relative">
              <h1 
                className={`text-4xl md:text-6xl font-light tracking-widest uppercase mb-4 transition-all duration-1000 ease-out transform ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                Kenangan <span className="font-semibold">Kelas</span>
              </h1>
              <p 
                className={`text-slate-400 tracking-[0.2em] uppercase text-sm md:text-base transition-all duration-1000 ease-out transform delay-300 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                Memori yang kekal abadi
              </p>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-slate-500/10 blur-[80px] -z-10 rounded-full pointer-events-none"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full">
              {memories.map((memory, index) => (
                <div 
                  key={memory.id}
                  className={`scroll-animate opacity-0 translate-y-12 transition-all duration-700 ease-out`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div 
                    onClick={() => setSelectedImage(memory)}
                    className="group relative flex flex-col gap-4 cursor-pointer"
                  >
                    <div className="relative overflow-hidden rounded-sm aspect-[4/5] bg-slate-900 border border-slate-800 transition-all duration-500 ease-out group-hover:border-slate-600 group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] group-active:scale-[0.98]">
                      <img 
                        src={memory.image} 
                        alt={memory.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] opacity-80 group-hover:opacity-100"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-40"></div>
                    </div>
                    
                    <div className="flex flex-col items-center text-center transition-all duration-500 opacity-70 group-hover:opacity-100">
                      <h3 className="text-lg font-medium tracking-wide">{memory.name}</h3>
                      <p className="text-xs text-slate-400 tracking-wider mt-1">{memory.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAPARAN: LOG MASUK */}
        {view === 'login' && (
          <div className="w-full max-w-md flex-1 flex items-center justify-center -mt-10">
            <div className={`w-full bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-10 rounded-2xl shadow-2xl transition-all duration-700 ease-out transform ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}>
              <div className="flex flex-col items-center mb-8">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <LogIn className="text-slate-300" size={20} />
                </div>
                <h2 className="text-2xl font-light tracking-wider">Log Masuk</h2>
                <p className="text-sm text-slate-400 tracking-wide mt-2 uppercase">Moderator Rasmi Sahaja</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">Kata Nama</label>
                  <input 
                    type="text" 
                    value={loginUser}
                    onChange={(e) => setLoginUser(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-800 focus:border-slate-500 rounded-lg px-4 py-3 text-slate-200 outline-none transition-colors duration-300"
                    placeholder="Masukkan kata nama"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">Kata Laluan</label>
                  <input 
                    type="password" 
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-800 focus:border-slate-500 rounded-lg px-4 py-3 text-slate-200 outline-none transition-colors duration-300"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-slate-200 hover:bg-white text-slate-900 font-medium tracking-wide py-3 rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95 mt-4 cursor-pointer"
                >
                  Log Masuk
                </button>
              </form>
            </div>
          </div>
        )}

        {/* PAPARAN: DASHBOARD MODERATOR */}
        {view === 'dashboard' && (
          <div className="w-full max-w-4xl">
            <div className={`mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 transition-all duration-700 ease-out transform ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-1">
                  <Shield size={14} /> Moderator Rasmi (GlacianDigital)
                </div>
                <h2 className="text-3xl font-light tracking-wider mb-2">Papan Pemuka</h2>
                <p className="text-slate-400 text-sm tracking-wide uppercase">Pengurusan Kenangan Kelas</p>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-slate-850 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg active:scale-95 text-sm tracking-wide cursor-pointer border border-slate-700"
              >
                <Plus size={16} /> Tambah Kenangan
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {memories.map((memory, index) => (
                <div 
                  key={memory.id}
                  className={`
                    flex items-center gap-6 bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-4 rounded-xl
                    transition-all duration-700 ease-out transform
                    ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}
                    ${deletingId === memory.id ? 'scale-95 opacity-0 h-0 p-0 mb-0 border-0 overflow-hidden' : 'scale-100 opacity-100 h-28 mb-4'}
                  `}
                  style={{ 
                    transitionDelay: isLoaded && !deletingId ? `${index * 50}ms` : '0ms',
                    transitionProperty: 'opacity, transform, height, padding, margin, border' 
                  }}
                >
                  {deletingId !== memory.id && (
                    <>
                      <img src={memory.image} alt={memory.name} className="w-20 h-20 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h4 className="text-lg font-medium">{memory.name}</h4>
                        <p className="text-slate-400 text-sm mt-1">{memory.date}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => openEditModal(memory)}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Sunting Kenangan"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => setConfirmDeleteId(memory.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
                          title="Padam Kenangan"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
              
              {memories.length === 0 && (
                <div className="text-center py-20 text-slate-500 tracking-wider">
                  Tiada kenangan direkodkan.
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* Lightbox Skrin Penuh */}
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-700 ease-in-out ${
          selectedImage ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div 
          className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl transition-opacity duration-700"
          onClick={() => setSelectedImage(null)}
        ></div>
        
        <button 
          onClick={() => setSelectedImage(null)}
          className="absolute top-6 right-6 z-50 p-3 text-slate-400 hover:text-white transition-colors hover:rotate-90 duration-500 cursor-pointer"
        >
          <X size={32} strokeWidth={1} />
        </button>

        {selectedImage && (
          <div 
            className={`relative z-10 w-full max-w-4xl flex flex-col md:flex-row bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-2xl transition-all duration-700 delay-100 ease-out transform ${
              selectedImage ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'
            }`}
          >
            <div className="md:w-2/3 bg-black">
              <img 
                src={selectedImage.image} 
                alt={selectedImage.name} 
                className="w-full h-[50vh] md:h-[70vh] object-cover opacity-90"
              />
            </div>
            <div className="md:w-1/3 p-8 flex flex-col justify-center bg-slate-900/50">
              <h2 className="text-3xl font-light mb-2">{selectedImage.name}</h2>
              <p className="text-sm text-slate-400 tracking-widest uppercase mb-8">{selectedImage.date}</p>
              <div className="w-12 h-[1px] bg-slate-700 mb-8"></div>
              <p className="text-slate-300 leading-relaxed font-light text-sm md:text-base">
                "{selectedImage.desc}"
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modal Tambah Kenangan */}
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ${
          showAddModal ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div 
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setShowAddModal(false)}
        ></div>
        
        <div 
          className={`relative z-10 w-full max-w-lg bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl transition-all duration-500 ease-out transform ${
            showAddModal ? 'translate-y-0 scale-100' : 'translate-y-20 scale-95'
          }`}
        >
          <button 
            onClick={() => setShowAddModal(false)}
            className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
          
          <h3 className="text-2xl font-light mb-6">Tambah Kenangan</h3>
          
          <form onSubmit={handleAddMemory} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">Nama</label>
              <input 
                type="text" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 focus:border-slate-500 rounded-lg px-4 py-2 text-slate-200 outline-none" 
                required 
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">Tarikh</label>
              <input 
                type="text" 
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 focus:border-slate-500 rounded-lg px-4 py-2 text-slate-200 outline-none" 
                placeholder="Contoh: 12 Ogos 2026" 
                required 
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">Pilih Gambar Dari Galeri</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-800 border-dashed rounded-lg cursor-pointer bg-slate-950/50 hover:bg-slate-800/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {newImagePreview ? (
                    <img src={newImagePreview} alt="Pratonton" className="h-20 object-cover rounded mb-2" />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mb-2 text-slate-400" />
                      <p className="mb-2 text-xs text-slate-400"><span className="font-semibold">Klik untuk muat naik</span> fail gambar</p>
                    </>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">Keterangan</label>
              <textarea 
                rows="3" 
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 focus:border-slate-500 rounded-lg px-4 py-2 text-slate-200 outline-none resize-none"
              ></textarea>
            </div>
            
            <button 
              type="submit"
              className="w-full bg-white text-slate-900 font-medium py-3 rounded-lg mt-6 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Simpan
            </button>
          </form>
        </div>
      </div>

      {/* Modal Sunting (Edit) Kenangan */}
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ${
          showEditModal ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div 
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setShowEditModal(false)}
        ></div>
        
        <div 
          className={`relative z-10 w-full max-w-lg bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl transition-all duration-500 ease-out transform ${
            showEditModal ? 'translate-y-0 scale-100' : 'translate-y-20 scale-95'
          }`}
        >
          <button 
            onClick={() => setShowEditModal(false)}
            className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
          
          <h3 className="text-2xl font-light mb-6">Sunting Kenangan</h3>
          
          <form onSubmit={handleUpdateMemory} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">Nama</label>
              <input 
                type="text" 
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 focus:border-slate-500 rounded-lg px-4 py-2 text-slate-200 outline-none" 
                required 
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">Tarikh</label>
              <input 
                type="text" 
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 focus:border-slate-500 rounded-lg px-4 py-2 text-slate-200 outline-none" 
                required 
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">Tukar Gambar Dari Galeri</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-800 border-dashed rounded-lg cursor-pointer bg-slate-950/50 hover:bg-slate-800/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {editImagePreview ? (
                    <img src={editImagePreview} alt="Pratonton" className="h-20 object-cover rounded mb-2" />
                  ) : (
                    <Upload className="w-8 h-8 mb-2 text-slate-400" />
                  )}
                </div>
                <input type="file" accept="image/*" onChange={handleEditImageChange} className="hidden" />
              </label>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">Keterangan</label>
              <textarea 
                rows="3" 
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 focus:border-slate-500 rounded-lg px-4 py-2 text-slate-200 outline-none resize-none"
              ></textarea>
            </div>
            
            <button 
              type="submit"
              className="w-full bg-white text-slate-900 font-medium py-3 rounded-lg mt-6 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Kemaskini
            </button>
          </form>
        </div>
      </div>

      {/* Modal Pengesahan Padam */}
      <div 
        className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-all duration-300 ${
          confirmDeleteId ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div 
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          onClick={() => setConfirmDeleteId(null)}
        ></div>
        
        <div 
          className={`relative z-10 w-full max-w-sm bg-slate-900 border border-slate-700 p-6 rounded-xl shadow-2xl transition-all duration-300 ease-out transform text-center ${
            confirmDeleteId ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-4">
            <Trash2 size={24} />
          </div>
          <h3 className="text-xl font-medium mb-2">Padam Kenangan?</h3>
          <p className="text-sm text-slate-400 mb-6">Tindakan ini tidak boleh dikembalikan.</p>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setConfirmDeleteId(null)}
              className="flex-1 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button 
              onClick={executeDelete}
              className="flex-1 py-2.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
            >
              Padam
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

function BackgroundEffects() {
  return (
    <>
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -inset-[100%] opacity-30"
          style={{
            background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #020617 50%, #0f172a 100%)',
            animation: 'slowSpin 60s linear infinite',
          }}
        ></div>
      </div>

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/30 blur-[1px]"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              left: Math.random() * 100 + '%',
              bottom: '-10px',
              animation: `floatUp ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 15}s`,
              opacity: 0
            }}
          ></div>
        ))}
      </div>
    </>
  );
}

// Render React App
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
