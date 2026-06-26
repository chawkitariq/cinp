import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';
import { Problem } from './entities/problem.entity';

@Injectable()
export class ProblemService {
  constructor(
    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,
  ) {}

  /**
   * Creates a reusable technical problem from validated request data.
   *
   * @param createProblemDto Validated problem creation payload.
   * @returns A promise that resolves to the saved problem entity.
   */
  create(createProblemDto: CreateProblemDto) {
    const problem = this.problemRepository.create(createProblemDto);
    return this.problemRepository.save(problem);
  }

  /**
   * Lists all problems without relation expansion.
   *
   * @returns A promise that resolves to every persisted problem entity.
   */
  findAll() {
    return this.problemRepository.find();
  }

  /**
   * Finds a problem by UUID or throws when it does not exist.
   *
   * @param id The problem UUID to load.
   * @returns A promise that resolves to the matching problem entity.
   * @throws {NotFoundException} When the problem does not exist.
   */
  async findOne(id: string) {
    const problem = await this.findOneWithTestCases(id);

    if (!problem) {
      throw new NotFoundException(`Problem ${id} not found`);
    }

    return problem;
  }

  /**
   * Applies partial problem changes through TypeORM preload semantics.
   *
   * @param id The UUID of the problem to update.
   * @param updateProblemDto Partial problem payload validated by NestJS.
   * @returns A promise that resolves to the saved problem entity.
   * @throws {NotFoundException} When the problem does not exist.
   */
  async update(id: string, updateProblemDto: UpdateProblemDto) {
    const problem = await this.problemRepository.preload({
      id,
      ...updateProblemDto,
    });

    if (!problem) {
      throw new NotFoundException(`Problem ${id} not found`);
    }

    return this.problemRepository.save(problem);
  }

  /**
   * Deletes a problem by UUID and reports whether a row was removed.
   *
   * @param id The UUID of the problem to delete.
   * @returns A promise that resolves to a deletion confirmation payload.
   * @throws {NotFoundException} When the problem does not exist.
   */
  async remove(id: string) {
    const result = await this.problemRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`Problem ${id} not found`);
    }

    return { deleted: true };
  }

  /**
   * Loads one problem with its associated test cases.
   *
   * @param id The problem UUID to load.
   * @returns A promise that resolves to the matching problem entity or `null`.
   */
  private findOneWithTestCases(id: string) {
    return this.problemRepository
      .createQueryBuilder('problem')
      .leftJoinAndSelect('problem.testCases', 'testCase')
      .where('problem.id = :id', { id })
      .orderBy('testCase.createdAt', 'ASC')
      .getOne();
  }
}
