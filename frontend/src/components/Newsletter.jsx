import { useState } from 'react';
import { api } from '../lib/api.js';
import { MailIcon, ShieldIcon } from './Icons.jsx';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState({ status: 'idle', message: '' });

  const submit = async (e) => {
    e.preventDefault();
    setState({ status: 'loading', message: '' });
    try {
      const res = await api.subscribe(email.trim());
      setState({ status: 'done', message: res.message });
      setEmail('');
    } catch (err) {
      setState({ status: 'error', message: err.message });
    }
  };

  return (
    <section className="newsletter">
      <span className="newsletter-icon">
        <MailIcon size={34} />
      </span>
      <div className="newsletter-copy">
        <h2>Stay in the Loop</h2>
        <p>New drops, restocks and members-only offers, straight to your inbox.</p>
      </div>
      <div className="newsletter-form-wrap">
        <form className="newsletter-form" onSubmit={submit}>
          <input
            type="email"
            required
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email address"
          />
          <button type="submit" disabled={state.status === 'loading'}>
            {state.status === 'loading' ? '…' : 'Subscribe'}
          </button>
        </form>
        <p className="newsletter-note">
          {state.message || (
            <>
              <ShieldIcon size={14} /> We respect your privacy. Unsubscribe anytime.
            </>
          )}
        </p>
      </div>
    </section>
  );
}
