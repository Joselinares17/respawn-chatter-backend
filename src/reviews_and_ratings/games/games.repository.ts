import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GameDocument } from './game.schema';
@Injectable()
export class GamesRepository {
  constructor(@InjectModel('Game') private readonly gameModel: Model<GameDocument>) {}

  async findAll(): Promise<GameDocument[]> {
    return this.gameModel.find().exec();
  }

  async findById(id: string): Promise<GameDocument> {
    return this.gameModel.findById(id).exec();
  }

  async create(game: GameDocument): Promise<GameDocument> {
    const newGame = new this.gameModel(game);
    return newGame.save();
  }
}
