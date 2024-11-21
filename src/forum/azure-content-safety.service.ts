import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import ContentSafetyClient from '@azure-rest/ai-content-safety';
import { AzureKeyCredential } from '@azure/core-auth';

@Injectable()
export class AzureContentSafetyService {
  private client;

  constructor() {
    const API_KEY = process.env.AZURE_API_KEY || '450a56bea54841209629807860df4c88';
    const ENDPOINT =
      process.env.AZURE_ENDPOINT ||
      'https://ia-content-moderator-lab.cognitiveservices.azure.com/';
    this.client = ContentSafetyClient(ENDPOINT, new AzureKeyCredential(API_KEY));
  }

  async analyzeText(text: string): Promise<{ isSafe: boolean; unsafeCategories: any[] }> {
    const analyzeTextOption = { text };
    const analyzeTextParameters = { body: analyzeTextOption };

    try {
      const result = await this.client.path('/text:analyze').post(analyzeTextParameters);

      if (result.status === '200') {
        const unsafeCategories = result.body.categoriesAnalysis
          .filter((category) => category.severity > 0)
          .map((category) => ({
            category: category.category,
            severity: category.severity,
          }));

        return {
          isSafe: unsafeCategories.length === 0,
          unsafeCategories,
        };
      } else {
        throw new HttpException(
          'Error en el análisis de texto.',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      console.error('Error al analizar el texto:', error);
      throw new HttpException(
        'Error al comunicarse con Azure Content Safety.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
