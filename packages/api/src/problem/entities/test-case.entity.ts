import { Problem } from 'src/problem/entities/problem.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Executable input/output case used to validate a candidate submission.
 */
@Entity({ name: 'test_cases' })
export class TestCase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'problem_id' })
  problemId: string;

  @Column({ type: 'json' })
  input: Record<string, unknown>;

  /**
   * JSON-serializable expected result compared with the execution output.
   */
  @Column({ name: 'expected_output', type: 'json' })
  expectedOutput: unknown;

  /**
   * Marks cases that may be shown to candidates as examples.
   */
  @Column({ name: 'is_public', default: false })
  isPublic: boolean;

  @Column({ nullable: true })
  explanation?: string;

  @ManyToOne(() => Problem, (problem) => problem.testCases)
  @JoinColumn({ name: 'problem_id' })
  problem: Problem;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
