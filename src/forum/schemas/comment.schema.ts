import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({
  timestamps: true,
})
export class Reply {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String, required: true })
  author: string;

  @Prop({ type: Number, default: 0 })
  votes: number;
}

export const ReplySchema = SchemaFactory.createForClass(Reply);

@Schema({
  timestamps: true,
})
export class Comment {
  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String, required: true })
  author: string;

  @Prop({ type: Number, default: 0 })
  votes: number;

  @Prop({ type: [ReplySchema], default: [] }) // Respuestas anidadas como subdocumentos
  replies: Reply[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);