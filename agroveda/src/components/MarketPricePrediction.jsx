// import { useEffect, useState } from "react";
// import axios from "axios";
// import Navbar from "./Navbar";
// import styles from "../styles/MarketPricePrediction.module.css";

// const API = "http://localhost:5000";

// export default function MarketPricePrediction() {
//   const [states, setStates] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [markets, setMarkets] = useState([]);
//   const [commodities, setCommodities] = useState([]);
//   const [varieties, setVarieties] = useState([]);

//   const [form, setForm] = useState({
//     state: "",
//     district: "",
//     market: "",
//     commodity: "",
//     variety: "",
//   });

//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     axios.get(`${API}/market/states`)
//       .then(res => setStates(res.data.states));

//     axios.get(`${API}/market/districts`)
//       .then(res => setDistricts(res.data.districts));

//     axios.get(`${API}/market/markets`)
//       .then(res => setMarkets(res.data.markets));

//     axios.get(`${API}/market/commodities`)
//       .then(res => setCommodities(res.data.commodities));

//     axios.get(`${API}/market/varieties`)
//       .then(res => setVarieties(res.data.varieties));
//   }, []);

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handlePredict = async () => {
//     if (
//       !form.state ||
//       !form.district ||
//       !form.market ||
//       !form.commodity ||
//       !form.variety
//     ) {
//       setError("Please select all fields.");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");
//       setResult(null);

//       const res = await axios.post(
//         `${API}/market/predict`,
//         form
//       );

//       setResult(res.data);
//     } catch (err) {
//       setError(
//         err?.response?.data?.error ||
//         "Prediction failed."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles.page}>
//       <Navbar />

//       <div className={styles.hero}>
//         <h1>📈 Market Price Prediction</h1>
//         <p>
//           Predict mandi prices using historical agricultural market data.
//         </p>
//       </div>

//       <div className={styles.container}>
//         <div className={styles.card}>

//           <div className={styles.grid}>

//             <div className={styles.field}>
//               <label>State</label>
//               <select
//                 name="state"
//                 value={form.state}
//                 onChange={handleChange}
//                 className={styles.select}
//               >
//                 <option value="">Select State</option>
//                 {states.map((item) => (
//                   <option key={item} value={item}>
//                     {item}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className={styles.field}>
//               <label>District</label>
//               <select
//                 name="district"
//                 value={form.district}
//                 onChange={handleChange}
//                 className={styles.select}
//               >
//                 <option value="">Select District</option>
//                 {districts.map((item) => (
//                   <option key={item} value={item}>
//                     {item}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className={styles.field}>
//               <label>Market</label>
//               <select
//                 name="market"
//                 value={form.market}
//                 onChange={handleChange}
//                 className={styles.select}
//               >
//                 <option value="">Select Market</option>
//                 {markets.map((item) => (
//                   <option key={item} value={item}>
//                     {item}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className={styles.field}>
//               <label>Commodity</label>
//               <select
//                 name="commodity"
//                 value={form.commodity}
//                 onChange={handleChange}
//                 className={styles.select}
//               >
//                 <option value="">Select Commodity</option>
//                 {commodities.map((item) => (
//                   <option key={item} value={item}>
//                     {item}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className={styles.field}>
//               <label>Variety</label>
//               <select
//                 name="variety"
//                 value={form.variety}
//                 onChange={handleChange}
//                 className={styles.select}
//               >
//                 <option value="">Select Variety</option>
//                 {varieties.map((item) => (
//                   <option key={item} value={item}>
//                     {item}
//                   </option>
//                 ))}
//               </select>
//             </div>

//           </div>

//           <button
//             className={styles.predictBtn}
//             onClick={handlePredict}
//             disabled={loading}
//           >
//             {loading ? "Predicting..." : "Predict Prices"}
//           </button>

//           {error && (
//             <div className={styles.error}>
//               {error}
//             </div>
//           )}
//         </div>

//         {result && (
//           <div className={styles.resultCard}>
//             <h2>Predicted Market Prices</h2>

//             <div className={styles.priceGrid}>

//               <div className={styles.priceBox}>
//                 <span>Min Price</span>
//                 <h3>₹ {result.min_price}</h3>
//               </div>

//               <div className={styles.priceBox}>
//                 <span>Max Price</span>
//                 <h3>₹ {result.max_price}</h3>
//               </div>

//               <div className={styles.priceBox}>
//                 <span>Modal Price</span>
//                 <h3>₹ {result.modal_price}</h3>
//               </div>

//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import styles from "../styles/MarketPricePrediction.module.css";

const API = "http://localhost:5000";

export default function MarketPricePrediction() {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [commodities, setCommodities] = useState([]);
  const [varieties, setVarieties] = useState([]);

  const [form, setForm] = useState({
    state: "",
    district: "",
    market: "",
    commodity: "",
    variety: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get(`${API}/market/states`).then((res) => setStates(res.data.states));
    axios.get(`${API}/market/districts`).then((res) => setDistricts(res.data.districts));
    axios.get(`${API}/market/markets`).then((res) => setMarkets(res.data.markets));
    axios.get(`${API}/market/commodities`).then((res) => setCommodities(res.data.commodities));
    axios.get(`${API}/market/varieties`).then((res) => setVarieties(res.data.varieties));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePredict = async () => {
    if (!form.state || !form.district || !form.market || !form.commodity || !form.variety) {
      setError("Please select all fields before predicting.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setResult(null);
      const res = await axios.post(`${API}/market/predict`, form);
      setResult(res.data);
    } catch (err) {
      setError(err?.response?.data?.error || "Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectFields = [
    { name: "state", label: "State", options: states, icon: "🗺" },
    { name: "district", label: "District", options: districts, icon: "📍" },
    { name: "market", label: "Market", options: markets, icon: "🏛" },
    { name: "commodity", label: "Commodity", options: commodities, icon: "🌾" },
    { name: "variety", label: "Variety", options: varieties, icon: "🔖" },
  ];

  return (
    <div className={styles.page}>
      <Navbar />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroEyebrow}>Agricultural Intelligence</div>
          <h1 className={styles.heroTitle}>Mandi Price Forecasting</h1>
          <p className={styles.heroSubtitle}>
            Query historical market data across India's regulated mandis to receive
            predictive price ranges for any commodity-variety pair.
          </p>
        </div>
        <div className={styles.heroAccent} aria-hidden="true">
          <span>₹</span>
        </div>
      </section>

      {/* Main */}
      <main className={styles.main}>

        {/* Form Panel */}
        <div className={styles.formPanel}>
          <div className={styles.formHeader}>
            <span className={styles.formTag}>Query Parameters</span>
            <h2 className={styles.formTitle}>Select Market Details</h2>
          </div>

          <div className={styles.fieldsGrid}>
            {selectFields.map(({ name, label, options, icon }) => (
              <div className={styles.field} key={name}>
                <label className={styles.label} htmlFor={name}>
                  <span className={styles.labelIcon}>{icon}</span>
                  {label}
                </label>
                <div className={styles.selectWrap}>
                  <select
                    id={name}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="">Choose {label}</option>
                    {options.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                  <span className={styles.selectChevron} aria-hidden="true">↓</span>
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className={styles.errorBanner} role="alert">
              <span className={styles.errorIcon}>⚠</span>
              {error}
            </div>
          )}

          <button
            className={styles.predictBtn}
            onClick={handlePredict}
            disabled={loading}
          >
            {loading ? (
              <span className={styles.btnLoading}>
                <span className={styles.spinner} />
                Analysing market data…
              </span>
            ) : (
              <span>Predict Prices →</span>
            )}
          </button>
        </div>

        {/* Result Board */}
        {result && (
          <div className={styles.resultBoard}>
            <div className={styles.boardHeader}>
              <span className={styles.boardLabel}>Live Forecast</span>
              <span className={styles.boardBadge}>Today's Estimate</span>
            </div>

            <div className={styles.commodity}>
              {form.commodity}
              {form.variety && (
                <span className={styles.varietyTag}>{form.variety}</span>
              )}
            </div>
            <div className={styles.marketMeta}>
              {form.market} · {form.district}, {form.state}
            </div>

            <div className={styles.priceRow}>
              <div className={styles.priceItem}>
                <span className={styles.priceLabel}>Minimum</span>
                <span className={styles.priceValue}>
                  <span className={styles.rupee}>₹</span>
                  {Number(result.min_price).toLocaleString("en-IN")}
                </span>
                <span className={styles.priceUnit}>per quintal</span>
              </div>

              <div className={`${styles.priceItem} ${styles.priceItemModal}`}>
                <span className={styles.priceLabel}>Modal</span>
                <span className={`${styles.priceValue} ${styles.priceValueModal}`}>
                  <span className={styles.rupee}>₹</span>
                  {Number(result.modal_price).toLocaleString("en-IN")}
                </span>
                <span className={styles.priceUnit}>most traded</span>
              </div>

              <div className={styles.priceItem}>
                <span className={styles.priceLabel}>Maximum</span>
                <span className={styles.priceValue}>
                  <span className={styles.rupee}>₹</span>
                  {Number(result.max_price).toLocaleString("en-IN")}
                </span>
                <span className={styles.priceUnit}>per quintal</span>
              </div>
            </div>

            <div className={styles.rangeBar}>
              <div className={styles.rangeBarTrack}>
                <div
                  className={styles.rangeBarFill}
                  style={{
                    width: `${Math.min(
                      100,
                      ((result.modal_price - result.min_price) /
                        Math.max(1, result.max_price - result.min_price)) *
                        100
                    )}%`,
                  }}
                />
              </div>
              <div className={styles.rangeLabels}>
                <span>Min ₹{Number(result.min_price).toLocaleString("en-IN")}</span>
                <span>Max ₹{Number(result.max_price).toLocaleString("en-IN")}</span>
              </div>
            </div>

            <p className={styles.disclaimer}>
              Predictions based on historical mandi data. Prices may vary due to
              seasonal and regional factors.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

