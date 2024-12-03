import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type PostDocument = Post & Document;

@Schema({
  timestamps: true
})
export class Post {
  @Prop({ type: String, required: true })
  title: string;
  @Prop({ type: String, required: true })
  content: string;
  @Prop({ type: String, required: true })
  author: string;
  @Prop({ type: String, required: true })
  authorAvatar: string;
  @Prop({ type: Number, default: 0 })
  votes: number;
  @Prop({ type: Number, default: 0 })
  views: number;
  @Prop({ type: [String], default: [] })
  tags: [String];
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Comment' }], default: [] }) 
  comments: Types.ObjectId[];
}

export const PostSchema = SchemaFactory.createForClass(Post);