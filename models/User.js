import { Schema, model } from 'mongoose';


const userSchema = new Schema({
    username: { type: String , minlength: 5, maxlength: 20 },
    email: { type: String , unique: true  , required: true },
    phone: { type: String, unique: true, sparse: true , required: false },
    password: { type: String },
    avatar: { type: String },   // صورة البروفايل من Google
    googleId: { type: String }, // sub اللي جاي من Google
    role: { type: String, enum: ['user', 'admin'], default: 'user' }, // إضافة حقل الدور مع قيمة افتراضية
}, { timestamps: true });

const User = model('User', userSchema);
export default User;