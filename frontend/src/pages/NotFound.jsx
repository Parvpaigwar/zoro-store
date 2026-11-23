import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="section narrow center">
      <h1 className="page-title">Page not found</h1>
      <Link to="/" className="label link-underline">Back home</Link>
    </section>
  );
}
