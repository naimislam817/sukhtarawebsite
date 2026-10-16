import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import RoomsPage from './pages/RoomsPage';
import RoomDetailPage from './pages/RoomDetailPage';
import FacilityPage from './pages/FacilityPage';
import BookPage from './pages/BookPage';

// Admin
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminRoomsPage from './pages/admin/AdminRoomsPage';
import AdminHomepageImagesPage from './pages/admin/AdminHomepageImagesPage';
import AdminRasunPage from './pages/admin/AdminRasunPage';
import AdminBanquetPage from './pages/admin/AdminBanquetPage';
import AdminSkylightPage from './pages/admin/AdminSkylightPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import ProtectedRoute from './components/admin/ProtectedRoute';

import './styles/global.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public Site ─────────────────────────────────── */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/rooms/:slug" element={<RoomDetailPage />} />
          <Route path="/facilities/:slug" element={<FacilityPage />} />
          <Route path="/book" element={<BookPage />} />
        </Route>

        {/* ── Admin Panel ──────────────────────────────────── */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/rooms" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="rooms" element={<AdminRoomsPage />} />
          <Route path="homepage-images" element={<AdminHomepageImagesPage />} />
          <Route path="restaurant" element={<AdminRasunPage />} />
          <Route path="banquet" element={<AdminBanquetPage />} />
          <Route path="skylight" element={<AdminSkylightPage />} />
          <Route path="bookings" element={<AdminBookingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
