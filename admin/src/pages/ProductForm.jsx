import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ConfirmButton, ErrorNote, Loading, PageHead, Toast } from '../components/ui.jsx';
import { STORE_URL, api, assetUrl, slugify } from '../lib/api.js';

const BLANK = {
  name: '', slug: '', tagline: '', description: '', category: '',
  price: '', compareAtPrice: '', stock: 0, sortOrder: 0,
  featured: false, active: false,
  images: [], highlights: [], details: [],
};

export default function ProductForm() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const [form, setForm] = useState(isNew ? BLANK : null);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState('');
  const fileRef = useRef(null);

  useEffect(() => {
    api.products().then((ps) => setCategories([...new Set(ps.map((p) => p.category))].sort())).catch(() => {});
    if (isNew) return;
    api
      .product(id)
      .then((p) => setForm({ ...BLANK, ...p, compareAtPrice: p.compareAtPrice ?? '' }))
      .catch(setError);
  }, [id, isNew]);

  if (!form) return error ? <ErrorNote error={error} /> : <Loading />;

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const onName = (v) => setForm((f) => ({ ...f, name: v, slug: slugTouched ? f.slug : slugify(v) }));

  const upload = async (files) => {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    try {
      const { paths } = await api.uploadImages(files);
      setForm((f) => ({ ...f, images: [...f.images, ...paths] }));
    } catch (err) {
      setError(err);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const moveImage = (i, dir) =>
    setForm((f) => {
      const imgs = [...f.images];
      const j = i + dir;
      if (j < 0 || j >= imgs.length) return f;
      [imgs[i], imgs[j]] = [imgs[j], imgs[i]];
      return { ...f, images: imgs };
    });

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const body = {
      ...form,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice === '' ? '' : Number(form.compareAtPrice),
      stock: Number(form.stock),
      sortOrder: Number(form.sortOrder),
      highlights: form.highlights.map((h) => h.trim()).filter(Boolean),
      details: form.details.filter((d) => d.title.trim() && d.body.trim()),
    };
    try {
      if (isNew) {
        const created = await api.createProduct(body);
        navigate(`/products/${created._id}`, { replace: true });
        setToast('Product created');
      } else {
        const updated = await api.updateProduct(id, body);
        setForm({ ...BLANK, ...updated, compareAtPrice: updated.compareAtPrice ?? '' });
        setToast('Saved');
      }
    } catch (err) {
      setError(err);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save}>
      <PageHead title={isNew ? 'New product' : form.name || 'Edit product'}>
        {!isNew && form.active && (
          <a className="btn btn-ghost" href={`${STORE_URL}/products/${form.slug}`} target="_blank" rel="noreferrer">View on store ↗</a>
        )}
        <Link to="/products" className="btn btn-ghost">Back</Link>
        <button className="btn btn-primary" disabled={saving || uploading}>{saving ? 'Saving…' : 'Save'}</button>
      </PageHead>

      <ErrorNote error={error} />

      <div className="form-grid">
        <div className="form-main">
          <section className="card pad">
            <h2>Basics</h2>
            <Field label="Name"><input className="input" value={form.name} onChange={(e) => onName(e.target.value)} required /></Field>
            <Field label="URL slug" hint={`${STORE_URL.replace(/^https?:\/\//, '')}/products/${form.slug || '…'}`}>
              <input
                className="input"
                value={form.slug}
                onChange={(e) => { setSlugTouched(true); set('slug', slugify(e.target.value)); }}
                pattern="[a-z0-9-]+"
                required
              />
            </Field>
            <Field label="Tagline" hint="One short line shown under the price.">
              <input className="input" value={form.tagline} onChange={(e) => set('tagline', e.target.value)} />
            </Field>
            <Field label="Description">
              <textarea className="input" rows={5} value={form.description} onChange={(e) => set('description', e.target.value)} />
            </Field>
          </section>

          <section className="card pad">
            <div className="card-head-inline">
              <h2>Images</h2>
              <span className="muted small">First image is the thumbnail. JPG, PNG or WebP, up to 8MB.</span>
            </div>
            <div className="img-grid">
              {form.images.map((src, i) => (
                <div key={src} className="img-tile">
                  <img src={assetUrl(src)} alt="" />
                  {i === 0 && <span className="img-main">Main</span>}
                  <div className="img-actions">
                    <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0} aria-label="Move left">←</button>
                    <button type="button" onClick={() => moveImage(i, 1)} disabled={i === form.images.length - 1} aria-label="Move right">→</button>
                    <button type="button" onClick={() => set('images', form.images.filter((_, j) => j !== i))} aria-label="Remove">✕</button>
                  </div>
                </div>
              ))}
              <label
                className={`img-drop ${uploading ? 'is-busy' : ''}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); upload(e.dataTransfer.files); }}
              >
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(e) => upload(e.target.files)} />
                {uploading ? 'Uploading…' : <>+ Add images<span className="muted small block">or drop here</span></>}
              </label>
            </div>
          </section>

          <section className="card pad">
            <div className="card-head-inline">
              <h2>Highlights</h2>
              <button type="button" className="link" onClick={() => set('highlights', [...form.highlights, ''])}>+ Add</button>
            </div>
            {form.highlights.length === 0 && <p className="muted small">Short bullet points shown on the product page.</p>}
            {form.highlights.map((h, i) => (
              <div key={i} className="repeat-row">
                <input className="input" value={h} onChange={(e) => set('highlights', form.highlights.map((x, j) => (j === i ? e.target.value : x)))} />
                <button type="button" className="btn btn-ghost" onClick={() => set('highlights', form.highlights.filter((_, j) => j !== i))}>Remove</button>
              </div>
            ))}
          </section>

          <section className="card pad">
            <div className="card-head-inline">
              <h2>Info sections</h2>
              <button type="button" className="link" onClick={() => set('details', [...form.details, { title: '', body: '' }])}>+ Add</button>
            </div>
            {form.details.length === 0 && <p className="muted small">Fold-out sections like Details, Shipping, Care.</p>}
            {form.details.map((d, i) => (
              <div key={i} className="detail-block">
                <div className="repeat-row">
                  <input
                    className="input" placeholder="Title (e.g. Care)" value={d.title}
                    onChange={(e) => set('details', form.details.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))}
                  />
                  <button type="button" className="btn btn-ghost" onClick={() => set('details', form.details.filter((_, j) => j !== i))}>Remove</button>
                </div>
                <textarea
                  className="input" rows={3} value={d.body}
                  onChange={(e) => set('details', form.details.map((x, j) => (j === i ? { ...x, body: e.target.value } : x)))}
                />
              </div>
            ))}
          </section>
        </div>

        <div className="form-side">
          <section className="card pad">
            <h2>Visibility</h2>
            <label className="check">
              <input type="checkbox" checked={form.active} onChange={(e) => set('active', e.target.checked)} />
              <span>Live on store<span className="muted small block">Hidden products can't be seen or bought.</span></span>
            </label>
            <label className="check">
              <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />
              <span>Featured</span>
            </label>
            <Field label="Sort order" hint="Lower shows first.">
              <input className="input" type="number" value={form.sortOrder} onChange={(e) => set('sortOrder', e.target.value)} />
            </Field>
          </section>

          <section className="card pad">
            <h2>Pricing & stock</h2>
            <Field label="Price (₹)"><input className="input" type="number" min="0" value={form.price} onChange={(e) => set('price', e.target.value)} required /></Field>
            <Field label="Compare-at price (₹)" hint="Optional. Only set this if the item was really sold at this price.">
              <input className="input" type="number" min="0" value={form.compareAtPrice} onChange={(e) => set('compareAtPrice', e.target.value)} />
            </Field>
            <Field label="Stock"><input className="input" type="number" min="0" value={form.stock} onChange={(e) => set('stock', e.target.value)} required /></Field>
          </section>

          <section className="card pad">
            <h2>Category</h2>
            <Field label="Category" hint="Pick one or type a new one.">
              <input className="input" list="cats" value={form.category} onChange={(e) => set('category', e.target.value)} required />
              <datalist id="cats">{categories.map((c) => <option key={c} value={c} />)}</datalist>
            </Field>
          </section>

          {!isNew && (
            <section className="card pad danger-zone">
              <h2>Delete</h2>
              <p className="muted small">Removes the product from the store. Past orders keep their own copy of it.</p>
              <ConfirmButton
                confirmLabel="Yes, delete"
                onConfirm={async () => {
                  try {
                    await api.deleteProduct(id);
                    navigate('/products', { replace: true });
                  } catch (err) {
                    setError(err);
                  }
                }}
              >
                Delete product
              </ConfirmButton>
            </section>
          )}
        </div>
      </div>
      <Toast message={toast} onDone={() => setToast('')} />
    </form>
  );
}

function Field({ label, hint, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {hint && <small className="muted">{hint}</small>}
    </label>
  );
}
