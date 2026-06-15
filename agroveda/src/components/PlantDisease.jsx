import { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import styles from "../styles/PlantDisease.module.css";

function PlantDisease() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/plant-disease",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Error detecting disease");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className={styles.diseaseContainer}>
        <h2>🌿 Plant Disease Detection</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className={styles.previewImage}
            />
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Detecting..." : "Detect Disease"}
          </button>
        </form>

        {result && (
          <div className={styles.result}>
            <h3>Prediction Result</h3>

            <p>
              <strong>Disease:</strong> {result.disease}
            </p>

            <p>
              <strong>Confidence:</strong>{" "}
              {result.confidence}%
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default PlantDisease;
