import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../styles/Navbar.module.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => setMenuOpen(false), [location]);

  const scrollTo = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const isActive = (hash) => location.hash === hash;

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : styles.navTransparent}`}>
        <div className={styles.navInner}>
          {/* Brand */}
          <Link to="/" className={styles.brand}>
            <div className={styles.logoMark}>
              <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
                <path d="M24 4C24 4 10 16 10 28C10 35.732 16.268 42 24 42C31.732 42 38 35.732 38 28C38 16 24 4 24 4Z" fill="white" fillOpacity="0.9"/>
                <path d="M24 14C24 14 17 21 17 28C17 31.866 20.134 35 24 35" stroke="#2D6A4F" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className={styles.brandName}>Agroveda</span>
          </Link>

          {/* Desktop Links */}
          <ul className={styles.links}>
            <li><button className={styles.navLink} onClick={() => scrollTo("features")}>Features</button></li>
            <li><button className={styles.navLink} onClick={() => scrollTo("how-it-works")}>How It Works</button></li>
            <li><button className={styles.navLink} onClick={() => scrollTo("about")}>About Us</button></li>
            <li><button className={styles.navLink} onClick={() => scrollTo("contact")}>Contact</button></li>
          </ul>

          {/* Desktop CTA */}
          <div className={styles.actions}>
            <Link to="/login" className={styles.btnLogin}>Log In</Link>
            <Link to="/signup" className={styles.btnSignup}>Get Started</Link>
          </div>

          {/* Hamburger */}
          <button
            className={`${styles.hamburger} ${menuOpen ? styles.open : ""}`}
            onClick={() => setMenuOpen(p => !p)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className={styles.mobileMenu}>
            <button className={styles.navLink} onClick={() => scrollTo("features")}>Features</button>
            <button className={styles.navLink} onClick={() => scrollTo("how-it-works")}>How It Works</button>
            <button className={styles.navLink} onClick={() => scrollTo("about")}>About Us</button>
            <button className={styles.navLink} onClick={() => scrollTo("contact")}>Contact</button>
            <div className={styles.mobileActions}>
              <Link to="/login" className={styles.btnLogin}>Log In</Link>
              <Link to="/signup" className={styles.btnSignup}>Get Started</Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}