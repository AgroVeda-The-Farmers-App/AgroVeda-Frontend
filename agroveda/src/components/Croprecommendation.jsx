// import { useState } from "react";
// import axios from "axios";
// import Navbar from "./Navbar";
// import styles from "../styles/CropRecommendation.module.css";

// const API = "http://localhost:5000";

// const FIELDS = [
//   { name: "N", label: "Nitrogen", unit: "mg/kg", placeholder: "90", icon: "N" },
//   { name: "P", label: "Phosphorus", unit: "mg/kg", placeholder: "42", icon: "P" },
//   { name: "K", label: "Potassium", unit: "mg/kg", placeholder: "43", icon: "K" },
//   { name: "temperature", label: "Temperature", unit: "°C", placeholder: "20.8", step: "0.01" },
//   { name: "humidity", label: "Humidity", unit: "%", placeholder: "82", step: "0.01" },
//   { name: "ph", label: "Soil pH", unit: "pH", placeholder: "6.5", step: "0.01" },
//   { name: "rainfall", label: "Rainfall", unit: "mm", placeholder: "202.9", step: "0.01" },
// ];

// export default function CropRecommendation() {
//   const [form, setForm] = useState({
//     N: "", P: "", K: "", temperature: "", humidity: "", ph: "", rainfall: ""
//   });
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handlePredict = async () => {
//     if (FIELDS.some((f) => !form[f.name])) {
//       setError("Please fill in all fields before predicting.");
//       return;
//     }
//     setLoading(true);
//     setError("");
//     setResult(null);
//     try {
//       const payload = Object.fromEntries(
//         FIELDS.map((f) => [f.name, Number(form[f.name])])
//       );
//       const res = await axios.post(`${API}/crop/predict`, payload);
//       setResult(res.data);
//     } catch {
//       setError("Prediction failed. Please check your inputs and try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isComplete = FIELDS.every((f) => form[f.name]);

//   return (
//     <div className={styles.page}>
//       <Navbar />

//       <div className={styles.hero}>
//         <span className={styles.heroEyebrow}>Precision Agriculture</span>
//         <h1 className={styles.heroTitle}>Crop Intelligence</h1>
//         <p className={styles.heroSub}>
//           Input your soil profile and climate data to receive a scientifically matched crop recommendation.
//         </p>
//       </div>

//       <div className={styles.container}>
//         <div className={styles.formCard}>
//           <div className={styles.sectionHeader}>
//             <span className={styles.sectionLabel}>Soil Nutrients</span>
//             <div className={styles.divider} />
//           </div>

//           <div className={styles.formGrid}>
//             {FIELDS.slice(0, 3).map((f) => (
//               <div className={styles.inputGroup} key={f.name}>
//                 <label className={styles.label}>{f.label}</label>
//                 <div className={styles.inputWrap}>
//                   <input
//                     className={styles.input}
//                     type="number"
//                     name={f.name}
//                     placeholder={f.placeholder}
//                     step={f.step || "1"}
//                     value={form[f.name]}
//                     onChange={handleChange}
//                   />
//                   <span className={styles.unit}>{f.unit}</span>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className={styles.sectionHeader} style={{ marginTop: "2rem" }}>
//             <span className={styles.sectionLabel}>Climate &amp; Soil Conditions</span>
//             <div className={styles.divider} />
//           </div>

//           <div className={styles.formGrid}>
//             {FIELDS.slice(3).map((f) => (
//               <div className={styles.inputGroup} key={f.name}>
//                 <label className={styles.label}>{f.label}</label>
//                 <div className={styles.inputWrap}>
//                   <input
//                     className={styles.input}
//                     type="number"
//                     name={f.name}
//                     placeholder={f.placeholder}
//                     step={f.step || "1"}
//                     value={form[f.name]}
//                     onChange={handleChange}
//                   />
//                   <span className={styles.unit}>{f.unit}</span>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <button
//             className={styles.predictBtn}
//             onClick={handlePredict}
//             disabled={!isComplete || loading}
//           >
//             {loading ? (
//               <span className={styles.btnInner}>
//                 <span className={styles.btnSpinner} />
//                 Analysing your data…
//               </span>
//             ) : (
//               <span className={styles.btnInner}>
//                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
//                   <path d="M12 2a10 10 0 1 0 10 10" /><path d="M12 8v4l3 3" /><path d="M18 2v4h4" />
//                 </svg>
//                 Get Recommendation
//               </span>
//             )}
//           </button>

//           {error && <p className={styles.error}>{error}</p>}
//         </div>

//         {result && (
//           <div className={styles.resultCard}>
//             <div className={styles.resultTop}>
//               <span className={styles.resultEyebrow}>Best Match</span>
//               <h2 className={styles.resultCrop}>{result.crop}</h2>
//               <div className={styles.confidencePill}>
//                 <span className={styles.confidenceBar} style={{ width: `${result.confidence}%` }} />
//                 <span className={styles.confidenceText}>{result.confidence}% confidence</span>
//               </div>
//             </div>
//             <div className={styles.resultInfo}>
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.infoIcon} aria-hidden="true">
//                 <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
//               </svg>
//               <p>
//                 This recommendation is derived from your soil nutrient profile (N, P, K), 
//                 pH level, ambient temperature, humidity, and annual rainfall — cross-matched 
//                 against verified agronomic datasets.
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import styles from "../styles/CropRecommendation.module.css";

