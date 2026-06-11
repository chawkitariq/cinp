import { Assessment } from "src/assessment/entities/assessment.entity"
import { Submission } from "src/submission/entities/submission.entity"
import { User } from "src/user/entities/user.entity"
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm"

enum SessionStatus {
    INVITED,
    IN_PROGRESS,
    COMPLETED,
    EXPIRED,
}


@Entity({name: 'assessment_sessions'})
@Unique(['token'])
export class AssessmentSession {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    token: string

    @Column({name: 'candidate_id'})
    candidateId: string

    @Column({name: 'assessment_id'})
    assessmentId: string
    
    @Column({ enum: SessionStatus, default: SessionStatus.INVITED })
    status: SessionStatus

    @Column({name: 'started_at', type: 'timestamptz', nullable: true})
    startedAt?: Date

    @Column({name: 'expires_at', type: 'timestamptz', nullable: true})
    expiresAt?: Date

    @Column({name: 'finished_at', type: 'timestamptz', nullable: true})
    finishedAt?: Date

    @Column()
    totalScore: number

    @ManyToOne(() => User, (user) => user.id)
    candidate: User

    @ManyToOne(() => Assessment, (assessment) => assessment.id)
    assessment: Assessment

    @OneToMany(() => Submission, submission => submission.sessionId)
    submissions: Submission[]

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date
}