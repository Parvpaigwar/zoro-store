import { useState } from 'react';

export default function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`accordion ${open ? 'is-open' : ''}`}>
      <button className="accordion-head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span>{title}</span>
        <span className="accordion-icon" aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      <div className="accordion-body" hidden={!open}>
        {children}
      </div>
    </div>
  );
}
