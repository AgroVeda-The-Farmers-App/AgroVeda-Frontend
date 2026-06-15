import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { database } from "./firebase";
import { ref, onValue } from "firebase/database";
import styles from "../styles/CheckMoisture.module.css";

function CheckMoisture() {
  const [moisture, setMoisture] = useState(0);

  useEffect(() => {
    const moistureRef = ref(database, "soilMoisturePercent");

    const unsubscribe = onValue(moistureRef, (snapshot) => {
      const data = snapshot.val();

      
      setMoisture(data ?? 0);
    });

    
    return () => unsubscribe();
  }, []);

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>🤖 IOT-Powered</span>
          <h1 className={styles.heroTitle}>
            Real Time Soil Moisture Detector
          </h1>
          <p className={styles.heroSub}>
            Live monitoring of soil conditions using IoT sensors
          </p>
        </div>
      </div>

      {/* Main Dashboard Card */}
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.label}>Soil Moisture Level</h2>

          <h1 className={styles.value}>
            {moisture}
            <span className={styles.percent}>%</span>
          </h1>
        </div>
      </div>
    </>
  );
}

export default CheckMoisture;