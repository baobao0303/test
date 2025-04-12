import mongoose from 'mongoose';

const socialSchema = new mongoose.Schema({
    href: { type: String, required: true },
    icon: { type: String, required: true },
    alt: { type: String, required: true }
});

export const Social = mongoose.model('Social', socialSchema);