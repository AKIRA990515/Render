import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async createMessage(userId: string, userName: string, dto: CreateMessageDto): Promise<Message> {
    const message = this.messageRepository.create({
      userId,
      userName,
      content: dto.content,
    });
    return this.messageRepository.save(message);
  }

  async getMessages(limit: number = 50, offset: number = 0): Promise<Message[]> {
    return this.messageRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });
  }
}