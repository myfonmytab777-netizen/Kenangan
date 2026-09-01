const { useState, useEffect } = React;
const { X, Plus, Trash2, Edit2, LogIn, LogOut, AlertCircle, CheckCircle, Shield, Upload } = lucide;

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
  const [view, setView] = useState('gallery');
  const [memories, setMemories] = useState(initialMemories);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMemory, setEditingMemory] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const moderatorAccount = { username: 'GlacianDigital', password: 'GunungGlobal' };

  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  
  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newImagePreview, setNewImagePreview] = useState(null);

  const [editName, setEditName] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editImagePreview, setEditImagePreview] = useState(null);

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEditImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

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

  const openEditModal = (memory) => {
    setEditingMemory(memory);
    setEditName(memory.name);
    setEditDate(memory.date);
    setEditDesc(memory.desc);
    setEditImagePreview(memory.image);
    setShowEditModal(true);
  };

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

      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-slate-900 border border-slate-700 backdrop-blur-md px-5 py-3 rounded-xl shadow-2xl transition-all">
          {notification.type === 'success' ? <CheckCircle className="text-emerald-400" size={20} /> : <AlertCircle className="text-red-400" size={20} />}
          <span className="text-sm text-slate-200">{notification.message}</span>
        </div>
      )}

      <nav className="fixed top-0 w-full p-6 z-40 flex justify-end pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-4">
          {view === 'gallery' && (
            <button onClick={() => setView('login')} className="text-slate-400 hover:text-white flex items-center gap-1.5 text-xs uppercase tracking-widest bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-full cursor-pointer">
              <LogIn size={14} /> Log Masuk Moderator
            </button>
          )}
          {view === 'dashboard' && (
            <button onClick={() => { setView('gallery'); showNotification('Log keluar berjaya.', 'success'); }} className="text-slate-400 hover:text-white flex items-center gap-2 text-sm uppercase tracking-widest bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-full cursor-pointer">
              <LogOut size={16} /> Keluar
            </button>
          )}
          {view === 'login' && (
            <button onClick={() => setView('gallery')} className="text-slate-400 hover:text-white flex items-center gap-2 text-sm uppercase tracking-widest cursor-pointer">
              Kembali ke Galeri
            </button>
          )}
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-6 py-24 min-h-screen flex flex-col items-center">
        {view === 'gallery' && (
          <div className="w-full max-w-6xl flex flex-col items-center">
            <div className="text-center mb-24 relative">
              <h1 className={`text-4xl md:text-6xl font-light tracking-widest uppercase mb-4 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                Kenangan <span className="font-semibold">Kelas</span>
              </h1>
              <p className={`text-slate-400 tracking-[0.2em] uppercase text-sm md:text-base transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                Memori yang kekal abadi
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full">
              {memories.map((memory) => (
                <div key={memory.id} onClick={() => setSelectedImage(memory)} className="group relative flex flex-col gap-4 cursor-pointer">
                  <div className="relative overflow-hidden rounded-sm aspect-[4/5] bg-slate-900 border border-slate-800 transition-all duration-500 group-hover:border-slate-600">
                    <img src={memory.image} alt={memory.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                  </div>
                  <div className="flex flex-col items-center text-center opacity-70 group-hover:opacity-100">
                    <h3 className="text-lg font-medium">{memory.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{memory.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'login' && (
          <div className="w-full max-w-md flex-1 flex items-center justify-center -mt-10">
            <div className="w-full bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-10 rounded-2xl shadow-2xl">
              <div className="flex flex-col items-center mb-8">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-4"><LogIn className="text-slate-300" size={20} /></div>
                <h2 className="text-2xl font-light">Log Masuk</h2>
                <p className="text-sm text-slate-400 mt-2 uppercase">Moderator Rasmi Sahaja</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">Kata Nama</label>
                  <input type="text" value={loginUser} onChange={(e) => setLoginUser(e.target.value)} className="w-full bg-slate-950 border border-slate-800 focus:border-slate-500 rounded-lg px-4 py-3 text-slate-200 outline-none" required />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2">Kata Laluan</label>
                  <input type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} className="w-full bg-slate-950 border border-slate-800 focus:border-slate-500 rounded-lg px-4 py-3 text-slate-200 outline-none" required />
                </div>
                <button type="submit" className="w-full bg-slate-200 hover:bg-white text-slate-900 font-medium py-3 rounded-lg transition cursor-pointer">Log Masuk</button>
              </form>
            </div>
          </div>
        )}

        {view === 'dashboard' && (
          <div className="w-full max-w-4xl">
            <div className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-1"><Shield size={14} /> Moderator Rasmi</div>
                <h2 className="text-3xl font-light mb-2">Papan Pemuka</h2>
              </div>
              <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg text-sm cursor-pointer border border-slate-700">
                <Plus size={16} /> Tambah Kenangan
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {memories.map((memory) => (
                <div key={memory.id} className="flex items-center gap-6 bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
                  <img src={memory.image} alt={memory.name} className="w-20 h-20 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h4 className="text-lg font-medium">{memory.name}</h4>
                    <p className="text-slate-400 text-sm mt-1">{memory.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(memory)} className="p-2 text-slate-400 hover:text-white cursor-pointer"><Edit2 size={18} /></button>
                    <button onClick={() => setConfirmDeleteId(memory.id)} className="p-2 text-red-400 hover:text-red-300 cursor-pointer"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
          <button onClick={() => setSelectedImage(null)} className="absolute top-6 right-6 z-50 p-3 text-slate-400 hover:text-white cursor-pointer"><X size={32} /></button>
          <div className="relative z-10 w-full max-w-4xl flex flex-col md:flex-row bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-2xl">
            <div className="md:w-2/3 bg-black"><img src={selectedImage.image} alt={selectedImage.name} className="w-full h-[50vh] md:h-[70vh] object-cover" /></div>
            <div className="md:w-1/3 p-8 flex flex-col justify-center">
              <h2 className="text-3xl font-light mb-2">{selectedImage.name}</h2>
              <p className="text-sm text-slate-400 uppercase mb-8">{selectedImage.date}</p>
              <p className="text-slate-300 font-light">"{selectedImage.desc}"</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative z-10 w-full max-w-lg bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white cursor-pointer"><X size={20} /></button>
            <h3 className="text-2xl font-light mb-6">Tambah Kenangan</h3>
            <form onSubmit={handleAddMemory} className="space-y-4">
              <div><label className="block text-xs uppercase text-slate-500 mb-2">Nama</label><input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 outline-none" required /></div>
              <div><label className="block text-xs uppercase text-slate-500 mb-2">Tarikh</label><input type="text" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 outline-none" required /></div>
              <div>
                <label className="block text-xs uppercase text-slate-500 mb-2">Gambar</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-800 border-dashed rounded-lg cursor-pointer bg-slate-950">
                  {newImagePreview ? <img src={newImagePreview} className="h-20 object-cover rounded" /> : <Upload className="text-slate-400" />}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
              <div><label className="block text-xs uppercase text-slate-500 mb-2">Keterangan</label><textarea rows="3" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 outline-none resize-none"></textarea></div>
              <button type="submit" className="w-full bg-white text-slate-900 font-medium py-3 rounded-lg mt-6 cursor-pointer">Simpan</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative z-10 w-full max-w-lg bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
            <button onClick={() => setShowEditModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white cursor-pointer"><X size={20} /></button>
            <h3 className="text-2xl font-light mb-6">Sunting Kenangan</h3>
            <form onSubmit={handleUpdateMemory} className="space-y-4">
              <div><label className="block text-xs uppercase text-slate-500 mb-2">Nama</label><input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 outline-none" required /></div>
              <div><label className="block text-xs uppercase text-slate-500 mb-2">Tarikh</label><input type="text" value={editDate} onChange={(e) => setEditDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 outline-none" required /></div>
              <div>
                <label className="block text-xs uppercase text-slate-500 mb-2">Tukar Gambar</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-800 border-dashed rounded-lg cursor-pointer bg-slate-950">
                  {editImagePreview ? <img src={editImagePreview} className="h-20 object-cover rounded" /> : <Upload className="text-slate-400" />}
                  <input type="file" accept="image/*" onChange={handleEditImageChange} className="hidden" />
                </label>
              </div>
              <div><label className="block text-xs uppercase text-slate-500 mb-2">Keterangan</label><textarea rows="3" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 outline-none resize-none"></textarea></div>
              <button type="submit" className="w-full bg-white text-slate-900 font-medium py-3 rounded-lg mt-6 cursor-pointer">Kemaskini</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Padam */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="relative z-10 w-full max-w-sm bg-slate-900 border border-slate-700 p-6 rounded-xl shadow-2xl text-center">
            <h3 className="text-xl font-medium mb-2">Padam Kenangan?</h3>
            <p className="text-sm text-slate-400 mb-6">Tindakan ini tidak boleh dikembalikan.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDeleteId(null)} className="flex-1 py-2.5 rounded-lg border border-slate-700 text-slate-300 cursor-pointer">Batal</button>
              <button onClick={executeDelete} className="flex-1 py-2.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 cursor-pointer">Padam</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BackgroundEffects() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute -inset-[100%] opacity-30" style={{ background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #020617 50%, #0f172a 100%)' }}></div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
