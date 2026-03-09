import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn, Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Scenario } from '../../scenarios/entities/scenario.entity';

@Entity('scores')
@Index(['userId', 'scenarioId'])
export class Score {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, (user) => user.scores, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('uuid')
  scenarioId: string;

  @ManyToOne(() => Scenario, (s) => s.scores, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'scenarioId' })
  scenario: Scenario;

  @Column({ type: 'integer' })
  score: number;

  @Column({ type: 'integer' })
  maxScore: number;

  @Column({ type: 'float' })
  accuracy: number; // 0-100%

  @Column({ type: 'integer' })
  xpEarned: number;

  /** Number of hints used */
  @Column({ type: 'integer', default: 0 })
  hintsUsed: number;

  /** Total time in seconds to complete */
  @Column({ type: 'integer', nullable: true })
  completionTimeSeconds: number;

  /** Breakdown by category */
  @Column({ type: 'jsonb', nullable: true })
  breakdown: {
    phishingDetection?: number;
    responseTime?: number;
    correctActions?: number;
    bonusPoints?: number;
  };

  /** Whether this is the user's best attempt */
  @Column({ default: false })
  isBest: boolean;

  @Column({ type: 'integer', default: 1 })
  attemptNumber: number;

  @CreateDateColumn()
  createdAt: Date;
}
