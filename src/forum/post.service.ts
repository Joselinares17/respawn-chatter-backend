import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Post } from './schemas/post.schema';
import { Comment } from './schemas/comment.schema';
import { CreateReplyDto } from './dtos/create-reply.dto';
import { Types } from "mongoose";

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name, 'forum') private readonly postModel: Model<Post>,
    @InjectModel(Comment.name, 'forum') private readonly commentModel: Model<Comment>,
  ) {}

  // Crear un nuevo post
  async createPost(createPostDto: any): Promise<Post> {
    const post = new this.postModel(createPostDto);
    return post.save();
  }

  // Obtener todos los posts con sus comentarios
  async getAllPosts(): Promise<Post[]> {
    return this.postModel.find().populate('comments').exec();
  }

  // Obtener un post en particular en base a su id
  async getPostById(postId: string): Promise<Post> {
    const postExist = this.postModel.findById(postId);

    if(!postExist) {
      throw Error(`${postId} does not exits`)
    }

    return postExist.populate('comments').exec();
  }

  // Obtener todos los comentarios de un post usando los id's del arreglo de comments. Creando así una nueva lista para enviarlo.
  async getAllCommentsByPost(postId: string): Promise<Comment[]> {
    const post = await this.postModel.findById(postId);
  
    if (!post) {
      throw new Error(`${postId} does not exist`);
    }
  
    const comments = await this.commentModel.find({ '_id': { $in: post.comments } }).exec();
    return comments;
  }
  

  // Agregar un comentario a un post
  async addComment(postId: string, createCommentDto: any): Promise<Comment> {
    const comment = new this.commentModel(createCommentDto);
    const savedComment = await comment.save();

    await this.postModel.findByIdAndUpdate(postId, {
      $push: { comments: savedComment._id },
    });

    return savedComment;
  }

  // Agregar una respuesta a un comentario
  async addReply(commentId: string, createReplyDto: CreateReplyDto): Promise<Comment> {
    const comment = await this.commentModel.findById(commentId);
  
    if (!comment) {
      throw new Error('Comment not found');
    }
  
    // Asegurar que el objeto incluye los campos requeridos
    comment.replies.push(createReplyDto);
    return comment.save();
  }

  // Votar un post
  async votePost(postId: string, direction: 'up' | 'down'): Promise<Post> {
    const increment = direction === 'up' ? 1 : -1;
    return this.postModel.findByIdAndUpdate(
      postId,
      { $inc: { votes: increment } },
      { new: true },
    );
  }

  async incrementViews(postId: string): Promise<Post> {
    // Busca y actualiza el post incrementando el campo 'views'
    const updatedPost = await this.postModel.findByIdAndUpdate(
      postId, // ID del post
      { $inc: { views: 1 } }, // Incrementar el campo 'views' en 1
      { new: true }, // Devolver el documento actualizado
    );

    // Si el post no existe, lanzar una excepción
    if (!updatedPost) {
      throw new Error(`Post con ID ${postId} no encontrado`);
    }

    return updatedPost;
  }

  // Votar un comentario
  async voteComment(
    commentId: string,
    direction: 'up' | 'down',
  ): Promise<Comment> {
    const increment = direction === 'up' ? 1 : -1;
    return this.commentModel.findByIdAndUpdate(
      commentId,
      { $inc: { votes: increment } },
      { new: true },
    );
  }

  // Votar una respuesta dentro de un comentario
  async voteReply(
    commentId: string,
    replyIndex: number,
    direction: 'up' | 'down',
  ): Promise<Comment> {
    const comment = await this.commentModel.findById(commentId);

    if (!comment || !comment.replies[replyIndex]) {
      throw new Error('Reply not found');
    }

    const increment = direction === 'up' ? 1 : -1;
    comment.replies[replyIndex].votes += increment;

    return comment.save();
  }
}
