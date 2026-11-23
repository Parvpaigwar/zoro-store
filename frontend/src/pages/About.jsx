import { Link } from 'react-router-dom';

export default function About() {
  return (
    <section className="section narrow">
      <span className="label">About</span>
      <h1 className="display display-sm">A shop for the one-of-a-kind.</h1>
      <p>
        ZORO is a small store for objects that are a little unusual — things that are unique, cool and beautiful
        enough to earn a place in your space. A sculptural sword for the wall. A pocket printer that runs on heat.
        Whatever comes next will share the same rule: it has to be genuinely interesting.
      </p>
      <p className="muted">
        We keep the collection small on purpose, check every piece before it ships, and deliver across India with
        cash on delivery.
      </p>
      <Link to="/shop" className="label link-underline">Browse the collection</Link>
    </section>
  );
}
