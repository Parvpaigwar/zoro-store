export default function QuantityInput({ value, onChange, max = 99, small }) {
  return (
    <div className={`qty ${small ? 'qty-sm' : ''}`}>
      <button type="button" onClick={() => onChange(Math.max(1, value - 1))} aria-label="Decrease quantity" disabled={value <= 1}>
        −
      </button>
      <span aria-live="polite">{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} aria-label="Increase quantity" disabled={value >= max}>
        +
      </button>
    </div>
  );
}
