import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';

@Controller('assessments')
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  /**
   * Creates a recruiter-owned assessment.
   *
   * @param createAssessmentDto Assessment creation payload validated by NestJS.
   * @returns A promise that resolves to the saved assessment with problems.
   */
  @Post()
  create(@Body() createAssessmentDto: CreateAssessmentDto) {
    return this.assessmentService.create(createAssessmentDto);
  }

  /**
   * Returns every assessment record.
   *
   * @returns A promise that resolves to every persisted assessment entity.
   */
  @Get()
  findAll() {
    return this.assessmentService.findAll();
  }

  /**
   * Returns one assessment by UUID.
   *
   * @param id The assessment UUID to load.
   * @returns A promise that resolves to the matching assessment entity.
   */
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.assessmentService.findOne(id);
  }

  /**
   * Updates an assessment by UUID.
   *
   * @param id The assessment UUID to update.
   * @param updateAssessmentDto Partial assessment payload validated by NestJS.
   * @returns A promise that resolves to the saved assessment with problems.
   */
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAssessmentDto: UpdateAssessmentDto,
  ) {
    return this.assessmentService.update(id, updateAssessmentDto);
  }

  /**
   * Deletes an assessment by UUID.
   *
   * @param id The assessment UUID to delete.
   * @returns A promise that resolves to a deletion confirmation payload.
   */
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.assessmentService.remove(id);
  }
}
