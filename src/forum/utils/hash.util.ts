import * as crypto from 'crypto';

export function generateContentHash(title: string, content: string, tags: string[]): string {
  const combinedText = [title, content, ...tags].join('|');
  return crypto.createHash('sha256').update(combinedText).digest('hex');
}
