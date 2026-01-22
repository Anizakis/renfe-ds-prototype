import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./styles/tokens.type.css";
import "./styles/tokens.icons.css";
import "./styles/tokens.colors.css";
import "./styles/tokens.spacing.css";
import "./styles/tokens.layout.css";
import "./styles/tokens.radius.css";
import "./styles/tokens.effects.css";
import "./index.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
