import { Module } from '@nestjs/common';
import { ProblemService } from './problem.service';
import { ProblemController } from './problem.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Problem } from './entities/problem.entity';
import { TestCase } from './entities/test-case.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Problem, TestCase])],
  controllers: [ProblemController],
  providers: [ProblemService],
})
export class ProblemModule {}
