import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import styles from "../styles/Signup.module.css";

const TOTAL = 9;

export default function Signup() {
  const navigate = useNavigate();
  const [lang, setLang] = useState("en");
  const t = T[lang];
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    language: "en", full_name: "", phone_no: "", dob: "",
    gender: "", marital_status: "", profession: "",
    address: "", email: "", password: "", confirm_password: "",
  });

  const patch = (field, val) => { setForm(p => ({ ...p, [field]: val })); setError(""); };

  const validate = () => {
    if (step === 1 && !form.full_name.trim()) return t.errName;
    if (step === 2 && !/^\d{10}$/.test(form.phone_no)) return t.errPhone;
    if (step === 3 && !form.dob) return t.errDob;
    if (step === 4 && !form.gender) return t.errGender;
    if (step === 5 && !form.marital_status) return t.errMarital;
    if (step === 6 && !form.profession) return t.errProfession;
    if (step === 7 && !form.address.trim()) return t.errAddress;
    if (step === 8) {
      if (!/^\S+@\S+\.\S+$/.test(form.email)) return t.errEmail;
      if (form.password.length < 6) return t.errPassword;
      if (form.password !== form.confirm_password) return t.errConfirm;
    }
    return null;
  };

  const next = () => { const e = validate(); if (e) { setError(e); return; } setStep(s => s + 1); setError(""); };
  const back = () => { setStep(s => s - 1); setError(""); };

  const submit = async () => {
    const e = validate(); if (e) { setError(e); return; }
    setLoading(true);
    const { confirm_password, ...payload } = form;
    try {
      const res = await axios.post("http://localhost:5000/signup", payload);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.error || t.errServer);
    } finally { setLoading(false); }
  };

  const titles = [t.chooseLanguage, t.stepName, t.stepPhone, t.stepDob,
  t.stepGender, t.stepMarital, t.stepProfession, t.stepAddress, t.stepAccount];
  const progress = (step / (TOTAL - 1)) * 100;

  return (
    <div className={styles.suPage}>
      <div className={`${styles.blob} ${styles.blob1}`} />
      <div className={`${styles.blob} ${styles.blob2}`} />
      <div className={`${styles.blob} ${styles.blob3}`} />

      <div className={styles.topbar}>
        <div className={styles.brand}>
          <svg width="30" height="30" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="24" fill="rgba(255,255,255,0.15)" />
            <path d="M24 8C24 8 12 18 12 28C12 34.627 17.373 40 24 40C30.627 40 36 34.627 36 28C36 18 24 8 24 8Z" fill="white" fillOpacity="0.9" />
            <path d="M24 16C24 16 18 22 18 28C18 31.314 20.686 34 24 34" stroke="#2D6A4F" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <span className={styles.brandName}>{t.brand}</span>
        </div>
        <p className={styles.signinHint}>
          {t.alreadyHave} <Link to="/login" className={styles.signinLink}>{t.signIn}</Link>
        </p>
      </div>

      <div className={styles.center}>
        <div className={styles.card} key={step}>
          {step > 0 && (
            <div className={styles.progressWrap}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
              </div>
              <span className={styles.stepCount}>{step} {t.of} {TOTAL - 1}</span>
            </div>
          )}

          <h2 className={styles.stepTitle}>{titles[step]}</h2>

          {error && (
            <div className={styles.error}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="#DC2626" strokeWidth="1.5" />
                <path d="M8 5v3M8 10.5v.5" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {error}
            </div>
          )}

          {step === 0 && (
            <div className={styles.body}>
              <p className={styles.subtitle}>{t.languageSubtitle}</p>
              <div className={styles.langGrid}>
                {[{ code: "en", flag: "🇬🇧", label: "English", native: "English" }, { code: "bn", flag: "🇮🇳", label: "Bengali", native: "বাংলা" }].map(({ code, flag, label, native }) => (
                  <button key={code} className={`${styles.langBtn} ${lang === code ? styles.langActive : ""}`}
                    onClick={() => {
                      setLang(code);
                      patch("language", code);
                      // Trigger Google Translate
                      const select = document.querySelector(".goog-te-combo");
                      if (select) {
                        select.value = code; // "en" or "bn"
                        select.dispatchEvent(new Event("change"));
                      }
                    }}>
                    <span className={styles.langFlag}>{flag}</span>
                    <span className={styles.langLabel}>{label}</span>
                    <span className={styles.langNative}>{native}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className={styles.body}>
              <input className={`${styles.input} ${styles.inputLg}`} type="text"
                placeholder={t.namePlaceholder} value={form.full_name}
                onChange={e => patch("full_name", e.target.value)}
                onKeyDown={e => e.key === "Enter" && next()} autoFocus />
              <p className={styles.hint}>{t.nameHint}</p>
            </div>
          )}

          {step === 2 && (
            <div className={styles.body}>
              <div className={styles.phoneWrap}>
                <span className={styles.phoneCode}>+91</span>
                <input className={`${styles.input} ${styles.inputPhone}`} type="tel"
                  placeholder={t.phonePlaceholder} value={form.phone_no}
                  onChange={e => patch("phone_no", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  onKeyDown={e => e.key === "Enter" && next()} autoFocus />
              </div>
              <p className={styles.hint}>{t.phoneHint}</p>
            </div>
          )}

          {step === 3 && (
            <div className={styles.body}>
              <input className={`${styles.input} ${styles.inputLg}`} type="date"
                value={form.dob} onChange={e => patch("dob", e.target.value)} autoFocus />
              <p className={styles.hint}>{t.dobHint}</p>
            </div>
          )}

          {step === 4 && (
            <div className={styles.body}>
              <div className={styles.choiceGrid}>
                {[{ val: "Male", label: t.male, icon: "👨‍🌾" }, { val: "Female", label: t.female, icon: "👩‍🌾" }, { val: "Other", label: t.other, icon: "🌿" }].map(({ val, label, icon }) => (
                  <button key={val} className={`${styles.choiceBtn} ${form.gender === val ? styles.choiceActive : ""}`} onClick={() => patch("gender", val)}>
                    <span className={styles.choiceIcon}>{icon}</span><span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className={styles.body}>
              <div className={`${styles.choiceGrid} ${styles.choiceGrid2}`}>
                {[{ val: "Single", label: t.single, icon: "🌱" }, { val: "Married", label: t.married, icon: "🌾" }, { val: "Widowed", label: t.widowed, icon: "🍂" }, { val: "Divorced", label: t.divorced, icon: "🌿" }].map(({ val, label, icon }) => (
                  <button key={val} className={`${styles.choiceBtn} ${form.marital_status === val ? styles.choiceActive : ""}`} onClick={() => patch("marital_status", val)}>
                    <span className={styles.choiceIcon}>{icon}</span><span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className={styles.body}>
              <div className={`${styles.choiceGrid} ${styles.choiceGrid2}`}>
                {[{ val: "Farmer", label: t.farmer, icon: "🌾" }, { val: "Agronomist", label: t.agronomist, icon: "🔬" }, { val: "Researcher", label: t.researcher, icon: "📊" }, { val: "Student", label: t.student, icon: "📚" }, { val: "Trader", label: t.trader, icon: "🏪" }, { val: "Other", label: t.otherProf, icon: "✨" }].map(({ val, label, icon }) => (
                  <button key={val} className={`${styles.choiceBtn} ${form.profession === val ? styles.choiceActive : ""}`} onClick={() => patch("profession", val)}>
                    <span className={styles.choiceIcon}>{icon}</span><span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 7 && (
            <div className={styles.body}>
              <input className={`${styles.input} ${styles.inputLg}`} type="text"
                placeholder={t.addressPlaceholder} value={form.address}
                onChange={e => patch("address", e.target.value)}
                onKeyDown={e => e.key === "Enter" && next()} autoFocus />
              <p className={styles.hint}>{t.addressHint}</p>
            </div>
          )}

          {step === 8 && (
            <div className={styles.body}>
              <input className={styles.input} type="email" placeholder={t.emailPlaceholder}
                value={form.email} onChange={e => patch("email", e.target.value)} autoFocus />
              <div className={styles.passWrap}>
                <input className={styles.input} type={showPass ? "text" : "password"}
                  placeholder={t.passwordPlaceholder} value={form.password}
                  onChange={e => patch("password", e.target.value)} />
                <button className={styles.eyeBtn} type="button" onClick={() => setShowPass(p => !p)}>
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
              <input className={styles.input} type="password" placeholder={t.confirmPlaceholder}
                value={form.confirm_password} onChange={e => patch("confirm_password", e.target.value)} />
            </div>
          )}

          <div className={styles.nav}>
            {step > 0 && <button className={styles.btnBack} onClick={back}>{t.back}</button>}
            {step < TOTAL - 1
              ? <button className={styles.btnNext} onClick={next}>{t.next}</button>
              : <button className={`${styles.btnNext} ${styles.btnSubmit}`} onClick={submit} disabled={loading}>
                {loading ? <span className={styles.spinner} /> : t.createAccount}
              </button>
            }
          </div>
        </div>
      </div>

      <p className={styles.footer}>© 2025 Agroveda · {t.tagline}</p>
    </div>
  );
}