import { Assessment } from 'src/assessment/entities/assessment.entity';
import { Submission } from 'src/submission/entities/submission.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Candidate session lifecycle from invitation through completion.
 */
export enum SessionStatus {
  INVITED = 'invited',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
}

/**
 * Candidate-specific attempt for a single assessment invitation token.
 */
@Entity({ name: 'assessment_sessions' })
@Unique(['token'])
export class AssessmentSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string;

  /**
   * Email address used to invite and identify the candidate.
   */
  @Column({ name: 'candidate_email' })
  candidateEmail: string;

  @Column({ name: 'candidate_name', nullable: true })
  candidateName?: string;

  @Column({ name: 'assessment_id' })
  assessmentId: string;

  @Column({ type: 'enum', enum: SessionStatus, default: SessionStatus.INVITED })
  status: SessionStatus;

  /**
   * Timestamp when the candidate first starts the timed assessment.
   */
  @Column({ name: 'started_at', type: 'timestamptz', nullable: true })
  startedAt?: Date;

  /**
   * Deadline after which the session can no longer accept submissions.
   */
  @Column({ name: 'expires_at', type: 'timestamptz', nullable: true })
  expiresAt?: Date;

  /**
   * Timestamp when the candidate explicitly finishes the session.
   */
  @Column({ name: 'finished_at', type: 'timestamptz', nullable: true })
  finishedAt?: Date;

  /**
   * Aggregated score across submissions in this session.
   */
  @Column({ name: 'total_score', default: 0 })
  totalScore: number;

  @ManyToOne(() => Assessment, (assessment) => assessment.sessions)
  @JoinColumn({ name: 'assessment_id' })
  assessment: Assessment;

  @OneToMany(() => Submission, (submission) => submission.session)
  submissions: Submission[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
