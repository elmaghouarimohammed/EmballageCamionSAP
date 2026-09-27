import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

(function securityHardening() {
  if (window !== window.top) {
    try {
      window.top.location = window.location;
    } catch {
      document.documentElement.style.display = 'none';
      throw new Error('Framing denied by EmballageCamionSAP security policy.');
    }
  }

  try {
    // eslint-disable-next-line no-undef
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' && import.meta.env.PROD) {
      // eslint-disable-next-line no-undef
      Object.freeze(__REACT_DEVTOOLS_GLOBAL_HOOK__);
      try {
        // eslint-disable-next-line no-undef
        delete window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
      } catch {
        // ignore non-configurable props
      }
    }
  } catch {
    // ignore
  }

  try {
    window.Function.prototype.constructor = function () {}.constructor;
  } catch {
    // ignore
  }

  try {
    Object.freeze(Math);
    Object.freeze(JSON);
    Object.freeze(Object.prototype);
  } catch {
    // ignore
  }
})();

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Root element #root not found — cannot bootstrap EmballageCamionSAP.');
}

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
