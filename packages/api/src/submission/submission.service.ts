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

  create(createSubmissionDto: CreateSubmissionDto) {
    const submission = this.submissionRepository.create(createSubmissionDto);
    return this.submissionRepository.save(submission);
  }

  findAll() {
    return this.submissionRepository.find();
  }

  async findOne(id: string) {
    const submission = await this.submissionRepository.findOne({
      where: { id },
    });

    if (!submission) {
      throw new NotFoundException(`Submission ${id} not found`);
    }

    return submission;
  }

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

  async remove(id: string) {
    const result = await this.submissionRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`Submission ${id} not found`);
    }

    return { deleted: true };
  }
}
