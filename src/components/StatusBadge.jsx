export default function StatusBadge({ status }) {
  const published = status === 'published';
  return (
    <span className={published ? 'status-badge published' : 'status-badge draft'}>
      <span className="status-dot" aria-hidden="true" />
      {published ? 'Terbit' : 'Draft'}
    </span>
  );
}
