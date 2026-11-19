import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Leaf, MagnifyingGlass, Plant, QrCode, Sun, Drop, MapPin,
} from '@phosphor-icons/react';
import { api } from '../lib/api.js';
import LoadingState from '../components/LoadingState.jsx';

export default function HomePage() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    let active = true;
    api('/api/plants')
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return plants;
    return plants.filter((plant) => (
      plant.name.toLowerCase().includes(q)
      || plant.slug.toLowerCase().includes(q)
      || (plant.scientific_name || '').toLowerCase().includes(q)
    ));
  }, [plants, query]);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <Leaf size={15} weight="fill" aria-hidden="true" />
            Koleksi tanaman Kokulikuler
          </span>
          <h1>Kenali yang tumbuh di sekitar kita.</h1>
          <p className="hero-lead">
            Setiap tanaman di taman memiliki halaman informasinya sendiri. Pindai QR Code
            di dekat tanaman, atau telusuri koleksinya dari sini.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#koleksi">
              Jelajahi tanaman
              <ArrowRight size={17} aria-hidden="true" />
            </a>
            <Link className="button ghost" to="/admin">
              Kelola taman
            </Link>
          </div>
          <div className="hero-assurance">
            <span><QrCode size={17} aria-hidden="true" /> Tanpa aplikasi tambahan</span>
            <span><Leaf size={17} aria-hidden="true" /> Konten diverifikasi pengelola</span>
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <div className="hero-plant-card">
            <div className="hero-plant-top">
              <span className="hero-plant-icon"><Leaf size={26} weight="fill" /></span>
              <span className="hero-plant-tag">Panduan singkat</span>
            </div>
            <h2>Dari papan nama ke halaman hidup.</h2>
            <p>Satu pindai, informasi lengkap tentang ciri, manfaat, dan cara merawat.</p>
            <div className="hero-plant-chips">
              <span><Sun size={15} /> Cahaya</span>
              <span><Drop size={15} /> Air</span>
              <span><MapPin size={15} /> Lokasi</span>
            </div>
          </div>
          <div className="hero-floating-card">
            <QrCode size={26} weight="duotone" />
            <div>
              <strong>QR di setiap tanaman</strong>
              <small>URL tetap stabil saat konten diperbarui</small>
            </div>
          </div>
        </div>
      </section>

      <section className="collection" id="koleksi" aria-labelledby="koleksi-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Jelajahi koleksi</span>
            <h2 id="koleksi-title">Tanaman di taman</h2>
          </div>
          {plants.length > 0 && (
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
          )}
        </div>

        {loading && <LoadingState label="Memuat koleksi tanaman…" />}

        {!loading && error && (
          <div className="notice error" role="alert">
            <strong>Koleksi belum dapat dimuat.</strong>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && plants.length === 0 && (
          <div className="empty-garden">
            <span className="empty-icon" aria-hidden="true"><Plant size={34} /></span>
            <h3>Taman sedang dipersiapkan</h3>
            <p>
              Informasi tanaman akan muncul di sini setelah pengelola memverifikasi
              kontennya dan menerbitkannya untuk publik.
            </p>
            <Link className="text-link" to="/admin">
              Masuk ke pengelolaan
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        )}

        {!loading && !error && plants.length > 0 && filtered.length === 0 && (
          <div className="empty-garden compact">
            <h3>Tanaman tidak ditemukan</h3>
            <p>Coba kata kunci lain atau hapus pencarian.</p>
            <button type="button" className="text-link as-button" onClick={() => setQuery('')}>
              Tampilkan semua
            </button>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="plant-grid">
            {filtered.map((plant) => (
              <Link className="plant-card" to={`/plants/${plant.slug}`} key={plant.id}>
                <div className="plant-card-media">
                  {plant.image_path ? (
                    <img src={plant.image_path} alt={plant.name} loading="lazy" />
                  ) : (
                    <span className="plant-card-placeholder" aria-hidden="true">
                      <Leaf size={30} />
                    </span>
                  )}
                  <span className="plant-card-arrow" aria-hidden="true">
                    <ArrowRight size={17} />
                  </span>
                </div>
                <div className="plant-card-body">
                  <h3>{plant.name}</h3>
                  {plant.scientific_name && <p className="scientific">{plant.scientific_name}</p>}
                  <p>{plant.short_description || 'Informasi tanaman sedang dilengkapi.'}</p>
                  {plant.location_label && (
                    <span className="plant-card-location">
                      <MapPin size={14} aria-hidden="true" />
                      {plant.location_label}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
