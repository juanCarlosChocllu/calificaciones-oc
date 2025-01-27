import { Test, TestingModule } from '@nestjs/testing';
import { LogCorreoService } from './log-correo.service';

describe('LogCorreoService', () => {
  let service: LogCorreoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogCorreoService],
    }).compile();

    service = module.get<LogCorreoService>(LogCorreoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
