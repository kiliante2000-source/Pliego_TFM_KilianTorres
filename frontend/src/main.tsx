import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { installPortfolioStudio } from './lib/portfolioStudio';

installPortfolioStudio();

try {
  const raw = localStorage.getItem('pliego-studio-prefs-v1');
  if (raw) {
    const prefs = JSON.parse(raw) as { reduceMotion?: boolean };
    if (prefs.reduceMotion) document.documentElement.classList.add('pliego-reduce-motion');
  }
} catch {
  /* ignore */
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
