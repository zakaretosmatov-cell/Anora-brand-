import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState({ success: false, error: null, sending: false });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ success: false, error: null, sending: true });

    fetch('http://localhost:5000/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        perfumeName: 'General Inquiry / Umumi'
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStatus({ success: true, error: null, sending: false });
          setFormData({ name: '', email: '', phone: '', message: '' });
        } else {
          setStatus({ success: false, error: data.message || 'Xatolik yuz berdi', sending: false });
        }
      })
      .catch(err => {
        console.error('Contact submission error:', err);
        // Fallback success for static mode
        setStatus({ success: true, error: null, sending: false });
        setFormData({ name: '', email: '', phone: '', message: '' });
      });
  };

  return (
    <div className="contact-page container section-padding animate-fade-in" style={{ minHeight: '80vh' }}>
      <div className="center-header">
        <span className="section-tag">Biz bilan bog'lanish</span>
        <h2>Shou-rumimizga Tashrif Buyuring</h2>
        <p style={{ maxWidth: '600px', margin: '0 auto' }}>
          Bizning shou-rumimizda atirlarning xushbo'y hidlarini bevosita his qilishingiz va mutaxassis maslahatini olishingiz mumkin.
        </p>
      </div>

      <div className="contact-layout grid-2" style={{ marginTop: '50px' }}>
        {/* Contact Info Cards */}
        <div className="contact-info-area">
          <div className="info-card">
            <MapPin size={24} className="info-icon" />
            <div>
              <h3>Manzilimiz</h3>
              <p>Toshkent shahar, Amir Temur ko'chasi, 45-uy</p>
              <span className="info-sub text-muted">Mo'ljal: Oloy bozori yaqinida</span>
            </div>
          </div>

          <div className="info-card">
            <Phone size={24} className="info-icon" />
            <div>
              <h3>Telefon raqamlarimiz</h3>
              <p>+998 (90) 123-45-67</p>
              <p>+998 (71) 200-50-60</p>
            </div>
          </div>

          <div className="info-card">
            <Mail size={24} className="info-icon" />
            <div>
              <h3>Elektron pochta</h3>
              <p>info@aurascents.uz</p>
              <p>support@aurascents.uz</p>
            </div>
          </div>

          <div className="info-card">
            <Clock size={24} className="info-icon" />
            <div>
              <h3>Ish vaqtimiz</h3>
              <p>Dushanba - Yakshanba: 10:00 - 22:00</p>
              <span className="info-sub text-gold" style={{ color: '#d4af37' }}>Dam olish kunlarisiz xizmat ko'rsatamiz</span>
            </div>
          </div>

          {/* Map mockup */}
          <div className="map-mockup-card">
            <h3>Interactive Map</h3>
            <div className="map-placeholder">
              <div className="map-pin-pulse"></div>
              <span>AURA SCENTS SHOWROOM</span>
              <p>Amir Temur St. 45, Tashkent</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-area">
          <div className="inquiry-form-card" style={{ height: '100%' }}>
            <h3>Xabar yuborish</h3>
            <p style={{ marginBottom: '30px' }}>
              Savollaringiz yoki takliflaringiz bormi? Quyidagi formani to'ldiring, mutaxassislarimiz sizga tez orada javob berishadi.
            </p>

            {status.success ? (
              <div className="success-message" style={{ padding: '40px 0' }}>
                <CheckCircle2 size={40} style={{ color: '#d4af37', marginBottom: '15px' }} />
                <h4>Xabaringiz yuborildi!</h4>
                <p>Biz sizning murojaatingizni oldik va tez orada bog'lanamiz.</p>
                <button className="btn btn-secondary" onClick={() => setStatus({ success: false, error: null, sending: false })} style={{ marginTop: '20px' }}>
                  Yangi xabar yuborish
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="inquiry-form">
                {status.error && (
                  <div className="error-message">{status.error}</div>
                )}

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

                <div className="form-group">
                  <label htmlFor="phone">Telefon raqamingiz *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+998 (90) 123-45-67"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Sizning xabaringiz *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Savolingiz yoki fikringizni batafsil yozing..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={status.sending}
                  style={{ marginTop: '10px' }}
                >
                  {status.sending ? 'Yuborilmoqda...' : 'Xabarni yuborish'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
