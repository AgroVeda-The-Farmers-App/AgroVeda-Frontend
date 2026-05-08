import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import styles from "../styles/News.module.css";

const API = "http://localhost:5000";

const TABS = [
  { key: "general",  label: <i className="bi bi-newspaper"></i>,      desc: "Latest agriculture news from India" },
  { key: "organic",  label: "🍃 Organic",       desc: "Organic & natural farming updates" },
  { key: "msp",      label: "📊 MSP & Prices",  desc: "Minimum support price & mandi rates" },
  { key: "agritech", label: "🤖 Agri-Tech",     desc: "Tech innovation in farming" },
  { key: "weather",  label: "🌦️ Weather",       desc: "Live farm weather & advisory" },
];

const CITIES = [
  "Patna","Lucknow","Bhopal","Jaipur","Hyderabad","Pune","Nagpur",
  "Chandigarh","Bhubaneswar","Guwahati","Kolkata","Chennai","Bangalore",
  "Ahmedabad","Indore","Varanasi","Agra","Surat","Coimbatore","Visakhapatnam"
];

const ADVISORY_ICONS = { info: "🌧️", warning: "⚠️", success: "✅" };
const ADVISORY_CLASS = { info: styles.advisoryInfo, warning: styles.advisoryWarning, success: styles.advisorySuccess };

const FORECAST_ICONS = {
  Rain: "🌧️", Thunderstorm: "⛈️", Snow: "❄️", Clear: "☀️",
  Clouds: "⛅", Drizzle: "🌦️", Mist: "🌫️", Fog: "🌫️",
};

