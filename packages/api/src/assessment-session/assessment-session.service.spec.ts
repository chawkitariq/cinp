import { Test, TestingModule } from '@nestjs/testing';
import { AssessmentSessionService } from './assessment-session.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AssessmentSession } from './entities/assessment-session.entity';

describe('AssessmentSessionService', () => {
  let service: AssessmentSessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssessmentSessionService,
        {
          provide: getRepositoryToken(AssessmentSession),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AssessmentSessionService>(AssessmentSessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
