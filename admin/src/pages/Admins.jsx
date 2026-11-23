import { useState } from 'react';
import { ConfirmButton, ErrorNote, Loading, PageHead, Toast } from '../components/ui.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api, formatDate } from '../lib/api.js';
import useFetch from '../lib/useFetch.js';

const EMPTY = { name: '', email: '', password: '', role: 'admin' };

export default function Admins() {
  const { admin: me } = useAuth();
  const { data: admins, loading, error, reload } = useFetch(() => api.admins(), []);
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [toast, setToast] = useState('');

  const run = async (fn, msg) => {
    setActionError(null);
    try {
      await fn();
      setToast(msg);
      reload();
    } catch (err) {
      setActionError(err);
    }
  };

  const create = (e) => {
    e.preventDefault();
    run(async () => {
      await api.createAdmin(form);
      setForm(EMPTY);
      setShowForm(false);
    }, 'Team member added');
  };

  return (
    <>
      <PageHead title="Team">
        <button className="btn btn-primary" onClick={() => setShowForm((s) => !s)}>{showForm ? 'Close' : 'Add member'}</button>
      </PageHead>
      <p className="muted subhead">
        <strong>Super admins</strong> can do everything, including managing the team. <strong>Admins</strong> manage products and orders.
      </p>
      <ErrorNote error={error || actionError} />

      {showForm && (
        <form className="card pad inline-form" onSubmit={create}>
          <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="input" type="password" placeholder="Temporary password (8+ chars)" minLength={8} autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="admin">Admin</option>
            <option value="superadmin">Super admin</option>
          </select>
          <button className="btn btn-primary">Add</button>
        </form>
      )}

      {loading && !admins && <Loading />}
      {admins && (
        <div className="card">
          <table className="table">
            <thead><tr><th>Member</th><th>Role</th><th className="hide-sm">Last sign-in</th><th>Status</th><th /></tr></thead>
            <tbody>
              {admins.map((a) => {
                const self = a._id === me._id;
                return (
                  <tr key={a._id}>
                    <td><strong>{a.name}</strong>{self && <span className="muted"> (you)</span>}<div className="muted small">{a.email}</div></td>
                    <td>
                      {self ? (
                        a.role === 'superadmin' ? 'Super admin' : 'Admin'
                      ) : (
                        <select className="input input-sm" value={a.role} onChange={(e) => run(() => api.updateAdmin(a._id, { role: e.target.value }), 'Role updated')}>
                          <option value="admin">Admin</option>
                          <option value="superadmin">Super admin</option>
                        </select>
                      )}
                    </td>
                    <td className="hide-sm muted small">{a.lastLoginAt ? formatDate(a.lastLoginAt) : 'Never'}</td>
                    <td>
                      <span className={`badge ${a.active ? 'badge-delivered' : 'badge-muted'}`}>{a.active ? 'Active' : 'Disabled'}</span>
                    </td>
                    <td className="num actions">
                      {!self && (
                        <>
                          <button className="btn btn-ghost btn-sm" onClick={() => run(() => api.updateAdmin(a._id, { active: !a.active }), a.active ? 'Disabled' : 'Enabled')}>
                            {a.active ? 'Disable' : 'Enable'}
                          </button>
                          <ConfirmButton className="btn btn-ghost btn-sm" confirmLabel="Delete" onConfirm={() => run(() => api.deleteAdmin(a._id), 'Removed')}>
                            Remove
                          </ConfirmButton>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <Toast message={toast} onDone={() => setToast('')} />
    </>
  );
}
