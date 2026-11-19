import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Eye, MagnifyingGlass, PencilSimple, Plus, QrCode, Trash, WarningCircle,
} from '@phosphor-icons/react';
import { api, formatDate } from '../lib/api.js';
import StatusBadge from '../components/StatusBadge.jsx';
import LoadingState from '../components/LoadingState.jsx';

export default function AdminPlantsPage() {
  const [plants, setPlants] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    api(`/api/admin-plants?q=${encodeURIComponent(debouncedQuery)}&page=${page}&limit=12`)
      .then((payload) => {
        if (!active) return;
        setPlants(payload.data);
        setMeta(payload.meta);
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
  }, [debouncedQuery, page, refreshKey]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteBusy(true);
    setError('');
    try {
      await api(`/api/admin-plant?id=${deleteTarget.id}`, { method: 'DELETE' });
      setDeleteTarget(null);
      if (plants.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        setRefreshKey((key) => key + 1);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleteBusy(false);
    }
  }

  return (
    <div className="page-stack">
      <header className="page-heading">
        <div>
          <span className="eyebrow">Data tanaman</span>
          <h1>Data tanaman</h1>
          <p>Kelola profil, foto, status publikasi, dan tautan QR setiap tanaman.</p>
        </div>
        <Link className="button primary" to="/admin/plants/new">
          <Plus size={18} aria-hidden="true" />
          Tambah tanaman
        </Link>
      </header>

      {error && (
        <div className="notice error" role="alert">
          <WarningCircle size={18} aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <section className="panel">
        <div className="panel-heading list-heading">
          <div>
            <h2>Daftar tanaman</h2>
            <p>{meta.total} tanaman tersimpan.</p>
          </div>
          <label className="search-field">
            <MagnifyingGlass size={18} aria-hidden="true" />
            <span className="sr-only">Cari tanaman</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari nama tanaman..."
            />
          </label>
        </div>

        {loading && plants.length === 0 && <LoadingState label="Memuat data tanaman…" />}

        {!loading && plants.length === 0 && (
          <div className="panel-empty">
            <p>{debouncedQuery ? 'Tidak ada tanaman yang cocok dengan pencarian.' : 'Belum ada data tanaman.'}</p>
            {debouncedQuery ? (
              <button type="button" className="text-link as-button" onClick={() => setQuery('')}>
                Hapus pencarian
              </button>
            ) : (
              <Link className="button secondary" to="/admin/plants/new">Tambah tanaman pertama</Link>
            )}
          </div>
        )}

        {plants.length > 0 && (
          <div className="table-wrap">
            <table className="data-table plants-table">
              <thead>
                <tr>
                  <th scope="col">Tanaman</th>
                  <th scope="col">Status</th>
                  <th scope="col">Diperbarui</th>
                  <th scope="col">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {plants.map((plant) => (
                  <tr key={plant.id}>
                    <td>
                      <span className="table-plant-name">{plant.name}</span>
                      <span className="table-plant-slug">/{plant.slug}</span>
                    </td>
                    <td><StatusBadge status={plant.status} /></td>
                    <td className="muted-cell">{formatDate(plant.updated_at)}</td>
                    <td>
                      <div className="row-actions">
                        <Link
                          className="icon-link"
                          to={`/admin/plants/${plant.id}/edit`}
                          aria-label={`Edit ${plant.name}`}
                          title="Edit tanaman"
                        >
                          <PencilSimple size={17} aria-hidden="true" />
                        </Link>
                        {plant.status === 'published' && (
                          <Link
                            className="icon-link"
                            to={`/plants/${plant.slug}`}
                            aria-label={`Lihat ${plant.name}`}
                            title="Lihat halaman publik"
                          >
                            <Eye size={17} aria-hidden="true" />
                          </Link>
                        )}
                        <Link
                          className="icon-link"
                          to="/admin/qr"
                          aria-label={`QR ${plant.name}`}
                          title="Lihat QR Code"
                        >
                          <QrCode size={17} aria-hidden="true" />
                        </Link>
                        <button
                          type="button"
                          className="icon-link danger"
                          onClick={() => setDeleteTarget(plant)}
                          aria-label={`Hapus ${plant.name}`}
                          title="Hapus tanaman"
                        >
                          <Trash size={17} aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {meta.pages > 1 && (
          <div className="pagination">
            <button
              type="button"
              className="button secondary small"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1 || loading}
            >
              Sebelumnya
            </button>
            <span>Halaman {page} dari {meta.pages}</span>
            <button
              type="button"
              className="button secondary small"
              onClick={() => setPage((current) => Math.min(meta.pages, current + 1))}
              disabled={page >= meta.pages || loading}
            >
              Berikutnya
            </button>
          </div>
        )}
      </section>

      {deleteTarget && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setDeleteTarget(null);
        }}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="delete-title">
            <span className="modal-icon danger" aria-hidden="true"><Trash size={22} /></span>
            <h2 id="delete-title">Hapus {deleteTarget.name}?</h2>
            <p>
              Data tanaman akan dihapus permanen. QR Code yang sudah dicetak
              untuk tanaman ini tidak akan berfungsi lagi.
            </p>
            <div className="modal-actions">
              <button type="button" className="button ghost" onClick={() => setDeleteTarget(null)} disabled={deleteBusy}>
                Batal
              </button>
              <button type="button" className="button danger" onClick={handleDelete} disabled={deleteBusy}>
                {deleteBusy ? 'Menghapus…' : 'Ya, hapus tanaman'}
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="table-footnote">
        Ingin membagikan halaman? Buka QR Code tanaman dari menu
        {' '}
        <Link to="/admin/qr">QR Code <ArrowRight size={13} aria-hidden="true" /></Link>.
      </p>
    </div>
  );
}
