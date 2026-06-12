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
   */
  create(createProblemDto: CreateProblemDto) {
    const problem = this.problemRepository.create(createProblemDto);
    return this.problemRepository.save(problem);
  }

  /**
   * Lists all problems without relation expansion.
   */
  findAll() {
    return this.problemRepository.find();
  }

  /**
   * Finds a problem by UUID or throws when it does not exist.
   */
  async findOne(id: string) {
    const problem = await this.problemRepository.findOne({ where: { id } });

    if (!problem) {
      throw new NotFoundException(`Problem ${id} not found`);
    }

    return problem;
  }

  /**
   * Applies partial problem changes through TypeORM preload semantics.
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
   */
  async remove(id: string) {
    const result = await this.problemRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`Problem ${id} not found`);
    }

    return { deleted: true };
  }
}
