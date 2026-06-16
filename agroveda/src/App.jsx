import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import CropCalendar from "./components/Cropcalendar";
import News from "./components/News";
import YieldPredictor from "./components/YieldPredictor";
import Weather from "./components/Weather";
import SupportBot from "./components/SupportBot";
import UserProfile from "./components/Userprofile";
import CropRecommendation from "./components/Croprecommendation";
import MarketPricePrediction from "./components/MarketPricePrediction";
import PlantDisease from "./components/PlantDisease";
import FertilizerPrediction from "./components/FertilizerPrediction";
import CheckMoisture from "./components/CheckMoisture";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/crop-calendar" element={<CropCalendar />} />
        <Route path="/news" element={<News />} />
        <Route path="/yield-predictor" element={<YieldPredictor />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/crop-recommendation" element={<CropRecommendation />} />
        <Route path="/market-prices" element={<MarketPricePrediction/>} />
        <Route path="/plant-disease" element={<PlantDisease/>} />
        <Route path="/fertilizer-predictor" element={<FertilizerPrediction/>} />
        <Route path="/soil-moisture" element={<CheckMoisture/>} />
      </Routes>

      <SupportBot userName="" />
    </BrowserRouter>
  );
}

export default App;