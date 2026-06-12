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

@Entity({ name: 'test_cases' })
export class TestCase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'problem_id' })
  problemId: string;

  @Column({ type: 'json' })
  input: Record<string, unknown>;

  @Column({ name: 'expected_output', type: 'json' })
  expectedOutput: unknown;

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
