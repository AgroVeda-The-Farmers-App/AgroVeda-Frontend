import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/ForgotPassword.module.css";

const API = "http://localhost:5000";

// Step labels
const STEPS = ["Enter Phone", "Verify OTP", "New Password"];

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep]       = useState(0);
  const [phone, setPhone]     = useState("");
  const [otp, setOtp]         = useState(["", "", "", "", "", ""]);
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const otpRefs = useRef([]);

  // ── Resend countdown ──────────────────────────────────────────
  const startResendTimer = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer(t => {
        if (t <= 1) { clearInterval(interval); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  // ── STEP 0: Send OTP ─────────────────────────────────────────
  const handleSendOtp = async () => {
    if (!/^\d{10}$/.test(phone)) {
      setError("Enter a valid 10-digit phone number.");
      return;
    }
    setLoading(true); setError("");
    try {
      await axios.post(`${API}/forgot-password/send-otp`, { phone_no: phone });
      setStep(1);
      startResendTimer();
    } catch (e) {
      setError(e?.response?.data?.error || "Failed to send OTP.");
    } finally { setLoading(false); }
  };

  // ── STEP 1: Verify OTP ────────────────────────────────────────
  const handleVerifyOtp = async () => {
    const otpStr = otp.join("");
    if (otpStr.length !== 6) { setError("Enter the full 6-digit OTP."); return; }
    setLoading(true); setError("");
    try {
      await axios.post(`${API}/forgot-password/verify-otp`, {
        phone_no: phone,
        otp: otpStr,
      });
      setStep(2);
    } catch (e) {
      setError(e?.response?.data?.error || "Invalid OTP.");
    } finally { setLoading(false); }
  };

  // ── STEP 2: Reset Password ────────────────────────────────────
  const handleReset = async () => {
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true); setError("");
    try {
      await axios.post(`${API}/forgot-password/reset`, {
        phone_no: phone,
        new_password: password,
        confirm_password: confirm,
      });
      setSuccess("Password reset successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (e) {
      setError(e?.response?.data?.error || "Reset failed. Please try again.");
    } finally { setLoading(false); }
  };

  // ── OTP input handler ─────────────────────────────────────────
  const handleOtpChange = (index, val) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);
    setError("");
    // Auto-focus next
    if (val && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKey = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter") {
      if (step === 1) handleVerifyOtp();
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setError(""); setOtp(["","","","","",""]);
    try {
      await axios.post(`${API}/forgot-password/send-otp`, { phone_no: phone });
      startResendTimer();
    } catch (e) {
      setError(e?.response?.data?.error || "Failed to resend OTP.");
    }
  };

  return (
    <div className={styles.page}>
      {/* Background blobs */}
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      {/* Top bar */}
      <div className={styles.topbar}>
        <Link to="/" className={styles.brand}>
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="24" fill="rgba(255,255,255,0.15)" />
            <path d="M24 8C24 8 12 18 12 28C12 34.627 17.373 40 24 40C30.627 40 36 34.627 36 28C36 18 24 8 24 8Z" fill="white" fillOpacity="0.9"/>
            <path d="M24 16C24 16 18 22 18 28C18 31.314 20.686 34 24 34" stroke="#2D6A4F" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <span className={styles.brandName}>Agroveda</span>
        </Link>
        <Link to="/login" className={styles.backLink}>← Back to Login</Link>
      </div>

      {/* Card */}
      <div className={styles.cardWrap}>
        <div className={styles.card}>

          {/* Step indicator */}
          <div className={styles.stepIndicator}>
            {STEPS.map((label, i) => (
              <div key={i} className={styles.stepItem}>
                <div className={`${styles.stepCircle} ${i < step ? styles.stepDone : i === step ? styles.stepCurrent : ""}`}>
                  {i < step ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7l3.5 3.5L12 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`${styles.stepLine} ${i < step ? styles.stepLineFilled : ""}`} />
                )}
              </div>
            ))}
          </div>
          <div className={styles.stepLabels}>
            {STEPS.map((label, i) => (
              <span key={i} className={`${styles.stepLabel} ${i === step ? styles.stepLabelActive : ""}`}>
                {label}
              </span>
            ))}
          </div>

          {/* Error / Success */}
          {error && (
            <div className={styles.errorBox}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="#DC2626" strokeWidth="1.5"/>
                <path d="M8 5v3M8 10.5v.5" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {error}
            </div>
          )}
          {success && (
            <div className={styles.successBox}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="#16a34a" strokeWidth="1.5"/>
                <path d="M5 8l2 2 4-4" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {success}
            </div>
          )}

          {/* ── STEP 0: Phone ── */}
          {step === 0 && (
            <div className={styles.stepBody}>
              <div className={styles.stepIcon}>📱</div>
              <h2 className={styles.title}>Forgot Password?</h2>
              <p className={styles.subtitle}>
                Enter your registered phone number and we'll send you a 6-digit OTP to reset your password.
              </p>
              <div className={styles.phoneWrap}>
                <span className={styles.phoneCode}>+91</span>
                <input
                  className={styles.phoneInput}
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={e => { setPhone(e.target.value.replace(/\D/g,"").slice(0,10)); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleSendOtp()}
                  autoFocus
                  maxLength={10}
                />
              </div>
              <button className={styles.btnPrimary} onClick={handleSendOtp} disabled={loading}>
                {loading ? <span className={styles.spinner}/> : "Send OTP →"}
              </button>
            </div>
          )}

          {/* ── STEP 1: OTP ── */}
          {step === 1 && (
            <div className={styles.stepBody}>
              <div className={styles.stepIcon}>🔐</div>
              <h2 className={styles.title}>Enter OTP</h2>
              <p className={styles.subtitle}>
                We sent a 6-digit code to <strong>+91 {phone}</strong>. Enter it below.
              </p>

              {/* OTP boxes */}
              <div className={styles.otpGrid}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => otpRefs.current[i] = el}
                    className={`${styles.otpBox} ${digit ? styles.otpFilled : ""}`}
                    type="tel"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKey(i, e)}
                    onFocus={e => e.target.select()}
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              <button className={styles.btnPrimary} onClick={handleVerifyOtp} disabled={loading}>
                {loading ? <span className={styles.spinner}/> : "Verify OTP →"}
              </button>

              {/* Resend */}
              <p className={styles.resendText}>
                Didn't receive it?{" "}
                <button
                  className={`${styles.resendBtn} ${resendTimer > 0 ? styles.resendDisabled : ""}`}
                  onClick={handleResend}
                  disabled={resendTimer > 0}
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                </button>
              </p>

              <button className={styles.btnGhost} onClick={() => { setStep(0); setOtp(["","","","","",""]); setError(""); }}>
                ← Change number
              </button>
            </div>
          )}

          {/* ── STEP 2: New Password ── */}
          {step === 2 && (
            <div className={styles.stepBody}>
              <div className={styles.stepIcon}>🔒</div>
              <h2 className={styles.title}>Set New Password</h2>
              <p className={styles.subtitle}>
                Choose a strong password for your Agroveda account.
              </p>

              <div className={styles.passWrap}>
                <input
                  className={styles.input}
                  type={showPass ? "text" : "password"}
                  placeholder="New password (min 6 characters)"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  autoFocus
                />
                <button className={styles.eyeBtn} type="button" onClick={() => setShowPass(p => !p)}>
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>

              <input
                className={styles.input}
                type="password"
                placeholder="Confirm new password"
                value={confirm}
                onChange={e => { setConfirm(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleReset()}
              />

              {/* Password strength indicator */}
              {password.length > 0 && (
                <div className={styles.strengthWrap}>
                  <div className={styles.strengthBar}>
                    <div
                      className={styles.strengthFill}
                      style={{
                        width: `${Math.min((password.length / 12) * 100, 100)}%`,
                        background: password.length < 6 ? "#ef4444"
                          : password.length < 10 ? "#f59e0b"
                          : "#22c55e"
                      }}
                    />
                  </div>
                  <span className={styles.strengthLabel}>
                    {password.length < 6 ? "Weak" : password.length < 10 ? "Good" : "Strong"}
                  </span>
                </div>
              )}

              <button className={`${styles.btnPrimary} ${styles.btnGold}`} onClick={handleReset} disabled={loading}>
                {loading ? <span className={styles.spinner}/> : "Reset Password 🌱"}
              </button>
            </div>
          )}

        </div>

        <p className={styles.footer}>© 2025 Agroveda · Your data is secure with us 🔒</p>
      </div>
    </div>
  );
}