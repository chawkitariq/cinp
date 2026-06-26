import { Test, TestingModule } from '@nestjs/testing';
import { ProblemController } from './problem.controller';
import { ProblemService } from './problem.service';

describe('ProblemController', () => {
  let controller: ProblemController;
  let problemService: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    problemService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProblemController],
      providers: [
        {
          provide: ProblemService,
          useValue: problemService,
        },
      ],
    }).compile();

    controller = module.get<ProblemController>(ProblemController);
  });

  it('delegates problem creation to the service', async () => {
    problemService.create.mockResolvedValue({
      id: 'problem-1',
      testCases: [{ id: 'test-case-1' }],
    });

    await expect(
      controller.create({
        title: 'Two Sum',
        slug: 'two-sum',
        description: 'Find two numbers',
        testCases: [
          {
            input: { nums: [2, 7, 11, 15], target: 9 },
            expectedOutput: [0, 1],
          },
        ],
      }),
    ).resolves.toEqual({
      id: 'problem-1',
      testCases: [{ id: 'test-case-1' }],
    });

    expect(problemService.create).toHaveBeenCalledWith({
      title: 'Two Sum',
      slug: 'two-sum',
      description: 'Find two numbers',
      testCases: [
        {
          input: { nums: [2, 7, 11, 15], target: 9 },
          expectedOutput: [0, 1],
        },
      ],
    });
  });

  it('delegates problem loading to the service', async () => {
    problemService.findOne.mockResolvedValue({ id: 'problem-1' });

    await expect(controller.findOne('problem-1')).resolves.toEqual({
      id: 'problem-1',
    });

    expect(problemService.findOne).toHaveBeenCalledWith('problem-1');
  });
});
