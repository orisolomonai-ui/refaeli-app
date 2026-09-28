import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import TraineeDetail from "./pages/TraineeDetail";
import SplashScreen from "./components/SplashScreen";
import TraineeLayout from "./components/trainee-area/TraineeLayout";
import TraineeHome from "./pages/trainee/TraineeHome";
import TraineeProgress from "./pages/trainee/TraineeProgress";
import TraineeCash from "./pages/trainee/TraineeCash";
import TraineeCommunity from "./pages/trainee/TraineeCommunity";
import TraineeStore from "./pages/trainee/TraineeStore";
import { TraineesProvider } from "./context/TraineesContext";

const SPLASH_SEEN_KEY = "refaeli_entered";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* מערכת הניהול */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/trainee/:id" element={<TraineeDetail />} />
        {/* אזור המתאמן */}
        <Route path="/me" element={<TraineeHome />} />
        <Route path="/me/progress" element={<TraineeProgress />} />
        <Route path="/me/cash" element={<TraineeCash />} />
        <Route path="/me/community" element={<TraineeCommunity />} />
        <Route path="/me/store" element={<TraineeStore />} />
      </Routes>
    </AnimatePresence>
  );
}

// אזור המתאמן מקבל מעטפת כהה משלו; כל השאר נשאר עם הכותרת של מערכת הניהול
function AppShell() {
  const { pathname } = useLocation();
  const isTraineeArea = pathname === "/me" || pathname.startsWith("/me/");
  const Shell = isTraineeArea ? TraineeLayout : Layout;
  return (
    <Shell>
      <AnimatedRoutes />
    </Shell>
  );
}

function SplashGate() {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(
    () => !sessionStorage.getItem(SPLASH_SEEN_KEY)
  );

  function dismiss() {
    sessionStorage.setItem(SPLASH_SEEN_KEY, "true");
    setShowSplash(false);
  }

  return (
    <AnimatePresence>
      {showSplash && (
        <SplashScreen
          onEnterTrainee={() => {
            dismiss();
            navigate("/me");
          }}
          onEnterAdmin={dismiss}
        />
      )}
    </AnimatePresence>
  );
}

function App() {
  return (
    <TraineesProvider>
      <BrowserRouter>
        <AppShell />
        <SplashGate />
      </BrowserRouter>
    </TraineesProvider>
  );
}

export default App;
