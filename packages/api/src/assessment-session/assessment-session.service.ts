import { Injectable } from '@nestjs/common';
import { CreateAssessmentSessionDto } from './dto/create-assessment-session.dto';
import { UpdateAssessmentSessionDto } from './dto/update-assessment-session.dto';

@Injectable()
export class AssessmentSessionService {
  create(createAssessmentSessionDto: CreateAssessmentSessionDto) {
    return 'This action adds a new assessmentSession';
  }

  findAll() {
    return `This action returns all assessmentSession`;
  }

  findOne(id: number) {
    return `This action returns a #${id} assessmentSession`;
  }

  update(id: number, updateAssessmentSessionDto: UpdateAssessmentSessionDto) {
    return `This action updates a #${id} assessmentSession`;
  }

  remove(id: number) {
    return `This action removes a #${id} assessmentSession`;
  }
}
