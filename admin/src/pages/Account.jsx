import { useState } from 'react';
import { ErrorNote, PageHead, Toast } from '../components/ui.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../lib/api.js';

export default function Account() {
  const { admin } = useAuth();
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (form.next !== form.confirm) return setError(new Error('New passwords do not match'));
    setBusy(true);
    try {
      await api.changePassword(form.current, form.next);
      setForm({ current: '', next: '', confirm: '' });
      setToast('Password changed');
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHead title="Account" />
      <div className="narrow">
        <section className="card pad">
          <h2>Profile</h2>
          <p><strong>{admin.name}</strong><br /><span className="muted">{admin.email}</span><br /><span className="muted">{admin.role === 'superadmin' ? 'Super admin' : 'Admin'}</span></p>
        </section>
        <form className="card pad" onSubmit={submit}>
          <h2>Change password</h2>
          <ErrorNote error={error} />
          <label className="field"><span>Current password</span>
            <input className="input" type="password" autoComplete="current-password" value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} required />
          </label>
          <label className="field"><span>New password</span>
            <input className="input" type="password" autoComplete="new-password" minLength={8} value={form.next} onChange={(e) => setForm({ ...form, next: e.target.value })} required />
          </label>
          <label className="field"><span>Confirm new password</span>
            <input className="input" type="password" autoComplete="new-password" minLength={8} value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} required />
          </label>
          <button className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Update password'}</button>
        </form>
      </div>
      <Toast message={toast} onDone={() => setToast('')} />
    </>
  );
}
