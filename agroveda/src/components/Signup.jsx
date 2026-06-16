import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import styles from "../styles/Signup.module.css";

const TOTAL = 7;

const triggerGoogleTranslate = (langCode) => {
  const select = document.querySelector(".goog-te-combo");
  if (select) {
    select.value = langCode;
    select.dispatchEvent(new Event("change"));
  }
};

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");

  const [form, setForm] = useState({
    language: "en", full_name: "", phone_no: "", dob: "",
    gender: "", address: "", password: "", confirm_password: "",
  });

  const patch = (field, val) => { setForm(p => ({ ...p, [field]: val })); setError(""); };

  const validate = () => {

    // STEP 1 - Full Name
    if (step === 1) {

      if (!form.full_name.trim())
        return "Please enter your full name.";

      if (form.full_name.trim().length < 3)
        return "Name must be at least 3 characters.";

      if (!/^[A-Za-z ]+$/.test(form.full_name))
        return "Name can contain only letters and spaces.";
    }

    // STEP 2 - Phone
    if (step === 2) {
      if (!form.phone_no)
        return "Phone number is required.";

      if (!/^[6-9]\d{9}$/.test(form.phone_no))
        return "Enter a valid 10-digit Indian mobile number.";

      // Like 2222222222, 9999999999
      if (/^(\d)\1{9}$/.test(form.phone_no))
        return "Enter a valid phone number.";

      // 1234567890
      const digits = form.phone_no.split("").map(Number);
      const isSequential = digits.every((d, i) => i === 0 || d === digits[i - 1] + 1);
      if (isSequential)
        return "Enter a valid phone number.";
    }

    // STEP 3 - DOB
    if (step === 3) {
      if (!form.dob)
        return "Please select your date of birth.";

      const dob = new Date(form.dob);
      const today = new Date();

      const minDate = new Date("1950-01-01");

      if (dob < minDate)
        return "Year must be 1950 or later.";

      if (dob > today)
        return "Date of birth cannot be in the future.";

      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }

      if (age < 18)
        return "You must be at least 18 years old.";
    }

    // STEP 4 - Gender
    if (step === 4) {

      if (!form.gender)
        return "Please select your gender.";
    }

    // STEP 5 - Address
    if (step === 5) {

      if (!form.address.trim())
        return "Please enter your address.";

      if (form.address.trim().length < 10)
        return "Address must be at least 10 characters.";
    }

    // STEP 6 - Password
    if (step === 6) {

      if (!form.password)
        return "Password is required.";

      if (form.password.length < 8)
        return "Password must be at least 8 characters.";

      if (
        !/(?=.*[a-z])/.test(form.password)
      )
        return "Password must contain a lowercase letter.";

      if (
        !/(?=.*[A-Z])/.test(form.password)
      )
        return "Password must contain an uppercase letter.";

      if (
        !/(?=.*\d)/.test(form.password)
      )
        return "Password must contain a number.";

      if (
        !/(?=.*[@$!%*?&])/.test(form.password)
      )
        return "Password must contain a special character.";

      if (form.password !== form.confirm_password)
        return "Passwords do not match.";
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
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.error || "Signup failed. Please try again.");
    } finally { setLoading(false); }
  };

  const titles = [
    "Choose your language",
    "What's your full name?",
    "Your phone number",
    "Your date of birth",
    "Select your gender",
    "Create your account",
  ];

  const progress = (step / (TOTAL - 1)) * 100;

  return (
    <div className={styles.suPage}>
      <div className={`${styles.blob} ${styles.blob1}`} />
      <div className={`${styles.blob} ${styles.blob2}`} />
      <div className={`${styles.blob} ${styles.blob3}`} />

      {/* Top bar */}
      <div className={styles.topbar}>
        <div className={styles.brand}>
          <svg width="30" height="30" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="24" fill="rgba(255,255,255,0.15)" />
            <path d="M24 8C24 8 12 18 12 28C12 34.627 17.373 40 24 40C30.627 40 36 34.627 36 28C36 18 24 8 24 8Z" fill="white" fillOpacity="0.9" />
            <path d="M24 16C24 16 18 22 18 28C18 31.314 20.686 34 24 34" stroke="#2D6A4F" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <span className={styles.brandName}>Agroveda</span>
        </div>
        <p className={styles.signinHint}>
          Already have an account?{" "}
          <Link to="/login" className={styles.signinLink}>Sign in →</Link>
        </p>
      </div>

      {/* Card */}
      <div className={styles.center}>
        <div className={styles.card} key={step}>

          {/* Progress bar */}
          {step > 0 && (
            <div className={styles.progressWrap}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
              </div>
              <span className={styles.stepCount}>{step} / {TOTAL - 1}</span>
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

          {/* ── STEP 0: Language ── */}
          {step === 0 && (
            <div className={styles.body}>
              <p className={styles.subtitle}>
                Select the language you are most comfortable with
              </p>
              <div className={styles.langGrid}>
                {[
                  { code: "en", flag: "🇬🇧", label: "English", native: "English" },
                  { code: "bn", flag: "🇮🇳", label: "Bengali", native: "বাংলা" },
                ].map(({ code, flag, label, native }) => (
                  <button
                    key={code}
                    className={`${styles.langBtn} ${selectedLang === code ? styles.langActive : ""}`}
                    onClick={() => {
                      setSelectedLang(code);
                      patch("language", code);
                      triggerGoogleTranslate(code);
                    }}
                  >
                    <span className={styles.langFlag}>{flag}</span>
                    <span className={styles.langLabel}>{label}</span>
                    <span className={styles.langNative}>{native}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 1: Name ── */}
          {step === 1 && (
            <div className={styles.body}>
              <input
                className={`${styles.input} ${styles.inputLg}`}
                type="text"
                placeholder="e.g. Rajan Kumar"
                value={form.full_name}
                onChange={(e) =>
                  patch(
                    "full_name",
                    e.target.value.replace(/[^A-Za-z ]/g, "")
                  )
                }
                onKeyDown={e => e.key === "Enter" && next()}
                autoFocus
              />
              <p className={styles.hint}>As per your official records</p>
            </div>
          )}



          {/* ── STEP 2: Phone ── */}
          {step === 2 && (
            <div className={styles.body}>
              <div className={styles.phoneWrap}>
                <span className={styles.phoneCode}>+91</span>
                <input
                  className={`${styles.input} ${styles.inputPhone}`}
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={form.phone_no}
                  onChange={e => patch("phone_no", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  onKeyDown={e => e.key === "Enter" && next()}
                  autoFocus
                />
              </div>
              <p className={styles.hint}>We'll send crop alerts to this number</p>
            </div>
          )}

          {/* ── STEP 3: DOB ── */}
          {step === 3 && (
            <div className={styles.body}>
              <input
                className={`${styles.input} ${styles.inputLg}`}
                type="date"
                value={form.dob}
                min="1950-01-01"
                max={new Date().toISOString().split("T")[0]}
                onChange={e => patch("dob", e.target.value)}
                autoFocus
              />
              <p className={styles.hint}>Helps us give age-appropriate advice</p>
            </div>


          )}



          {/* ── STEP 4: Gender ── */}
          {step === 4 && (
            <div className={styles.body}>
              <div className={styles.choiceGrid}>
                {[
                  { val: "Male", label: "Male", icon: "👨‍🌾" },
                  { val: "Female", label: "Female", icon: "👩‍🌾" },
                  { val: "Other", label: "Other", icon: "🌿" },
                ].map(({ val, label, icon }) => (
                  <button
                    key={val}
                    className={`${styles.choiceBtn} ${form.gender === val ? styles.choiceActive : ""}`}
                    onClick={() => patch("gender", val)}
                  >
                    <span className={styles.choiceIcon}>{icon}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 5: Address ── */}
          {step === 5 && (
            <div className={styles.body}>
              <input
                className={`${styles.input} ${styles.inputLg}`}
                type="text"
                placeholder="Village, District, State"
                value={form.address}
                onChange={e => patch("address", e.target.value)}
                onKeyDown={e => e.key === "Enter" && next()}
                autoFocus
              />
              <p className={styles.hint}>Helps us give localised weather and crop data</p>
            </div>
          )}

          {/* ── STEP 6: Account ── */}
          {step === 6 && (
            <div className={styles.body}>
              <div className={styles.passWrap}>
                <input className={styles.input} type={showPass ? "text" : "password"}
                  placeholder="Minimum 6 characters" value={form.password}
                  onChange={e => patch("password", e.target.value)} />
                <button className={styles.eyeBtn} type="button" onClick={() => setShowPass(p => !p)}>
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
              <input className={styles.input} type="password"
                placeholder="Repeat your password" value={form.confirm_password}
                onChange={e => patch("confirm_password", e.target.value)} />
            </div>
          )}

          {/* Navigation */}
          <div className={styles.nav}>
            {step > 0 && (
              <button className={styles.btnBack} onClick={back}>← Back</button>
            )}
            {step < TOTAL - 1 ? (
              <button className={styles.btnNext} onClick={next}>Continue →</button>
            ) : (
              <button
                className={`${styles.btnNext} ${styles.btnSubmit}`}
                onClick={submit}
                disabled={loading}
              >
                {loading ? <span className={styles.spinner} /> : "Create Account 🌱"}
              </button>
            )}
          </div>

        </div>
      </div>

      <p className={styles.footer}>© 2025 Agroveda · Rooted in tradition. Growing with science.</p>
    </div>
  );
}