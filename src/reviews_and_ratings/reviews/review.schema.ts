// review.schema.ts
import { Schema, Document, Types } from 'mongoose';
import { Game } from 'src/reviews_and_ratings/games/game.schema';  // Asegúrate de importar el esquema de Game

// Definición de la interfaz para la reseña
export interface ReviewDocument extends Document {
  userId: Types.ObjectId;
  gameId: Types.ObjectId;
  rating: number;
  reviewText: string;
  createdAt: Date;
  updatedAt: Date;
}

// Definición del esquema de la reseña
export const ReviewSchema = new Schema<ReviewDocument>({
  userId: { type: Schema.Types.ObjectId, required: true },
  gameId: { type: Schema.Types.ObjectId, ref: 'Game', required: true },  // Referencia a 'Game'
  rating: { type: Number, required: true },
  reviewText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { versionKey: false });

// Exportación del modelo 'Review' y del esquema
export const Review = 'Review'; // 'Review' es el nombre del modelo
