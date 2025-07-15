import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* The landing page will be the main route */}
        <Route path="/" element={<LandingPage />} />
        
        {/* The map application will be at the "/app" route */}
        <Route path="/app" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;