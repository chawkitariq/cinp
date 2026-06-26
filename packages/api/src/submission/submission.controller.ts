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
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';

@Controller('submissions')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  /**
   * Records a candidate code submission.
   *
   * @param createSubmissionDto Submission payload validated by NestJS.
   * @returns A promise that resolves to the saved submission entity.
   */
  @Post()
  create(@Body() createSubmissionDto: CreateSubmissionDto) {
    return this.submissionService.create(createSubmissionDto);
  }

  /**
   * Returns every submission record.
   *
   * @returns A promise that resolves to every persisted submission entity.
   */
  @Get()
  findAll() {
    return this.submissionService.findAll();
  }

  /**
   * Returns one submission by UUID.
   *
   * @param id The submission UUID to load.
   * @returns A promise that resolves to the matching submission entity.
   */
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.submissionService.findOne(id);
  }

  /**
   * Updates submission execution or scoring data by UUID.
   *
   * @param id The submission UUID to update.
   * @param updateSubmissionDto Partial submission payload validated by NestJS.
   * @returns A promise that resolves to the saved submission entity.
   */
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSubmissionDto: UpdateSubmissionDto,
  ) {
    return this.submissionService.update(id, updateSubmissionDto);
  }

  /**
   * Deletes a submission by UUID.
   *
   * @param id The submission UUID to delete.
   * @returns A promise that resolves to a deletion confirmation payload.
   */
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.submissionService.remove(id);
  }
}
