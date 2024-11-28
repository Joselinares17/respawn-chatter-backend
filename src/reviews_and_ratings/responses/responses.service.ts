import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { ResponseDocument } from './response.schema';

@Injectable()
export class ResponsesService {
  constructor(
    @InjectModel('Response', 'gameReviews') private readonly responseModel: Model<ResponseDocument>,
  ) {}

  // Crear una nueva respuesta
  async createResponse(data: Partial<ResponseDocument>): Promise<ResponseDocument> {
    const response = new this.responseModel(data);
    return response.save();
  }

  // Obtener respuestas por ID de reseña o respuesta
  async getResponsesByParent(
    parentReviewId?: string,
    parentResponseId?: string,
  ) {
    // Construir el filtro dinámico según los parámetros
    const filter: FilterQuery<ResponseDocument> = {};
  
    if (parentReviewId) {
      filter.parentReviewId = parentReviewId;
  
      // Asegurarse de que `parentResponseId` no exista
      filter.parentResponseId = { $in: [null, undefined] };
    }
  
    if (parentResponseId) {
      filter.parentResponseId = parentResponseId;
    }
  
    // Realizar la consulta con el filtro dinámico
    return this.responseModel.find(filter).populate('userId', 'username email').exec();
  }
}