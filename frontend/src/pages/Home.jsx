import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Sparkles, Compass } from 'lucide-react';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [activeNoteTab, setActiveNoteTab] = useState('Woody');

  const noteCategories = {
    Woody: {
      title: "Woody (Yog'ochli)",
      description: "Sandal daraxti, sadr (cedarwood) va vetiver notalari. Bu iforlar o'ziga xos chuqurlik, mustahkamlik va yer isi bilan ajralib turadi. Issiq, sirli va doimiy.",
      vibes: "Erkaklik kuchi, olijanoblik, ishonch",
      link: "/catalog?family=Woody"
    },
    Floral: {
      title: "Floral (Gulli)",
      description: "Atirgul, yasmin, nilufar va binafsha notalari. Nafislik va tabiat go'zalligining uyg'unligi. Shirinroq, yengilroq va jozibador iforlar.",
      vibes: "Nafislik, romantika, ayollik latofati",
      link: "/catalog?family=Floral"
    },
    Citrus: {
      title: "Citrus (Sitrusli)",
      description: "Bergamot, limon, mandarin va greypfrut notalari. Tinchlantiruvchi va tetiklashtiruvchi toza energiya. Yozgi fasl uchun eng mukammal tanlov.",
      vibes: "Tetiklik, yengillik, yangi energiya",
      link: "/catalog?family=Citrus"
    },
    Oriental: {
      title: "Oriental (Sharqona)",
      description: "Amber, vanil, dolchin va ekzotik ziravorlar notalari. Chuqur, shirin, juda boy va unutilmas iforlar. Uzoq saqlanib qolishi bilan ajralib turadi.",
      vibes: "Sirli joziba, hashamat, kechki ehtiros",
      link: "/catalog?family=Oriental"
    }
  };

  useEffect(() => {
    // Fetch perfumes from API
    fetch('http://localhost:5000/api/perfumes')
      .then(res => res.json())
      .then(data => {
        // Take first 3 perfumes as featured
        setFeatured(data.slice(0, 3));
      })
      .catch(err => {
        console.warn('Backend API connection failed, using static featured perfumes:', err);
        // Fallback static data if backend is down
        setFeatured([
          {
            _id: "1",
            id: "1",
            name: "Oud Imperial",
            brand: "Anora Brand",
            family: "Woody",
            description: "A deep, mysterious journey into the heart of the Orient.",
            price: "145$",
            size: "100ml",
            image: "/images/perfumes/oud_imperial.jpg"
          },
          {
            _id: "2",
            id: "2",
            name: "Rose de Nuit",
            brand: "Anora Brand",
            family: "Floral",
            description: "A velvet night in Paris. A sensual blend of dark damask rose.",
            price: "130$",
            size: "100ml",
            image: "/images/perfumes/rose_de_nuit.jpg"
          },
          {
            _id: "3",
            id: "3",
            name: "Citrus Nectar",
            brand: "Anora Brand",
            family: "Citrus",
            description: "A refreshing burst of Mediterranean sunshine.",
            price: "110$",
            size: "100ml",
            image: "/images/perfumes/citrus_nectar.jpg"
          }
        ]);
      });
  }, []);

  return (
    <div className="home-page animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <p className="hero-subtitle animate-fade-in-up">Eksklyuziv Parfyumeriya Uyi</p>
          <h1 className="hero-title animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            O'ZINGIZNING MUKAMMAL <br />IFORINGIZNI KASHF ETING
          </h1>
          <p className="hero-desc animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Sotib olish uchun emas, his qilish uchun yaratilgan parfyumeriya asarlari. Noyob notalar va yuqori darajadagi hashamat katalogini ko'ring.
          </p>
          <div className="hero-actions animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Link to="/catalog" className="btn btn-primary">
              Kolleksiyani ko'rish <ArrowRight size={16} style={{ marginLeft: '8px' }} />
            </Link>
            <Link to="/contact" className="btn btn-secondary">
              Biz bilan bog'lanish
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Philosophy / Story */}
      <section className="brand-story section-padding">
        <div className="container grid-2">
          <div className="story-content">
            <span className="section-tag"><Sparkles size={14} /> Falsafamiz</span>
            <h2 className="left-aligned">Parfyumeriya - bu San'at</h2>
            <p className="story-lead">
              Biz atirlarni shunchaki mahsulot deb hisoblamaymiz. Biz uchun parfyumeriya — bu xotiralar, tuyg'ular va inson xarakterini so'zsiz ifodalovchi san'at turidir.
            </p>
            <p>
              Anora Brand shou-rumi eng nozik did egalari uchun dunyodagi eng noyob parfyumeriya notalarini yig'di. Biz mijozlarimizga iforlar olamini tadqiq qilish, ularning kelib chiqish tarixi va murakkab piramida notalari bilan yaqindan tanishish imkoniyatini taqdim etamiz. Ushbu katalog orqali siz o'zingizning ichki dunyongizga mos ifor profillarini topishingiz mumkin.
            </p>
            <div className="story-details-mini">
              <div className="story-stat">
                <span className="stat-num">100%</span>
                <span className="stat-label">Original</span>
              </div>
              <div className="story-stat">
                <span className="stat-num">4</span>
                <span className="stat-label">Ifor Oilasi</span>
              </div>
              <div className="story-stat">
                <span className="stat-num">Premium</span>
                <span className="stat-label">Sifat</span>
              </div>
            </div>
          </div>
          <div className="story-image-container">
            <div className="story-image-border"></div>
            <img src="/images/perfumes/oud_imperial.jpg" alt="Luxury Perfume Crafting" className="story-image" />
          </div>
        </div>
      </section>

      {/* Note Explorer (Interactive Scent Profile Wheel) */}
      <section className="note-explorer section-padding" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="center-header">
            <span className="section-tag"><Compass size={14} /> Ifor Olamini Tadqiq Eting</span>
            <h2>Ifor Oila Profillari</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto 40px' }}>
              Atirlar tarkibidagi dominant notalariga ko'ra bir necha oilalarga bo'linadi. O'zingizga yoqadigan oilani tanlang va uning xususiyatlarini bilib oling.
            </p>
          </div>

          <div className="note-tabs">
            {Object.keys(noteCategories).map((key) => (
              <button
                key={key}
                className={`note-tab-btn ${activeNoteTab === key ? 'active' : ''}`}
                onClick={() => setActiveNoteTab(key)}
              >
                {key}
              </button>
            ))}
          </div>

          <div className="note-tab-content">
            <div className="note-tab-card">
              <h3>{noteCategories[activeNoteTab].title}</h3>
              <p className="note-tab-description">{noteCategories[activeNoteTab].description}</p>
              <div className="note-tab-meta">
                <strong>Yetkazadigan tuyg'u (Vibe):</strong>
                <span>{noteCategories[activeNoteTab].vibes}</span>
              </div>
              <Link to={noteCategories[activeNoteTab].link} className="btn btn-gold-outline" style={{ marginTop: '20px' }}>
                Ushbu oiladagi atirlarni ko'rish <ArrowRight size={14} style={{ marginLeft: '6px' }} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Perfumes */}
      <section className="featured-section section-padding">
        <div className="container">
          <div className="center-header">
            <span className="section-tag"><Star size={14} /> Tanlangan Iforlar</span>
            <h2>Eng Mashhur Atirlarimiz</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto 40px' }}>
              Brendimizning eng ko'p e'tirof etilgan, har bir notasi bilan qalblarni zabt etgan durdona asarlari.
            </p>
          </div>

          <div className="perfume-grid">
            {featured.map((perfume) => (
              <div key={perfume._id || perfume.id} className="perfume-card">
                <div className="perfume-card-image-wrapper">
                  <img src={perfume.image} alt={perfume.name} className="perfume-card-image" />
                  <span className="perfume-card-badge">{perfume.family}</span>
                </div>
                <div className="perfume-card-info">
                  <span className="perfume-card-brand">{perfume.brand}</span>
                  <h3>{perfume.name}</h3>
                  <p className="perfume-card-desc">
                    {perfume.description.length > 90 ? `${perfume.description.substring(0, 90)}...` : perfume.description}
                  </p>
                  <div className="perfume-card-bottom">
                    <span className="perfume-card-meta">{perfume.size} | {perfume.price}</span>
                    <Link to={`/perfume/${perfume._id || perfume.id}`} className="perfume-card-link">
                      Tafsilotlar <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <Link to="/catalog" className="btn btn-primary">
              Barcha Atirlarni Ko'rish
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
