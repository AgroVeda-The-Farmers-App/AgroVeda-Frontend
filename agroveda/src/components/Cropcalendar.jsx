import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import styles from "../styles/CropCalendar.module.css";

const API = "http://localhost:5000";

const GUIDE_SECTIONS = [
  {
    heading: "🌱 Sowing",
    fields: [
      { key: "sowing_method",      label: "Method" },
      { key: "best_sowing_months", label: "Best Months" },
      { key: "plant_spacing_cm",   label: "Plant Spacing" },
      { key: "row_spacing_cm",     label: "Row Spacing" },
    ],
  },
  {
    heading: "☀️ Growing Conditions",
    fields: [
      { key: "sun_requirements", label: "Sunlight" },
      { key: "soil_type",        label: "Soil Type" },
      { key: "water_needs",      label: "Water Needs" },
    ],
  },
  {
    heading: "🌾 Harvest",
    fields: [
      { key: "harvest_months",   label: "Harvest Months" },
      { key: "harvest_duration", label: "Duration" },
      { key: "yield_per_hectare", label: "Expected Yield" },
    ],
  },
  {
    heading: "🧪 Inputs & Protection",
    fields: [
      { key: "fertilizer",   label: "Fertilizer" },
      { key: "common_pests", label: "Common Pests" },
    ],
  },
];

