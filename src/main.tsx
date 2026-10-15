import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/dosis/400.css';
import '@fontsource/dosis/500.css';
import '@fontsource/dosis/600.css';
import '@fontsource/dosis/700.css';
import '@fontsource/dancing-script/600.css';
import '@fontsource/dancing-script/700.css';
import './styles.css';
import App from './App';

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
