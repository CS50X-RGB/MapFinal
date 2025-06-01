import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { persistor, store } from './store';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { NextUIProvider } from '@nextui-org/react';
import { PersistGate } from 'redux-persist/integration/react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient,QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

if ('serviceWorker' in navigator) {
  navigator?.serviceWorker?.register('../firebase-messaging-sw.js')
  .then(function(registration) {
    console.log('Registration successful, scope is:', registration.scope);
  }).catch(function(err) {
    console.log('Service worker registration failed, error:', err);
  });
}
export const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<QueryClientProvider client={queryClient}>
  <NextUIProvider>
    <PersistGate loading={null} persistor={persistor} >
      <BrowserRouter>
        <Provider store={store}>
          <App />
          <Toaster />
        </Provider>
      </BrowserRouter>
    </PersistGate>
    <ReactQueryDevtools initialIsOpen={false} />
  </NextUIProvider>
</QueryClientProvider>
);

reportWebVitals();
