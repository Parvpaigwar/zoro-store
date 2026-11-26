import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { assetUrl, formatPrice } from '../lib/api.js';
import { CartIcon } from './Icons.jsx';

export default function ProductCard({ product }) {
  const { add } = useCart();
  const [first, second] = product.images;
  const onSale = product.compareAtPrice > product.price;
  const off = onSale ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0;

  return (
    <article className="card">
      <Link to={`/products/${product.slug}`} className="card-media">
        <img src={assetUrl(first)} alt={product.name} loading="lazy" />
        {second && <img src={assetUrl(second)} alt="" className="card-media-alt" loading="lazy" />}
        {!product.inStock && <span className="badge badge-muted">Sold out</span>}
        {product.inStock && onSale && <span className="badge">-{off}%</span>}
      </Link>
      <div className="card-body">
        <span className="card-cat">{product.category}</span>
        <Link to={`/products/${product.slug}`} className="card-name">
          {product.name}
        </Link>
        <div className="card-foot">
          <span className="card-price">
            {formatPrice(product.price)}
            {onSale && <s>{formatPrice(product.compareAtPrice)}</s>}
          </span>
          <button
            className="card-add"
            onClick={() => add(product)}
            disabled={!product.inStock}
            aria-label={`Add ${product.name} to cart`}
          >
            <CartIcon size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}
