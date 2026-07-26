import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Key, Database, MailOpen, LogOut, Check } from 'lucide-react';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Dashboard states
  const [activeTab, setActiveTab] = useState('perfumes'); // perfumes or inquiries
  const [perfumes, setPerfumes] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Perfume Form States
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: 'Anora Brand',
    description: '',
    price: '120$',
    size: '100ml',
    family: 'Woody',
    gender: 'Unisex',
    image: '/images/perfumes/oud_imperial.jpg',
    longevity: 4,
    sillage: 3,
    topNotes: '',
    middleNotes: '',
    baseNotes: ''
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    // Check if password already stored in session
    const savedPass = sessionStorage.getItem('adminPass');
    if (savedPass) {
      setPassword(savedPass);
      verifyPassword(savedPass);
    }
  }, []);

  const verifyPassword = (pass) => {
    // Perform a validation request by trying to fetch inquiries
    fetch('http://localhost:5000/api/inquiries', {
      headers: { 'x-admin-password': pass }
    })
      .then(res => {
        if (res.ok) {
          setIsAuthenticated(true);
          sessionStorage.setItem('adminPass', pass);
          fetchData(pass);
        } else {
          setLoginError('Noto`g`ri parol. Qaytadan urinib ko`ring.');
          sessionStorage.removeItem('adminPass');
        }
      })
      .catch(err => {
        console.warn('API error, simulating auth in offline/static mode...');
        if (pass === 'admin123') {
          setIsAuthenticated(true);
          sessionStorage.setItem('adminPass', pass);
          fetchStaticData();
        } else {
          setLoginError('Noto`g`ri parol. (Static modeda standart parol: admin123)');
        }
      });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    verifyPassword(password);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    sessionStorage.removeItem('adminPass');
  };

  const fetchData = (pass) => {
    setLoading(true);
    // Fetch perfumes
    const fetchPerfumes = fetch('http://localhost:5000/api/perfumes').then(res => res.json());
    // Fetch inquiries
    const fetchInquiries = fetch('http://localhost:5000/api/inquiries', {
      headers: { 'x-admin-password': pass }
    }).then(res => res.json());

    Promise.all([fetchPerfumes, fetchInquiries])
      .then(([perfumeData, inquiryData]) => {
        setPerfumes(perfumeData);
        setInquiries(inquiryData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching admin data:', err);
        fetchStaticData();
      });
  };

  const fetchStaticData = () => {
    setLoading(true);
    // Setup fallback mock data for testing
    setPerfumes([
      {
        _id: "1",
        id: "1",
        name: "Oud Imperial",
        brand: "Anora Brand",
        description: "A deep, mysterious journey into the heart of the Orient.",
        price: "145$",
        size: "100ml",
        notes: { top: ["Cardamom"], middle: ["Oud"], base: ["Sandalwood"] },
        family: "Woody",
        image: "/images/perfumes/oud_imperial.jpg",
        longevity: 5,
        sillage: 5,
        gender: "Unisex"
      }
    ]);
    setInquiries([
      {
        id: "1",
        name: "Farhod Ergashev",
        email: "farhod@mail.com",
        phone: "+998 (99) 888-77-66",
        message: "Oud Imperial atirini shou-rumda sinab ko'rish uchun vaqt belgilamoqchi edim.",
        perfumeName: "Oud Imperial",
        createdAt: new Date().toISOString(),
        status: "Pending"
      }
    ]);
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      brand: 'Anora Brand',
      description: '',
      price: '120$',
      size: '100ml',
      family: 'Woody',
      gender: 'Unisex',
      image: '/images/perfumes/oud_imperial.jpg',
      longevity: 4,
      sillage: 3,
      topNotes: '',
      middleNotes: '',
      baseNotes: ''
    });
    setIsEditing(false);
    setEditId(null);
    setFormError('');
    setFormSuccess('');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    // Prepare payload
    const payload = {
      name: formData.name,
      brand: formData.brand,
      description: formData.description,
      price: formData.price,
      size: formData.size,
      family: formData.family,
      gender: formData.gender,
      image: formData.image,
      longevity: Number(formData.longevity),
      sillage: Number(formData.sillage),
      notes: {
        top: formData.topNotes.split(',').map(n => n.trim()).filter(n => n !== ''),
        middle: formData.middleNotes.split(',').map(n => n.trim()).filter(n => n !== ''),
        base: formData.baseNotes.split(',').map(n => n.trim()).filter(n => n !== '')
      }
    };

    const url = isEditing 
      ? `http://localhost:5000/api/perfumes/${editId}` 
      : 'http://localhost:5000/api/perfumes';
      
    const method = isEditing ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': password
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error('Action failed');
        return res.json();
      })
      .then(data => {
        setFormSuccess(isEditing ? 'Ifor muvaffaqiyatli tahrirlandi!' : 'Yangi ifor muvaffaqiyatli qo`shildi!');
        resetForm();
        fetchData(password);
      })
      .catch(err => {
        console.error('Error saving perfume:', err);
        // Static mode simulation
        if (isEditing) {
          setPerfumes(prev => prev.map(p => (p._id === editId || p.id === editId) ? { ...p, ...payload, _id: editId } : p));
          setFormSuccess('Ifor tahrirlandi (Simulated).');
        } else {
          const newMock = { ...payload, _id: Date.now().toString() };
          setPerfumes(prev => [...prev, newMock]);
          setFormSuccess('Ifor qo`shildi (Simulated).');
        }
        resetForm();
      });
  };

  const handleEditClick = (perfume) => {
    setIsEditing(true);
    setEditId(perfume._id || perfume.id);
    setFormData({
      name: perfume.name,
      brand: perfume.brand,
      description: perfume.description,
      price: perfume.price,
      size: perfume.size,
      family: perfume.family,
      gender: perfume.gender,
      image: perfume.image,
      longevity: perfume.longevity,
      sillage: perfume.sillage,
      topNotes: perfume.notes?.top?.join(', ') || '',
      middleNotes: perfume.notes?.middle?.join(', ') || '',
      baseNotes: perfume.notes?.base?.join(', ') || ''
    });
    // Scroll to form
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Haqiqatan ham ushbu atirni katalogdan o`chirmoqchimisiz?')) {
      fetch(`http://localhost:5000/api/perfumes/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': password }
      })
        .then(res => {
          if (!res.ok) throw new Error('Delete failed');
          return res.json();
        })
        .then(() => {
          fetchData(password);
        })
        .catch(err => {
          console.error('Error deleting perfume:', err);
          // Static simulation
          setPerfumes(prev => prev.filter(p => p._id !== id && p.id !== id));
        });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-page container section-padding flex-center animate-fade-in" style={{ minHeight: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="inquiry-form-card" style={{ maxWidth: '400px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Key size={36} style={{ color: '#d4af37', marginBottom: '10px' }} />
            <h3>Admin Tizimiga Kirish</h3>
            <p>Katalog ma'lumotlarini boshqarish uchun parolni kiriting.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="inquiry-form">
            {loginError && <div className="error-message" style={{ marginBottom: '15px' }}>{loginError}</div>}
            
            <div className="form-group">
              <label htmlFor="admin-pass">Parol *</label>
              <input
                type="password"
                id="admin-pass"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Parolni kiriting"
              />
            </div>
            <span className="text-muted" style={{ fontSize: '0.75rem', display: 'block', marginBottom: '15px' }}>
              Standart parol: <code>admin123</code>
            </span>
            <button type="submit" className="btn btn-primary w-100">Kirish</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page container section-padding animate-fade-in">
      <div className="admin-header">
        <div>
          <h2>Boshqaruv Paneli (Admin)</h2>
          <p>Katalog mahsulotlarini va mijozlar so'rovlarini boshqarish bo'limi.</p>
        </div>
        <button className="btn btn-secondary" onClick={handleLogout} style={{ display: 'flex', gap: '8px', padding: '10px 20px' }}>
          <LogOut size={16} /> Chiqish
        </button>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button 
          className={`admin-tab-btn ${activeTab === 'perfumes' ? 'active' : ''}`}
          onClick={() => setActiveTab('perfumes')}
        >
          <Database size={16} /> Atirlar Katalogi ({perfumes.length})
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'inquiries' ? 'active' : ''}`}
          onClick={() => setActiveTab('inquiries')}
        >
          <MailOpen size={16} /> Mijozlar So'rovlari ({inquiries.length})
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner">Yuklanmoqda...</div>
      ) : activeTab === 'perfumes' ? (
        <div className="admin-perfume-layout">
          {/* Perfume Management Form */}
          <div className="admin-form-area">
            <div className="inquiry-form-card">
              <h3>{isEditing ? 'Atirni Tahrirlash' : 'Yangi Atir Qo`shish'}</h3>
              
              {formError && <div className="error-message">{formError}</div>}
              {formSuccess && <div className="success-message" style={{ padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} /> {formSuccess}</div>}

              <form onSubmit={handleFormSubmit} className="inquiry-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Atir Nomi *</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="Masalan: Oud Imperial" />
                  </div>
                  <div className="form-group">
                    <label>Brend *</label>
                    <input type="text" name="brand" required value={formData.brand} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Narxi (Ma'lumot uchun) *</label>
                    <input type="text" name="price" required value={formData.price} onChange={handleInputChange} placeholder="140$" />
                  </div>
                  <div className="form-group">
                    <label>Hajmi *</label>
                    <input type="text" name="size" required value={formData.size} onChange={handleInputChange} placeholder="100ml" />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Ifor Oilasi *</label>
                    <select name="family" value={formData.family} onChange={handleInputChange} className="form-select">
                      <option value="Woody">Woody (Yog'ochli)</option>
                      <option value="Floral">Floral (Gulli)</option>
                      <option value="Citrus">Citrus (Sitrusli)</option>
                      <option value="Oriental">Oriental (Sharqona)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Kimlar uchun *</label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange} className="form-select">
                      <option value="Unisex">Unisex</option>
                      <option value="Men">Men (Erkaklar)</option>
                      <option value="Women">Women (Ayollar)</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Chidamliligi (1-5) *</label>
                    <input type="number" name="longevity" min="1" max="5" required value={formData.longevity} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Yoyiluvchanligi (1-5) *</label>
                    <input type="number" name="sillage" min="1" max="5" required value={formData.sillage} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Rasm URL-manzili *</label>
                  <input type="text" name="image" required value={formData.image} onChange={handleInputChange} />
                  <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                    Standart rasm yo'llari: <code>/images/perfumes/oud_imperial.jpg</code>, <code>rose_de_nuit.jpg</code>, <code>citrus_nectar.jpg</code>, <code>vetiver_sauvage.jpg</code>
                  </span>
                </div>

                <div className="form-group">
                  <label>Top Notalari (vergul bilan ajratilgan)</label>
                  <input type="text" name="topNotes" value={formData.topNotes} onChange={handleInputChange} placeholder="Bergamot, Lemon, Orange" />
                </div>
                <div className="form-group">
                  <label>Heart/Middle Notalari (vergul bilan ajratilgan)</label>
                  <input type="text" name="middleNotes" value={formData.middleNotes} onChange={handleInputChange} placeholder="Rose, Jasmine, Neroli" />
                </div>
                <div className="form-group">
                  <label>Base Notalari (vergul bilan ajratilgan)</label>
                  <input type="text" name="baseNotes" value={formData.baseNotes} onChange={handleInputChange} placeholder="Oud, Sandalwood, Amber" />
                </div>

                <div className="form-group">
                  <label>Tavsifi (Description) *</label>
                  <textarea name="description" rows="3" required value={formData.description} onChange={handleInputChange} placeholder="Atirning kelib chiqishi, xarakteri haqida qisqacha ma'lumot..."></textarea>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn btn-primary w-100">{isEditing ? 'Saqlash' : 'Qo`shish'}</button>
                  {isEditing && (
                    <button type="button" className="btn btn-secondary w-100" onClick={resetForm}>Bekor qilish</button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Perfume List Table */}
          <div className="admin-list-area">
            <h3>Katalog ro'yxati ({perfumes.length} ta mahsulot)</h3>
            <div className="table-responsive" style={{ marginTop: '20px' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Rasm</th>
                    <th>Nomi</th>
                    <th>Toifasi</th>
                    <th>Narxi/Hajmi</th>
                    <th>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {perfumes.map(p => (
                    <tr key={p._id || p.id}>
                      <td>
                        <img src={p.image} alt={p.name} className="table-img" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                      </td>
                      <td>
                        <strong>{p.name}</strong>
                        <span className="table-sub text-muted" style={{ display: 'block', fontSize: '0.8rem' }}>{p.brand}</span>
                      </td>
                      <td>{p.family} ({p.gender})</td>
                      <td>{p.price} / {p.size}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button className="action-btn edit" onClick={() => handleEditClick(p)} title="Tahrirlash">
                            <Edit2 size={16} />
                          </button>
                          <button className="action-btn delete" onClick={() => handleDeleteClick(p._id || p.id)} title="O'chirish">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Inquiries Management list */
        <div className="admin-inquiry-layout">
          <h3>Mijozlar tomonidan yuborilgan murojaatlar ({inquiries.length} ta)</h3>
          {inquiries.length === 0 ? (
            <div className="no-results" style={{ padding: '40px 0' }}>Hozircha hech qanday so'rov kelib tushmagan.</div>
          ) : (
            <div className="inquiry-cards-list" style={{ marginTop: '25px', display: 'grid', gap: '20px' }}>
              {inquiries.map(inq => (
                <div key={inq._id || inq.id} className="inquiry-admin-card">
                  <div className="inquiry-admin-header">
                    <div>
                      <h4>{inq.name}</h4>
                      <span className="inquiry-date">{new Date(inq.createdAt).toLocaleString()}</span>
                    </div>
                    <span className="status-badge pending">{inq.status}</span>
                  </div>
                  <div className="inquiry-admin-body">
                    <p><strong>Telefon:</strong> {inq.phone}</p>
                    <p><strong>Email:</strong> {inq.email}</p>
                    {inq.perfumeName && (
                      <p><strong>Qiziqqan Atiri:</strong> <span className="text-gold" style={{ color: '#d4af37', fontWeight: 'bold' }}>{inq.perfumeName}</span></p>
                    )}
                    <p className="inquiry-message"><strong>Xabar:</strong> {inq.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
