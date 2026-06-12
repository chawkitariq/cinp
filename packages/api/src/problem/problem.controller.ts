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
import { ProblemService } from './problem.service';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';

@Controller('problem')
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

  /**
   * Creates a reusable coding problem.
   */
  @Post()
  create(@Body() createProblemDto: CreateProblemDto) {
    return this.problemService.create(createProblemDto);
  }

  /**
   * Returns every problem record.
   */
  @Get()
  findAll() {
    return this.problemService.findAll();
  }

  /**
   * Returns one problem by UUID.
   */
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.problemService.findOne(id);
  }

  /**
   * Updates a problem by UUID.
   */
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProblemDto: UpdateProblemDto,
  ) {
    return this.problemService.update(id, updateProblemDto);
  }

  /**
   * Deletes a problem by UUID.
   */
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.problemService.remove(id);
  }
}