const API = "http://localhost:5000";
const OW_KEY = "65297baa40f92ffaeca9f583a6dbf81f";

const FIELDS = [
  { name: "N", label: "Nitrogen", unit: "mg/kg", placeholder: "90", icon: "N" },
  { name: "P", label: "Phosphorus", unit: "mg/kg", placeholder: "42", icon: "P" },
  { name: "K", label: "Potassium", unit: "mg/kg", placeholder: "43", icon: "K" },
  { name: "temperature", label: "Temperature", unit: "°C", placeholder: "20.8", step: "0.01", autoFilled: true },
  { name: "humidity", label: "Humidity", unit: "%", placeholder: "82", step: "0.01", autoFilled: true },
  { name: "ph", label: "Soil pH", unit: "pH", placeholder: "6.5", step: "0.01" },
  { name: "rainfall", label: "Rainfall", unit: "mm", placeholder: "202.9", step: "0.01" },
];

export default function CropRecommendation() {
  const [form, setForm] = useState({
    N: "", P: "", K: "", temperature: "", humidity: "", ph: "", rainfall: ""
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Location search state
  const [locationQuery, setLocationQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState("");
  const [autoFilledFields, setAutoFilledFields] = useState({ temperature: false, humidity: false });
  const debounceRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced city search via OpenWeather Geocoding API
  const handleLocationInput = (e) => {
    const q = e.target.value;
    setLocationQuery(q);
    setSelectedLocation(null);
    setWeatherError("");

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q.trim() || q.length < 2) { setSuggestions([]); return; }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=6&appid=${OW_KEY}`
        );
        // Deduplicate by name+state+country
        const seen = new Set();
        const unique = res.data.filter((item) => {
          const key = `${item.name}|${item.state || ""}|${item.country}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        setSuggestions(unique);
      } catch {
        setSuggestions([]);
      }
    }, 350);
  };

  const fetchWeather = async (loc) => {
    setSelectedLocation(loc);
    setLocationQuery(`${loc.name}${loc.state ? `, ${loc.state}` : ""}, ${loc.country}`);
    setSuggestions([]);
    setWeatherLoading(true);
    setWeatherError("");

    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${loc.lat}&lon=${loc.lon}&units=metric&appid=${OW_KEY}`
      );
      const temp = res.data.main.temp.toFixed(2);
      const hum = res.data.main.humidity.toString();
      setForm((prev) => ({ ...prev, temperature: temp, humidity: hum }));
      setAutoFilledFields({ temperature: true, humidity: true });
    } catch {
      setWeatherError("Could not fetch weather data. Try another location.");
    } finally {
      setWeatherLoading(false);
    }
  };

  const clearLocation = () => {
    setLocationQuery("");
    setSelectedLocation(null);
    setSuggestions([]);
    setWeatherError("");
    setAutoFilledFields({ temperature: false, humidity: false });
    setForm((prev) => ({ ...prev, temperature: "", humidity: "" }));
  };

  const handlePredict = async () => {
    if (FIELDS.some((f) => !form[f.name])) {
      setError("Please fill in all fields before predicting.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const payload = Object.fromEntries(
        FIELDS.map((f) => [f.name, Number(form[f.name])])
      );
      const res = await axios.post(`${API}/crop/predict`, payload);
      setResult(res.data);
    } catch {
      setError("Prediction failed. Please check your inputs and try again.");
    } finally {
      setLoading(false);
    }
  };

  const isComplete = FIELDS.every((f) => form[f.name]);

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.hero}>
        <span className={styles.heroEyebrow}>Precision Agriculture</span>
        <h1 className={styles.heroTitle}>Crop Intelligence</h1>
        <p className={styles.heroSub}>
          Input your soil profile and climate data to receive a scientifically matched crop recommendation.
        </p>
      </div>

      <div className={styles.container}>
        <div className={styles.formCard}>

          {/* ── Location picker ── */}
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Location Auto-Fill</span>
            <div className={styles.divider} />
          </div>

          <div className={styles.locationBlock} ref={dropdownRef}>
            <p className={styles.locationHint}>
              Search your district or city to auto-fill <strong>Temperature</strong> and <strong>Humidity</strong> from live weather data.
            </p>
            <div className={styles.locationInputWrap}>
              <svg className={styles.locationIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              <input
                className={styles.locationInput}
                type="text"
                placeholder="e.g. Kolkata, Murshidabad, Mumbai…"
                value={locationQuery}
                onChange={handleLocationInput}
                autoComplete="off"
              />
              {weatherLoading && <span className={styles.locationSpinner} />}
              {selectedLocation && !weatherLoading && (
                <button className={styles.clearBtn} onClick={clearLocation} title="Clear location" aria-label="Clear location">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>

            {suggestions.length > 0 && (
              <ul className={styles.dropdown}>
                {suggestions.map((s, i) => (
                  <li key={i} className={styles.dropdownItem} onClick={() => fetchWeather(s)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.dropdownPin} aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span className={styles.dropdownName}>{s.name}</span>
                    {s.state && <span className={styles.dropdownState}>{s.state}</span>}
                    <span className={styles.dropdownCountry}>{s.country}</span>
                  </li>
                ))}
              </ul>
            )}

            {weatherError && <p className={styles.weatherError}>{weatherError}</p>}

            {selectedLocation && !weatherLoading && autoFilledFields.temperature && (
              <div className={styles.weatherBadge}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10"/><polyline points="12 6 12 12 16 14"/></svg>
                Live weather fetched for <strong>{selectedLocation.name}{selectedLocation.state ? `, ${selectedLocation.state}` : ""}</strong> — temperature &amp; humidity filled.
              </div>
            )}
          </div>

          {/* ── Soil nutrients ── */}
          <div className={styles.sectionHeader} style={{ marginTop: "2rem" }}>
            <span className={styles.sectionLabel}>Soil Nutrients</span>
            <div className={styles.divider} />
          </div>

          <div className={styles.formGrid}>
            {FIELDS.slice(0, 3).map((f) => (
              <div className={styles.inputGroup} key={f.name}>
                <label className={styles.label}>{f.label}</label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    type="number"
                    name={f.name}
                    placeholder={f.placeholder}
                    step={f.step || "1"}
                    value={form[f.name]}
                    onChange={handleChange}
                  />
                  <span className={styles.unit}>{f.unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ── Climate & Soil ── */}
          <div className={styles.sectionHeader} style={{ marginTop: "2rem" }}>
            <span className={styles.sectionLabel}>Climate &amp; Soil Conditions</span>
            <div className={styles.divider} />
          </div>

          <div className={styles.formGrid}>
            {FIELDS.slice(3).map((f) => (
              <div className={styles.inputGroup} key={f.name}>
                <label className={styles.label}>
                  {f.label}
                  {f.autoFilled && autoFilledFields[f.name] && (
                    <span className={styles.autoTag}>auto-filled</span>
                  )}
                </label>
                <div className={styles.inputWrap}>
                  <input
                    className={`${styles.input} ${f.autoFilled && autoFilledFields[f.name] ? styles.inputAutoFilled : ""}`}
                    type="number"
                    name={f.name}
                    placeholder={f.placeholder}
                    step={f.step || "1"}
                    value={form[f.name]}
                    onChange={(e) => {
                      if (f.autoFilled) setAutoFilledFields((p) => ({ ...p, [f.name]: false }));
                      handleChange(e);
                    }}
                    readOnly={weatherLoading && f.autoFilled}
                  />
                  <span className={styles.unit}>{f.unit}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            className={styles.predictBtn}
            onClick={handlePredict}
            disabled={!isComplete || loading}
          >
            {loading ? (
              <span className={styles.btnInner}>
                <span className={styles.btnSpinner} />
                Analysing your data…
              </span>
            ) : (
              <span className={styles.btnInner}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 2a10 10 0 1 0 10 10" /><path d="M12 8v4l3 3" /><path d="M18 2v4h4" />
                </svg>
                Get Recommendation
              </span>
            )}
          </button>

          {error && <p className={styles.error}>{error}</p>}
        </div>

        {result && (
          <div className={styles.resultCard}>
            <div className={styles.resultTop}>
              <span className={styles.resultEyebrow}>Best Match</span>
              <h2 className={styles.resultCrop}>{result.crop}</h2>
              <div className={styles.confidencePill}>
                <span className={styles.confidenceBar} style={{ width: `${result.confidence}%` }} />
                <span className={styles.confidenceText}>{result.confidence}% confidence</span>
              </div>
            </div>
            <div className={styles.resultInfo}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.infoIcon} aria-hidden="true">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p>
                This recommendation is derived from your soil nutrient profile (N, P, K),
                pH level, ambient temperature, humidity, and annual rainfall — cross-matched
                against verified agronomic datasets.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}