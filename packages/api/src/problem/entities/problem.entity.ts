import { AssessmentProblem } from 'src/assessment/entities/assessment-problem.entity';
import { Submission } from 'src/submission/entities/submission.entity';
import { User } from 'src/user/entities/user.entity';
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
import { TestCase } from './test-case.entity';
import { Difficulty } from '../enums/difficulty.enum';

/**
 * Technical exercise created by a recruiter and reused in assessments.
 */
@Entity({ name: 'problems' })
@Unique(['slug'])
export class Problem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  slug: string;

  @Column({ type: 'enum', enum: Difficulty, default: Difficulty.EASY })
  difficulty: Difficulty;

  @Column()
  description: string;

  @Column({ type: 'json', nullable: true })
  examples?: Record<string, unknown>[];

  /**
   * Human-readable constraints shown to candidates, such as input limits.
   */
  @Column({ nullable: true })
  constraints?: string;

  /**
   * Optional starter code displayed in the web editor before submission.
   */
  @Column({ name: 'starter_code', nullable: true })
  starterCode?: string;

  @Column({ name: 'created_by_id' })
  createdById: string;

  @ManyToOne(() => User, (user) => user.createdProblems)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @OneToMany(
    () => AssessmentProblem,
    (assessmentProblem) => assessmentProblem.problem,
  )
  assessments: AssessmentProblem[];

  @OneToMany(() => TestCase, (testCase) => testCase.problem)
  testCases: TestCase[];

  @OneToMany(() => Submission, (submission) => submission.problem)
  submissions: Submission[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
