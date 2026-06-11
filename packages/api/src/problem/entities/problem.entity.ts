import { AssessmentProblem } from "src/assessment/entities/assessment-problem.entity"
import { Submission } from "src/submission/entities/submission.entity"
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm"

enum Difficulty {
    EASY,
    MEDIUM,
    HARD,
}

@Entity({ name: 'problems' })
@Unique(['slug'])
export class Problem {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    title: string

    @Column()
    slug: string

    @Column()
    difficulty: Difficulty

    @Column()
    description: string

    @Column({ type: 'json' })
    examples?: string

    @Column()
    constraints?: string

    @Column({ name: 'starter_code' })
    starterCode?: string

    // @OneToMany(() => AssessmentSession)
    // testCases: TestCase[]

    @OneToMany(() => AssessmentProblem, assessmentProblem => assessmentProblem.problemId)
    assessments: AssessmentProblem[]

    @OneToMany(() => Submission, submission => submission.problem)
    submissions: Submission[]

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date
}
