export function Loading() {
  return <div className="status">Loading…</div>;
}

export function ErrorState({ error }) {
  return <div className="status">{error?.message || 'Something went wrong.'}</div>;
}
