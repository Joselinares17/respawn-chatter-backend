// game.schema.ts
import { Schema, Document, model } from 'mongoose';

export interface GameDocument extends Document {
  title: string;
  releaseYear: number;
  genre: string[];
  platforms: string[];
  createdAt: Date;
  image?: string;
}

export const GameSchema = new Schema<GameDocument>({
  title: { type: String, required: true },
  releaseYear: { type: Number, required: true },
  genre: { type: [String], required: true },
  platforms: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now },
  image: { type: String, required: false },
}, { versionKey: false });

export const Game = model<GameDocument>('Game', GameSchema); // El nombre del modelo
