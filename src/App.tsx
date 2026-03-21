import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PQRS from './pages/PQRS';
import Cobertura from './pages/Cobertura';
import Legal from './pages/Legal';
import LegalPage from './pages/LegalPage';

import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pqrs" element={<PQRS />} />
        <Route path="/cobertura" element={<Cobertura />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/legal/:slug" element={<LegalPage />} />
      </Routes>
    </Router>
  );
}

export default App;
