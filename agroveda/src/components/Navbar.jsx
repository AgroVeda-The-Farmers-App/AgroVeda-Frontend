import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/Navbar.module.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Read user from localStorage on mount + on route change
  useEffect(() => {
    const stored = localStorage.getItem("user");
    setUser(stored ? JSON.parse(stored) : null);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const scrollTo = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // First name only for display
  const firstName = user?.full_name?.split(" ")[0] || "";

  return (
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
            <li><Link to="/news" className={styles.navLink}>News</Link></li>
        </ul>

        {/* Desktop CTA — changes based on auth state */}
        <div className={styles.actions}>
          {user ? (
            // ── LOGGED IN ──
            <div className={styles.userMenu}>
              <div className={styles.userAvatar}>
                {firstName.charAt(0).toUpperCase()}
              </div>
              <span className={styles.userName}>Hi, {firstName}!</span>
              <button className={styles.btnLogout} onClick={handleLogout}>
                Log Out
              </button>
            </div>
          ) : (
            // ── LOGGED OUT ──
            <>
              <Link to="/login" className={styles.btnLogin}>Log In</Link>
              <Link to="/signup" className={styles.btnSignup}>Get Started</Link>
            </>
          )}
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
            {user ? (
              <>
                <span className={styles.mobileUserName}>👋 {firstName}</span>
                <button className={styles.btnLogout} onClick={handleLogout}>Log Out</button>
              </>
            ) : (
              <>
                <Link to="/login" className={styles.btnLogin}>Log In</Link>
                <Link to="/signup" className={styles.btnSignup}>Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}