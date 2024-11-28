import { Injectable } from '@nestjs/common';
import { AzureContentSafetyService } from './azure-content-safety.service';

@Injectable()
export class ContentModerationService {
  constructor(private readonly contentSafetyService: AzureContentSafetyService) {}

  /**
   * Modera el contenido utilizando Azure Content Safety
   * @param content Textos a analizar (título, contenido, tags)
   * @returns Resultado de la moderación (es seguro o no y categorías inseguras si existen)
   */
  async moderateContent(content: any): Promise<{ isSafe: boolean; unsafeCategories?: string }> {
    const analysisResult = await this.contentSafetyService.analyzeText(content.join('\n---\n'));

    if (!analysisResult.isSafe) {
      // Construir un mensaje con las categorías inseguras detectadas
      const unsafeCategories = analysisResult.unsafeCategories
        .map((cat) => `${cat.category} (Severidad: ${cat.severity})`)
        .join(', ');

      return { isSafe: false, unsafeCategories };
    }

    return { isSafe: true };
  }
}
