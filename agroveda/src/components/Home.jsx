import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import styles from "../styles/Home.module.css";

const FEATURES = [

  {
    icon: "🌾",
    title: "Smart Crop Advisory",
    text: "AI-powered recommendations tailored to your soil type, season, and local climate — so every decision is backed by data.",
    link: "/crop-calendar",   // ← clickable
  },
  {
    icon: "🌦️",
    title: "Hyperlocal Weather Alerts",
    text: "Get real-time weather forecasts and extreme weather warnings directly for your farm's pincode, not a generic region.",
    link: "/weather",
  },
  {
    icon: "📊",
    title: "Crop recommendation",
    text: "Track mandi prices across 500+ markets in real time. Know when to sell and where to sell for maximum profit.",
    link: "/crop-recommendation",
  },

  {
    icon: "🧪",
    title: "Yield Predictor",
    text: "Predict your expected crop yield and total production using our AI model trained on real Indian agricultural data.",
    link: "/yield-predictor",
  },
  {
    icon: "💧",
    title: "Irrigation Planner",
    text: "Optimise water usage with our smart irrigation schedules that adapt to rainfall forecasts and crop growth stages.",
    link: null,
  },
  {
    icon: "🤖",
    title: "Market price Prediction",
    text: "Chat with our multilingual AI assistant 24/7 — ask in Hindi, Bengali, Tamil or English and get expert answers instantly.",
    link: "/market-prices",

  },
];

const STEPS = [
  {
    num: "01",
    title: "Create Your Profile",
    text: "Sign up and tell us about your farm — location, crop type, land size. Takes under 2 minutes.",
  },
  {
    num: "02",
    title: "Get Your Dashboard",
    text: "Instantly receive a personalised farm dashboard with weather, market prices and crop health scores.",
  },
  {
    num: "03",
    title: "Follow AI Advice",
    text: "Act on step-by-step guidance for sowing, fertilising, pest control and harvesting.",
  },
  {
    num: "04",
    title: "Grow & Earn More",
    text: "Track yield improvements, compare market prices and sell smarter with Agroveda's network.",
  },
];

