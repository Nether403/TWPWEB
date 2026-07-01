import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import HomePage from '@/pages/HomePage.jsx';
import InfoPage from '@/pages/InfoPage.jsx';
import ProcessoErgoSumPage from '@/pages/ProcessoErgoSumPage.jsx';
import TheGatePage from '@/pages/TheGatePage.jsx';
import FounderPage from '@/pages/FounderPage.jsx';
import NotFoundPage from '@/pages/NotFoundPage.jsx';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/info" element={<InfoPage />} />
            <Route path="/processo-ergo-sum" element={<ProcessoErgoSumPage />} />
            <Route path="/the-gate" element={<TheGatePage />} />
            <Route path="/founder" element={<FounderPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;