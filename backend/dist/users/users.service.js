"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("./entities/user.entity");
let UsersService = class UsersService {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async create(dto) {
        const exists = await this.userRepo.findOne({ where: { email: dto.email } });
        if (exists)
            throw new common_1.ConflictException('Email already in use');
        const passwordHash = await bcrypt.hash(dto.password, 12);
        const user = this.userRepo.create({ ...dto, passwordHash });
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
    async findOne(id) {
        const user = await this.userRepo.findOne({ where: { id }, relations: ['scores'] });
        if (!user)
            throw new common_1.NotFoundException(`User ${id} not found`);
        return user;
    }
    async findByEmail(email) {
        return this.userRepo.findOne({ where: { email } });
    }
    async update(id, dto) {
        const user = await this.findOne(id);
        if (dto.password) {
            dto.passwordHash = await bcrypt.hash(dto.password, 12);
            delete dto.password;
        }
        Object.assign(user, dto);
        return this.userRepo.save(user);
    }
    async remove(id) {
        const user = await this.findOne(id);
        await this.userRepo.softDelete(user.id);
    }
    async addXp(userId, xp) {
        const user = await this.findOne(userId);
        user.xp += xp;
        user.totalScore += xp;
        if (user.xp >= 5000)
            user.level = user_entity_1.UserLevel.EXPERT;
        else if (user.xp >= 2000)
            user.level = user_entity_1.UserLevel.ADVANCED;
        else if (user.xp >= 500)
            user.level = user_entity_1.UserLevel.INTERMEDIATE;
        return this.userRepo.save(user);
    }
    async updateLastLogin(userId) {
        await this.userRepo.update(userId, { lastLoginAt: new Date() });
    }
    async leaderboard(limit = 10) {
        return this.userRepo.find({
            select: ['id', 'name', 'level', 'totalScore', 'xp', 'streak'],
            where: { isActive: true },
            order: { totalScore: 'DESC' },
            take: limit,
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map