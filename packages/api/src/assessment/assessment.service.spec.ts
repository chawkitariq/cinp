import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AssessmentProblem } from './entities/assessment-problem.entity';
import { AssessmentService } from './assessment.service';
import { Assessment } from './entities/assessment.entity';
import { Problem } from 'src/problem/entities/problem.entity';
import { AssessmentStatus } from './enums/assessment-status.enum';

describe('AssessmentService', () => {
  let service: AssessmentService;

  const assessmentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    preload: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(),
    manager: {
      transaction: jest.fn(),
    },
  };

  const assessmentProblemRepository = {
    create: jest.fn((value: Partial<AssessmentProblem>) => value),
    delete: jest.fn(),
    save: jest.fn(),
  };

  const problemRepository = {
    find: jest.fn(),
  };

  const queryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  };

  const manager = {
    getRepository: jest.fn((entity: unknown) => {
      if (entity === Assessment) {
        return assessmentRepository;
      }

      if (entity === AssessmentProblem) {
        return assessmentProblemRepository;
      }

      if (entity === Problem) {
        return problemRepository;
      }

      throw new Error(`Unexpected repository: ${String(entity)}`);
    }),
  };
  type TransactionManager = typeof manager;

  beforeEach(async () => {
    jest.clearAllMocks();

    assessmentRepository.manager.transaction.mockImplementation(
      (cb: (manager: TransactionManager) => Promise<unknown>) => cb(manager),
    );
    assessmentRepository.createQueryBuilder.mockReturnValue(queryBuilder);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssessmentService,
        {
          provide: getRepositoryToken(Assessment),
          useValue: assessmentRepository,
        },
      ],
    }).compile();

    service = module.get<AssessmentService>(AssessmentService);
  });

  it('creates an assessment with ordered problem links', async () => {
    assessmentRepository.create.mockReturnValue({
      title: 'Frontend challenge',
      description: 'Assess React fundamentals.',
      durationMin: 45,
      status: AssessmentStatus.DRAFT,
    });
    assessmentRepository.save.mockResolvedValue({
      id: 'assessment-1',
    });
    queryBuilder.getOne.mockResolvedValue({
      id: 'assessment-1',
      title: 'Frontend challenge',
      description: 'Assess React fundamentals.',
      durationMin: 45,
      status: AssessmentStatus.DRAFT,
      problems: [
        {
          assessmentId: 'assessment-1',
          problemId: 'problem-1',
          order: 0,
        },
        {
          assessmentId: 'assessment-1',
          problemId: 'problem-2',
          order: 1,
        },
      ],
    });
    problemRepository.find.mockResolvedValue([
      { id: 'problem-1' },
      { id: 'problem-2' },
    ]);

    const result = await service.create({
      title: 'Frontend challenge',
      description: 'Assess React fundamentals.',
      durationMin: 45,
      status: AssessmentStatus.DRAFT,
      problemIds: ['problem-1', 'problem-2'],
    });

    expect(assessmentRepository.create).toHaveBeenCalledWith({
      title: 'Frontend challenge',
      description: 'Assess React fundamentals.',
      durationMin: 45,
      status: AssessmentStatus.DRAFT,
    });
    const [problemQuery] = problemRepository.find.mock.calls[0] as [
      { select: { id: true }; where: unknown },
    ];
    expect(problemQuery.select).toEqual({ id: true });
    expect(problemQuery.where).toBeDefined();
    expect(assessmentProblemRepository.delete).toHaveBeenCalledWith({
      assessmentId: 'assessment-1',
    });
    expect(assessmentProblemRepository.save).toHaveBeenCalledWith([
      {
        assessmentId: 'assessment-1',
        problemId: 'problem-1',
        order: 0,
      },
      {
        assessmentId: 'assessment-1',
        problemId: 'problem-2',
        order: 1,
      },
    ]);
    expect(result).toMatchObject({
      id: 'assessment-1',
      problems: [
        {
          problemId: 'problem-1',
          order: 0,
        },
        {
          problemId: 'problem-2',
          order: 1,
        },
      ],
    });
  });

  it('replaces problem links when updating an assessment', async () => {
    assessmentRepository.preload.mockResolvedValue({
      id: 'assessment-1',
      title: 'Updated assessment',
      durationMin: 60,
    });
    assessmentRepository.save.mockResolvedValue({
      id: 'assessment-1',
    });
    queryBuilder.getOne.mockResolvedValue({
      id: 'assessment-1',
      title: 'Updated assessment',
      durationMin: 60,
      problems: [
        {
          assessmentId: 'assessment-1',
          problemId: 'problem-3',
          order: 0,
        },
      ],
    });
    problemRepository.find.mockResolvedValue([{ id: 'problem-3' }]);

    const result = await service.update('assessment-1', {
      title: 'Updated assessment',
      durationMin: 60,
      problemIds: ['problem-3'],
    });

    expect(assessmentRepository.preload).toHaveBeenCalledWith({
      id: 'assessment-1',
      title: 'Updated assessment',
      durationMin: 60,
    });
    expect(assessmentProblemRepository.delete).toHaveBeenCalledWith({
      assessmentId: 'assessment-1',
    });
    expect(assessmentProblemRepository.save).toHaveBeenCalledWith([
      {
        assessmentId: 'assessment-1',
        problemId: 'problem-3',
        order: 0,
      },
    ]);
    expect(result).toMatchObject({
      id: 'assessment-1',
      problems: [
        {
          problemId: 'problem-3',
          order: 0,
        },
      ],
    });
  });
});
