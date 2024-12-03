import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './review.schema';
import { Game, GameDocument } from 'src/reviews_and_ratings/games/game.schema';  // Importamos Game

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel('Review', 'gameReviews') private reviewModel: Model<ReviewDocument>,  // Modelo de reseña
    @InjectModel('Game', 'gameReviews') private gameModel: Model<GameDocument>,      // Modelo de juego
  ) {}

  // Obtener todas las reseñas con los datos del juego
  async getAllReviews(): Promise<ReviewDocument[]> {   
    
    const reviews = this.reviewModel
      .find()
      .populate('gameId') // Esto hará que se rellene la información del juego relacionado
      .exec();

    return reviews;
    }

  // Obtener reseñas por usuario con datos del juego
  async getReviewsByUser(userId: string): Promise<ReviewDocument[]> {
    console.log(userId);
    const reviews = await this.reviewModel
      .find({ userId })
      .populate('gameId') // Rellenamos con la información del juego
      .exec();

    console.log('Estas son las reseñas:', reviews);

    return reviews;
  }

  async getReviewsByGame(gameId: string): Promise<ReviewDocument[]> {
    // Si no está en caché, obtenemos desde la base de datos
    const reviews = await this.reviewModel
      .find({ gameId })
      .populate('gameId')  // Rellenamos con la información del juego
      .exec();

    console.log('Estas son las reviews', reviews);
    return reviews;
  }

  // Obtener una reseña por ID con datos del juego
  async getReviewById(id: string): Promise<ReviewDocument> {
    const review = await this.reviewModel
      .findById(id)
      .populate('gameId') // Rellenamos con la información del juego
      .exec();
    
      if (!review) {
        throw new Error('Reseña no encontrada');
      }
  
      return review;
  }

  // Crear una nueva reseña
  async createReview(createReviewDto: any): Promise<ReviewDocument> {
    const createdReview = new this.reviewModel(createReviewDto);
    console.log(createdReview);
    const savedReview = await createdReview.save();
    return savedReview;
  }


  async editReview(id: string, updateReviewDto: any): Promise<ReviewDocument> {
    const updatedReview = await this.reviewModel.findByIdAndUpdate(id, updateReviewDto, {
      new: true, // Retorna el documento actualizado
    }).exec();
    if (!updatedReview) {
      throw new Error('Reseña no encontrada');
    }

    return updatedReview;
  }

  // Eliminar una reseña por ID
  async deleteReviewById(id: string): Promise<{ message: string }> {
    const review = await this.reviewModel.findById(id);
    if (!review) {
      throw new Error('Reseña no encontrada');
    }
    await this.reviewModel.findByIdAndDelete(id);

    return { message: 'Reseña eliminada exitosamente' };
  }

}
