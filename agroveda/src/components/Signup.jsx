import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "../styles/Auth.module.css";

const PROFESSIONS = ["Farmer", "Agronomist", "Researcher", "Student", "Trader", "Other"];

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    full_name: "", email: "", password: "", confirm_password: "",
    address: "", gender: "", marital_status: "", profession: "", dob: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  const validateStep1 = () => {
    if (!form.full_name.trim()) return "Full name is required.";
    if (!form.email.trim()) return "Email is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Enter a valid email address.";
    if (!form.password) return "Password is required.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    if (form.password !== form.confirm_password) return "Passwords do not match.";
    return null;
  };

  const nextStep = () => {
    const err = validateStep1();
    if (err) { setError(err); return; }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { confirm_password, ...payload } = form;
    try {
      const res = await axios.post("http://localhost:5000/signup", payload);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.error || "Signup failed. Please try again.");
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
              <path d="M24 8C24 8 12 18 12 28C12 34.627 17.373 40 24 40C30.627 40 36 34.627 36 28C36 18 24 8 24 8Z" fill="white" fillOpacity="0.9"/>
              <path d="M24 16C24 16 18 22 18 28C18 31.314 20.686 34 24 34" stroke="#2D6A4F" strokeWidth="2" strokeLinecap="round"/>
              <path d="M24 14L24 38" stroke="rgba(45,106,79,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 3"/>
            </svg>
          </div>
          <h1 className={styles.brandName}>Agroveda</h1>
          <p className={styles.brandTagline}>Rooted in tradition. Growing with science.</p>
        </div>

        <div className={styles.panelContent}>
          <h2 className={styles.panelHeading}>
            Join thousands of<br />
            <span>thriving farmers</span>
          </h2>
          <p className={styles.panelText}>
            Get personalised crop advice, real-time weather alerts, and market intelligence — all in one place.
          </p>
          <div className={styles.featurePills}>
            <span className={styles.pill}>🌾 Personalised Plans</span>
            <span className={styles.pill}>💧 Irrigation Tips</span>
            <span className={styles.pill}>🧪 Soil Analysis</span>
            <span className={styles.pill}>📱 Mobile Ready</span>
          </div>
        </div>

        <div className={styles.panelFooter}>
          <div className={styles.statsRow}>
            <div className={styles.stat}><span className={styles.statNum}>Free</span><span className={styles.statLabel}>To Join</span></div>
            <div className={styles.statDivider} />
            <div className={styles.stat}><span className={styles.statNum}>18+</span><span className={styles.statLabel}>States</span></div>
            <div className={styles.statDivider} />
            <div className={styles.stat}><span className={styles.statNum}>6</span><span className={styles.statLabel}>Languages</span></div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className={styles.rightPanel}>
        <div className={`${styles.formCard} ${styles.formCardWide}`}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Create your account</h2>
            <p className={styles.formSubtitle}>Start your journey with Agroveda today</p>
          </div>

          {/* Step Indicator */}
          <div className={styles.stepIndicator}>
            <div className={`${styles.stepDot} ${step >= 1 ? styles.stepActive : ""}`}>
              <span>1</span>
            </div>
            <div className={`${styles.stepLine} ${step >= 2 ? styles.stepLineFilled : ""}`} />
            <div className={`${styles.stepDot} ${step >= 2 ? styles.stepActive : ""}`}>
              <span>2</span>
            </div>
            <div className={styles.stepLabels}>
              <span>Account</span>
              <span>Profile</span>
            </div>
          </div>

          {error && (
            <div className={styles.errorBanner}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#DC2626" strokeWidth="1.5"/><path d="M8 5v3M8 10.5v.5" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round"/></svg>
              {error}
            </div>
          )}

          {step === 1 ? (
            <div className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="full_name">Full Name</label>
                <div className={styles.inputWrap}>
                  <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="6.5" r="3" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M2.5 15c0-3.038 2.91-5.5 6.5-5.5s6.5 2.462 6.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <input id="full_name" name="full_name" type="text" className={styles.input}
                    placeholder="Rajan Kumar" value={form.full_name} onChange={handleChange} autoComplete="name" />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="su-email">Email Address</label>
                <div className={styles.inputWrap}>
                  <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="1.5" y="3.5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M1.5 6.5L9 11L16.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <input id="su-email" name="email" type="email" className={styles.input}
                    placeholder="you@example.com" value={form.email} onChange={handleChange} autoComplete="email" />
                </div>
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="su-password">Password</label>
                  <div className={styles.inputWrap}>
                    <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <rect x="3.5" y="8" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M6 8V5.5a3 3 0 016 0V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <input id="su-password" name="password" type={showPass ? "text" : "password"}
                      className={styles.input} placeholder="Min 6 characters"
                      value={form.password} onChange={handleChange} autoComplete="new-password" />
                    <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(p => !p)}>
                      {showPass ? (
                        <svg width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M1 9C2.5 5.5 5.5 3 9 3s6.5 2.5 8 6c-1.5 3.5-4.5 6-8 6s-6.5-2.5-8-6z" stroke="currentColor" strokeWidth="1.5"/><circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M3 3l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M1 9C2.5 5.5 5.5 3 9 3s6.5 2.5 8 6c-1.5 3.5-4.5 6-8 6s-6.5-2.5-8-6z" stroke="currentColor" strokeWidth="1.5"/><circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5"/></svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="confirm_password">Confirm Password</label>
                  <div className={styles.inputWrap}>
                    <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <rect x="3.5" y="8" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M6 8V5.5a3 3 0 016 0V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <input id="confirm_password" name="confirm_password" type="password"
                      className={styles.input} placeholder="Repeat password"
                      value={form.confirm_password} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <button type="button" className={styles.submitBtn} onClick={nextStep}>
                Continue <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="dob">Date of Birth</label>
                  <div className={styles.inputWrap}>
                    <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <rect x="2" y="4" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M6 2v4M12 2v4M2 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <input id="dob" name="dob" type="date" className={`${styles.input} ${styles.dateInput}`}
                      value={form.dob} onChange={handleChange} />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="gender">Gender</label>
                  <div className={styles.inputWrap}>
                    <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <circle cx="9" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M9 12v4M7 15h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <select id="gender" name="gender" className={`${styles.input} ${styles.select}`}
                      value={form.gender} onChange={handleChange}>
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other / Prefer not to say</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="marital_status">Marital Status</label>
                  <div className={styles.inputWrap}>
                    <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M5 9l2.5 2.5L13 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                    <select id="marital_status" name="marital_status" className={`${styles.input} ${styles.select}`}
                      value={form.marital_status} onChange={handleChange}>
                      <option value="">Select status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Widowed">Widowed</option>
                      <option value="Divorced">Divorced</option>
                    </select>
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="profession">Profession</label>
                  <div className={styles.inputWrap}>
                    <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <rect x="2" y="8" width="14" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M6 8V6a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <select id="profession" name="profession" className={`${styles.input} ${styles.select}`}
                      value={form.profession} onChange={handleChange}>
                      <option value="">Select profession</option>
                      {PROFESSIONS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="address">Address</label>
                <div className={styles.inputWrap}>
                  <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 1.5C6.515 1.5 4.5 3.515 4.5 6c0 3.75 4.5 10.5 4.5 10.5S13.5 9.75 13.5 6c0-2.485-2.015-4.5-4.5-4.5z" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="9" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  <input id="address" name="address" type="text" className={styles.input}
                    placeholder="Village, District, State" value={form.address} onChange={handleChange} />
                </div>
              </div>

              <div className={styles.stepBtns}>
                <button type="button" className={styles.backBtn} onClick={() => { setStep(1); setError(""); }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Back
                </button>
                <button type="submit" className={styles.submitBtn} style={{ flex: 1 }} disabled={loading}>
                  {loading ? <span className={styles.spinner} /> : <>Create Account <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></>}
                </button>
              </div>
            </form>
          )}

          <div className={styles.divider}><span>or</span></div>

          <p className={styles.switchText}>
            Already have an account?{" "}
            <Link to="/login" className={styles.switchLink}>Sign in →</Link>
          </p>
        </div>

        <p className={styles.bottomNote}>
          © 2025 Agroveda · Empowering Indian Farmers
        </p>
      </div>
    </div>
  );
}