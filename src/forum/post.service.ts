import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './schemas/post.schema';
import { Comment, Reply } from './schemas/comment.schema';
import { CreateReplyDto } from './dtos/create-reply.dto';
import { ContentModerationService } from './content-moderation.service';
import { CreateCommentDto } from './dtos/create-comment.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name, 'forum') private readonly postModel: Model<Post>,
    @InjectModel(Comment.name, 'forum') private readonly commentModel: Model<Comment>,
    private readonly contentModerationService : ContentModerationService
  ) {}

  // Crear un nuevo post
  async createPost(title: string, content: string, tags: string[]): Promise<{ post?: Post; error?: string }> {
    const moderationResult = await this.contentModerationService.moderateContent([title, content, ...tags]);
  
    if (!moderationResult.isSafe) {
      return { error: `El contenido no pasó la moderación. Categorías inseguras detectadas: ${moderationResult.unsafeCategories}` };
    }
  
    const post = new this.postModel({ title, content, tags });
    return { post: await post.save() };
  }

  // Obtener todos los posts con sus comentarios
  async getAllPosts(): Promise<Post[]> {
    return this.postModel.find().populate('comments').exec();
  }

  // Obtener un post en particular en base a su id
  async getPostById(postId: string): Promise<Post> {
  if (!postId) {
    throw new Error('Post ID is required');
  }
  
  const postExist = await this.postModel.findById(postId);

  if (!postExist) {
    throw new Error(`Post with ID ${postId} does not exist`);
  }

  return postExist.populate('comments')
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
  async createComment(postId: string, request: CreateCommentDto): Promise<{ comment?: Comment; error?: string }> {
    const { content, author } = request
    const moderationResult = await this.contentModerationService.moderateContent([content]);
  
    if (!moderationResult.isSafe) {
      return { error: `El comentario no pasó la moderación. Categorías inseguras detectadas: ${moderationResult.unsafeCategories}` };
    }
  
    const comment = new this.commentModel({ postId, request});
    return { comment: await comment.save() };
  }

  // Agregar una respuesta a un comentario
  async createReply(commentId: string, request: CreateReplyDto): Promise<{ reply?: Reply; error?: string }> {
    const { content, author } = request

    const moderationResult = await this.contentModerationService.moderateContent([content]);
  
    if (!moderationResult.isSafe) {
      return { error: `La respuesta no pasó la moderación. Categorías inseguras detectadas: ${moderationResult.unsafeCategories}` };
    }
  
    const reply = { content, author, votes: 0 }; 
    await this.commentModel.updateOne(
      { _id: commentId },
      { $push: { replies: reply } }
    );
  
    return { reply };
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
    const updatedPost = await this.postModel.findByIdAndUpdate(
      postId, 
      { $inc: { views: 1 } }, 
      { new: true }, 
    );

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

  // Eliminar un post
  async deletePost(postId: string): Promise<{ error?: string }> {
    try {
      const post = await this.postModel.findByIdAndDelete(postId);
      
      if (!post) {
        return { error: `Post con ID ${postId} no encontrado` };
      }

      await this.commentModel.deleteMany({ postId });

      return {};
    } catch (error) {
      return { error: `Error al eliminar el post: ${error.message}` };
    }
  }
}
