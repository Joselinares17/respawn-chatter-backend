import { Schema, Document } from 'mongoose';

export const ReviewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  gameId: { type: Schema.Types.ObjectId, ref: 'Game', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export interface Review {
  userId: string;
  gameId: string;
  rating: number;
  reviewText: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewDocument extends Review, Document {}
