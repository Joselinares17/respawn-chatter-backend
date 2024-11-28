import { Schema, Document } from 'mongoose';

// Interfaz del documento de Usuario
export interface UserDocument extends Document {
  username: string;
  email: string;
  createdAt: Date;
}

// Esquema de Usuario
export const UserSchema = new Schema<UserDocument>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
}, { versionKey: false });

export const User = 'User'; // 'Review' es el nombre del modelo
