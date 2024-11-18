import { Injectable } from '@nestjs/common';

@Injectable()
export class ForumService {
  getForum() {
    return ['Forum 1','Forum 2','Forum 3']
  }
}
