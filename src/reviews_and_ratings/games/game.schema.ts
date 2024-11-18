// game.schema.ts
import { Schema, Document } from 'mongoose';

export interface GameDocument extends Document {
  title: string;
  developer: string;
  releaseYear: number;
  genre: string[];
  platforms: string[];
  createdAt: Date;
}

export const GameSchema = new Schema<GameDocument>({
  title: { type: String, required: true },
  developer: { type: String, required: true },
  releaseYear: { type: Number, required: true },
  genre: { type: [String], required: true },
  platforms: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Game = 'Game'; // El nombre del modelo
