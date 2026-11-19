import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PublicLayout from './components/PublicLayout.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import PlantDetailPage from './pages/PlantDetailPage.jsx';
import AdminLoginPage from './pages/AdminLoginPage.jsx';
import AdminOverviewPage from './pages/AdminOverviewPage.jsx';
import AdminPlantsPage from './pages/AdminPlantsPage.jsx';
import AdminPlantFormPage from './pages/AdminPlantFormPage.jsx';
import AdminQrPage from './pages/AdminQrPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/plants/:slug" element={<PlantDetailPage />} />
          </Route>

          <Route path="/admin" element={<AdminLoginPage />} />

          <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route path="/admin/overview" element={<AdminOverviewPage />} />
            <Route path="/admin/plants" element={<AdminPlantsPage />} />
            <Route path="/admin/plants/new" element={<AdminPlantFormPage />} />
            <Route path="/admin/plants/:id/edit" element={<AdminPlantFormPage />} />
            <Route path="/admin/qr" element={<AdminQrPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
