import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next';
import i18n from './config/i18n';
import { registerLicense } from '@syncfusion/ej2-base';

// Registering Syncfusion license key
registerLicense('Ngo9BigBOggjHTQxAR8/V1NBaF1cXmhPYVF3WmFZfVpgc19HaFZTRmYuP1ZhSXxXdkBhW39ZcXxXRWhbUkA=');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <BrowserRouter><App /></BrowserRouter>
    </I18nextProvider>
  </React.StrictMode>,
)
