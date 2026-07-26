import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowRight, X } from 'lucide-react';

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [perfumes, setPerfumes] = useState([]);
  const [filteredPerfumes, setFilteredPerfumes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFamily, setSelectedFamily] = useState(searchParams.get('family') || 'All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [selectedLongevity, setSelectedLongevity] = useState('All');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    // Read query parameter for family filter if changed externally
    const familyParam = searchParams.get('family');
    if (familyParam) {
      setSelectedFamily(familyParam);
    }
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/perfumes')
      .then(res => res.json())
      .then(data => {
        setPerfumes(data);
        setLoading(false);
      })
      .catch(err => {
        console.warn('Backend API connection failed, using static catalog:', err);
        const staticData = [
          {
            _id: "1",
            id: "1",
            name: "Oud Imperial",
            brand: "Anora Brand",
            description: "A deep, mysterious journey into the heart of the Orient. Warm spices, rich agarwood (oud), and golden amber form a powerful, long-lasting, and regal scent profile.",
            price: "145$",
            size: "100ml",
            notes: { top: ["Cardamom", "Pink Pepper"], middle: ["Oud", "Rose"], base: ["Sandalwood", "Amber"] },
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
            description: "A velvet night in Paris. A sensual, dark, and romantic blend of damask rose, sweet chocolatey praline, and warm patchouli.",
            price: "130$",
            size: "100ml",
            notes: { top: ["Red Fruits", "Bergamot"], middle: ["Damask Rose", "Jasmine"], base: ["Praline", "Vanilla"] },
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
            description: "A refreshing burst of Mediterranean sunshine. Crisp, sparkling bergamot, sweet orange nectar, and fresh salty sea breeze.",
            price: "110$",
            size: "100ml",
            notes: { top: ["Bergamot", "Mandarin"], middle: ["Sea Salt", "Neroli"], base: ["Cedarwood", "Musk"] },
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
            description: "Bold, earthy, and sophisticated. A clean woody fragrance highlighting green vetiver, smoke, and black pepper.",
            price: "125$",
            size: "100ml",
            notes: { top: ["Grapefruit", "Black Pepper"], middle: ["Vetiver", "Geranium"], base: ["Cedarwood", "Patchouli"] },
            family: "Woody",
            image: "/images/perfumes/vetiver_sauvage.jpg",
            longevity: 4,
            sillage: 3,
            gender: "Men"
          }
        ];
        setPerfumes(staticData);
        setLoading(false);
      });
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = perfumes;

    // Search query filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.family.toLowerCase().includes(q) ||
          (p.notes &&
            (p.notes.top.some(n => n.toLowerCase().includes(q)) ||
              p.notes.middle.some(n => n.toLowerCase().includes(q)) ||
              p.notes.base.some(n => n.toLowerCase().includes(q))))
      );
    }

    // Family filter
    if (selectedFamily !== 'All') {
      result = result.filter(p => p.family === selectedFamily);
    }

    // Gender filter
    if (selectedGender !== 'All') {
      result = result.filter(p => p.gender === selectedGender);
    }

    // Longevity filter
    if (selectedLongevity !== 'All') {
      result = result.filter(p => p.longevity >= parseInt(selectedLongevity));
    }

    setFilteredPerfumes(result);
  }, [perfumes, searchQuery, selectedFamily, selectedGender, selectedLongevity]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedFamily('All');
    setSelectedGender('All');
    setSelectedLongevity('All');
    setSearchParams({});
  };

  const handleFamilyChange = (family) => {
    setSelectedFamily(family);
    if (family === 'All') {
      searchParams.delete('family');
    } else {
      searchParams.set('family', family);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="catalog-page container section-padding animate-fade-in" style={{ minHeight: '80vh' }}>
      <div className="center-header">
        <span className="section-tag">Eksklyuziv To'plam</span>
        <h2>Atirlar Katalogi</h2>
        <p style={{ maxWidth: '600px', margin: '0 auto' }}>
          Bizning barcha premium iforlarimiz to'plami. Ularning hid notalari, xususiyatlari va oilalari bilan tanishing.
        </p>
      </div>

      {/* Control / Search Panel */}
      <div className="catalog-controls">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Atir nomi, brendi yoki notalari bo'yicha qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>
              <X size={16} />
            </button>
          )}
        </div>
        <button className="btn btn-secondary filter-toggle-btn" onClick={() => setShowMobileFilters(!showMobileFilters)}>
          <SlidersHorizontal size={16} style={{ marginRight: '8px' }} /> Filtrlar
        </button>
      </div>

      <div className="catalog-layout">
        {/* Sidebar Filters */}
        <aside className={`filter-sidebar ${showMobileFilters ? 'active' : ''}`}>
          <div className="sidebar-header">
            <h3>Filtrlar</h3>
            <button className="close-filters-btn" onClick={() => setShowMobileFilters(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="filter-group">
            <h4>Ifor Oilasi</h4>
            <div className="filter-options">
              {['All', 'Woody', 'Floral', 'Citrus', 'Oriental'].map(fam => (
                <button
                  key={fam}
                  className={`filter-opt-btn ${selectedFamily === fam ? 'active' : ''}`}
                  onClick={() => handleFamilyChange(fam)}
                >
                  {fam === 'All' ? 'Barchasi' : fam}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h4>Kimlar uchun (Gender)</h4>
            <div className="filter-options">
              {[
                { key: 'All', label: 'Barchasi' },
                { key: 'Men', label: 'Erkaklar' },
                { key: 'Women', label: 'Ayollar' },
                { key: 'Unisex', label: 'Uniseks (Barcha)' }
              ].map(gen => (
                <button
                  key={gen.key}
                  className={`filter-opt-btn ${selectedGender === gen.key ? 'active' : ''}`}
                  onClick={() => setSelectedGender(gen.key)}
                >
                  {gen.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h4>Chidamlilik darajasi (Longevity)</h4>
            <div className="filter-options">
              {[
                { key: 'All', label: 'Barchasi' },
                { key: '5', label: 'A' + 'lo (5/5)' },
                { key: '4', label: 'Yaxshi (4/5+)' },
                { key: '3', label: 'O`rtacha (3/5+)' }
              ].map(long => (
                <button
                  key={long.key}
                  className={`filter-opt-btn ${selectedLongevity === long.key ? 'active' : ''}`}
                  onClick={() => setSelectedLongevity(long.key)}
                >
                  {long.label}
                </button>
              ))}
            </div>
          </div>

          <button className="btn btn-gold-outline w-100" onClick={resetFilters} style={{ marginTop: '20px', width: '100%' }}>
            Filtrlarni tozalash
          </button>
        </aside>

        {/* Catalog Grid */}
        <main className="catalog-grid-area">
          {loading ? (
            <div className="loading-spinner">Yuklanmoqda...</div>
          ) : filteredPerfumes.length === 0 ? (
            <div className="no-results">
              <p>Sizning so'rovingiz bo'yicha hech qanday atir topilmadi.</p>
              <button className="btn btn-secondary" onClick={resetFilters} style={{ marginTop: '20px' }}>
                Barcha atirlarni ko'rish
              </button>
            </div>
          ) : (
            <div className="perfume-grid">
              {filteredPerfumes.map(perfume => (
                <div key={perfume._id || perfume.id} className="perfume-card">
                  <div className="perfume-card-image-wrapper">
                    <img src={perfume.image} alt={perfume.name} className="perfume-card-image" />
                    <span className="perfume-card-badge">{perfume.family}</span>
                  </div>
                  <div className="perfume-card-info">
                    <span className="perfume-card-brand">{perfume.brand}</span>
                    <h3>{perfume.name}</h3>
                    <p className="perfume-card-desc">
                      {perfume.description.length > 100 ? `${perfume.description.substring(0, 100)}...` : perfume.description}
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
          )}
        </main>
      </div>
    </div>
  );
};

export default Catalog;
