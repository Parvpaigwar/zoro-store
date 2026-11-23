import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export const ROLES = ['superadmin', 'admin'];

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ROLES, default: 'admin' },
    active: { type: Boolean, default: true },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

adminSchema.methods.setPassword = async function (password) {
  this.passwordHash = await bcrypt.hash(password, 12);
};
adminSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

adminSchema.set('toJSON', {
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    return ret;
  },
});

export default mongoose.model('Admin', adminSchema);
