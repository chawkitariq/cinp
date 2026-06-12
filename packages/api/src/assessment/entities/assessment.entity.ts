import { AssessmentSession } from 'src/assessment-session/entities/assessment-session.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AssessmentProblem } from './assessment-problem.entity';

/**
 * Publication lifecycle for an assessment invitation flow.
 */
export enum AssessmentStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  CLOSED = 'closed',
}

/**
 * Timed set of problems assembled by a recruiter for candidates.
 */
@Entity({ name: 'assessments' })
export class Assessment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  /**
   * Assessment duration in minutes.
   */
  @Column({ name: 'duration_min' })
  durationMin: number;

  @Column({
    type: 'enum',
    enum: AssessmentStatus,
    default: AssessmentStatus.DRAFT,
  })
  status: AssessmentStatus;

  @Column({ name: 'created_by_id' })
  createdById: string;

  @ManyToOne(() => User, (user) => user.createdAssessments)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @OneToMany(
    () => AssessmentProblem,
    (assessmentProblem) => assessmentProblem.assessment,
  )
  problems: AssessmentProblem[];

  @OneToMany(
    () => AssessmentSession,
    (assessmentSession) => assessmentSession.assessment,
  )
  sessions: AssessmentSession[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
