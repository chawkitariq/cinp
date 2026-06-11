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

export enum SubmissionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  PASSED = 'passed',
  FAILED = 'failed',
  ERROR = 'error',
}

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

  @Column({ name: 'passed_tests', default: 0 })
  passedTests: number;

  @Column({ name: 'total_tests', default: 0 })
  totalTests: number;

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
