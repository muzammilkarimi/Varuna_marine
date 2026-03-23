import { ApplyBankedUseCase } from './ApplyBankedUseCase';
import type { IComplianceRepository, IBankRepository } from '../../ports/outbound/IComplianceRepository';

describe('ApplyBankedUseCase', () => {
  it('should successfully apply banked surplus into a deficit ship', async () => {
    const mockComplianceRepo: IComplianceRepository = {
      save: jest.fn(),
      findByShipAndYear: jest.fn().mockResolvedValue({ id: 1, shipId: 'R001', year: 2024, cbGco2eq: -50000 }),
      findAdjustedCb: jest.fn()
    };

    const mockBankRepo: IBankRepository = {
      bankSurplus: jest.fn(),
      getTotalBanked: jest.fn().mockResolvedValue(80000),
      applyBanked: jest.fn().mockResolvedValue(null),
      findBankEntries: jest.fn()
    };

    const useCase = new ApplyBankedUseCase(mockComplianceRepo, mockBankRepo);
    await useCase.execute('R001', 2024, 30000);

    expect(mockBankRepo.applyBanked).toHaveBeenCalledWith('R001', 2024, 30000);
  });

  it('should throw if requested amount exceeds available banked threshold', async () => {
    const mockComplianceRepo = {} as IComplianceRepository;
    const mockBankRepo: IBankRepository = {
      bankSurplus: jest.fn(),
      getTotalBanked: jest.fn().mockResolvedValue(10000), // Only 10k available
      applyBanked: jest.fn(),
      findBankEntries: jest.fn()
    };

    const useCase = new ApplyBankedUseCase(mockComplianceRepo, mockBankRepo);
    await expect(useCase.execute('R001', 2024, 30000)).rejects.toThrow('Not enough banked surplus available');
  });
});
