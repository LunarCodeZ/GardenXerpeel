import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="full-loader" role="status" aria-live="polite">
        <span className="loader-dot" />
        <span>Menyiapkan dashboard…</span>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin" replace state={{ from: location.pathname }} />;
  }

  return children;
}
