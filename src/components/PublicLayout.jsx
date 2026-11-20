import { Link, NavLink, Outlet } from 'react-router-dom';
import { Leaf, ArrowRight } from '@phosphor-icons/react';

export default function PublicLayout() {
  return (
    <div className="public-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <Link className="brand" to="/" aria-label="Digital Garden, kembali ke beranda">
            <span className="brand-mark" aria-hidden="true">
              <Leaf weight="fill" size={20} />
            </span>
            <span className="brand-copy">
              <strong>Digital Garden</strong>
              <small>Kokulikuler</small>
            </span>
          </Link>
          <nav className="site-nav" aria-label="Navigasi utama">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Tanaman
            </NavLink>
            <Link className="nav-admin" to="/admin">
              Masuk admin
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </nav>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <div className="footer-brand">
            <span className="brand-mark small" aria-hidden="true">
              <Leaf weight="fill" size={16} />
            </span>
            <div>
              <strong>Digital Garden</strong>
              <p>Informasi tanaman untuk siapa saja yang ingin mengenal dan merawatnya.</p>
            </div>
          </div>
          <div className="footer-links">
            <Link to="/">Daftar tanaman</Link>
            <Link to="/admin">Pengelolaan</Link>
          </div>
        </div>
        <p className="footer-note">
          Konten tanaman ditinjau oleh pengelola taman. Pindai QR di dekat tanaman untuk membuka halamannya.
        </p>
      </footer>
    </div>
  );
}
