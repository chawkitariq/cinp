import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import { AssessmentProblem } from './entities/assessment-problem.entity';
import { Assessment } from './entities/assessment.entity';
import { Problem } from 'src/problem/entities/problem.entity';

@Injectable()
export class AssessmentService {
  constructor(
    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,
  ) {}

  /**
   * Creates a recruiter-owned assessment from validated request data.
   *
   * @param createAssessmentDto Validated assessment creation payload.
   * @returns A promise that resolves to the saved assessment with ordered problems.
   */
  async create(createAssessmentDto: CreateAssessmentDto) {
    const assessmentId = await this.assessmentRepository.manager.transaction(
      async (manager) => {
        const { problemIds = [], ...assessmentData } = createAssessmentDto;
        const assessment = manager
          .getRepository(Assessment)
          .create(assessmentData);
        const savedAssessment = await manager
          .getRepository(Assessment)
          .save(assessment);

        await this.syncAssessmentProblems(
          manager.getRepository(AssessmentProblem),
          manager.getRepository(Problem),
          savedAssessment.id,
          problemIds,
        );

        return savedAssessment.id;
      },
    );

    return this.findOneWithProblems(assessmentId);
  }

  /**
   * Lists all assessments without relation expansion.
   *
   * @returns A promise that resolves to every persisted assessment entity.
   */
  findAll() {
    return this.assessmentRepository.find();
  }

  /**
   * Finds an assessment by UUID or throws when it does not exist.
   *
   * @param id The assessment UUID to load.
   * @returns A promise that resolves to the matching assessment entity.
   * @throws {NotFoundException} When the assessment does not exist.
   */
  async findOne(id: string) {
    const assessment = await this.findOneWithProblems(id);

    if (!assessment) {
      throw new NotFoundException(`Assessment ${id} not found`);
    }

    return assessment;
  }

  /**
   * Loads one assessment together with its ordered problem memberships.
   *
   * @param id The assessment UUID to load.
   * @returns A promise that resolves to the assessment or `null` when it is missing.
   */
  private findOneWithProblems(id: string) {
    return this.assessmentRepository
      .createQueryBuilder('assessment')
      .leftJoinAndSelect('assessment.problems', 'assessmentProblem')
      .leftJoinAndSelect('assessmentProblem.problem', 'problem')
      .where('assessment.id = :id', { id })
      .orderBy('assessmentProblem.order', 'ASC')
      .getOne();
  }

  /**
   * Applies partial assessment changes through TypeORM preload semantics.
   *
   * @param id The UUID of the assessment to update.
   * @param updateAssessmentDto Partial assessment payload validated by NestJS.
   * @returns A promise that resolves to the saved assessment with problems.
   * @throws {NotFoundException} When the assessment does not exist.
   */
  async update(id: string, updateAssessmentDto: UpdateAssessmentDto) {
    await this.assessmentRepository.manager.transaction(async (manager) => {
      const { problemIds, ...assessmentData } = updateAssessmentDto;
      const assessment = await manager.getRepository(Assessment).preload({
        id,
        ...assessmentData,
      });

      if (!assessment) {
        throw new NotFoundException(`Assessment ${id} not found`);
      }

      await manager.getRepository(Assessment).save(assessment);

      if (problemIds !== undefined) {
        await this.syncAssessmentProblems(
          manager.getRepository(AssessmentProblem),
          manager.getRepository(Problem),
          id,
          problemIds,
        );
      }
    });

    return this.findOneWithProblems(id);
  }

  /**
   * Deletes an assessment by UUID and reports whether a row was removed.
   *
   * @param id The UUID of the assessment to delete.
   * @returns A promise that resolves to a deletion confirmation payload.
   * @throws {NotFoundException} When the assessment does not exist.
   */
  async remove(id: string) {
    const result = await this.assessmentRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`Assessment ${id} not found`);
    }

    return { deleted: true };
  }

  /**
   * Replaces the ordered set of problems attached to an assessment.
   *
   * @param assessmentProblemRepository Repository used to persist join rows.
   * @param problemRepository Repository used to validate problem identifiers.
   * @param assessmentId UUID of the assessment being synchronized.
   * @param problemIds Ordered problem UUIDs to attach to the assessment.
   * @returns A promise that resolves when the join table has been synchronized.
   * @throws {NotFoundException} When one or more problem UUIDs do not exist.
   */
  private async syncAssessmentProblems(
    assessmentProblemRepository: Repository<AssessmentProblem>,
    problemRepository: Repository<Problem>,
    assessmentId: string,
    problemIds: string[],
  ) {
    await assessmentProblemRepository.delete({ assessmentId });

    if (!problemIds.length) {
      return;
    }

    const uniqueProblemIds = [...new Set(problemIds)];
    const problems = await problemRepository.find({
      where: { id: In(uniqueProblemIds) },
      select: {
        id: true,
      },
    });

    if (problems.length !== uniqueProblemIds.length) {
      const existingProblemIds = new Set(problems.map((problem) => problem.id));
      const missingProblemIds = uniqueProblemIds.filter(
        (problemId) => !existingProblemIds.has(problemId),
      );

      throw new NotFoundException(
        `Problems ${missingProblemIds.join(', ')} not found`,
      );
    }

    await assessmentProblemRepository.save(
      problemIds.map((problemId, order) =>
        assessmentProblemRepository.create({
          assessmentId,
          problemId,
          order,
        }),
      ),
    );
  }
}
