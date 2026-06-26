import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProblemDto } from './dto/create-problem.dto';
import { Problem } from './entities/problem.entity';
import { TestCase } from './entities/test-case.entity';
import { ProblemService } from './problem.service';

describe('ProblemService', () => {
  let service: ProblemService;
  let problemRepository: jest.Mocked<
    Pick<
      Repository<Problem>,
      'create' | 'save' | 'createQueryBuilder' | 'preload' | 'delete'
    >
  >;

  const queryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  };

  beforeEach(async () => {
    problemRepository = {
      create: jest.fn((problem: Partial<Problem>) =>
        Object.assign(new Problem(), problem),
      ),
      save: jest.fn((problem: Problem) => Promise.resolve(problem)),
      createQueryBuilder: jest.fn(() => queryBuilder as never),
      preload: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProblemService,
        {
          provide: getRepositoryToken(Problem),
          useValue: problemRepository,
        },
      ],
    }).compile();

    service = module.get<ProblemService>(ProblemService);
    jest.clearAllMocks();
  });

  it('creates a problem with nested test cases in one save call', async () => {
    const createProblemDto: CreateProblemDto = {
      title: 'Two Sum',
      slug: 'two-sum',
      description: 'Find two numbers',
      testCases: [
        {
          input: { nums: [2, 7, 11, 15], target: 9 },
          expectedOutput: [0, 1],
          isPublic: true,
        },
      ],
    };

    const savedProblem = Object.assign(new Problem(), {
      id: 'problem-1',
      title: createProblemDto.title,
      slug: createProblemDto.slug,
      description: createProblemDto.description,
      testCases: [
        Object.assign(new TestCase(), {
          id: 'test-case-1',
          problemId: 'problem-1',
          input: { nums: [2, 7, 11, 15], target: 9 },
          expectedOutput: [0, 1],
          isPublic: true,
        }),
      ],
    });

    problemRepository.save.mockResolvedValue(savedProblem);

    await expect(service.create(createProblemDto)).resolves.toBe(savedProblem);

    expect(problemRepository.create).toHaveBeenCalledWith(createProblemDto);
    expect(problemRepository.save).toHaveBeenCalledWith(expect.any(Problem));
  });

  it('throws when loading a missing problem', async () => {
    queryBuilder.getOne.mockResolvedValue(null);

    await expect(service.findOne('missing-problem')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
