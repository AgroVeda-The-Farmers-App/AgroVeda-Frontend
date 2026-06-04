import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import styles from "../styles/Yieldpredictor.module.css";

const API = "http://localhost:5000";

export default function YieldPredictor() {
  const [options, setOptions]   = useState({ states: [], districts: [], seasons: [], crops: [] });
  const [form, setForm]         = useState({ state: "", district: "", season: "", crop: "", area: "" });
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [optLoading, setOptLoading] = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => {
    axios.get(`${API}/yield/options`)
      .then(r => { setOptions(r.data); setOptLoading(false); })
      .catch(() => { setError("Failed to load options."); setOptLoading(false); });
  }, []);

  const set = (field, val) => { setForm(p => ({ ...p, [field]: val })); setError(""); setResult(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.state || !form.district || !form.season || !form.crop || !form.area) {
      setError("Please fill in all fields."); return;
    }
    if (parseFloat(form.area) <= 0) { setError("Area must be greater than 0."); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await axios.post(`${API}/yield/predict`, { ...form, area: parseFloat(form.area) });
      setResult(res.data);
    } catch (e) {
      setError(e?.response?.data?.error || "Prediction failed. Please try again.");
    } finally { setLoading(false); }
  };

  const isReady = form.state && form.district && form.season && form.crop && form.area;

  return (
    <div className={styles.page}>
      <Navbar />

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>🤖 ML-Powered</span>
          <h1 className={styles.heroTitle}>Smart Yield Predictor</h1>
          <p className={styles.heroSub}>
            Enter your farm details and get an AI-powered prediction of expected yield
            and total production — backed by real agricultural data.
          </p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.layout}>

          {/* ── FORM ── */}
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Enter Farm Details</h2>
            <p className={styles.formSub}>All fields are required for accurate prediction</p>

            {error && (
              <div className={styles.errorBox}>
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="#DC2626" strokeWidth="1.5"/>
                  <path d="M8 5v3M8 10.5v.5" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form} noValidate>

              {/* State */}
              <div className={styles.field}>
                <label className={styles.label}>📍 State</label>
                <div className={styles.selectWrap}>
                  <select className={styles.select} value={form.state}
                    onChange={e => set("state", e.target.value)}
                    disabled={optLoading}>
                    <option value="">{optLoading ? "Loading..." : "-- Select state --"}</option>
                    {options.states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* District */}
              <div className={styles.field}>
                <label className={styles.label}>🏘️ District</label>
                <div className={styles.selectWrap}>
                  <select className={styles.select} value={form.district}
                    onChange={e => set("district", e.target.value)}
                    disabled={optLoading}>
                    <option value="">-- Select district --</option>
                    {options.districts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {/* Season */}
              <div className={styles.field}>
                <label className={styles.label}>🗓️ Season</label>
                <div className={styles.selectWrap}>
                  <select className={styles.select} value={form.season}
                    onChange={e => set("season", e.target.value)}
                    disabled={optLoading}>
                    <option value="">-- Select season --</option>
                    {options.seasons.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Crop */}
              <div className={styles.field}>
                <label className={styles.label}>🌾 Crop</label>
                <div className={styles.selectWrap}>
                  <select className={styles.select} value={form.crop}
                    onChange={e => set("crop", e.target.value)}
                    disabled={optLoading}>
                    <option value="">-- Select crop --</option>
                    {options.crops.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Area */}
              <div className={styles.field}>
                <label className={styles.label}>📐 Area (in hectares)</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} type="number" min="0.1" step="0.1"
                    placeholder="e.g. 2.5" value={form.area}
                    onChange={e => set("area", e.target.value)} />
                  <span className={styles.inputSuffix}>ha</span>
                </div>
              </div>

              <button type="submit" className={styles.submitBtn}
                disabled={loading || !isReady || optLoading}>
                {loading ? (
                  <><span className={styles.spinner} /> Predicting...</>
                ) : (
                  <>🔮 Predict Yield</>
                )}
              </button>
            </form>
          </div>

          {/* ── RESULT PANEL ── */}
          <div className={styles.resultPanel}>

            {/* Placeholder before prediction */}
            {!result && !loading && (
              <div className={styles.placeholder}>
                <div className={styles.placeholderIcon}>🌾</div>
                <h3 className={styles.placeholderTitle}>Your prediction will appear here</h3>
                <p className={styles.placeholderSub}>Fill in the farm details on the left and click Predict Yield to get your results.</p>
                <div className={styles.placeholderSteps}>
                  {["Select your state & district", "Choose season & crop", "Enter farm area in hectares", "Get instant AI prediction"].map((s, i) => (
                    <div key={i} className={styles.placeholderStep}>
                      <span className={styles.stepNum}>{i + 1}</span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Loading animation */}
            {loading && (
              <div className={styles.loadingCard}>
                <div className={styles.loadingIcon}>🤖</div>
                <p className={styles.loadingText}>Running prediction model...</p>
                <div className={styles.loadingDots}><span/><span/><span/></div>
              </div>
            )}

            {/* Result */}
            {result && !loading && (
              <div className={styles.resultCard}>

                {/* Success badge */}
                <div className={styles.resultBadge}>✅ Prediction Complete</div>

                {/* Main metrics */}
                <div className={styles.metricsGrid}>
                  <div className={styles.metricCard}>
                    <div className={styles.metricIcon}>📊</div>
                    <div className={styles.metricValue}>
                      {result.yield_per_hectare} <span className={styles.metricUnit}>t/ha</span>
                    </div>
                    <div className={styles.metricLabel}>Predicted Yield</div>
                    <div className={styles.metricSub}>Tonnes per hectare</div>
                  </div>
                  <div className={`${styles.metricCard} ${styles.metricGold}`}>
                    <div className={styles.metricIcon}>🏭</div>
                    <div className={styles.metricValue}>
                      {result.total_production} <span className={styles.metricUnit}>t</span>
                    </div>
                    <div className={styles.metricLabel}>Total Production</div>
                    <div className={styles.metricSub}>Expected harvest</div>
                  </div>
                </div>

                {/* Input summary */}
                <div className={styles.summaryCard}>
                  <p className={styles.summaryTitle}>📋 Input Summary</p>
                  <div className={styles.summaryGrid}>
                    {[
                      { label: "State",    value: result.state },
                      { label: "District", value: result.district },
                      { label: "Season",   value: result.season },
                      { label: "Crop",     value: result.crop },
                      { label: "Area",     value: `${result.area} ha` },
                    ].map(item => (
                      <div key={item.label} className={styles.summaryRow}>
                        <span className={styles.summaryLabel}>{item.label}</span>
                        <span className={styles.summaryValue}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tip */}
                <div className={styles.tipBox}>
                  <span className={styles.tipIcon}>💡</span>
                  <p className={styles.tipText}>
                    This prediction is based on historical agricultural data from across India.
                    Actual yield may vary based on weather, soil quality, and farming practices.
                  </p>
                </div>

                {/* Reset */}
                <button className={styles.resetBtn}
                  onClick={() => { setResult(null); setForm({ state:"", district:"", season:"", crop:"", area:"" }); }}>
                  🔄 Predict Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}