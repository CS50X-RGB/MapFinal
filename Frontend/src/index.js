import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { store } from './store';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { NextUIProvider } from '@nextui-org/react';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js')
    .then((registration) => {
      console.log('Service Worker registered with scope', registration);
    })
    .catch((error) => {
      console.error('Error registering Service Worker:', error);
    })
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <NextUIProvider>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </NextUIProvider>
);

reportWebVitals();
