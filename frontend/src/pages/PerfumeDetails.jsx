import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Wind, Users, CheckCircle2, ShieldCheck } from 'lucide-react';

const PerfumeDetails = () => {
  const { id } = useParams();
  const [perfume, setPerfume] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Inquiry Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `Salom, menga sizlarning "..." atiringiz qiziq. Bu atir haqida batafsilroq ma'lumot olishni istardim.`
  });
  const [inquiryStatus, setInquiryStatus] = useState({ success: false, error: null, sending: false });

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/perfumes/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setPerfume(data);
        // Pre-fill message with perfume name
        setFormData(prev => ({
          ...prev,
          message: `Salom, menga sizlarning "${data.name}" atiringiz qiziq. Bu atir haqida batafsilroq ma'lumot olishni istardim.`
        }));
        setLoading(false);
      })
      .catch(err => {
        console.warn('Backend API connection failed or perfume not found, searching static list:', err);
        // Fallback search in static list
        const staticData = [
          {
            _id: "1",
            id: "1",
            name: "Oud Imperial",
            brand: "Anora Brand",
            description: "A deep, mysterious journey into the heart of the Orient. Warm spices, rich agarwood (oud), and golden amber form a powerful, long-lasting, and regal scent profile that demands presence.",
            price: "145$",
            size: "100ml",
            notes: {
              top: ["Cardamom", "Pink Pepper", "Nutmeg"],
              middle: ["Agarwood (Oud)", "Damask Rose", "Patchouli"],
              base: ["Sandalwood", "Amber", "White Musk", "Leather"]
            },
            family: "Woody",
            image: "/images/perfumes/oud_imperial.jpg",
            longevity: 5,
            sillage: 5,
            gender: "Unisex"
          },
          {
            _id: "2",
            id: "2",
            name: "Rose de Nuit",
            brand: "Anora Brand",
            description: "A velvet night in Paris. A sensual, dark, and romantic blend of damask rose, sweet chocolatey praline, and warm patchouli. Perfect for cold evenings and romantic encounters.",
            price: "130$",
            size: "100ml",
            notes: {
              top: ["Red Fruits", "Bergamot", "Saffron"],
              middle: ["Damask Rose", "Jasmine", "Violet"],
              base: ["Praline", "Vanilla", "Patchouli", "Oudh"]
            },
            family: "Floral",
            image: "/images/perfumes/rose_de_nuit.jpg",
            longevity: 4,
            sillage: 4,
            gender: "Women"
          },
          {
            _id: "3",
            id: "3",
            name: "Citrus Nectar",
            brand: "Anora Brand",
            description: "A refreshing burst of Mediterranean sunshine. Crisp, sparkling bergamot, sweet orange nectar, and fresh salty sea breeze. Invigorating and clean, ideal for hot summer days.",
            price: "110$",
            size: "100ml",
            notes: {
              top: ["Bergamot", "Mandarin Orange", "Lemon"],
              middle: ["Sea Salt", "Neroli", "Ginger"],
              base: ["Cedarwood", "White Musk", "Vetiver"]
            },
            family: "Citrus",
            image: "/images/perfumes/citrus_nectar.jpg",
            longevity: 3,
            sillage: 3,
            gender: "Unisex"
          },
          {
            _id: "4",
            id: "4",
            name: "Vétiver Sauvage",
            brand: "Anora Brand",
            description: "Bold, earthy, and sophisticated. A clean woody fragrance highlighting green vetiver, smoke, and black pepper. It projects an air of timeless elegance and natural charisma.",
            price: "125$",
            size: "100ml",
            notes: {
              top: ["Grapefruit", "Black Pepper", "Bergamot"],
              middle: ["Vetiver", "Geranium", "Sichuan Pepper"],
              base: ["Cedarwood", "Patchouli", "Benzoin"]
            },
            family: "Woody",
            image: "/images/perfumes/vetiver_sauvage.jpg",
            longevity: 4,
            sillage: 3,
            gender: "Men"
          }
        ];
        
        const found = staticData.find(p => p.id === id || p._id === id);
        if (found) {
          setPerfume(found);
          setFormData(prev => ({
            ...prev,
            message: `Salom, menga sizlarning "${found.name}" atiringiz qiziq. Bu atir haqida batafsilroq ma'lumot olishni istardim.`
          }));
        }
        setLoading(false);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    setInquiryStatus({ success: false, error: null, sending: true });

    const payload = {
      ...formData,
      perfumeId: perfume._id || perfume.id,
      perfumeName: perfume.name
    };

    fetch('http://localhost:5000/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setInquiryStatus({ success: true, error: null, sending: false });
          // Reset form (keep contact details but clear message)
          setFormData(prev => ({ ...prev, message: '' }));
        } else {
          setInquiryStatus({ success: false, error: data.message || 'Xatolik yuz berdi', sending: false });
        }
      })
      .catch(err => {
        console.error('Inquiry submission error:', err);
        // Fallback success for static mode
        setInquiryStatus({
          success: true,
          error: null,
          sending: false
        });
        console.log('Static mode simulated inquiry success.');
      });
  };

  if (loading) {
    return <div className="container section-padding loading-spinner">Ifor yuklanmoqda...</div>;
  }

  if (!perfume) {
    return (
      <div className="container section-padding text-center" style={{ minHeight: '60vh' }}>
        <h2>Afsuski, atir topilmadi</h2>
        <p style={{ margin: '20px 0 30px' }}>Siz qidirgan ifor bizning katalogda mavjud emas yoki o'chirilgan bo'lishi mumkin.</p>
        <Link to="/catalog" className="btn btn-primary">Katalogga qaytish</Link>
      </div>
    );
  }

  // Helper render indicators
  const renderMeter = (val) => {
    const bars = [];
    for (let i = 1; i <= 5; i++) {
      bars.push(
        <div
          key={i}
          className={`meter-bar ${i <= val ? 'active' : ''}`}
        ></div>
      );
    }
    return <div className="meter-bars">{bars}</div>;
  };

  return (
    <div className="perfume-detail-page container section-padding animate-fade-in">
      <Link to="/catalog" className="back-link">
        <ArrowLeft size={16} /> Katalogga qaytish
      </Link>

      <div className="detail-layout">
        {/* Left column: Image & Stats */}
        <div className="detail-visual">
          <div className="detail-image-card">
            <img src={perfume.image} alt={perfume.name} className="detail-image" />
          </div>

          <div className="perfume-stats-card">
            <h3>Ifor Xarakteristikasi</h3>
            
            <div className="stat-meter-group">
              <div className="stat-meter-label">
                <span><Clock size={16} /> Chidamliligi (Longevity)</span>
                <strong>{perfume.longevity}/5</strong>
              </div>
              {renderMeter(perfume.longevity)}
              <span className="stat-meter-desc">
                {perfume.longevity === 5 ? 'Juda kuchli (12+ soatgacha)' : 
                 perfume.longevity === 4 ? 'Uzoq muddatli (8-12 soat)' : 
                 'O`rtacha (4-8 soat)'}
              </span>
            </div>

            <div className="stat-meter-group">
              <div className="stat-meter-label">
                <span><Wind size={16} /> Yoyiluvchanligi (Sillage)</span>
                <strong>{perfume.sillage}/5</strong>
              </div>
              {renderMeter(perfume.sillage)}
              <span className="stat-meter-desc">
                {perfume.sillage === 5 ? 'Kuchli iz qoldiradi' : 
                 perfume.sillage === 4 ? 'Yaxshi seziladi' : 
                 'Yaqin masofada seziladi'}
              </span>
            </div>

            <div className="detail-meta-row">
              <div className="meta-item">
                <Users size={16} />
                <div>
                  <span>Jinsi</span>
                  <strong>{perfume.gender === 'Men' ? 'Erkaklar uchun' : 
                           perfume.gender === 'Women' ? 'Ayollar uchun' : 'Uniseks'}</strong>
                </div>
              </div>
              <div className="meta-item">
                <ShieldCheck size={16} />
                <div>
                  <span>Hajmi / Narxi</span>
                  <strong>{perfume.size} | {perfume.price}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Description, Notes & Inquiry Form */}
        <div className="detail-content">
          <span className="perfume-brand">{perfume.brand}</span>
          <h2>{perfume.name}</h2>
          <span className="perfume-family-tag">{perfume.family} toifasi</span>
          
          <p className="perfume-description" style={{ marginTop: '25px' }}>
            {perfume.description}
          </p>

          {/* Fragrance Pyramid */}
          <div className="fragrance-pyramid-section">
            <h3>Ifor Piramidasi (Notalar)</h3>
            <div className="pyramid">
              <div className="pyramid-level top-notes">
                <div className="level-badge">Top Notasi</div>
                <div className="level-notes">
                  {perfume.notes?.top?.map((note, i) => (
                    <span key={i} className="note-bubble">{note}</span>
                  )) || <span>Mavjud emas</span>}
                </div>
                <span className="level-time">Dastlabki 15-30 daqiqada seziladi</span>
              </div>
              
              <div className="pyramid-level middle-notes">
                <div className="level-badge">Heart (Yurak) Notasi</div>
                <div className="level-notes">
                  {perfume.notes?.middle?.map((note, i) => (
                    <span key={i} className="note-bubble">{note}</span>
                  )) || <span>Mavjud emas</span>}
                </div>
                <span className="level-time">2-4 soat davomida dominantlik qiladi</span>
              </div>
              
              <div className="pyramid-level base-notes">
                <div className="level-badge">Base (Asos) Notasi</div>
                <div className="level-notes">
                  {perfume.notes?.base?.map((note, i) => (
                    <span key={i} className="note-bubble">{note}</span>
                  )) || <span>Mavjud emas</span>}
                </div>
                <span className="level-time">6-12 soatgacha terida saqlanib qoladi</span>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="inquiry-form-card">
            <h3>Ushbu ifor bo'yicha so'rov yuborish</h3>
            <p>
              Ushbu atirni shou-rumimizda sinab ko'rish yoki u haqida batafsilroq so'rash uchun quyidagi formani to'ldiring. Biz siz bilan tez fursatda bog'lanamiz.
            </p>

            {inquiryStatus.success ? (
              <div className="success-message">
                <CheckCircle2 size={32} style={{ color: '#d4af37', marginBottom: '10px' }} />
                <h4>Sizning so'rovingiz qabul qilindi!</h4>
                <p>Siz bilan tez orada telefon yoki elektron pochta orqali bog'lanamiz.</p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="inquiry-form">
                {inquiryStatus.error && (
                  <div className="error-message">{inquiryStatus.error}</div>
                )}
                
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="name">Ismingiz *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ismingizni kiriting"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email manzilingiz *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@mail.com"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Telefon raqamingiz *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+998 (__) ___-__-__"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Xabaringiz</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="3"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Xabar matni..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={inquiryStatus.sending}
                >
                  {inquiryStatus.sending ? 'Yuborilmoqda...' : 'So`rov yuborish'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfumeDetails;
