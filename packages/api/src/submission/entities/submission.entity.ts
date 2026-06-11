import { AssessmentSession } from 'src/assessment-session/entities/assessment-session.entity';
import { Problem } from 'src/problem/entities/problem.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

enum SubmissionStatus {
  PENDING,
  RUNNING,
  PASSED,
  FAILED,
  ERROR,
}

@Entity({ name: 'submissions' })
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sessionId: string;

  @Column()
  problemId: string;

  @Column()
  language: string;

  @Column()
  code: string;

  @Column({ enum: SubmissionStatus, default: SubmissionStatus.PENDING })
  status: SubmissionStatus;

  @Column({ default: 0 })
  score: number;

  @Column({ default: 0 })
  passedTests: number;

  @Column({ default: 0 })
  totalTests: number;

  @Column({ nullable: true })
  runtimeMs?: number;

  @ManyToOne(() => AssessmentSession)
  session: AssessmentSession;

  @ManyToOne(() => Problem)
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
