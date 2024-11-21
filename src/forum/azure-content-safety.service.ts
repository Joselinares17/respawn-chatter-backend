import { Injectable } from '@nestjs/common';
import ContentSafetyClient from "@azure-rest/ai-content-safety";
import { AzureKeyCredential } from "@azure/core-auth";

@Injectable()
export class AzureContentSafetyService {
  private readonly client;
  API_KEY = process.env.AZURE_API_KEY;
  ENDPOINT = process.env.AZURE_ENDPOINT;

  constructor() {
    this.client = ContentSafetyClient(this.ENDPOINT, new AzureKeyCredential(this.API_KEY));
  }

  async analyzeText(text: string): Promise<{ isSafe: boolean; unsafeCategories: any[] }> {
    const analyzeTextOption = { text };
    const analyzeTextParameters = { body: analyzeTextOption };

    try {
      const result = await this.client.path("/text:analyze").post(analyzeTextParameters);

      if (result.status === "200") {
        const unsafeCategories = result.body.categoriesAnalysis
          .filter(category => category.severity > 0)
          .map(category => ({ category: category.category, severity: category.severity }));

        return {
          isSafe: unsafeCategories.length === 0,
          unsafeCategories: unsafeCategories
        };
      } else {
        throw new Error("Error en el análisis de texto.");
      }
    } catch (error) {
      console.error("Error al analizar el texto:", error);
      throw error;
    }
  }
}
