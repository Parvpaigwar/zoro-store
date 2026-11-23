import { Link } from 'react-router-dom';
import { assetUrl, formatPrice } from '../lib/api.js';

export default function ProductCard({ product }) {
  const [first, second] = product.images;
  return (
    <Link to={`/products/${product.slug}`} className="card">
      <div className="card-media">
        <img src={assetUrl(first)} alt={product.name} loading="lazy" />
        {second && <img src={assetUrl(second)} alt="" className="card-media-alt" loading="lazy" />}
        {!product.inStock && <span className="badge">Sold out</span>}
        {product.inStock && product.compareAtPrice > product.price && <span className="badge">Sale</span>}
      </div>
      <div className="card-info">
        <span className="card-name">{product.name}</span>
        <span className="card-price">
          {product.compareAtPrice > product.price && (
            <s className="muted">{formatPrice(product.compareAtPrice)}</s>
          )}
          {formatPrice(product.price)}
        </span>
      </div>
      <span className="card-cat muted">{product.category}</span>
    </Link>
  );
}