export default function CropCalendar() {
  const [states, setStates]     = useState([]);
  const [crops, setCrops]       = useState([]);
  const [state, setState]       = useState("");
  const [crop, setCrop]         = useState("");
  const [info, setInfo]         = useState(null);   // season + category
  const [guide, setGuide]       = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [statesLoading, setStatesLoading] = useState(true);

  // Load states on mount
  useEffect(() => {
    axios.get(`${API}/crop/states`)
      .then(r => { setStates(r.data.states); setStatesLoading(false); })
      .catch(() => { setError("Failed to load states."); setStatesLoading(false); });
  }, []);

  // Load crops when state changes
  useEffect(() => {
    if (!state) { setCrops([]); setCrop(""); setInfo(null); setGuide(null); return; }
    setCrop(""); setInfo(null); setGuide(null);
    axios.get(`${API}/crop/crops?state=${encodeURIComponent(state)}`)
      .then(r => setCrops(r.data.crops))
      .catch(() => setError("Failed to load crops."));
  }, [state]);

  // Load crop info when crop changes
  useEffect(() => {
    if (!state || !crop) { setInfo(null); setGuide(null); return; }
    setGuide(null);
    axios.get(`${API}/crop/info?state=${encodeURIComponent(state)}&crop=${encodeURIComponent(crop)}`)
      .then(r => setInfo(r.data))
      .catch(() => setError("Failed to load crop info."));
  }, [crop]);

  const handleGenerate = async () => {
    if (!state || !crop || !info) return;
    setLoading(true); setError(""); setGuide(null);
    try {
      const res = await axios.post(`${API}/crop/generate`, {
        state, crop, season: info.season,
      });
      setGuide(res.data.guide);
    } catch (e) {
      setError(e?.response?.data?.error || "Failed to generate guide. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className={styles.page}>
      <Navbar />

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>🌾 AI-Powered</span>
          <h1 className={styles.heroTitle}>Smart Crop Calendar</h1>
          <p className={styles.heroSub}>
            Select your state and crop — get a complete AI-generated farming guide
            tailored to your region and season.
          </p>
        </div>
      </div>

      <div className={styles.container}>

        {/* Selectors */}
        <div className={styles.selectorCard}>
          <div className={styles.selectorGrid}>

            {/* State */}
            <div className={styles.selectWrap}>
              <label className={styles.selectLabel}>📍 Select State</label>
              <div className={styles.selectBox}>
                <select
                  className={styles.select}
                  value={state}
                  onChange={e => { setState(e.target.value); setError(""); }}
                  disabled={statesLoading}
                >
                  <option value="">{statesLoading ? "Loading states..." : "-- Choose your state --"}</option>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Crop */}
            <div className={styles.selectWrap}>
              <label className={styles.selectLabel}>🌿 Select Crop</label>
              <div className={styles.selectBox}>
                <select
                  className={styles.select}
                  value={crop}
                  onChange={e => { setCrop(e.target.value); setError(""); }}
                  disabled={!state || crops.length === 0}
                >
                  <option value="">{!state ? "Select state first" : "-- Choose your crop --"}</option>
                  {crops.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

          </div>

          {/* Info pills */}
          {info && (
            <div className={styles.infoPills}>
              <div className={styles.pill}>
                <span className={styles.pillIcon}>📍</span>
                <span className={styles.pillLabel}>State</span>
                <span className={styles.pillValue}>{info.state}</span>
              </div>
              <div className={styles.pill}>
                <span className={styles.pillIcon}>🗓️</span>
                <span className={styles.pillLabel}>Season</span>
                <span className={styles.pillValue}>{info.season}</span>
              </div>
              <div className={styles.pill}>
                <span className={styles.pillIcon}>🏷️</span>
                <span className={styles.pillLabel}>Category</span>
                <span className={styles.pillValue}>{info.category}</span>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className={styles.errorBox}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="#DC2626" strokeWidth="1.5"/>
                <path d="M8 5v3M8 10.5v.5" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {error}
            </div>
          )}

          {/* Generate Button */}
          <button
            className={styles.generateBtn}
            onClick={handleGenerate}
            disabled={!state || !crop || !info || loading}
          >
            {loading ? (
              <><span className={styles.spinner} /> Generating your guide...</>
            ) : (
              <>✨ Generate Growth Calendar</>
            )}
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className={styles.loadingCard}>
            <div className={styles.loadingIcon}>🌱</div>
            <p className={styles.loadingText}>
              Our AI is crafting your personalised farming guide for <strong>{crop}</strong> in <strong>{state}</strong>...
            </p>
            <div className={styles.loadingDots}>
              <span /><span /><span />
            </div>
          </div>
        )}

        {/* Guide Result */}
        {guide && !loading && (
          <div className={styles.resultWrap}>

            {/* Header */}
            <div className={styles.resultHeader}>
              <div>
                <h2 className={styles.resultTitle}>{crop} — {state}</h2>
                <p className={styles.resultSub}>{info?.season} Season · {info?.category}</p>
              </div>
              <div className={styles.resultBadge}>AI Generated ✨</div>
            </div>

            {/* Crop Timeline */}
            <div className={styles.timeline}>
              <div className={styles.timelineItem}>
                <div className={`${styles.timelineDot} ${styles.dotGreen}`} />
                <div className={styles.timelineContent}>
                  <span className={styles.timelineLabel}>Sow</span>
                  <span className={styles.timelineValue}>{guide.best_sowing_months}</span>
                </div>
              </div>
              <div className={styles.timelineArrow}>→</div>
              <div className={styles.timelineItem}>
                <div className={`${styles.timelineDot} ${styles.dotYellow}`} />
                <div className={styles.timelineContent}>
                  <span className={styles.timelineLabel}>Grow</span>
                  <span className={styles.timelineValue}>{guide.harvest_duration}</span>
                </div>
              </div>
              <div className={styles.timelineArrow}>→</div>
              <div className={styles.timelineItem}>
                <div className={`${styles.timelineDot} ${styles.dotOrange}`} />
                <div className={styles.timelineContent}>
                  <span className={styles.timelineLabel}>Harvest</span>
                  <span className={styles.timelineValue}>{guide.harvest_months}</span>
                </div>
              </div>
            </div>

            {/* Guide Sections */}
            <div className={styles.guideGrid}>
              {GUIDE_SECTIONS.map(section => (
                <div key={section.heading} className={styles.guideCard}>
                  <h3 className={styles.guideHeading}>{section.heading}</h3>
                  <div className={styles.guideFields}>
                    {section.fields.map(f => (
                      <div key={f.key} className={styles.guideRow}>
                        <span className={styles.guideLabel}>{f.label}</span>
                        <span className={styles.guideValue}>{guide[f.key] || "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div className={styles.tipsGrid}>
              <div className={styles.tipCard}>
                <div className={styles.tipIcon}>💡</div>
                <div>
                  <p className={styles.tipTitle}>Pro Tip — {info?.season} in {state}</p>
                  <p className={styles.tipText}>{guide.pro_tip}</p>
                </div>
              </div>
              <div className={`${styles.tipCard} ${styles.tipGold}`}>
                <div className={styles.tipIcon}>📈</div>
                <div>
                  <p className={styles.tipTitle}>Market Tip</p>
                  <p className={styles.tipText}>{guide.market_tip}</p>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}