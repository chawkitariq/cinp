import { Problem } from 'src/problem/entities/problem.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Assessment } from './assessment.entity';

@Entity({ name: 'assessment_problems' })
export class AssessmentProblem {
  @Column({ default: 0 })
  order: number;

  @Column({ name: 'assessment_id' })
  @PrimaryColumn()
  assessmentId: string;

  @Column({ name: 'problem_id' })
  @PrimaryColumn()
  problemId: string;

  @OneToMany(() => Assessment, (assessment) => assessment.id)
  assessment: Assessment;

  @OneToMany(() => Problem, (problem) => problem.id)
  problem: Problem;
}
