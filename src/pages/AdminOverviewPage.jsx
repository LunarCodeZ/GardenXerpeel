import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, CheckCircle, Clock, Plant, Plus, QrCode, WarningCircle,
} from '@phosphor-icons/react';
import { api, formatDateTime } from '../lib/api.js';
import StatusBadge from '../components/StatusBadge.jsx';
import LoadingState from '../components/LoadingState.jsx';

export default function AdminOverviewPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api('/api/admin/dashboard')
      .then((payload) => {
        if (active) setData(payload.data);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="page-stack">
      <header className="page-heading">
        <div>
          <span className="eyebrow">Overview</span>
          <h1>Taman yang terus bertumbuh.</h1>
          <p>Pantau koleksi, lengkapi konten, dan siapkan QR untuk setiap tanaman.</p>
        </div>
        <Link className="button primary" to="/admin/plants/new">
          <Plus size={18} aria-hidden="true" />
          Tambah tanaman
        </Link>
      </header>

      {loading && <LoadingState label="Memuat ringkasan taman…" />}
      {error && (
        <div className="notice error" role="alert">
          <WarningCircle size={18} aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {data && (
        <>
          <section className="stat-grid" aria-label="Ringkasan data tanaman">
            <article className="stat-card">
              <span className="stat-icon forest"><Plant size={22} aria-hidden="true" /></span>
              <div>
                <span className="stat-label">Total tanaman</span>
                <strong>{data.total}</strong>
                <small>Seluruh data di database</small>
              </div>
            </article>
            <article className="stat-card">
              <span className="stat-icon green"><CheckCircle size={22} aria-hidden="true" /></span>
              <div>
                <span className="stat-label">Terbit</span>
                <strong>{data.published}</strong>
                <small>Tampil di halaman publik</small>
              </div>
            </article>
            <article className="stat-card">
              <span className="stat-icon sand"><Clock size={22} aria-hidden="true" /></span>
              <div>
                <span className="stat-label">Draft</span>
                <strong>{data.draft}</strong>
                <small>Menunggu verifikasi konten</small>
              </div>
            </article>
          </section>

          <div className="overview-columns">
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h2>Tanaman terbaru</h2>
                  <p>Perubahan terakhir pada data tanaman.</p>
                </div>
                <Link className="text-link" to="/admin/plants">
                  Lihat semua
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>

              {data.recent.length === 0 ? (
                <div className="panel-empty">
                  <p>Belum ada data tanaman.</p>
                  <Link className="button secondary" to="/admin/plants/new">Tambah tanaman pertama</Link>
                </div>
              ) : (
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th scope="col">Tanaman</th>
                        <th scope="col">Status</th>
                        <th scope="col">Diperbarui</th>
                        <th scope="col"><span className="sr-only">Aksi</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recent.map((plant) => (
                        <tr key={plant.id}>
                          <td>
                            <span className="table-plant-name">{plant.name}</span>
                            <span className="table-plant-slug">/{plant.slug}</span>
                          </td>
                          <td><StatusBadge status={plant.status} /></td>
                          <td className="muted-cell">{formatDateTime(plant.updated_at)}</td>
                          <td className="align-right">
                            <Link className="row-link" to={`/admin/plants/${plant.id}/edit`} aria-label={`Edit ${plant.name}`}>
                              Edit
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <aside className="overview-side">
              <section className="panel quick-panel">
                <span className="panel-icon" aria-hidden="true"><QrCode size={22} /></span>
                <h2>Siapkan QR tanaman</h2>
                <p>
                  Unduh QR dalam format SVG atau PNG untuk dicetak dan dipasang
                  di dekat tanaman. URL tetap sama saat konten diperbarui.
                </p>
                <Link className="button secondary" to="/admin/qr">
                  Buka alat QR
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </section>

              <section className="panel tip-panel">
                <h2>Ingat sebelum terbit</h2>
                <ul>
                  <li>Verifikasi nama ilmiah dan identifikasi tanaman.</li>
                  <li>Pastikan foto benar-benar mewakili tanaman.</li>
                  <li>Hindari klaim manfaat tanpa sumber tepercaya.</li>
                </ul>
              </section>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}