export default function Home() {
  return (
    <div style={{ background: "var(--off-white, #FAFDF8)" }}>
      <Navbar />

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroBlob1} />
        <div className={styles.heroBlob2} />

        <div className={styles.heroContent}>
          <div className={styles.heroEyebrow}>
            🌱 India's Smartest Farm Platform
          </div>
          <h1 className={styles.heroTitle}>
            Where Ancient Wisdom<br />
            Meets <em>Modern Science</em>
          </h1>
          <p className={styles.heroSub}>
            Agroveda gives every farmer — from a small kisan to a large estate — the tools,
            intelligence and market access to grow more and earn more.
          </p>
          <div className={styles.heroCta}>
            <Link to="/signup" className={styles.btnPrimary}>
              Start for Free
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <button className={styles.btnSecondary} onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}>
              See How It Works
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.scrollHint}>
          <div className={styles.scrollDot} />
          <span>Scroll</span>
        </div>

        <div className={styles.heroStats}>
          {[
            { num: "12,000+", label: "Active Farmers" },
            { num: "18 States", label: "Pan India Coverage" },
            { num: "98%",      label: "Satisfaction Rate" },
            { num: "6 Languages", label: "Multilingual Support" },
          ].map((s) => (
            <div key={s.label} className={styles.heroStat}>
              <span className={styles.statNum}>{s.num}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className={styles.featuresWrap}>
        <div className={styles.section}>
          <span className={styles.sectionLabel}>What We Offer</span>
          <h2 className={styles.sectionTitle}>
            Everything your farm<br />
            <span>needs in one place</span>
          </h2>
          <p className={styles.sectionSub}>
            From seed selection to market timing — Agroveda covers every stage of the farming cycle with intelligent, data-driven tools.
          </p>
          <div className={styles.featuresGrid}>
            {FEATURES.map((f) =>
              f.link ? (
                // ── Clickable card ──
                <Link to={f.link} key={f.title} className={`${styles.featureCard} ${styles.featureCardLink}`}>
                  <div className={styles.featureIcon}>{f.icon}</div>
                  <h3 className={styles.featureTitle}>{f.title}</h3>
                  <p className={styles.featureText}>{f.text}</p>
                  <span className={styles.featureArrow}>
                    Explore →
                  </span>
                </Link>
              ) : (
                // ── Static card ──
                <div key={f.title} className={styles.featureCard}>
                  <div className={styles.featureIcon}>{f.icon}</div>
                  <h3 className={styles.featureTitle}>{f.title}</h3>
                  <p className={styles.featureText}>{f.text}</p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className={styles.sectionFull}>
        <div className={`${styles.howBg} ${styles.sectionFull}`} style={{ padding: 0 }}>
          <div className={`${styles.section} ${styles.howInner}`}>
            <span className={styles.sectionLabel}>Simple Process</span>
            <h2 className={styles.sectionTitle}>
              Get started in<br />
              <span style={{ color: "#FDE68A" }}>4 easy steps</span>
            </h2>
            <p className={styles.sectionSub}>
              No technical knowledge needed. If you can use a smartphone, you can use Agroveda.
            </p>
            <div className={styles.stepsGrid}>
              {STEPS.map((s) => (
                <div key={s.num} className={styles.stepCard}>
                  <div className={styles.stepNum}>{s.num}</div>
                  <h4 className={styles.stepTitle}>{s.title}</h4>
                  <p className={styles.stepText}>{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className={styles.section} style={{ textAlign: "center", maxWidth: "700px" }}>
        <span className={styles.sectionLabel}>Our Mission</span>
        <h2 className={styles.sectionTitle}>
          Built for the <span>Indian Farmer</span>
        </h2>
        <p style={{ fontSize: "1rem", color: "var(--text-light)", lineHeight: 1.75, marginBottom: "2.5rem" }}>
          Agroveda was founded with one goal — bridge the gap between traditional farming wisdom and modern agricultural science.
          We believe every farmer, regardless of land size or education, deserves access to the same tools that large agribusinesses use.
        </p>
        <Link to="/signup" className={styles.btnPrimary} style={{ display: "inline-flex" }}>
          Join Agroveda Free
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer id="contact" className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerTop}>
            <div className={styles.footerBrand}>
              <div className={styles.footerLogoRow}>
                <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
                  <path d="M24 4C24 4 10 16 10 28C10 35.732 16.268 42 24 42C31.732 42 38 35.732 38 28C38 16 24 4 24 4Z" fill="white" fillOpacity="0.8"/>
                  <path d="M24 14C24 14 17 21 17 28C17 31.866 20.134 35 24 35" stroke="#52B788" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
                <span className={styles.footerBrandName}>Agroveda</span>
              </div>
              <p className={styles.footerTagline}>
                Rooted in tradition. Growing with science. Empowering India's farming community since 2024.
              </p>
              <div className={styles.footerSocials}>
                {["𝕏", "f", "in", "📷"].map((s, i) => (
                  <a key={i} href="#" className={styles.socialBtn}>{s}</a>
                ))}
              </div>
            </div>
            <div className={styles.footerCol}>
              <h4>Platform</h4>
              <ul className={styles.footerLinks}>
                <li><a href="#features">Features</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><Link to="/crop-calendar">Crop Calendar</Link></li>
                <li><a href="#">Mobile App</a></li>
              </ul>
            </div>
            <div className={styles.footerCol}>
              <h4>Company</h4>
              <ul className={styles.footerLinks}>
                <li><a href="#about">About Us</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Press</a></li>
              </ul>
            </div>
            <div className={styles.footerCol}>
              <h4>Contact</h4>
              <ul className={styles.footerLinks}>
                <li><a href="mailto:hello@agroveda.com">hello@agroveda.com</a></li>
                <li><a href="#">+91 98765 43210</a></li>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <span>© 2025 Agroveda. All rights reserved.</span>
            <span className={styles.footerBadge}>🇮🇳 Made with ❤️ in India</span>
          </div>
        </div>
      </footer>
    </div>
  );
}