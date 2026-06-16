import { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import styles from "../styles/FertilizerPrediction.module.css";

function FertilizerPrediction() {
  const [formData, setFormData] = useState({
    temperature: "",
    humidity: "",
    moisture: "",
    soil: "",
    crop: "",
    nitrogen: "",
    potassium: "",
    phosphorus: "",
  });

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setResult("");

    try {
      const response = await axios.post(
        "http://localhost:5000/fertilizer",
        formData
      );

      setResult(response.data.fertilizer);
    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(error.response.data.error || "Backend Error");
      } else {
        alert("Unable to connect to Flask backend");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
       {/* Hero */}
            <div className={styles.hero}>
              <div className={styles.heroContent}>
                <span className={styles.eyebrow}>🤖 ML-Powered</span>
                <h1 className={styles.heroTitle}>Smart Fertilizer Predictor</h1>
                <p className={styles.heroSub}>
                  Enter your farm details and get an AI-powered prediction of expected Fertilizer 
                  — backed by real agricultural data.
                </p>
              </div>
            </div>
      <div className={styles.container}>
        <h1>🌱 AgroVeda</h1>
        <h2>Fertilizer Recommendation System</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
            
          <input
            type="number"
            name="temperature"
            placeholder="Temperature"
            value={formData.temperature}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="humidity"
            placeholder="Humidity"
            value={formData.humidity}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="moisture"
            placeholder="Moisture"
            value={formData.moisture}
            onChange={handleChange}
            required
          />

          <select
            name="soil"
            value={formData.soil}
            onChange={handleChange}
            required
          >
            <option value="">Select Soil Type</option>
            <option value="Black">Black</option>
            <option value="Clayey">Clayey</option>
            <option value="Loamy">Loamy</option>
            <option value="Red">Red</option>
            <option value="Sandy">Sandy</option>
          </select>

          <select
            name="crop"
            value={formData.crop}
            onChange={handleChange}
            required
          >
            <option value="">Select Crop</option>
            <option value="Barley">Barley</option>
            <option value="Cotton">Cotton</option>
            <option value="Ground Nuts">Ground Nuts</option>
            <option value="Maize">Maize</option>
            <option value="Millets">Millets</option>
            <option value="Oil seeds">Oil seeds</option>
            <option value="Paddy">Paddy</option>
            <option value="Pulses">Pulses</option>
            <option value="Sugarcane">Sugarcane</option>
            <option value="Tobacco">Tobacco</option>
            <option value="Wheat">Wheat</option>
          </select>

          <input
            type="number"
            name="nitrogen"
            placeholder="Nitrogen"
            value={formData.nitrogen}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="potassium"
            placeholder="Potassium"
            value={formData.potassium}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="phosphorus"
            placeholder="Phosphorus"
            value={formData.phosphorus}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Predicting..." : "Predict Fertilizer"}
          </button>
        </form>

        {result && (
          <div className={styles.result}>
            <h3>Recommended Fertilizer</h3>
            <p>{result}</p>
          </div>
        )}
      </div>
    </>
  );
}

export default FertilizerPrediction;
