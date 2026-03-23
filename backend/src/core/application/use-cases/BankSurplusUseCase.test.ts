import { BankSurplusUseCase } from './BankSurplusUseCase';
import type { IComplianceRepository, IBankRepository } from '../../ports/outbound/IComplianceRepository';

describe('BankSurplusUseCase', () => {
  it('should successfully bank surplus if adequate credits exist', async () => {
    const mockComplianceRepo: IComplianceRepository = {
      save: jest.fn(),
      findByShipAndYear: jest.fn().mockResolvedValue({ id: 1, shipId: 'R002', year: 2024, cbGco2eq: 100000 }),
      findAdjustedCb: jest.fn()
    };

    const mockBankRepo: IBankRepository = {
      bankSurplus: jest.fn().mockResolvedValue(null),
      getTotalBanked: jest.fn(),
      applyBanked: jest.fn(),
      findBankEntries: jest.fn()
    };

    const useCase = new BankSurplusUseCase(mockComplianceRepo, mockBankRepo);
    await useCase.execute('R002', 2024, 50000);

    expect(mockBankRepo.bankSurplus).toHaveBeenCalledWith('R002', 2024, 50000);
  });

  it('should throw an error if deficit or inadequate compliance balance available', async () => {
    const mockComplianceRepo: IComplianceRepository = {
      save: jest.fn(),
      findByShipAndYear: jest.fn().mockResolvedValue({ id: 1, shipId: 'R001', year: 2024, cbGco2eq: -40000 }),
      findAdjustedCb: jest.fn()
    };
    const mockBankRepo = {} as IBankRepository;

    const useCase = new BankSurplusUseCase(mockComplianceRepo, mockBankRepo);
    await expect(useCase.execute('R001', 2024, 10000)).rejects.toThrow('No positive surplus to bank');
  });
});
