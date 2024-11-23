import { Schema, Document, Types } from 'mongoose';

// Interfaz del documento
export interface ResponseDocument extends Document {
  parentReviewId?: Types.ObjectId;
  parentResponseId?: Types.ObjectId;
  userId: Types.ObjectId;
  responseText: string;
  createdAt: Date;
}

// Esquema de mongoose
export const ResponseSchema = new Schema<ResponseDocument>({
  parentReviewId: { type: Schema.Types.ObjectId, ref: 'Review', default: null },
  parentResponseId: { type: Schema.Types.ObjectId, ref: 'Response', default: null },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  responseText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
