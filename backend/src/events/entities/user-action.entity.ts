import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn, Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Scenario } from '../../scenarios/entities/scenario.entity';

export enum ActionType {
  // Email simulator
  EMAIL_OPENED = 'email_opened',
  LINK_CLICKED = 'link_clicked',
  ATTACHMENT_OPENED = 'attachment_opened',
  EMAIL_REPORTED = 'email_reported',
  EMAIL_DELETED = 'email_deleted',
  PHISHING_IDENTIFIED = 'phishing_identified',

  // Login simulator
  LOGIN_ATTEMPTED = 'login_attempted',
  FAKE_SITE_IDENTIFIED = 'fake_site_identified',
  CREDENTIALS_ENTERED = 'credentials_entered',
  SITE_REPORTED = 'site_reported',

  // General
  SCENARIO_STARTED = 'scenario_started',
  SCENARIO_COMPLETED = 'scenario_completed',
  SCENARIO_ABANDONED = 'scenario_abandoned',
  HINT_REQUESTED = 'hint_requested',
  GENERAL_INTERACTION = 'general_interaction',

  // Network
  WAF_RULE_CREATED = 'waf_rule_created',
  SECURITY_DECISION = 'security_decision',
  SECURITY_TEST = 'security_test',
}

export enum ActionRisk {
  SAFE = 'safe',
  LOW = 'low',
  WARNING = 'warning',
  HIGH = 'high',
  DANGEROUS = 'dangerous',
}

@Entity('user_actions')
@Index(['userId', 'createdAt'])
@Index(['scenarioId'])
export class UserAction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, (user) => user.actions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('uuid', { nullable: true })
  scenarioId: string;

  @ManyToOne(() => Scenario, (s) => s.actions, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'scenarioId' })
  scenario: Scenario;

  @Column({ enum: ActionType })
  actionType: ActionType;

  @Column({ enum: ActionRisk, default: ActionRisk.SAFE })
  risk: ActionRisk;

  /** Points gained or lost from this specific action */
  @Column({ type: 'integer', default: 0 })
  pointsDelta: number;

  /** Extra context: e.g. which email ID, which URL was clicked */
  @Column({ type: 'simple-json', nullable: true })
  metadata: Record<string, any>;

  /** Time user took to make decision (ms) */
  @Column({ type: 'integer', nullable: true })
  responseTimeMs: number;

  @Column({ type: 'boolean', default: false })
  isCorrect: boolean;

  /** Human-readable session identifier */
  @Column({ nullable: true })
  sessionId: string;

  @CreateDateColumn()
  createdAt: Date;
}
