import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './review.schema';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel('Review') private reviewModel: Model<ReviewDocument>,  // Inyecta el modelo de Mongoose
  ) {}

  // Obtener todas las reseñas
  async getAllReviews(): Promise<Review[]> {
    return this.reviewModel.find().exec();
  }

  // Obtener reseñas por usuario
  async getReviewsByUser(userId: string): Promise<Review[]> {
    return this.reviewModel.find({ userId }).exec();
  }

  // Obtener una reseña por ID
  async getReviewById(id: string): Promise<Review> {
    return this.reviewModel.findById(id).exec();
  }

  // Crear una nueva reseña
  async createReview(createReviewDto: any): Promise<Review> {
    const createdReview = new this.reviewModel(createReviewDto);
    return createdReview.save();
  }

  // Actualizar una reseña
  async updateReview(id: string, updateReviewDto: any): Promise<Review> {
    return this.reviewModel.findByIdAndUpdate(id, updateReviewDto, { new: true }).exec();  // Devuelve la reseña actualizada
  }
}