import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, OneToMany, Index,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Score } from '../../scores/entities/score.entity';
import { UserAction } from '../../events/entities/user-action.entity';

export enum UserRole {
  TRAINEE = 'trainee',
  ANALYST = 'analyst',
  ADMIN = 'admin',
}

export enum UserLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

@Entity('users')
@Index(['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Exclude()
  @Column()
  passwordHash: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.TRAINEE })
  role: UserRole;

  @Column({ type: 'enum', enum: UserLevel, default: UserLevel.BEGINNER })
  level: UserLevel;

  @Column({ type: 'integer', default: 0 })
  totalScore: number;

  @Column({ type: 'integer', default: 0 })
  xp: number;

  @Column({ type: 'integer', default: 0 })
  streak: number; // consecutive days trained

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @OneToMany(() => Score, (score) => score.user)
  scores: Score[];

  @OneToMany(() => UserAction, (action) => action.user)
  actions: UserAction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
