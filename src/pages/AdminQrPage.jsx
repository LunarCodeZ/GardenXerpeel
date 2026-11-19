import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, DownloadSimple, Printer, QrCode, WarningCircle,
} from '@phosphor-icons/react';
import { api } from '../lib/api.js';
import LoadingState from '../components/LoadingState.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

export default function AdminQrPage() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api('/api/admin/plants')
      .then((payload) => {
        if (active) setPlants(payload.data);
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
          <span className="eyebrow">QR Code</span>
          <h1>QR Code</h1>
          <p>
            Setiap QR mengarah ke URL halaman tanaman yang stabil. Konten boleh
            diperbarui tanpa mencetak ulang QR.
          </p>
        </div>
        <Link className="button ghost" to="/admin/plants">
          Kelola data tanaman
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </header>

      <div className="notice info">
        <Printer size={19} aria-hidden="true" />
        <p>
          Cetak QR dengan ukuran yang cukup besar dan sisakan ruang kosong di
          sekelilingnya. Uji pindai dari beberapa ponsel sebelum dipasang permanen.
        </p>
      </div>

      {loading && <LoadingState label="Menyiapkan QR tanaman…" />}
      {error && (
        <div className="notice error" role="alert">
          <WarningCircle size={18} aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && plants.length === 0 && (
        <div className="panel panel-empty">
          <p>Belum ada tanaman untuk dibuatkan QR.</p>
          <Link className="button secondary" to="/admin/plants/new">Tambah tanaman</Link>
        </div>
      )}

      {plants.length > 0 && (
        <div className="qr-grid">
          {plants.map((plant) => (
            <article className="qr-card" key={plant.id}>
              <div className="qr-card-head">
                <div>
                  <h2>{plant.name}</h2>
                  <span className="table-plant-slug">/{plant.slug}</span>
                </div>
                <StatusBadge status={plant.status} />
              </div>

              <div className="qr-preview">
                <img
                  src={`/api/admin/plants/${plant.id}/qr?format=png&download=0`}
                  alt={`QR Code ${plant.name}`}
                  width="220"
                  height="220"
                />
              </div>

              <div className="qr-destination">
                <span className="qr-destination-label">
                  <QrCode size={15} aria-hidden="true" />
                  URL tujuan
                </span>
                <code>{plant.qr_url || `—`}</code>
              </div>

              <div className="qr-actions">
                <a
                  className="button secondary small"
                  href={`/api/admin/plants/${plant.id}/qr?format=svg`}
                  download={`${plant.slug}.svg`}
                >
                  <DownloadSimple size={16} aria-hidden="true" />
                  SVG
                </a>
                <a
                  className="button secondary small"
                  href={`/api/admin/plants/${plant.id}/qr?format=png`}
                  download={`${plant.slug}.png`}
                >
                  <DownloadSimple size={16} aria-hidden="true" />
                  PNG
                </a>
                <Link className="text-link" to={`/admin/plants/${plant.id}/edit`}>
                  Edit
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
