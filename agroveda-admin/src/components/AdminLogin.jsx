import { useState } from "react";
import axios from "axios";
import styles from "../styles/Admin.module.css";

const API = "http://localhost:5000";

export default function AdminLogin({ onLogin }) {
  const [form, setForm]       = useState({ email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError("All fields required."); return; }
    setLoading(true); setError("");
    try {
      const res = await axios.post(`${API}/admin/login`, form);
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminUser",  JSON.stringify(res.data.admin));
      onLogin(res.data.admin);
    } catch (err) {
      setError(err?.response?.data?.error || "Login failed.");
    } finally { setLoading(false); }
  };

  return (
    <div className={styles.page}>
      {/* Left decorative panel */}
      <div className={styles.leftPanel}>
        <div className={styles.blob1} /><div className={styles.blob2} />
        <div className={styles.panelContent}>
          <div className={styles.logoRow}>
            <div className={styles.logoIcon}>
              <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
                <path d="M24 4C24 4 10 16 10 28C10 35.732 16.268 42 24 42C31.732 42 38 35.732 38 28C38 16 24 4 24 4Z" fill="white" fillOpacity="0.9"/>
                <path d="M24 14C24 14 17 21 17 28C17 31.866 20.134 35 24 35" stroke="#1a3a2a" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className={styles.logoText}>Agroveda</span>
          </div>
          <h1 className={styles.panelTitle}>Admin Control Centre</h1>
          <p className={styles.panelSub}>Monitor users, track growth and manage the Agroveda platform from one secure dashboard.</p>
          <div className={styles.featureList}>
            {["📊 Real-time analytics","👥 User management","📈 Growth charts","🔒 Secure access"].map(f => (
              <div key={f} className={styles.featureItem}>{f}</div>
            ))}
          </div>
        </div>
        <p className={styles.panelFooter}>© 2025 Agroveda · Admin Portal</p>
      </div>

      {/* Right login form */}
      <div className={styles.rightPanel}>
        <div className={styles.formCard}>
          <div className={styles.formTop}>
            <div className={styles.adminBadge}>🔐 ADMIN ACCESS</div>
            <h2 className={styles.formTitle}>Sign in to Dashboard</h2>
            <p className={styles.formSub}>Restricted to authorised personnel only</p>
          </div>

          {error && <div className={styles.errorBox}><span>⚠</span> {error}</div>}

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.field}>
              <label className={styles.label}>Admin Email</label>
              <div className={styles.inputWrap}>
                <svg className={styles.inputIcon} width="17" height="17" viewBox="0 0 18 18" fill="none">
                  <rect x="1.5" y="3.5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M1.5 6.5L9 11L16.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input className={styles.input} type="email" placeholder="admin@agroveda.com"
                  value={form.email} onChange={e => { setForm(p => ({...p, email: e.target.value})); setError(""); }}
                  autoComplete="email" autoFocus />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <div className={styles.inputWrap}>
                <svg className={styles.inputIcon} width="17" height="17" viewBox="0 0 18 18" fill="none">
                  <rect x="3.5" y="8" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M6 8V5.5a3 3 0 016 0V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input className={styles.input} type={showPass ? "text" : "password"}
                  placeholder="Enter password"
                  value={form.password} onChange={e => { setForm(p => ({...p, password: e.target.value})); setError(""); }}
                  autoComplete="current-password" />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(p => !p)}>
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : "Access Dashboard →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}