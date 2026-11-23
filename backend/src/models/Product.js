import mongoose from 'mongoose';

const detailSchema = new mongoose.Schema(
  { title: { type: String, required: true }, body: { type: String, required: true } },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    tagline: { type: String, default: '' },
    description: { type: String, default: '' },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 }, // INR, whole rupees
    compareAtPrice: { type: Number, min: 0 },
    images: [{ type: String }],
    highlights: [{ type: String }],
    details: [detailSchema], // accordion sections on the product page
    stock: { type: Number, default: 0, min: 0 },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.virtual('inStock').get(function () {
  return this.stock > 0;
});
productSchema.set('toJSON', { virtuals: true, versionKey: false });

export default mongoose.model('Product', productSchema);
