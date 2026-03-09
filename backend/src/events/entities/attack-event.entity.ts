import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn, Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum EventSeverity {
  INFO = 'info',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum AttackEventType {
  PHISHING_ATTEMPT = 'phishing_attempt',
  CREDENTIAL_THEFT = 'credential_theft',
  MALWARE_SIMULATED = 'malware_simulated',
  SOCIAL_ENGINEERING = 'social_engineering',
  BRUTE_FORCE = 'brute_force',
  RANSOMWARE_SIMULATED = 'ransomware_simulated',
  SQL_INJECTION = 'sql_injection',
  DOS_ATTACK = 'dos_attack',
  PORT_SCAN = 'port_scan',
}

@Entity('attack_events')
@Index(['userId', 'createdAt'])
@Index(['severity', 'createdAt'])
export class AttackEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { nullable: true })
  userId: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'enum', enum: AttackEventType })
  eventType: AttackEventType;

  @Column({ type: 'enum', enum: EventSeverity, default: EventSeverity.INFO })
  severity: EventSeverity;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  /** IP address of simulated attacker */
  @Column({ nullable: true })
  sourceIp: string;

  /** Whether the user successfully identified/blocked the attack */
  @Column({ nullable: true })
  wasDetected: boolean;

  /** Time to detect in ms — null if not detected */
  @Column({ type: 'integer', nullable: true })
  detectionTimeMs: number;

  @Column({ type: 'jsonb', nullable: true })
  payload: Record<string, any>;

  @Column({ nullable: true })
  sessionId: string;

  @Column({ default: false })
  isResolved: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
