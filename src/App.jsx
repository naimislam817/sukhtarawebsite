import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import RoomsPage from './pages/RoomsPage';
import RoomDetailPage from './pages/RoomDetailPage';
import FacilityPage from './pages/FacilityPage';
import BookPage from './pages/BookPage';
import './styles/global.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/rooms/:slug" element={<RoomDetailPage />} />
          <Route path="/facilities/:slug" element={<FacilityPage />} />
          <Route path="/book" element={<BookPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
