import { AssessmentProblem } from 'src/assessment/entities/assessment-problem.entity';
import { Submission } from 'src/submission/entities/submission.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

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

  @Column({ nullable: true })
  constraints?: string;

  @Column({ name: 'starter_code', nullable: true })
  starterCode?: string;

  @OneToMany(
    () => AssessmentProblem,
    (assessmentProblem) => assessmentProblem.problem,
  )
  assessments: AssessmentProblem[];

  @OneToMany(() => Submission, (submission) => submission.problem)
  submissions: Submission[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
