import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Edit2, LogIn, LogOut, AlertCircle, CheckCircle, Shield, Upload, ChevronLeft, ChevronRight, Layers, ImageIcon } from 'lucide-react';

export default function App() {
  const [view, setView] = useState('gallery');
  const [memories, setMemories] = useState([
    {
      id: 1,
      name: 'Sahabat Kami (Kenangan Abadi)',
      date: '28/02/2009 - 01/09/2026',
      images: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800'
      ],
      desc: 'Kenangan terindah bersama sahabat yang sentiasa ceria, dikenang selama-lamanya dalam hati kami. Al-Fatihah.'
    }
  ]);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMemory, setEditingMemory] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const moderatorAccount = { username: 'GlacianDigital', password: 'GunungGlobal' };

  // Form States
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newImagesPreview, setNewImagesPreview] = useState([]);
  const [editName, setEditName] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editImagesPreview, setEditImagesPreview] = useState([]);

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
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
      showNotification('Akses ditolak. Maklumat moderator salah.', 'error');
    }
  };

  const handleMultipleImages = (e, setPreview) => {
    const files = Array.from(e.target.files);
    const previews = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result);
        if (previews.length === files.length) setPreview(previews);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddMemory = (e) => {
    e.preventDefault();
    if (!newName || !newDate || newImagesPreview.length === 0) {
      showNotification('Sila lengkapkan maklumat dan muat naik sekurang-kurangnya satu gambar.', 'error');
      return;
    }
    const newMemoryItem = {
      id: Date.now(),
      name: newName,
      date: newDate,
      images: newImagesPreview,
      desc: newDesc || 'Tiada keterangan.'
    };
    setMemories([newMemoryItem, ...memories]);
    setShowAddModal(false);
    setNewName(''); setNewDate(''); setNewDesc(''); setNewImagesPreview([]);
    showNotification('Kenangan berjaya disimpan.', 'success');
  };

  const openEditModal = (memory) => {
    setEditingMemory(memory);
    setEditName(memory.name);
    setEditDate(memory.date);
    setEditDesc(memory.desc);
    setEditImagesPreview(memory.images);
    setShowEditModal(true);
  };

  const handleUpdateMemory = (e) => {
    e.preventDefault();
    setMemories(memories.map(m => m.id === editingMemory.id ? {
      ...m, name: editName, date: editDate, images: editImagesPreview, desc: editDesc
    } : m));
    setShowEditModal(false);
    showNotification('Kenangan dikemas kini.', 'success');
  };

  const nextSlide = (e) => {
    e.stopPropagation();
    if (selectedMemory) {
      setCurrentSlideIndex((prev) => (prev + 1) % selectedMemory.images.length);
    }
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    if (selectedMemory) {
      setCurrentSlideIndex((prev) => (prev - 1 + selectedMemory.images.length) % selectedMemory.images.length);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans overflow-x-hidden selection:bg-slate-700 selection:text-white">
      <BackgroundEffects />

      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 bg-slate-900/90 border border-slate-700 backdrop-blur-md px-5 py-3 rounded-xl shadow-2xl transition-all animate-in fade-in slide-in-from-top-4 duration-500">
          {notification.type === 'success' ? <CheckCircle className="text-emerald-400" size={20} /> : <AlertCircle className="text-red-400" size={20} />}
          <span className="text-sm font-light tracking-wide">{notification.message}</span>
        </div>
      )}

      <nav className="fixed top-0 w-full p-6 z-40 flex justify-end pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-4">
          {view === 'gallery' ? (
            <button onClick={() => setView('login')} className="text-slate-400 hover:text-white transition-all text-xs uppercase tracking-widest bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-full hover:bg-slate-800">
              Moderator
            </button>
          ) : (
            <button onClick={() => setView('gallery')} className="text-slate-400 hover:text-white transition-all text-xs uppercase tracking-widest">
              Kembali ke Galeri
            </button>
          )}
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-6 py-24 min-h-screen flex flex-col items-center">
        
        {view === 'gallery' && (
          <div className="w-full max-w-6xl flex flex-col items-center">
            <div className={`text-center mb-24 transition-all duration-1000 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-4xl md:text-6xl font-light tracking-widest uppercase mb-4">Kenangan <span className="font-semibold">Abadi</span></h1>
              <p className="text-slate-400 tracking-[0.2em] uppercase text-xs md:text-sm">28.02.2009 — 01.09.2026</p>
            </div>

            {memories.length === 0 ? (
              <div className="text-center py-24 flex flex-col items-center gap-4 text-slate-500">
                <ImageIcon size={48} strokeWidth={1} />
                <p className="tracking-widest uppercase text-sm">Tiada kenangan dimuat naik lagi.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 w-full">
                {memories.map((memory, index) => (
                  <div key={memory.id} className="opacity-100 transition-all duration-700" style={{ transitionDelay: `${index * 100}ms` }}>
                    <div onClick={() => { setSelectedMemory(memory); setCurrentSlideIndex(0); }} className="group relative cursor-pointer">
                      <div className="relative overflow-hidden rounded-lg aspect-[4/5] bg-slate-900 border border-slate-800 transition-all duration-500 group-hover:border-slate-500 group-hover:shadow-2xl">
                        <img src={memory.images[0]} alt={memory.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
                        
                        {memory.images.length > 1 && (
                          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-[10px] px-2 py-1 rounded flex items-center gap-1 uppercase tracking-tighter">
                            <Layers size={10} /> {memory.images.length} Gambar
                          </div>
                        )}
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                        <div className="absolute bottom-6 left-0 right-0 text-center translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                          <span className="text-[10px] uppercase tracking-[0.3em] bg-white/10 backdrop-blur-md px-3 py-1 rounded-full">Lihat Slaid</span>
                        </div>
                      </div>
                      <div className="mt-6 text-center">
                        <h3 className="text-lg font-light tracking-widest group-hover:text-white transition-colors">{memory.name}</h3>
                        <p className="text-[10px] text-slate-500 tracking-widest mt-1 uppercase">{memory.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'login' && (
          <div className="w-full max-w-md flex-1 flex items-center justify-center -mt-10">
            <div className="w-full bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-10 rounded-2xl shadow-2xl transition-all duration-700 transform scale-100">
              <div className="text-center mb-10">
                <Shield className="mx-auto mb-4 text-slate-500" size={32} />
                <h2 className="text-2xl font-light tracking-wider">Akses Moderator</h2>
              </div>
              <form onSubmit={handleLogin} className="space-y-6">
                <input type="text" value={loginUser} onChange={(e) => setLoginUser(e.target.value)} className="w-full bg-black/40 border border-slate-800 focus:border-slate-400 rounded-lg px-4 py-3 outline-none transition-all" placeholder="Kata Nama" required />
                <input type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} className="w-full bg-black/40 border border-slate-800 focus:border-slate-400 rounded-lg px-4 py-3 outline-none transition-all" placeholder="Kata Laluan" required />
                <button type="submit" className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-slate-200 transition-all uppercase tracking-widest text-xs">Log Masuk</button>
              </form>
            </div>
          </div>
        )}

        {view === 'dashboard' && (
          <div className="w-full max-w-4xl">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-light tracking-tight">Papan Pemuka</h2>
                <p className="text-slate-500 text-xs uppercase tracking-widest mt-1">Moderator: GlacianDigital</p>
              </div>
              <button onClick={() => setShowAddModal(true)} className="bg-white text-black px-6 py-2.5 rounded-lg flex items-center gap-2 text-xs font-semibold hover:bg-slate-200 transition-all">
                <Plus size={16} /> Tambah Kenangan
              </button>
            </div>

            <div className="space-y-4">
              {memories.map((m) => (
                <div key={m.id} className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl flex items-center gap-6">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 relative">
                    <img src={m.images[0]} alt="" className="w-full h-full object-cover" />
                    {m.images.length > 1 && <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[8px] font-bold">+{m.images.length - 1}</div>}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{m.name}</h4>
                    <p className="text-xs text-slate-500">{m.date} • {m.images.length} Gambar</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(m)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"><Edit2 size={18} /></button>
                    <button onClick={() => setConfirmDeleteId(m.id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* LIGHTBOX SLIDESHOW */}
      {selectedMemory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl transition-all duration-700">
          <button onClick={() => setSelectedMemory(null)} className="absolute top-8 right-8 text-slate-400 hover:text-white transition-all hover:rotate-90">
            <X size={32} strokeWidth={1.5} />
          </button>
          
          <div className="relative w-full max-w-5xl h-full max-h-[85vh] flex flex-col md:flex-row gap-8 items-center justify-center animate-in zoom-in-95 duration-500">
            
            <div className="relative flex-1 h-full w-full flex items-center justify-center group">
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black/40 shadow-2xl">
                <img 
                  key={currentSlideIndex}
                  src={selectedMemory.images[currentSlideIndex]} 
                  className="w-full h-full object-contain animate-in fade-in duration-700" 
                  alt="" 
                />
              </div>

              {selectedMemory.images.length > 1 && (
                <>
                  <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-black">
                    <ChevronLeft size={24} />
                  </button>
                  <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-black">
                    <ChevronRight size={24} />
                  </button>

                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {selectedMemory.images.map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1 transition-all rounded-full ${i === currentSlideIndex ? 'w-8 bg-white' : 'w-2 bg-white/30'}`}
                      ></div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="w-full md:w-80 flex flex-col justify-center text-center md:text-left">
              <h2 className="text-3xl font-light mb-2">{selectedMemory.name}</h2>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-6">{selectedMemory.date}</p>
              <div className="w-12 h-[1px] bg-slate-700 mb-6 mx-auto md:mx-0"></div>
              <p className="text-slate-300 text-sm leading-relaxed italic">"{selectedMemory.desc}"</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH KENANGAN */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg p-8 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-2xl font-light mb-8">Bina Memori Baru</h3>
            <form onSubmit={handleAddMemory} className="space-y-6">
              <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nama" className="w-full bg-black/40 border border-slate-800 p-3 rounded-lg outline-none focus:border-white transition-all" required />
              <input type="text" value={newDate} onChange={(e) => setNewDate(e.target.value)} placeholder="Tarikh (Contoh: 12 Ogos 2026)" className="w-full bg-black/40 border border-slate-800 p-3 rounded-lg outline-none focus:border-white transition-all" required />
              
              <div className="space-y-3">
                <label className="block text-xs uppercase tracking-widest text-slate-500">Galeri Slaid (Boleh pilih banyak)</label>
                <label className="flex flex-col items-center justify-center w-full min-h-[120px] border-2 border-dashed border-slate-800 rounded-xl cursor-pointer hover:bg-slate-800/30 transition-all">
                  <div className="flex flex-col items-center gap-2 p-4">
                    {newImagesPreview.length > 0 ? (
                      <div className="flex flex-wrap gap-2 justify-center">
                        {newImagesPreview.map((src, i) => <img key={i} src={src} className="w-12 h-12 object-cover rounded shadow-md" />)}
                      </div>
                    ) : (
                      <>
                        <Upload className="text-slate-500" size={24} />
                        <span className="text-[10px] text-slate-400">Pilih gambar-gambar memori</span>
                      </>
                    )}
                  </div>
                  <input type="file" multiple accept="image/*" onChange={(e) => handleMultipleImages(e, setNewImagesPreview)} className="hidden" />
                </label>
              </div>

              <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Keterangan..." rows="3" className="w-full bg-black/40 border border-slate-800 p-3 rounded-lg outline-none focus:border-white transition-all resize-none"></textarea>
              
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 text-slate-400 py-3 text-xs uppercase tracking-widest hover:text-white transition-all">Batal</button>
                <button type="submit" className="flex-1 bg-white text-black py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-slate-200 transition-all">Simpan Memori</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT KENANGAN */}
      {showEditModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg p-8 rounded-2xl shadow-2xl">
            <h3 className="text-2xl font-light mb-8">Sunting Memori</h3>
            <form onSubmit={handleUpdateMemory} className="space-y-6">
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Nama" className="w-full bg-black/40 border border-slate-800 p-3 rounded-lg outline-none focus:border-white transition-all" required />
              <input type="text" value={editDate} onChange={(e) => setEditDate(e.target.value)} placeholder="Tarikh" className="w-full bg-black/40 border border-slate-800 p-3 rounded-lg outline-none focus:border-white transition-all" required />
              
              <div className="space-y-3">
                <label className="block text-xs uppercase tracking-widest text-slate-500">Kemaskini Galeri Slaid</label>
                <label className="flex flex-col items-center justify-center w-full min-h-[100px] border-2 border-dashed border-slate-800 rounded-xl cursor-pointer hover:bg-slate-800/30 transition-all">
                  <div className="flex flex-wrap gap-2 p-4 justify-center">
                    {editImagesPreview.map((src, i) => <img key={i} src={src} className="w-10 h-10 object-cover rounded" />)}
                  </div>
                  <input type="file" multiple accept="image/*" onChange={(e) => handleMultipleImages(e, setEditImagesPreview)} className="hidden" />
                </label>
              </div>

              <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows="3" className="w-full bg-black/40 border border-slate-800 p-3 rounded-lg outline-none focus:border-white transition-all resize-none"></textarea>
              
              <div className="flex gap-4">
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 text-slate-400 py-3 text-xs uppercase tracking-widest">Batal</button>
                <button type="submit" className="flex-1 bg-white text-black py-3 rounded-lg text-xs font-bold uppercase tracking-widest">Kemaskini</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in zoom-in-95 duration-300">
          <div className="bg-slate-900 border border-red-900/30 w-full max-w-xs p-8 rounded-2xl shadow-2xl text-center">
            <Trash2 className="text-red-500 mx-auto mb-4" size={40} />
            <h3 className="text-lg font-medium mb-2">Hapuskan Kenangan?</h3>
            <p className="text-xs text-slate-500 mb-8 leading-relaxed">Tindakan ini tidak boleh dikembalikan. Memori ini akan hilang buat selamanya.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDeleteId(null)} className="flex-1 py-2 rounded-lg text-xs uppercase tracking-widest border border-slate-800 hover:bg-slate-800 transition-all">Batal</button>
              <button onClick={() => {
                setMemories(memories.filter(m => m.id !== confirmDeleteId));
                setConfirmDeleteId(null);
                showNotification('Kenangan telah dihapuskan.', 'success');
              }} className="flex-1 py-2 rounded-lg text-xs uppercase tracking-widest bg-red-500 text-white hover:bg-red-600 transition-all">Hapus</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function BackgroundEffects() {
  return (
    <>
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-[100%] opacity-30" style={{
            background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #020617 50%, #0f172a 100%)',
            animation: 'slowSpin 60s linear infinite',
          }}></div>
      </div>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white/20 blur-[1px]" style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              left: Math.random() * 100 + '%',
              bottom: '-10px',
              animation: `floatUp ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 15}s`,
              opacity: 0
            }}></div>
        ))}
      </div>
      <style>{`
        @keyframes slowSpin {
          0% { transform: rotate(0deg) scale(2); }
          50% { transform: rotate(180deg) scale(2.2); }
          100% { transform: rotate(360deg) scale(2); }
        }
        @keyframes floatUp {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { transform: translateY(-110vh) scale(1.2); opacity: 0; }
        }
      `}</style>
    </>
  );
}
