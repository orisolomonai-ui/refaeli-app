import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import TraineeDetail from "./pages/TraineeDetail";
import SplashScreen from "./components/SplashScreen";
import { TraineesProvider } from "./context/TraineesContext";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/trainee/:id" element={<TraineeDetail />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(
    () => !sessionStorage.getItem("refaeli_entered")
  );

  function handleEnter() {
    sessionStorage.setItem("refaeli_entered", "true");
    setShowSplash(false);
  }

  return (
    <TraineesProvider>
      <BrowserRouter>
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </BrowserRouter>
      <AnimatePresence>
        {showSplash && <SplashScreen onEnter={handleEnter} />}
      </AnimatePresence>
    </TraineesProvider>
  );
}

export default App;
