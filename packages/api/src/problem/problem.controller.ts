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

@Controller('problems')
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

  /**
   * Creates a reusable coding problem.
   *
   * @param createProblemDto Problem creation payload validated by NestJS.
   * @returns A promise that resolves to the saved problem entity.
   */
  @Post()
  create(@Body() createProblemDto: CreateProblemDto) {
    return this.problemService.create(createProblemDto);
  }

  /**
   * Returns every problem record.
   *
   * @returns A promise that resolves to every persisted problem entity.
   */
  @Get()
  findAll() {
    return this.problemService.findAll();
  }

  /**
   * Returns one problem by UUID.
   *
   * @param id The problem UUID to load.
   * @returns A promise that resolves to the matching problem entity.
   */
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.problemService.findOne(id);
  }

  /**
   * Updates a problem by UUID.
   *
   * @param id The problem UUID to update.
   * @param updateProblemDto Partial problem payload validated by NestJS.
   * @returns A promise that resolves to the saved problem entity.
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
   *
   * @param id The problem UUID to delete.
   * @returns A promise that resolves to a deletion confirmation payload.
   */
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.problemService.remove(id);
  }
}
