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

@Controller('assessment-session')
export class AssessmentSessionController {
  constructor(
    private readonly assessmentSessionService: AssessmentSessionService,
  ) {}

  @Post()
  create(@Body() createAssessmentSessionDto: CreateAssessmentSessionDto) {
    return this.assessmentSessionService.create(createAssessmentSessionDto);
  }

  @Get()
  findAll() {
    return this.assessmentSessionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.assessmentSessionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAssessmentSessionDto: UpdateAssessmentSessionDto,
  ) {
    return this.assessmentSessionService.update(id, updateAssessmentSessionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.assessmentSessionService.remove(id);
  }
}
