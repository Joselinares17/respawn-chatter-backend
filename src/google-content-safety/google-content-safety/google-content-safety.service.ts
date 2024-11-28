import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { LanguageServiceClient } from '@google-cloud/language';

@Injectable()
export class GoogleContentSafetyService {
  private readonly client = new LanguageServiceClient();

  async moderateText(text: string): Promise<any> {
    try {
      const document = {
        content: text,
        type: 'PLAIN_TEXT' as 'PLAIN_TEXT', // Asegúrate de usar este valor exacto
      };

      // Enviamos la solicitud al servicio de Google para análisis de sentimientos
      const response = await this.client.analyzeSentiment({ document });

      // El primer elemento es el análisis de sentimiento
      const result = response[0]; // Asegurémonos de acceder al primer valor del array

      // Puedes acceder a las puntuaciones de sentimiento, etc.
      console.log(result);

      return result;
    } catch (error) {
      console.error('Error en la moderación de texto:', error.message);
      throw new HttpException(
        'Error al comunicar con el servicio de Google Natural Language',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
