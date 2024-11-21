import { Controller, Get, Param, Query, Post, Body, Put, Delete } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewDocument } from './review.schema';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // Obtener todas las reseñas
  @Get()
  async getAllReviews(): Promise<ReviewDocument[]> {
    return this.reviewsService.getAllReviews();  // Llamamos al servicio
  }

  // Obtener reseñas por usuario
  @Get('user/:userId')
  async getReviewsByUser(@Param('userId') userId: string): Promise<ReviewDocument[]> {
    return this.reviewsService.getReviewsByUser(userId);  // Llamamos al servicio con el userId
  }

  // Obtener reseñas por usuario
  @Get('game/:gameId')
  async getReviewsByGame(@Param('gameId') gameId: string): Promise<ReviewDocument[]> {
    return this.reviewsService.getReviewsByGame(gameId);  // Llamamos al servicio con el userId
  }

  // Obtener una reseña por ID
  @Get(':id')
  async getReviewById(@Param('id') id: string): Promise<ReviewDocument> {
    return this.reviewsService.getReviewById(id);  // Llamamos al servicio con el ID de la reseña
  }

  // Crear una nueva reseña
  @Post()
  async createReview(@Body() createReviewDto: any): Promise<ReviewDocument> {
    return this.reviewsService.createReview(createReviewDto);  // Llamamos al servicio para crear la reseña
  }

  // Editar una reseña existente
  @Put(':id')
  async editReview(@Param('id') id: string, @Body() updateReviewDto: any): Promise<ReviewDocument> {
    return this.reviewsService.editReview(id, updateReviewDto);  // Llamamos al servicio para actualizar la reseña
  }

  // Eliminar una reseña por ID
  @Delete(':id')
  async deleteReview(@Param('id') id: string): Promise<{ message: string }> {
    return this.reviewsService.deleteReviewById(id);  // Llamamos al servicio para eliminar la reseña
  }

}
