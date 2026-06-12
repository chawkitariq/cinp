import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Assessment } from 'src/assessment/entities/assessment.entity';
import { Problem } from 'src/problem/entities/problem.entity';

/**
 * Platform account that can create recruiting content and own resources.
 */
@Entity({ name: 'users' })
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column()
  @Expose()
  email: string;

  /**
   * Hashed password credential.
   */
  @Column()
  @Exclude()
  password: string;

  /**
   * Grants access to recruiter-owned authoring workflows.
   */
  @Column({ name: 'is_recruiter', default: false })
  @Expose()
  isRecruiter: boolean;

  @OneToMany(() => Assessment, (assessment) => assessment.createdBy)
  @Exclude()
  createdAssessments: Assessment[];

  @OneToMany(() => Problem, (problem) => problem.createdBy)
  @Exclude()
  createdProblems: Problem[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  @Exclude()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  @Exclude()
  deletedAt?: Date;
}
