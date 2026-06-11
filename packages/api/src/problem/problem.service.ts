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

  create(createProblemDto: CreateProblemDto) {
    const problem = this.problemRepository.create(createProblemDto);
    return this.problemRepository.save(problem);
  }

  findAll() {
    return this.problemRepository.find();
  }

  async findOne(id: string) {
    const problem = await this.problemRepository.findOne({ where: { id } });

    if (!problem) {
      throw new NotFoundException(`Problem ${id} not found`);
    }

    return problem;
  }

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

  async remove(id: string) {
    const result = await this.problemRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`Problem ${id} not found`);
    }

    return { deleted: true };
  }
}
