import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Leaf, LockKey, EnvelopeSimple, WarningCircle } from '@phosphor-icons/react';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminLoginPage() {
  const { admin, loading, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && admin) {
    return <Navigate to="/admin/overview" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/admin/overview', { replace: true });
    } catch (err) {
      setError(err.message || 'Tidak dapat masuk. Periksa email dan kata sandi.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-shell">
      <aside className="login-aside">
        <Link className="brand on-dark" to="/" aria-label="Digital Garden, kembali ke beranda">
          <span className="brand-mark on-dark" aria-hidden="true">
            <Leaf weight="fill" size={20} />
          </span>
          <span className="brand-copy">
            <strong>Digital Garden</strong>
            <small>Kokulikuler</small>
          </span>
        </Link>

        <div className="login-quote">
          <span className="eyebrow light">Ruang pengelola</span>
          <h2>Taman yang rapi dimulai dari informasi yang terawat.</h2>
          <p>
            Perbarui profil tanaman, terbitkan konten yang sudah diverifikasi,
            dan siapkan QR Code untuk dipasang di dekat tanaman.
          </p>
        </div>

        <div className="login-aside-footer">
          <span className="leaf-line" aria-hidden="true">
            <Leaf size={18} />
            <Leaf size={18} />
            <Leaf size={18} />
          </span>
          <p>Satu sumber data untuk seluruh papan QR di taman.</p>
        </div>
      </aside>

      <main className="login-main">
        <Link className="back-link" to="/">
          <ArrowLeft size={16} aria-hidden="true" />
          Kembali ke halaman publik
        </Link>

        <div className="login-card">
          <span className="eyebrow">Masuk pengelola</span>
          <h1>Selamat datang kembali.</h1>
          <p className="login-lead">
            Gunakan akun admin untuk mengelola data tanaman dan QR Code.
          </p>

          {error && (
            <div className="notice error compact" role="alert">
              <WarningCircle size={18} aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <label htmlFor="email">Email</label>
            <div className="input-with-icon">
              <EnvelopeSimple size={18} aria-hidden="true" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@contoh.id"
                required
              />
            </div>

            <label htmlFor="password">Kata sandi</label>
            <div className="input-with-icon">
              <LockKey size={18} aria-hidden="true" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Masukkan kata sandi"
                required
              />
            </div>

            <button className="button primary wide" type="submit" disabled={submitting}>
              {submitting ? 'Memeriksa akun…' : 'Masuk ke dashboard'}
              {!submitting && <ArrowRight size={17} aria-hidden="true" />}
            </button>
          </form>

          <p className="login-help">
            Belum memiliki akun? Hubungi pengelola sistem untuk pembuatan akun admin.
          </p>
        </div>
      </main>
    </div>
  );
}
