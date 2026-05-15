import { useState } from "react";
import axios from "axios";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import Navbar from "./Navbar";
import styles from "../styles/Weather.module.css";

const API = "http://localhost:5000";

const STAT_CARDS = (w) => [
  { icon: "🌡️", label: "Temperature",  value: `${w.current_temp}°C` },
  { icon: "🤔", label: "Feels Like",   value: `${w.feels_like}°C` },
  { icon: "🔻", label: "Min Temp",     value: `${w.temp_min}°C` },
  { icon: "🔺", label: "Max Temp",     value: `${w.temp_max}°C` },
  { icon: "💧", label: "Humidity",     value: `${w.humidity}%` },
  { icon: "🌀", label: "Pressure",     value: `${w.pressure} hPa` },
  { icon: "💨", label: "Wind Speed",   value: `${w.wind_speed} m/s` },
  { icon: "🧭", label: "Wind Dir",     value: w.wind_compass },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
}

export default function Weather() {
  const [city, setCity]       = useState("");
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) { setError("Please enter a city name."); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await axios.post(`${API}/weather/predict`, { city: city.trim() });
      setResult(res.data);
    } catch (e) {
      setError(e?.response?.data?.error || "Failed to fetch weather. Check city name.");
    } finally { setLoading(false); }
  };

  // Build chart data
  const tempData  = result?.forecast_times?.map((t, i) => ({ time: t, temp: result.forecast_temp[i] })) || [];
  const humidData = result?.forecast_times?.map((t, i) => ({ time: t, humidity: result.forecast_humid[i] })) || [];

  return (
    <div className={styles.page}>
      <Navbar />

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroGradient}>🌧 RainSense</span>
          </h1>
          <p className={styles.heroSub}>
            Real-time weather intelligence · ML-powered rainfall prediction
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.searchWrap}>
              <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Enter city name — e.g. Kolkata, Mumbai, Delhi..."
                value={city}
                onChange={e => { setCity(e.target.value); setError(""); }}
                autoFocus
              />
            </div>
            <button type="submit" className={styles.searchBtn} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : "Analyse →"}
            </button>
          </form>

          {error && <div className={styles.errorBox}>⚠ {error}</div>}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className={styles.loadingWrap}>
          <div className={styles.loadingDots}><span/><span/><span/></div>
          <p>Fetching weather & running ML prediction...</p>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className={styles.container}>

          {/* City header */}
          <div className={styles.cityHeader}>
            <div>
              <h2 className={styles.cityName}>📍 {result.city}, {result.country}</h2>
              <p className={styles.citySub}>
                {result.description} · Wind {result.wind_compass} · {result.wind_speed} m/s
              </p>
            </div>
          </div>

          {/* Rain prediction banner */}
          <div className={`${styles.rainBanner} ${result.rain_tomorrow ? styles.rainYes : styles.rainNo}`}>
            <div className={styles.rainIcon}>{result.rain_tomorrow ? "🌧️" : "☀️"}</div>
            <div className={styles.rainTitle}>
              {result.rain_tomorrow ? "Rain Expected Tomorrow" : "No Rain Tomorrow"}
            </div>
            <div className={styles.rainSub}>
              ML model predicts {result.rain_tomorrow ? "rainfall" : "clear skies"} based on current conditions
            </div>
          </div>

          {/* Stat cards */}
          <div className={styles.sectionTitle}>Current Conditions</div>
          <div className={styles.statsGrid}>
            {STAT_CARDS(result).map((s, i) => (
              <div key={i} className={styles.statCard}>
                <span className={styles.statCardIcon}>{s.icon}</span>
                <div className={styles.statLabel}>{s.label}</div>
                <div className={styles.statValue}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className={styles.sectionTitle}>5-Hour Forecast</div>
          <div className={styles.chartsGrid}>

            {/* Temperature line chart */}
            <div className={styles.chartCard}>
              <h4 className={styles.chartTitle}>Temperature Forecast (°C)</h4>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={tempData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="temp" name="Temp °C"
                    stroke="#f97316" strokeWidth={2.5}
                    dot={{ fill: "#f97316", r: 4, strokeWidth: 2, stroke: "#0b0f1a" }}
                    activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Humidity bar chart */}
            <div className={styles.chartCard}>
              <h4 className={styles.chartTitle}>Humidity Forecast (%)</h4>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={humidData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="humidity" name="Humidity %" radius={[6, 6, 0, 0]}>
                    {humidData.map((_, i) => (
                      <Cell key={i}
                        fill={`rgb(${Math.round(29 + (67 * i / 4))}, ${Math.round(78 + (87 * i / 4))}, ${Math.round(216 - (56 * i / 4))})`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Forecast table */}
          <div className={styles.sectionTitle}>Hourly Breakdown</div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Temperature (°C)</th>
                  <th>Humidity (%)</th>
                </tr>
              </thead>
              <tbody>
                {result.forecast_times.map((t, i) => (
                  <tr key={i}>
                    <td>{t}</td>
                    <td>{result.forecast_temp[i]}°C</td>
                    <td>{result.forecast_humid[i]}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Search again */}
          <button className={styles.resetBtn}
            onClick={() => { setResult(null); setCity(""); }}>
            🔍 Search Another City
          </button>

        </div>
      )}
    </div>
  );
}