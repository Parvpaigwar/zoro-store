// Catalogue seed. Add new products here (or via an admin panel later) and run `npm run seed`.
// Gallery order (first image is the card / cart thumbnail).
const swordImages = [6, 2, 3, 4, 5, 7, 8, 9, 10, 1].map((n) => `/images/products/warrior-sword-${n}.jpg`);

export default [
  {
    name: 'The Warrior Sword',
    slug: 'warrior-sword',
    tagline: 'A statement piece for your wall.',
    description:
      'An ornate decorative sword mounted on a hand-finished walnut-tone wooden plaque. The blade carries an etched tribal pattern, the guard is cast with dragon detailing and the grip is wrapped in copper-toned coils. Made to be looked at — a centrepiece for a study, studio or living room.',
    category: 'Decor',
    price: 2499,
    images: swordImages,
    highlights: [
      'Wall-mounted wooden display plaque included',
      'Etched blade with tribal pattern',
      'Dragon-detailed guard and coiled grip',
      'Decorative piece — not sharpened',
    ],
    details: [
      {
        title: 'Details',
        body: 'Metal blade with etched pattern, cast metal guard and pommel, copper-tone coiled grip. Mounted on a contoured wooden plaque with silver ornamental inlay prints.',
      },
      {
        title: 'Mounting',
        body: 'Comes ready to hang. The sword rests on two pegs and a lower cradle and can be lifted off the plaque. Wall screws not included.',
      },
      {
        title: 'Shipping & Returns',
        body: 'Ships in 2–4 business days in protective packaging. Free shipping on orders above ₹999. Returns accepted within 7 days of delivery for unused items in original packaging.',
      },
      {
        title: 'Care',
        body: 'Wipe the blade with a soft dry cloth. Keep away from moisture. For decorative use only; keep out of reach of children.',
      },
    ],
    stock: 25,
    featured: true,
    sortOrder: 1,
  },
  {
    name: 'Pocket Thermal Printer',
    slug: 'pocket-thermal-printer',
    tagline: 'Ink-free prints from your phone.',
    description:
      'A palm-sized wireless thermal printer for notes, lists, labels, photos and little reminders. No ink, no cartridges — just paper and heat. Connects to your phone over Bluetooth.',
    category: 'Gadgets',
    price: 1799, // TODO: confirm real price
    images: ['/images/products/thermal-printer-1.svg'],
    highlights: [
      'Ink-free thermal printing',
      'Bluetooth — prints from your phone',
      'Rechargeable via USB-C',
      'Fits in a pocket or pencil case',
    ],
    details: [
      {
        title: 'Details',
        body: 'Prints text, to-do lists, labels and monochrome photos on 57mm thermal paper. Starter paper roll included.',
      },
      {
        title: 'In the box',
        body: 'Printer, USB-C cable, one starter paper roll, quick-start guide.',
      },
      {
        title: 'Shipping & Returns',
        body: 'Ships in 2–4 business days. Free shipping on orders above ₹999. Returns accepted within 7 days of delivery for unused items in original packaging.',
      },
    ],
    stock: 40,
    featured: true,
    sortOrder: 2,
  },
];
