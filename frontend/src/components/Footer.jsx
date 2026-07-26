import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-info">
            <h3>ANORA <span>BRAND</span></h3>
            <p>
              Parfyumeriya san'atining eng noyob va sara namunalarini o'zida jamlagan eksklyuziv katalog-sayt. Har bir hid — bu alohida hikoya.
            </p>
            <div className="social-links">
              <a href="https://t.me/anorabrand" target="_blank" rel="noreferrer" className="social-icon" aria-label="Telegram">
                <Send size={18} />
              </a>
              <a href="https://instagram.com/anorabrand" target="_blank" rel="noreferrer" className="social-icon" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://facebook.com/anorabrand" target="_blank" rel="noreferrer" className="social-icon" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>

          <div className="footer-links">
            <h4>Sahifalar</h4>
            <ul>
              <li><Link to="/">Bosh sahifa</Link></li>
              <li><Link to="/catalog">Katalog</Link></li>
              <li><Link to="/contact">Aloqa</Link></li>
              <li><Link to="/admin">Admin boshqaruvi</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Kolleksiyalar</h4>
            <ul>
              <li><Link to="/catalog?family=Woody">Woody (Yog'ochli)</Link></li>
              <li><Link to="/catalog?family=Floral">Floral (Gulli)</Link></li>
              <li><Link to="/catalog?family=Citrus">Citrus (Sitrusli)</Link></li>
              <li><Link to="/catalog?family=Oriental">Oriental (Sharqona)</Link></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Kontaktlar</h4>
            <p><MapPin size={16} className="text-gold" style={{ color: '#d4af37' }} /> Toshkent sh., Amir Temur ko'chasi, 45-uy</p>
            <p><Phone size={16} className="text-gold" style={{ color: '#d4af37' }} /> +998 (90) 123-45-67</p>
            <p><Mail size={16} className="text-gold" style={{ color: '#d4af37' }} /> info@anorabrand.uz</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Anora Brand. Barcha huquqlar himoyalangan.</p>
          <p style={{ color: '#666' }}>Eksklyuziv Atirlar Shou-rumi (Catalog Showcase only)</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
