import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import CropCalendar from "./components/Cropcalendar";
import News from "./components/News";
import YieldPredictor from "./components/YieldPredictor";
import Weather from "./components/Weather";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                element={<Home />} />
        <Route path="/login"           element={<Login />} />
        <Route path="/signup"          element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/crop-calendar"   element={<CropCalendar />} />
        <Route path="/news"            element={<News/>}/>
        <Route path="/yield-predictor"            element={<YieldPredictor/>}/>
        <Route path="/weather"            element={<Weather/>}/>
  
      </Routes>
    </BrowserRouter>
  );
}

export default App;