export default function News() {
  const [activeTab, setActiveTab]     = useState("general");
  const [articles, setArticles]       = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [city, setCity]               = useState("Kolkata");
  const [customCity, setCustomCity]   = useState("");
  const [weather, setWeather]         = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError]     = useState("");

  const fetchNews = useCallback(async (tab) => {
    setLoading(true); setError(""); setArticles([]);
    try {
      const res = await axios.get(`${API}/news?tab=${tab}`);
      setArticles(res.data.articles || []);
    } catch {
      setError("Failed to load news. Please try again.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (activeTab !== "weather") fetchNews(activeTab);
  }, [activeTab, fetchNews]);

  const handleWeather = async () => {
    const target = customCity.trim() || city;
    setWeatherLoading(true); setWeatherError(""); setWeather(null);
    try {
      const res = await axios.get(`${API}/weather?city=${encodeURIComponent(target)}`);
      setWeather(res.data.data);
    } catch (e) {
      setWeatherError(e?.response?.data?.error || "Failed to fetch weather.");
    } finally { setWeatherLoading(false); }
  };

  return (
    <div className={styles.page}>
      <Navbar />

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>📰 Live Updates</span>
          <h1 className={styles.heroTitle}>Agroveda News</h1>
          <p className={styles.heroSub}>Latest agricultural news, market prices and weather — all in one place.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabBar}>
        <div className={styles.tabList}>
          {TABS.map(t => (
            <button key={t.key}
              className={`${styles.tab} ${activeTab === t.key ? styles.tabActive : ""}`}
              onClick={() => setActiveTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.container}>

        {/* Tab description */}
        <p className={styles.tabDesc}>
          {TABS.find(t => t.key === activeTab)?.desc}
        </p>

        {/* ── NEWS TABS ── */}
        {activeTab !== "weather" && (
          <>
            {loading && (
              <div className={styles.loadingWrap}>
                <div className={styles.loadingDots}><span/><span/><span/></div>
                <p>Fetching latest news...</p>
              </div>
            )}

            {error && (
              <div className={styles.errorBox}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="#DC2626" strokeWidth="1.5"/>
                  <path d="M8 5v3M8 10.5v.5" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}

            {!loading && !error && articles.length === 0 && (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📭</div>
                <p>No articles found right now. Try again later.</p>
              </div>
            )}

            <div className={styles.newsGrid}>
              {articles.map((a, i) => (
                <div key={i} className={styles.newsCard}>
                  {a.image_url && (
                    <div className={styles.cardImg}>
                      <img src={a.image_url} alt={a.title}
                        onError={e => { e.target.parentNode.style.display = "none"; }} />
                    </div>
                  )}
                  <div className={styles.cardBody}>
                    <div className={styles.cardMeta}>
                      {a.source && <span className={styles.cardSource}>{a.source}</span>}
                      {a.pubDate && <span className={styles.cardDate}>📅 {a.pubDate}</span>}
                    </div>
                    <h3 className={styles.cardTitle}>{a.title}</h3>
                    {a.description && (
                      <p className={styles.cardDesc}>
                        {a.description.length > 160 ? a.description.slice(0, 160) + "..." : a.description}
                      </p>
                    )}
                    {a.link && (
                      <a href={a.link} target="_blank" rel="noopener noreferrer" className={styles.cardLink}>
                        Read Full Article →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── WEATHER TAB ── */}
        {activeTab === "weather" && (
          <div className={styles.weatherWrap}>

            {/* City selector */}
            <div className={styles.weatherSelector}>
              <div className={styles.weatherSelectGroup}>
                <label className={styles.weatherLabel}>Select City</label>
                <div className={styles.selectBox}>
                  <select className={styles.select} value={city}
                    onChange={e => setCity(e.target.value)}>
                    {CITIES.sort().map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className={styles.weatherSelectGroup}>
                <label className={styles.weatherLabel}>Or type any city</label>
                <input className={styles.cityInput} type="text"
                  placeholder="e.g. Varanasi, Muzaffarpur..."
                  value={customCity}
                  onChange={e => setCustomCity(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleWeather()} />
              </div>
              <button className={styles.weatherBtn} onClick={handleWeather} disabled={weatherLoading}>
                {weatherLoading ? <><span className={styles.spinner}/> Loading...</> : "Get Weather →"}
              </button>
            </div>

            {weatherError && (
              <div className={styles.errorBox}>{weatherError}</div>
            )}

            {weather && (
              <div className={styles.weatherResult}>

                {/* Current weather */}
                <div className={styles.weatherCard}>
                  <div className={styles.weatherCityRow}>
                    <h2 className={styles.weatherCity}>📍 {weather.city}, India</h2>
                    <span className={styles.weatherCondBadge}>{weather.condition}</span>
                  </div>
                  <div className={styles.weatherStats}>
                    {[
                      { icon: "🌡️", label: "Temperature", value: `${weather.temp} °C` },
                      { icon: "💧", label: "Humidity",    value: `${weather.humidity} %` },
                      { icon: "💨", label: "Wind Speed",  value: `${weather.wind_speed} m/s` },
                      { icon: "☁️", label: "Condition",   value: weather.condition },
                    ].map(s => (
                      <div key={s.label} className={styles.weatherStat}>
                        <span className={styles.weatherStatIcon}>{s.icon}</span>
                        <span className={styles.weatherStatValue}>{s.value}</span>
                        <span className={styles.weatherStatLabel}>{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Advisory */}
                <div className={`${styles.advisory} ${ADVISORY_CLASS[weather.advisory.type]}`}>
                  <span className={styles.advisoryIcon}>
                    {ADVISORY_ICONS[weather.advisory.type]}
                  </span>
                  <div>
                    <p className={styles.advisoryTitle}>Farming Advisory</p>
                    <p className={styles.advisoryText}>{weather.advisory.text}</p>
                  </div>
                </div>

                {/* 5-day forecast */}
                <div className={styles.forecastWrap}>
                  <h3 className={styles.forecastTitle}>📅 5-Day Forecast</h3>
                  <div className={styles.forecastGrid}>
                    {weather.forecast.map((f, i) => (
                      <div key={i} className={styles.forecastCard}>
                        <span className={styles.forecastDay}>{f.day}</span>
                        <span className={styles.forecastIcon}>
                          {FORECAST_ICONS[f.icon] || "🌤️"}
                        </span>
                        <span className={styles.forecastTemp}>{f.temp}°C</span>
                        <span className={styles.forecastDesc}>{f.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}