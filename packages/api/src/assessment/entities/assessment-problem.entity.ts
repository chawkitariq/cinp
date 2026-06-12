import { Problem } from 'src/problem/entities/problem.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Assessment } from './assessment.entity';

/**
 * Join entity ordering a problem inside an assessment.
 */
@Entity({ name: 'assessment_problems' })
export class AssessmentProblem {
  /**
   * Zero-based display order of the problem within the assessment.
   */
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
