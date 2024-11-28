import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { ResponseDocument } from './response.schema';

@Controller('responses')
export class ResponsesController {
  constructor(private readonly responsesService: ResponsesService) {}

  // Crear una nueva respuesta
  @Post()
  async createResponse(@Body() data: Partial<ResponseDocument>) {
    return this.responsesService.createResponse(data);
  }

  // Obtener respuestas por ID de reseña o respuesta
  @Get()
  async getResponses(
  @Query('parentReviewId') parentReviewId?: string,
  @Query('parentResponseId') parentResponseId?: string,
  ) {
    return this.responsesService.getResponsesByParent(parentReviewId, parentResponseId);
  }
}
