import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole, UserLevel } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const email = dto.email.toLowerCase();
    const exists = await this.userRepo.findOne({ where: { email } });
    if (exists) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = this.userRepo.create({ ...dto, email, passwordHash });
    return this.userRepo.save(user);
  }

  async findAll(page = 1, limit = 20) {
    const [data, total] = await this.userRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { totalScore: 'DESC' },
    });
    return { data, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id }, relations: ['scores'] });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email: email.toLowerCase() } });
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (dto.password) {
      (dto as any).passwordHash = await bcrypt.hash(dto.password, 12);
      delete dto.password;
    }
    Object.assign(user, dto);
    return this.userRepo.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepo.softDelete(user.id);
  }

  async addXp(userId: string, xp: number): Promise<User> {
    const user = await this.findOne(userId);
    user.xp += xp;
    user.totalScore += xp;
    // Level up logic
    if (user.xp >= 5000) user.level = UserLevel.EXPERT;
    else if (user.xp >= 2000) user.level = UserLevel.ADVANCED;
    else if (user.xp >= 500) user.level = UserLevel.INTERMEDIATE;
    return this.userRepo.save(user);
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.userRepo.update(userId, { lastLoginAt: new Date() });
  }

  /** Leaderboard: top users by score */
  async leaderboard(limit = 10) {
    return this.userRepo.find({
      select: ['id', 'name', 'level', 'totalScore', 'xp', 'streak'],
      where: { isActive: true },
      order: { totalScore: 'DESC' },
      take: limit,
    });
  }
}
