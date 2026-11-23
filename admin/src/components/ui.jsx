import { useEffect, useRef, useState } from 'react';

export function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{status}</span>;
}

export function Loading() {
  return <div className="empty">Loading…</div>;
}

export function ErrorNote({ error }) {
  if (!error) return null;
  return <div className="alert">{error.message || String(error)}</div>;
}

export function PageHead({ title, children }) {
  return (
    <div className="page-head">
      <h1>{title}</h1>
      <div className="page-actions">{children}</div>
    </div>
  );
}

/** Two-step inline confirm (no browser dialogs). */
export function ConfirmButton({ children, confirmLabel = 'Confirm', onConfirm, className = 'btn btn-danger', disabled }) {
  const [armed, setArmed] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 4000);
    return () => clearTimeout(t);
  }, [armed]);

  if (!armed) {
    return (
      <button type="button" className={className} disabled={disabled} onClick={() => setArmed(true)}>
        {children}
      </button>
    );
  }
  return (
    <span className="confirm">
      <button
        type="button"
        className="btn btn-danger"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            await onConfirm();
          } finally {
            setBusy(false);
            setArmed(false);
          }
        }}
      >
        {busy ? '…' : confirmLabel}
      </button>
      <button type="button" className="btn btn-ghost" onClick={() => setArmed(false)}>Cancel</button>
    </span>
  );
}

export function Toast({ message, onDone }) {
  const done = useRef(onDone);
  done.current = onDone;
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => done.current(), 2500);
    return () => clearTimeout(t);
  }, [message]);
  return message ? <div className="toast" role="status">{message}</div> : null;
}
