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
   */
  @Post()
  create(@Body() createAssessmentSessionDto: CreateAssessmentSessionDto) {
    return this.assessmentSessionService.create(createAssessmentSessionDto);
  }

  /**
   * Returns every assessment session record.
   */
  @Get()
  findAll() {
    return this.assessmentSessionService.findAll();
  }

  /**
   * Returns one candidate session by UUID.
   */
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.assessmentSessionService.findOne(id);
  }

  /**
   * Updates candidate session metadata by UUID.
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
   */
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.assessmentSessionService.remove(id);
  }
}
