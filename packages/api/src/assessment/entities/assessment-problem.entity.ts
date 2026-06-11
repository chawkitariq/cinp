import { Problem } from 'src/problem/entities/problem.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Assessment } from './assessment.entity';

@Entity({ name: 'assessment_problems' })
export class AssessmentProblem {
  @Column({ default: 0 })
  order: number;

  @PrimaryColumn({ name: 'assessment_id' })
  assessmentId: string;

  @PrimaryColumn({ name: 'problem_id' })
  problemId: string;

  @ManyToOne(() => Assessment, (assessment) => assessment.problems)
  @JoinColumn({ name: 'assessment_id' })
  assessment: Assessment;

  @ManyToOne(() => Problem, (problem) => problem.assessments)
  @JoinColumn({ name: 'problem_id' })
  problem: Problem;
}
