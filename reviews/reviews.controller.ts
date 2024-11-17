import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // Endpoint para obtener todas las reseñas de un usuario
  @Get('user/:userId')
  async getReviewsByUser(@Param('userId') userId: string) {
    return this.reviewsService.getReviewsByUser(userId);
  }

  // Endpoint para obtener una reseña por su ID
  @Get(':id')
  async getReviewById(@Param('id') id: string) {
    return this.reviewsService.getReviewById(id);
  }

  // Endpoint para actualizar una reseña
  @Patch(':id')
  async updateReview(
    @Param('id') id: string,
    @Body() updatedReview: Partial<{ comment: string; rating: number }>, // Aquí no necesitas usar la interfaz Review directamente
  ) {
    return this.reviewsService.updateReview(id, updatedReview);
  }
}
