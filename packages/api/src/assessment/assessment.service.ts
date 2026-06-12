import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import { Assessment } from './entities/assessment.entity';

@Injectable()
export class AssessmentService {
  constructor(
    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,
  ) {}

  /**
   * Creates a recruiter-owned assessment from validated request data.
   */
  create(createAssessmentDto: CreateAssessmentDto) {
    const assessment = this.assessmentRepository.create(createAssessmentDto);
    return this.assessmentRepository.save(assessment);
  }

  /**
   * Lists all assessments without relation expansion.
   */
  findAll() {
    return this.assessmentRepository.find();
  }

  /**
   * Finds an assessment by UUID or throws when it does not exist.
   */
  async findOne(id: string) {
    const assessment = await this.assessmentRepository.findOne({
      where: { id },
    });

    if (!assessment) {
      throw new NotFoundException(`Assessment ${id} not found`);
    }

    return assessment;
  }

  /**
   * Applies partial assessment changes through TypeORM preload semantics.
   */
  async update(id: string, updateAssessmentDto: UpdateAssessmentDto) {
    const assessment = await this.assessmentRepository.preload({
      id,
      ...updateAssessmentDto,
    });

    if (!assessment) {
      throw new NotFoundException(`Assessment ${id} not found`);
    }

    return this.assessmentRepository.save(assessment);
  }

  /**
   * Deletes an assessment by UUID and reports whether a row was removed.
   */
  async remove(id: string) {
    const result = await this.assessmentRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`Assessment ${id} not found`);
    }

    return { deleted: true };
  }
}
