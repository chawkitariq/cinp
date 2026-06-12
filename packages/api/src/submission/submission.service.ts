import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { Submission } from './entities/submission.entity';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectRepository(Submission)
    private readonly submissionRepository: Repository<Submission>,
  ) {}

  /**
   * Records a candidate submission from validated request data.
   */
  create(createSubmissionDto: CreateSubmissionDto) {
    const submission = this.submissionRepository.create(createSubmissionDto);
    return this.submissionRepository.save(submission);
  }

  /**
   * Lists all submissions without relation expansion.
   */
  findAll() {
    return this.submissionRepository.find();
  }

  /**
   * Finds a submission by UUID or throws when it does not exist.
   */
  async findOne(id: string) {
    const submission = await this.submissionRepository.findOne({
      where: { id },
    });

    if (!submission) {
      throw new NotFoundException(`Submission ${id} not found`);
    }

    return submission;
  }

  /**
   * Applies partial submission changes through TypeORM preload semantics.
   */
  async update(id: string, updateSubmissionDto: UpdateSubmissionDto) {
    const submission = await this.submissionRepository.preload({
      id,
      ...updateSubmissionDto,
    });

    if (!submission) {
      throw new NotFoundException(`Submission ${id} not found`);
    }

    return this.submissionRepository.save(submission);
  }

  /**
   * Deletes a submission by UUID and reports whether a row was removed.
   */
  async remove(id: string) {
    const result = await this.submissionRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`Submission ${id} not found`);
    }

    return { deleted: true };
  }
}
