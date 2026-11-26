import { ChipIcon, GiftIcon, LampIcon, SparkleIcon, TagIcon } from '../components/Icons.jsx';

// Visual style per category. Unknown categories fall back to a rotating palette.
const KNOWN = {
  decor: { Icon: LampIcon, tint: '#f6e3d6', blurb: 'Statement pieces' },
  gadgets: { Icon: ChipIcon, tint: '#dde8f3', blurb: 'Clever little things' },
};
const FALLBACK = [
  { Icon: SparkleIcon, tint: '#e6efd9' },
  { Icon: GiftIcon, tint: '#f3dfe6' },
  { Icon: TagIcon, tint: '#efe6d3' },
];

export function categoryStyle(name, i = 0) {
  return KNOWN[name.toLowerCase()] || { ...FALLBACK[i % FALLBACK.length], blurb: 'Explore the range' };
}
