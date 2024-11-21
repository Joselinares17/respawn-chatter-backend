import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GameDocument } from './game.schema';
import { GameDto } from './games.dto';

@Injectable()
export class GamesService {
  constructor(
    @InjectModel('Game') private readonly gameModel: Model<GameDocument>
  ) {}

  async create(createGameDto: GameDto): Promise<GameDocument> {
    const createdGame = new this.gameModel(createGameDto);
    return createdGame.save();
  }

  async findAll(): Promise<GameDocument[]> {
    return this.gameModel.find().exec();
  }

  async findOne(id: string): Promise<GameDocument> {
    return this.gameModel.findById(id).exec();
  }
}
