import { NavLink, Outlet } from 'react-router-dom';
import { SquaresFour, Plant, QrCode, SignOut, Leaf } from '@phosphor-icons/react';
import { useAuth } from '../context/AuthContext.jsx';

const navItems = [
  { to: '/admin/overview', label: 'Overview', icon: SquaresFour },
  { to: '/admin/plants', label: 'Data Tanaman', icon: Plant },
  { to: '/admin/qr', label: 'QR Code', icon: QrCode },
];

function initials(name) {
  return String(name || 'A')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export default function AdminLayout() {
  const { admin, logout } = useAuth();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="brand-mark on-dark" aria-hidden="true">
            <Leaf weight="fill" size={20} />
          </span>
          <div>
            <strong>Digital Garden</strong>
            <small>Ruang pengelola</small>
          </div>
        </div>

        <nav className="admin-nav" aria-label="Navigasi dashboard">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => (isActive ? 'admin-nav-link active' : 'admin-nav-link')}
            >
              <Icon size={19} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user">
            <span className="avatar" aria-hidden="true">{initials(admin?.name)}</span>
            <div className="admin-user-copy">
              <strong>{admin?.name || 'Admin'}</strong>
              <small>{admin?.email || ''}</small>
            </div>
          </div>
          <button type="button" className="logout-button" onClick={logout}>
            <SignOut size={18} aria-hidden="true" />
            Keluar
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="eyebrow">Dashboard pengelola</span>
            <p className="topbar-note">Perbarui konten, terbitkan, dan siapkan QR tanaman.</p>
          </div>
          <div className="topbar-user">
            <span className="avatar small" aria-hidden="true">{initials(admin?.name)}</span>
            <span>{admin?.name || 'Admin'}</span>
          </div>
        </header>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
