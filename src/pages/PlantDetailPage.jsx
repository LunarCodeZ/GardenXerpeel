import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, BookOpen, Drop, Heart, Leaf, MapPin, Plant, Sun,
} from '@phosphor-icons/react';
import { api } from '../lib/api.js';
import LoadingState from '../components/LoadingState.jsx';

function Section({ icon: Icon, title, children }) {
  if (!children) return null;
  return (
    <section className="detail-section">
      <div className="detail-section-heading">
        <span className="detail-icon" aria-hidden="true"><Icon size={20} /></span>
        <h2>{title}</h2>
      </div>
      <div className="detail-prose">{children}</div>
    </section>
  );
}

export default function PlantDetailPage() {
  const { slug } = useParams();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);
    setError('');
    api(`/api/plants/${encodeURIComponent(slug)}`)
      .then((payload) => {
        if (active) setPlant(payload.data);
      })
      .catch((err) => {
        if (!active) return;
        if (err.status === 404) setNotFound(true);
        else setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="detail-shell narrow">
        <LoadingState label="Memuat informasi tanaman…" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="detail-shell narrow">
        <div className="empty-garden">
          <span className="empty-icon" aria-hidden="true"><Plant size={34} /></span>
          <h1>Tanaman belum ditemukan</h1>
          <p>
            Halaman ini belum tersedia. Tanaman mungkin masih berstatus draft,
            atau tautan QR yang dipindai sudah tidak berlaku.
          </p>
          <Link className="button primary" to="/">
            <ArrowLeft size={17} aria-hidden="true" />
            Kembali ke daftar tanaman
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-shell narrow">
        <div className="notice error" role="alert">
          <strong>Informasi tanaman gagal dimuat.</strong>
          <p>{error}</p>
        </div>
        <Link className="text-link" to="/">Kembali ke daftar tanaman</Link>
      </div>
    );
  }

  if (!plant) return null;

  return (
    <article className="detail-shell">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">
          <ArrowLeft size={15} aria-hidden="true" />
          Daftar tanaman
        </Link>
      </nav>

      <header className="detail-hero">
        <div className="detail-media">
          {plant.image_path ? (
            <img src={plant.image_path} alt={plant.name} />
          ) : (
            <span className="detail-placeholder" aria-hidden="true"><Leaf size={52} /></span>
          )}
        </div>
        <div className="detail-intro">
          <span className="eyebrow">
            <Leaf size={15} weight="fill" aria-hidden="true" />
            Informasi tanaman
          </span>
          <h1>{plant.name}</h1>
          {plant.scientific_name && <p className="scientific large">{plant.scientific_name}</p>}
          <p className="detail-lead">
            {plant.short_description || 'Informasi singkat tanaman ini sedang dilengkapi.'}
          </p>
          <dl className="detail-facts">
            {plant.location_label && (
              <div>
                <dt><MapPin size={16} aria-hidden="true" /> Lokasi</dt>
                <dd>{plant.location_label}</dd>
              </div>
            )}
            {plant.habitat && (
              <div>
                <dt><Sun size={16} aria-hidden="true" /> Habitat</dt>
                <dd>{plant.habitat}</dd>
              </div>
            )}
            <div>
              <dt><Leaf size={16} aria-hidden="true" /> Status</dt>
              <dd>Terbit untuk publik</dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="detail-content">
        <Section icon={BookOpen} title="Tentang tanaman">
          {plant.description && <p className="pre-line">{plant.description}</p>}
        </Section>
        <Section icon={Leaf} title="Karakteristik">
          {plant.characteristics && <p className="pre-line">{plant.characteristics}</p>}
        </Section>
        <Section icon={Heart} title="Manfaat & kegunaan">
          {plant.benefits && <p className="pre-line">{plant.benefits}</p>}
        </Section>
        <Section icon={Drop} title="Panduan perawatan">
          {plant.care_guide && <p className="pre-line">{plant.care_guide}</p>}
        </Section>
      </div>

      <aside className="detail-footer-cta">
        <div>
          <h2>Ada tanaman lain di sekitar Anda?</h2>
          <p>Pindai QR Code berikutnya atau lihat kembali seluruh koleksi taman.</p>
        </div>
        <Link className="button primary" to="/">
          Lihat semua tanaman
          <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </aside>
    </article>
  );
}
