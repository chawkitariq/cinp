import { AssessmentSession } from 'src/assessment-session/entities/assessment-session.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AssessmentProblem } from './assessment-problem.entity';

enum AssessmentStatus {
  DRAFT,
  ACTIVE,
  CLOSED,
}

@Entity({ name: 'assessments' })
export class Assessment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description?: string;

  @Column({ name: 'duration_min' })
  durationMin: number;

  @Column({ enum: AssessmentStatus, default: AssessmentStatus.DRAFT })
  status: AssessmentStatus;

  @Column({ name: 'created_by_id' })
  createdById: string;

  @OneToMany(() => User, (user) => user.id)
  createdBy: User;

  @OneToMany(
    () => AssessmentProblem,
    (assessmentProblem) => assessmentProblem.assessmentId,
  )
  problems: AssessmentProblem[];

  @OneToMany(
    () => AssessmentSession,
    (assessmentSession) => assessmentSession.assessmentId,
  )
  sessions: AssessmentSession[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
