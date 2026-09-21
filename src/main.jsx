import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { HotelProvider } from './context/HotelContext';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <HotelProvider>
      <App />
    </HotelProvider>
  </AuthProvider>
);
