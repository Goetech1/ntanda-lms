import { Test, TestingModule } from '@nestjs/testing';
import { InstitutionController } from './controllers/institution.controller';
import { InstitutionService } from './institution.service';

describe('InstitutionController', () => {
  let controller: InstitutionController;

  const mockInstitutionService = {
    getCurrentInstitution: jest.fn(),
    updateCurrentInstitution: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstitutionController],
      providers: [
        {
          provide: InstitutionService,
          useValue: mockInstitutionService,
        },
      ],
    }).compile();

    controller = module.get<InstitutionController>(InstitutionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
