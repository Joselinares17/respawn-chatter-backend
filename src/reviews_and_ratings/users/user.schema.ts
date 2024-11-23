import { Schema, Document } from 'mongoose';

// Interfaz del documento de Usuario
export interface UserDocument extends Document {
  username: string;
  email: string;
  password: string; // Almacena la contraseña hasheada
  createdAt: Date;
}

// Esquema de Usuario
export const UserSchema = new Schema<UserDocument>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed password
  createdAt: { type: Date, default: Date.now },
}, { versionKey: false });
