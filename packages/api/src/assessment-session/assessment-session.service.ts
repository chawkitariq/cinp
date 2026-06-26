import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAssessmentSessionDto } from './dto/create-assessment-session.dto';
import { UpdateAssessmentSessionDto } from './dto/update-assessment-session.dto';
import { AssessmentSession } from './entities/assessment-session.entity';

@Injectable()
export class AssessmentSessionService {
  constructor(
    @InjectRepository(AssessmentSession)
    private readonly assessmentSessionRepository: Repository<AssessmentSession>,
  ) {}

  /**
   * Creates a candidate session and converts incoming ISO date strings to dates.
   *
   * @param createAssessmentSessionDto Validated session creation payload.
   * @returns A promise that resolves to the saved assessment session.
   */
  create(createAssessmentSessionDto: CreateAssessmentSessionDto) {
    const assessmentSession = this.assessmentSessionRepository.create(
      this.toEntity(createAssessmentSessionDto),
    );
    return this.assessmentSessionRepository.save(assessmentSession);
  }

  /**
   * Lists all assessment sessions without relation expansion.
   *
   * @returns A promise that resolves to every persisted assessment session entity.
   */
  findAll() {
    return this.assessmentSessionRepository.find();
  }

  /**
   * Finds a session by UUID or throws when the invitation does not exist.
   *
   * @param id The session UUID to load.
   * @returns A promise that resolves to the matching assessment session entity.
   * @throws {NotFoundException} When the session does not exist.
   */
  async findOne(id: string) {
    const assessmentSession = await this.assessmentSessionRepository.findOne({
      where: { id },
    });

    if (!assessmentSession) {
      throw new NotFoundException(`Assessment session ${id} not found`);
    }

    return assessmentSession;
  }

  /**
   * Applies partial session changes and preserves TypeORM not-found semantics.
   *
   * @param id The UUID of the session to update.
   * @param updateAssessmentSessionDto Partial session payload validated by NestJS.
   * @returns A promise that resolves to the saved assessment session.
   * @throws {NotFoundException} When the session does not exist.
   */
  async update(
    id: string,
    updateAssessmentSessionDto: UpdateAssessmentSessionDto,
  ) {
    const assessmentSession = await this.assessmentSessionRepository.preload({
      id,
      ...this.toEntity(updateAssessmentSessionDto),
    });

    if (!assessmentSession) {
      throw new NotFoundException(`Assessment session ${id} not found`);
    }

    return this.assessmentSessionRepository.save(assessmentSession);
  }

  /**
   * Deletes a session by UUID and reports whether a row was removed.
   *
   * @param id The UUID of the session to delete.
   * @returns A promise that resolves to a deletion confirmation payload.
   * @throws {NotFoundException} When the session does not exist.
   */
  async remove(id: string) {
    const result = await this.assessmentSessionRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`Assessment session ${id} not found`);
    }

    return { deleted: true };
  }

  /**
   * Maps DTO date strings to entity date values for persistence.
   *
   * @param dto Session DTO containing optional ISO date strings.
   * @returns A partial entity payload with native `Date` values.
   */
  private toEntity(
    dto: CreateAssessmentSessionDto | UpdateAssessmentSessionDto,
  ): Partial<AssessmentSession> {
    return {
      ...dto,
      startedAt: dto.startedAt ? new Date(dto.startedAt) : undefined,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      finishedAt: dto.finishedAt ? new Date(dto.finishedAt) : undefined,
    };
  }
}
