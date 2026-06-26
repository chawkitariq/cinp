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
import { AssessmentSessionService } from './assessment-session.service';
import { CreateAssessmentSessionDto } from './dto/create-assessment-session.dto';
import { UpdateAssessmentSessionDto } from './dto/update-assessment-session.dto';

@Controller('assessment-sessions')
export class AssessmentSessionController {
  constructor(
    private readonly assessmentSessionService: AssessmentSessionService,
  ) {}

  /**
   * Creates an invitation session for a candidate.
   *
   * @param createAssessmentSessionDto Session payload validated by NestJS.
   * @returns A promise that resolves to the saved session entity.
   */
  @Post()
  create(@Body() createAssessmentSessionDto: CreateAssessmentSessionDto) {
    return this.assessmentSessionService.create(createAssessmentSessionDto);
  }

  /**
   * Returns every assessment session record.
   *
   * @returns A promise that resolves to every persisted session entity.
   */
  @Get()
  findAll() {
    return this.assessmentSessionService.findAll();
  }

  /**
   * Returns one candidate session by UUID.
   *
   * @param id The session UUID to load.
   * @returns A promise that resolves to the matching session entity.
   */
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.assessmentSessionService.findOne(id);
  }

  /**
   * Updates candidate session metadata by UUID.
   *
   * @param id The session UUID to update.
   * @param updateAssessmentSessionDto Partial session payload validated by NestJS.
   * @returns A promise that resolves to the saved session entity.
   */
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAssessmentSessionDto: UpdateAssessmentSessionDto,
  ) {
    return this.assessmentSessionService.update(id, updateAssessmentSessionDto);
  }

  /**
   * Deletes a candidate session by UUID.
   *
   * @param id The session UUID to delete.
   * @returns A promise that resolves to a deletion confirmation payload.
   */
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.assessmentSessionService.remove(id);
  }
}
