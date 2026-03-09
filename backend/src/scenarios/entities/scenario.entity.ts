import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, OneToMany, Index,
} from 'typeorm';
import { UserAction } from '../../events/entities/user-action.entity';
import { Score } from '../../scores/entities/score.entity';

export enum ScenarioDifficulty {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum ScenarioType {
  PHISHING_EMAIL = 'phishing_email',
  FAKE_LOGIN = 'fake_login',
  SOCIAL_ENGINEERING = 'social_engineering',
  RANSOMWARE = 'ransomware',
  BRUTE_FORCE = 'brute_force',
  INSIDER_THREAT = 'insider_threat',
  SQL_INJECTION = 'sql_injection',
}

@Entity('scenarios')
@Index(['type'])
export class Scenario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: ScenarioType })
  type: ScenarioType;

  @Column({ type: 'enum', enum: ScenarioDifficulty })
  difficulty: ScenarioDifficulty;

  @Column({ type: 'integer' })
  maxScore: number;

  @Column({ type: 'integer' })
  xpReward: number;

  @Column({ type: 'integer', default: 0 })
  durationSeconds: number;

  /** JSON blob of scenario-specific simulation data */
  @Column({ type: 'jsonb', nullable: true })
  config: Record<string, any>;

  @Column({ type: 'text', array: true, default: '{}' })
  tags: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'integer', default: 0 })
  timesPlayed: number;

  @Column({ type: 'float', default: 0 })
  avgScore: number;

  @OneToMany(() => UserAction, (action) => action.scenario)
  actions: UserAction[];

  @OneToMany(() => Score, (score) => score.scenario)
  scores: Score[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
