import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "../styles/Auth.module.css";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {

      const res = await axios.post("http://localhost:5000/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Left Panel */}
      <div className={styles.leftPanel}>
        <div className={styles.leafDecor1} />
        <div className={styles.leafDecor2} />
        <div className={styles.brandBlock}>
          <div className={styles.logoMark}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="24" fill="rgba(255,255,255,0.15)" />
              <path d="M24 8C24 8 12 18 12 28C12 34.627 17.373 40 24 40C30.627 40 36 34.627 36 28C36 18 24 8 24 8Z" fill="white" fillOpacity="0.9" />
              <path d="M24 16C24 16 18 22 18 28C18 31.314 20.686 34 24 34" stroke="#2D6A4F" strokeWidth="2" strokeLinecap="round" />
              <path d="M24 14L24 38" stroke="rgba(45,106,79,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 3" />
            </svg>
          </div>
          <h1 className={styles.brandName}>Agroveda</h1>
          <p className={styles.brandTagline}>Rooted in tradition. Growing with science.</p>
        </div>

        <div className={styles.panelContent}>
          <h2 className={styles.panelHeading}>
            Cultivating a<br />
            <span>smarter harvest</span>
          </h2>
          <p className={styles.panelText}>
            Your intelligent partner for sustainable farming — from soil health to market insights.
          </p>
          <div className={styles.featurePills}>
            <span className={styles.pill}>🌱 Crop Advisory</span>
            <span className={styles.pill}>🌦️ Weather Alerts</span>
            <span className={styles.pill}>📊 Market Prices</span>
            <span className={styles.pill}>🤖 AI Insights</span>
          </div>
        </div>

        <div className={styles.panelFooter}>
          <div className={styles.statsRow}>
            <div className={styles.stat}><span className={styles.statNum}>12K+</span><span className={styles.statLabel}>Farmers</span></div>
            <div className={styles.statDivider} />
            <div className={styles.stat}><span className={styles.statNum}>98%</span><span className={styles.statLabel}>Satisfaction</span></div>
            <div className={styles.statDivider} />
            <div className={styles.stat}><span className={styles.statNum}>24/7</span><span className={styles.statLabel}>Support</span></div>
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className={styles.rightPanel}>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Welcome back</h2>
            <p className={styles.formSubtitle}>Sign in to your Agroveda account</p>
          </div>

          {error && (
            <div className={styles.errorBanner}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#DC2626" strokeWidth="1.5" /><path d="M8 5v3M8 10.5v.5" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" /></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">Email Address</label>
              <div className={styles.inputWrap}>
                <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="1.5" y="3.5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M1.5 6.5L9 11L16.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={styles.input}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className={styles.field}>
              <div className={styles.labelRow}>
                <label className={styles.label} htmlFor="password">Password</label>
                <a href="#" className={styles.forgotLink}>Forgot password?</a>
              </div>
              <div className={styles.inputWrap}>
                <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="3.5" y="8" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M6 8V5.5a3 3 0 016 0V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <input
                  id="password"
                  name="password"
                  type={showPass ? "text" : "password"}
                  className={styles.input}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPass((p) => !p)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M1 9C2.5 5.5 5.5 3 9 3s6.5 2.5 8 6c-1.5 3.5-4.5 6-8 6s-6.5-2.5-8-6z" stroke="currentColor" strokeWidth="1.5" /><circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" /><path d="M3 3l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M1 9C2.5 5.5 5.5 3 9 3s6.5 2.5 8 6c-1.5 3.5-4.5 6-8 6s-6.5-2.5-8-6z" stroke="currentColor" strokeWidth="1.5" /><circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" /></svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? (
                <span className={styles.spinner} />
              ) : (
                <>Sign In <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></>
              )}
            </button>
          </form>

          <div className={styles.divider}><span>or</span></div>

          <p className={styles.switchText}>
            Don't have an account?{" "}
            <Link to="/signup" className={styles.switchLink}>Create one free →</Link>
          </p>
        </div>

        <p className={styles.bottomNote}>
          © 2025 Agroveda · Empowering Indian Farmers
        </p>
      </div>
    </div>
  );
}