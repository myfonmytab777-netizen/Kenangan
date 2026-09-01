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

  return React.createElement(
    'div',
    { className: 'min-h-screen bg-slate-950 text-slate-200 font-sans overflow-x-hidden selection:bg-slate-700 selection:text-white relative' },
    [
      React.createElement(BackgroundEffects, { key: 'bg' }),

      notification && React.createElement(
        'div',
        { key: 'notif', className: 'fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-slate-900 border border-slate-700 backdrop-blur-md px-5 py-3 rounded-xl shadow-2xl transition-all' },
        [
          notification.type === 'success' ? React.createElement(CheckCircle, { key: 'c', className: 'text-emerald-400', size: 20 }) : React.createElement(AlertCircle, { key: 'a', className: 'text-red-400', size: 20 }),
          React.createElement('span', { key: 't', className: 'text-sm text-slate-200' }, notification.message)
        ]
      ),

      React.createElement(
        'nav',
        { key: 'nav', className: 'fixed top-0 w-full p-6 z-40 flex justify-end pointer-events-none' },
        React.createElement(
          'div',
          { className: 'pointer-events-auto flex items-center gap-4' },
          [
            view === 'gallery' && React.createElement(
              'button',
              { key: 'b1', onClick: () => setView('login'), className: 'text-slate-400 hover:text-white flex items-center gap-1.5 text-xs uppercase tracking-widest bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-full cursor-pointer' },
              [React.createElement(LogIn, { key: 'i', size: 14 }), ' Log Masuk Moderator']
            ),
            view === 'dashboard' && React.createElement(
              'button',
              { key: 'b2', onClick: () => { setView('gallery'); showNotification('Log keluar berjaya.', 'success'); }, className: 'text-slate-400 hover:text-white flex items-center gap-2 text-sm uppercase tracking-widest bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-full cursor-pointer' },
              [React.createElement(LogOut, { key: 'i', size: 16 }), ' Keluar']
            ),
            view === 'login' && React.createElement(
              'button',
              { key: 'b3', onClick: () => setView('gallery'), className: 'text-slate-400 hover:text-white flex items-center gap-2 text-sm uppercase tracking-widest cursor-pointer' },
              'Kembali ke Galeri'
            )
          ]
        )
      ),

      React.createElement(
        'main',
        { key: 'main', className: 'relative z-10 container mx-auto px-6 py-24 min-h-screen flex flex-col items-center' },
        [
          view === 'gallery' && React.createElement(
            'div',
            { key: 'g', className: 'w-full max-w-6xl flex flex-col items-center' },
            [
              React.createElement(
                'div',
                { key: 'h', className: 'text-center mb-24 relative' },
                [
                  React.createElement('h1', { key: 'title', className: `text-4xl md:text-6xl font-light tracking-widest uppercase mb-4 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}` }, ['Kenangan ', React.createElement('span', { key: 'cls', className: 'font-semibold' }, 'Kelas')]),
                  React.createElement('p', { key: 'sub', className: `text-slate-400 tracking-[0.2em] uppercase text-sm md:text-base transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}` }, 'Memori yang kekal abadi')
                ]
              ),
              React.createElement(
                'div',
                { key: 'grid', className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full' },
                memories.map((memory) => React.createElement(
                  'div',
                  { key: memory.id, onClick: () => setSelectedImage(memory), className: 'group relative flex flex-col gap-4 cursor-pointer' },
                  [
                    React.createElement(
                      'div',
                      { key: 'imgwrap', className: 'relative overflow-hidden rounded-sm aspect-[4/5] bg-slate-900 border border-slate-800 transition-all duration-500 group-hover:border-slate-600' },
                      React.createElement('img', { src: memory.image, alt: memory.name, className: 'w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100' })
                    ),
                    React.createElement(
                      'div',
                      { key: 'inf', className: 'flex flex-col items-center text-center opacity-70 group-hover:opacity-100' },
                      [
                        React.createElement('h3', { key: 'n', className: 'text-lg font-medium' }, memory.name),
                        React.createElement('p', { key: 'd', className: 'text-xs text-slate-400 mt-1' }, memory.date)
                      ]
                    )
                  ]
                ))
              )
            ]
          ),

          view === 'login' && React.createElement(
            'div',
            { key: 'l', className: 'w-full max-w-md flex-1 flex items-center justify-center -mt-10' },
            React.createElement(
              'div',
              { className: 'w-full bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-10 rounded-2xl shadow-2xl' },
              [
                React.createElement(
                  'div',
                  { key: 'lh', className: 'flex flex-col items-center mb-8' },
                  [
                    React.createElement('div', { key: 'ic', className: 'w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-4' }, React.createElement(LogIn, { size: 20, className: 'text-slate-300' })),
                    React.createElement('h2', { key: 'lt', className: 'text-2xl font-light' }, 'Log Masuk'),
                    React.createElement('p', { key: 'lp', className: 'text-sm text-slate-400 mt-2 uppercase' }, 'Moderator Rasmi Sahaja')
                  ]
                ),
                React.createElement(
                  'form',
                  { key: 'form', onSubmit: handleLogin, className: 'space-y-6' },
                  [
                    React.createElement('div', { key: 'f1' }, [
                      React.createElement('label', { key: 'lbl1', className: 'block text-xs uppercase tracking-wider text-slate-500 mb-2' }, 'Kata Nama'),
                      React.createElement('input', { key: 'in1', type: 'text', value: loginUser, onChange: (e) => setLoginUser(e.target.value), className: 'w-full bg-slate-950 border border-slate-800 focus:border-slate-500 rounded-lg px-4 py-3 text-slate-200 outline-none', required: true })
                    ]),
                    React.createElement('div', { key: 'f2' }, [
                      React.createElement('label', { key: 'lbl2', className: 'block text-xs uppercase tracking-wider text-slate-500 mb-2' }, 'Kata Laluan'),
                      React.createElement('input', { key: 'in2', type: 'password', value: loginPass, onChange: (e) => setLoginPass(e.target.value), className: 'w-full bg-slate-950 border border-slate-800 focus:border-slate-500 rounded-lg px-4 py-3 text-slate-200 outline-none', required: true })
                    ]),
                    React.createElement('button', { key: 'sub', type: 'submit', className: 'w-full bg-slate-200 hover:bg-white text-slate-900 font-medium py-3 rounded-lg transition cursor-pointer' }, 'Log Masuk')
                  ]
                )
              ]
            )
          ),

          view === 'dashboard' && React.createElement(
            'div',
            { key: 'd', className: 'w-full max-w-4xl' },
            [
              React.createElement(
                'div',
                { key: 'dh', className: 'mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4' },
                [
                  React.createElement('div', { key: 'dt' }, [
                    React.createElement('div', { key: 'sh', className: 'flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-1' }, [React.createElement(Shield, { key: 's', size: 14 }), ' Moderator Rasmi']),
                    React.createElement('h2', { key: 'hd', className: 'text-3xl font-light mb-2' }, 'Papan Pemuka')
                  ]),
                  React.createElement('button', { key: 'btnadd', onClick: () => setShowAddModal(true), className: 'flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg text-sm cursor-pointer border border-slate-700' }, [React.createElement(Plus, { key: 'p', size: 16 }), ' Tambah Kenangan'])
                ]
              ),
              React.createElement(
                'div',
                { key: 'dlist', className: 'flex flex-col gap-4' },
                memories.map((memory) => React.createElement(
                  'div',
                  { key: memory.id, className: 'flex items-center gap-6 bg-slate-900/50 border border-slate-800 p-4 rounded-xl' },
                  [
                    React.createElement('img', { key: 'mimg', src: memory.image, alt: memory.name, className: 'w-20 h-20 object-cover rounded-lg' }),
                    React.createElement('div', { key: 'minfo', className: 'flex-1' }, [
                      React.createElement('h4', { key: 'mn', className: 'text-lg font-medium' }, memory.name),
                      React.createElement('p', { key: 'md', className: 'text-slate-400 text-sm mt-1' }, memory.date)
                    ]),
                    React.createElement(
                      'div',
                      { key: 'macts', className: 'flex gap-2' },
                      [
                        React.createElement('button', { key: 'e', onClick: () => openEditModal(memory), className: 'p-2 text-slate-400 hover:text-white cursor-pointer' }, React.createElement(Edit2, { size: 18 })),
                        React.createElement('button', { key: 'del', onClick: () => setConfirmDeleteId(memory.id), className: 'p-2 text-red-400 hover:text-red-300 cursor-pointer' }, React.createElement(Trash2, { size: 18 }))
                      ]
                    )
                  ]
                ))
              )
            ]
          )
        ]
      ),

      selectedImage && React.createElement(
        'div',
        { key: 'light', className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl' },
        [
          React.createElement('button', { key: 'x', onClick: () => setSelectedImage(null), className: 'absolute top-6 right-6 z-50 p-3 text-slate-400 hover:text-white cursor-pointer' }, React.createElement(X, { size: 32 })),
          React.createElement(
            'div',
            { key: 'box', className: 'relative z-10 w-full max-w-4xl flex flex-col md:flex-row bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-2xl' },
            [
              React.createElement('div', { key: 'limg', className: 'md:w-2/3 bg-black' }, React.createElement('img', { src: selectedImage.image, alt: selectedImage.name, className: 'w-full h-[50vh] md:h-[70vh] object-cover' })),
              React.createElement('div', { key: 'ltxt', className: 'md:w-1/3 p-8 flex flex-col justify-center' }, [
                React.createElement('h2', { key: 'ln', className: 'text-3xl font-light mb-2' }, selectedImage.name),
                React.createElement('p', { key: 'ld', className: 'text-sm text-slate-400 uppercase mb-8' }, selectedImage.date),
                React.createElement('p', { key: 'lc', className: 'text-slate-300 font-light' }, `"${selectedImage.desc}"`)
              ])
            ]
          )
        ]
      ),

      showAddModal && React.createElement(
        'div',
        { key: 'modaladd', className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm' },
        React.createElement(
          'div',
          { className: 'relative z-10 w-full max-w-lg bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl' },
          [
            React.createElement('button', { key: 'ca', onClick: () => setShowAddModal(false), className: 'absolute top-4 right-4 text-slate-500 hover:text-white cursor-pointer' }, React.createElement(X, { size: 20 })),
            React.createElement('h3', { key: 'ta', className: 'text-2xl font-light mb-6' }, 'Tambah Kenangan'),
            React.createElement(
              'form',
              { key: 'fa', onSubmit: handleAddMemory, className: 'space-y-4' },
              [
                React.createElement('div', { key: 'a1' }, [React.createElement('label', { key: 'l1', className: 'block text-xs uppercase text-slate-500 mb-2' }, 'Nama'), React.createElement('input', { key: 'i1', type: 'text', value: newName, onChange: (e) => setNewName(e.target.value), className: 'w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 outline-none', required: true })]),
                React.createElement('div', { key: 'a2' }, [React.createElement('label', { key: 'l2', className: 'block text-xs uppercase text-slate-500 mb-2' }, 'Tarikh'), React.createElement('input', { key: 'i2', type: 'text', value: newDate, onChange: (e) => setNewDate(e.target.value), className: 'w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 outline-none', required: true })]),
                React.createElement('div', { key: 'a3' }, [
                  React.createElement('label', { key: 'l3', className: 'block text-xs uppercase text-slate-500 mb-2' }, 'Gambar'),
                  React.createElement(
                    'label',
                    { key: 'lblimg', className: 'flex flex-col items-center justify-center w-full h-32 border-2 border-slate-800 border-dashed rounded-lg cursor-pointer bg-slate-950' },
                    [
                      newImagePreview ? React.createElement('img', { key: 'prev', src: newImagePreview, className: 'h-20 object-cover rounded' }) : React.createElement(Upload, { key: 'up', className: 'text-slate-400' }),
                      React.createElement('input', { key: 'file', type: 'file', accept: 'image/*', onChange: handleImageChange, className: 'hidden' })
                    ]
                  )
                ]),
                React.createElement('div', { key: 'a4' }, [React.createElement('label', { key: 'l4', className: 'block text-xs uppercase text-slate-500 mb-2' }, 'Keterangan'), React.createElement('textarea', { key: 'i4', rows: 3, value: newDesc, onChange: (e) => setNewDesc(e.target.value), className: 'w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 outline-none resize-none' })]),
                React.createElement('button', { key: 'sub', type: 'submit', className: 'w-full bg-white text-slate-900 font-medium py-3 rounded-lg mt-6 cursor-pointer' }, 'Simpan')
              ]
            )
          ]
        )
      ),

      showEditModal && React.createElement(
        'div',
        { key: 'modaledit', className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm' },
        React.createElement(
          'div',
          { className: 'relative z-10 w-full max-w-lg bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl' },
          [
            React.createElement('button', { key: 'ce', onClick: () => setShowEditModal(false), className: 'absolute top-4 right-4 text-slate-500 hover:text-white cursor-pointer' }, React.createElement(X, { size: 20 })),
            React.createElement('h3', { key: 'te', className: 'text-2xl font-light mb-6' }, 'Sunting Kenangan'),
            React.createElement(
              'form',
              { key: 'fe', onSubmit: handleUpdateMemory, className: 'space-y-4' },
              [
                React.createElement('div', { key: 'e1' }, [React.createElement('label', { key: 'l1', className: 'block text-xs uppercase text-slate-500 mb-2' }, 'Nama'), React.createElement('input', { key: 'i1', type: 'text', value: editName, onChange: (e) => setEditName(e.target.value), className: 'w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 outline-none', required: true })]),
                React.createElement('div', { key: 'e2' }, [React.createElement('label', { key: 'l2', className: 'block text-xs uppercase text-slate-500 mb-2' }, 'Tarikh'), React.createElement('input', { key: 'i2', type: 'text', value: editDate, onChange: (e) => setEditDate(e.target.value), className: 'w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 outline-none', required: true })]),
                React.createElement('div', { key: 'e3' }, [
                  React.createElement('label', { key: 'l3', className: 'block text-xs uppercase text-slate-500 mb-2' }, 'Tukar Gambar'),
                  React.createElement(
                    'label',
                    { key: 'lblimg2', className: 'flex flex-col items-center justify-center w-full h-32 border-2 border-slate-800 border-dashed rounded-lg cursor-pointer bg-slate-950' },
                    [
                      editImagePreview ? React.createElement('img', { key: 'prev2', src: editImagePreview, className: 'h-20 object-cover rounded' }) : React.createElement(Upload, { key: 'up2', className: 'text-slate-400' }),
                      React.createElement('input', { key: 'file2', type: 'file', accept: 'image/*', onChange: handleEditImageChange, className: 'hidden' })
                    ]
                  )
                ]),
                React.createElement('div', { key: 'e4' }, [React.createElement('label', { key: 'l4', className: 'block text-xs uppercase text-slate-500 mb-2' }, 'Keterangan'), React.createElement('textarea', { key: 'i4', rows: 3, value: editDesc, onChange: (e) => setEditDesc(e.target.value), className: 'w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 outline-none resize-none' })]),
                React.createElement('button', { key: 'sub2', type: 'submit', className: 'w-full bg-white text-slate-900 font-medium py-3 rounded-lg mt-6 cursor-pointer' }, 'Kemaskini')
              ]
            )
          ]
        )
      ),

      confirmDeleteId && React.createElement(
        'div',
        { key: 'modaldel', className: 'fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md' },
        React.createElement(
          'div',
          { className: 'relative z-10 w-full max-w-sm bg-slate-900 border border-slate-700 p-6 rounded-xl shadow-2xl text-center' },
          [
            React.createElement('h3', { key: 'td', className: 'text-xl font-medium mb-2' }, 'Padam Kenangan?'),
            React.createElement('p', { key: 'pd', className: 'text-sm text-slate-400 mb-6' }, 'Tindakan ini tidak boleh dikembalikan.'),
            React.createElement(
              'div',
              { key: 'dacts', className: 'flex gap-3' },
              [
                React.createElement('button', { key: 'cb', onClick: () => setConfirmDeleteId(null), className: 'flex-1 py-2.5 rounded-lg border border-slate-700 text-slate-300 cursor-pointer' }, 'Batal'),
                React.createElement('button', { key: 'cd', onClick: executeDelete, className: 'flex-1 py-2.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 cursor-pointer' }, 'Padam')
              ]
            )
          ]
        )
      )
    ]
  );
}

function BackgroundEffects() {
  return React.createElement(
    'div',
    { className: 'fixed inset-0 z-0 overflow-hidden pointer-events-none' },
    React.createElement('div', { className: 'absolute -inset-[100%] opacity-30', style: { background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #020617 50%, #0f172a 100%)' } })
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
