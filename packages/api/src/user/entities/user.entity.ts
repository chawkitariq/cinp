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
import { AssessmentSession } from 'src/assessment-session/entities/assessment-session.entity';
import { Assessment } from 'src/assessment/entities/assessment.entity';

@Entity({ name: 'users' })
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ name: 'is_recruiter', default: false })
  isRecruiter: boolean;

  @OneToMany(() => Assessment, (assessment) => assessment.createdBy)
  createdAssessments: Assessment[];

  @OneToMany(() => AssessmentSession, (session) => session.candidate)
  assessmentSessions: AssessmentSession[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt?: Date;
}
