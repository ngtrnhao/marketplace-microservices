// services/auth-service/test/unit/auth/suspicious-activity.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { SuspiciousActivityService } from '../../../src/auth/services/suspicious-activity.service';
import { AuditLog } from '../../../src/auth/schemas/audit-log.schema';
import { IpBlockingService } from '../../../src/auth/services/ip-blocking.service';
import { Model } from 'mongoose';

describe('SuspiciousActivityService', () => {
  let service: SuspiciousActivityService;
  let mockAuditLogModel: Partial<Model<AuditLog>>;
  let mockIpBlockingService: any;

  beforeEach(async () => {
    // Tạo mock cho AuditLog Model
    mockAuditLogModel = {
      countDocuments: jest.fn().mockImplementation(() => Promise.resolve(0)),
    };

    // Tạo mock cho IpBlockingService
    mockIpBlockingService = {
      blockIp: jest.fn().mockImplementation(() => Promise.resolve()),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuspiciousActivityService,
        {
          provide: getModelToken(AuditLog.name),
          useValue: mockAuditLogModel,
        },
        {
          provide: IpBlockingService,
          useValue: mockIpBlockingService,
        },
      ],
    }).compile();

    service = module.get<SuspiciousActivityService>(SuspiciousActivityService);
  });

  describe('detectSuspiciousLogin', () => {
    const testData = {
      userId: 'test-user-id',
      ip: '192.168.1.1',
      userAgent: 'test-agent',
    };

    it('should block IP after 5 failed attempts', async () => {
      // Mock countDocuments để trả về 5
      (mockAuditLogModel.countDocuments as jest.Mock).mockResolvedValue(5);

      const result = await service.detectSuspiciousLogin(testData);

      expect(result).toBe(true);
      expect(mockIpBlockingService.blockIp).toHaveBeenCalledWith(
        testData.ip,
        'Quá nhiều lần đăng nhập thất bại',
      );
    });

    it('should not block IP with less than 5 failed attempts', async () => {
      // Mock countDocuments để trả về 3
      (mockAuditLogModel.countDocuments as jest.Mock).mockResolvedValue(3);

      const result = await service.detectSuspiciousLogin(testData);

      expect(result).toBe(false);
      expect(mockIpBlockingService.blockIp).not.toHaveBeenCalled();
    });

    it('should count only recent failed attempts', async () => {
      await service.detectSuspiciousLogin(testData);

      expect(mockAuditLogModel.countDocuments).toHaveBeenCalledWith({
        userId: testData.userId,
        action: 'login_failed',
        ip: testData.ip,
        timestamp: { $gte: expect.any(Date) },
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
