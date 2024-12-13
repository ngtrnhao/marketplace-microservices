import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { IpBlockingService } from '../../../src/auth/services/ip-blocking.service';
import { BlockedIP } from '../../../src/auth/schemas/blocked-ip.schema';

describe('IpBlockingService', () => {
  let service: IpBlockingService;
  let mockBlockedIpModel: any;

  beforeEach(async () => {
    mockBlockedIpModel = {
      create: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IpBlockingService,
        {
          provide: getModelToken(BlockedIP.name),
          useValue: mockBlockedIpModel,
        },
      ],
    }).compile();

    service = module.get<IpBlockingService>(IpBlockingService);
  });

  describe('blockIp', () => {
    it('should create a blocked IP record', async () => {
      const testIp = '192.168.1.1';
      const testReason = 'Suspicious activity';

      await service.blockIp(testIp, testReason);

      expect(mockBlockedIpModel.create).toHaveBeenCalledWith({
        ip: testIp,
        reason: testReason,
        blockedUntil: expect.any(Date),
      });
    });
  });

  describe('isIpBlocked', () => {
    it('should return true for blocked IP', async () => {
      const testIp = '192.168.1.1';
      mockBlockedIpModel.findOne.mockResolvedValue({
        ip: testIp,
        blockedUntil: new Date(Date.now() + 3600000), // 1 giờ sau
      });

      const result = await service.isIpBlocked(testIp);
      expect(result).toBe(true);
    });

    it('should return false for unblocked IP', async () => {
      mockBlockedIpModel.findOne.mockResolvedValue(null);

      const result = await service.isIpBlocked('192.168.1.1');
      expect(result).toBe(false);
    });

    it('should return false for expired block', async () => {
      // Mock findOne để trả về null khi tìm IP với điều kiện blockedUntil > now
      mockBlockedIpModel.findOne.mockResolvedValue(null);

      const result = await service.isIpBlocked('192.168.1.1');
      expect(result).toBe(false);
    });
  });
});
