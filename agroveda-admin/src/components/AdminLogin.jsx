import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/AdminLogin.module.css";

const API = "http://localhost:5000";

export default function AdminLogin({ onLogin }) {
  const [form, setForm]         = useState({ email: "", password: "" });
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [dark, setDark]         = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError("Please fill in all fields before continuing."); return; }
    setLoading(true); setError("");
    try {
      const res = await axios.post(`${API}/admin/login`, form);
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminUser",  JSON.stringify(res.data.admin));
      onLogin(res.data.admin);
    } catch (err) {
      setError(err?.response?.data?.error || "Login failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className={styles.page}>

      {/* Left panel */}
      <div className={styles.leftPanel}>
        <div className={styles.logoRow}>
          <div className={styles.logoIcon}>
            <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
              <path d="M24 4C24 4 10 16 10 28C10 35.732 16.268 42 24 42C31.732 42 38 35.732 38 28C38 16 24 4 24 4Z" fill="#16a34a"/>
              <path d="M24 14C24 14 17 21 17 28C17 31.866 20.134 35 24 35" stroke="#f0fdf4" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className={styles.logoText}>Agroveda</span>
        </div>

        <div className={styles.hero}>
          <div className={styles.heroTag}>Admin platform</div>
          <h1 className={styles.heroTitle}>Manage everything<br/>from <em>one place.</em></h1>
          <p className={styles.heroSub}>A secure, centralised dashboard to oversee users, monitor platform health, and drive growth across the Agroveda ecosystem.</p>

          <div className={styles.statsGrid}>
            {[
              { val: "12", unit: "k", label: "Active users" },
              { val: "99", unit: "%", label: "Uptime" },
              { val: "4",  unit: "ms", label: "Avg response" },
            ].map(s => (
              <div key={s.label} className={styles.statCard}>
                <div className={styles.statVal}><span>{s.val}</span>{s.unit}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className={styles.dividerRow}>
            <div className={styles.dividerLine}/>
            <span className={styles.dividerText}>Dashboard access includes</span>
            <div className={styles.dividerLine}/>
          </div>

          <div className={styles.perks}>
            {[
              "Real-time analytics and growth charts",
              "Full user lifecycle management",
              "Role-based access and audit logs",
              "Content and notification controls",
            ].map(p => (
              <div key={p} className={styles.perk}>
                <div className={styles.perkDot}/>
                {p}
              </div>
            ))}
          </div>
        </div>

        <p className={styles.panelFooter}>© 2025 Agroveda · Admin Portal · v2.4.1</p>
      </div>

      {/* Right panel */}
      <div className={styles.rightPanel}>
        <button
          className={styles.themeBtn}
          onClick={() => setDark(d => !d)}
          aria-label="Toggle light/dark mode"
        >
          {dark ? "☀️" : "🌙"}
        </button>

        <div className={styles.formCard}>
          <div className={styles.secureBadge}>🔒 Restricted access</div>
          <h2 className={styles.formTitle}>Welcome back</h2>
          <p className={styles.formSub}>Sign in to your admin dashboard</p>

          {error && (
            <div className={styles.errorBox}>
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
              <label className={styles.label}>Admin email</label>
              <div className={styles.inputWrap}>
                <svg className={styles.inputIcon} width="16" height="16" viewBox="0 0 18 18" fill="none">
                  <rect x="1.5" y="3.5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M1.5 6.5L9 11L16.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input
                  className={styles.input}
                  type="email"
                  placeholder="admin@agroveda.com"
                  value={form.email}
                  onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setError(""); }}
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <div className={styles.inputWrap}>
                <svg className={styles.inputIcon} width="16" height="16" viewBox="0 0 18 18" fill="none">
                  <rect x="3.5" y="8" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M6 8V5.5a3 3 0 016 0V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input
                  className={styles.input}
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => { setForm(p => ({ ...p, password: e.target.value })); setError(""); }}
                  autoComplete="current-password"
                  style={{ paddingRight: "38px" }}
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPass(p => !p)}
                  aria-label="Toggle password visibility"
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? <span className={styles.spinner}/> : "Access dashboard →"}
            </button>
          </form>

          <div className={styles.formFoot}>
            <span className={styles.formFootTxt}>Authorised personnel only</span>
            <a href="#" className={styles.helpLink}>Need help?</a>
          </div>
        </div>
      </div>

    </div>
  );
}