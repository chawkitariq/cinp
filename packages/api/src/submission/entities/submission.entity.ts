import { AssessmentSession } from 'src/assessment-session/entities/assessment-session.entity';
import { Problem } from 'src/problem/entities/problem.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Execution and grading lifecycle for a submitted solution.
 */
export enum SubmissionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  PASSED = 'passed',
  FAILED = 'failed',
  ERROR = 'error',
}

/**
 * Candidate code submission for a problem within an assessment session.
 */
@Entity({ name: 'submissions' })
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'session_id' })
  sessionId: string;

  @Column({ name: 'problem_id' })
  problemId: string;

  @Column()
  language: string;

  /**
   * Source code submitted by the candidate.
   */
  @Column({ type: 'text' })
  code: string;

  @Column({
    type: 'enum',
    enum: SubmissionStatus,
    default: SubmissionStatus.PENDING,
  })
  status: SubmissionStatus;

  @Column({ default: 0 })
  score: number;

  /**
   * Number of validation test cases that passed.
   */
  @Column({ name: 'passed_tests', default: 0 })
  passedTests: number;

  /**
   * Total number of validation test cases executed.
   */
  @Column({ name: 'total_tests', default: 0 })
  totalTests: number;

  /**
   * Runtime reported by the execution engine in milliseconds.
   */
  @Column({ name: 'runtime_ms', nullable: true })
  runtimeMs?: number;

  @ManyToOne(() => AssessmentSession, (session) => session.submissions)
  @JoinColumn({ name: 'session_id' })
  session: AssessmentSession;

  @ManyToOne(() => Problem, (problem) => problem.submissions)
  @JoinColumn({ name: 'problem_id' })
  problem: Problem;

  @Column({
    name: 'submitted_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  submittedAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
