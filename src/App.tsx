import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';

// Carga diferida — cada página se convierte en un chunk separado
const Home        = lazy(() => import('./pages/Home'))
const PQRS        = lazy(() => import('./pages/PQRS'))
const Cobertura   = lazy(() => import('./pages/Cobertura'))
const Legal       = lazy(() => import('./pages/Legal'))
const LegalPage   = lazy(() => import('./pages/LegalPage'))
const Solicitud   = lazy(() => import('./pages/Solicitud'))
const GeminiLiveWidget = lazy(() =>
  import('./components/GeminiLiveWidget').then(m => ({ default: m.GeminiLiveWidget }))
)

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark">
      <div className="w-8 h-8 border-2 border-brand-action border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/"             element={<Home />} />
          <Route path="/pqrs"         element={<PQRS />} />
          <Route path="/cobertura"    element={<Cobertura />} />
          <Route path="/legal"        element={<Legal />} />
          <Route path="/legal/:slug"  element={<LegalPage />} />
          <Route path="/solicitud"    element={<Solicitud />} />
        </Routes>
      </Suspense>
      {/* Widget Global Chat Inteligente */}
      <Suspense fallback={null}>
        <GeminiLiveWidget />
      </Suspense>
    </Router>
  );
}

export default App;
