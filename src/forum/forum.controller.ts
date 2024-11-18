import { Controller, Get } from "@nestjs/common";
import { ForumService } from './forum.service';

@Controller('/forums')
export class ForumController {
  private forumService: ForumService;

  constructor(forumService:ForumService) {
    this.forumService = forumService;
  }

  @Get()
  getAllForum() {
    return this.forumService.getForum();
  }
}