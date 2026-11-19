import { Link } from 'react-router-dom';
import { ArrowLeft, Leaf } from '@phosphor-icons/react';

export default function NotFoundPage() {
  return (
    <div className="not-found-shell">
      <span className="brand-mark large" aria-hidden="true"><Leaf size={28} /></span>
      <span className="eyebrow">404</span>
      <h1>Halaman tidak ditemukan</h1>
      <p>Tautan yang Anda buka tidak tersedia atau sudah dipindahkan.</p>
      <Link className="button primary" to="/">
        <ArrowLeft size={17} aria-hidden="true" />
        Kembali ke beranda
      </Link>
    </div>
  );
}
