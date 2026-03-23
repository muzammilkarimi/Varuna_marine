import { CreatePoolUseCase } from './CreatePoolUseCase';
import type { IPoolRepository } from '../../ports/outbound/IPoolRepository';
import type { IComplianceRepository } from '../../ports/outbound/IComplianceRepository';

describe('CreatePoolUseCase', () => {
  it('should correctly balance surpluses and deficits iterative loop', async () => {
    const mockPoolRepo: IPoolRepository = {
      createPool: jest.fn().mockImplementation((_year, members) => Promise.resolve({ id: 1, year: 2024, members })),
      findPoolsByYear: jest.fn()
    };

    const mockComplianceRepo: IComplianceRepository = {
      save: jest.fn(),
      findByShipAndYear: jest.fn(),
      findAdjustedCb: jest.fn()
        .mockResolvedValueOnce(50000)  // Ship A Surplus
        .mockResolvedValueOnce(-30000) // Ship B Deficit
    };

    const useCase = new CreatePoolUseCase(mockPoolRepo, mockComplianceRepo);
    const pool = await useCase.execute(2024, ['ShipA', 'ShipB']);

    expect(pool.members).toHaveLength(2);
    const memberA = pool.members.find((m: any) => m.shipId === 'ShipA');
    const memberB = pool.members.find((m: any) => m.shipId === 'ShipB');

    expect(memberB.cbAfter).toBe(0); // Offset fully settled
    expect(memberA.cbAfter).toBe(20000); // reduced by 30000
    expect(mockPoolRepo.createPool).toHaveBeenCalled();
  });

  it('should throw an error if the aggregated total sum yields negative', async () => {
    const mockPoolRepo: IPoolRepository = { createPool: jest.fn(), findPoolsByYear: jest.fn() };
    const mockComplianceRepo: IComplianceRepository = {
      save: jest.fn(),
      findByShipAndYear: jest.fn(),
      findAdjustedCb: jest.fn()
        .mockResolvedValueOnce(-50000)
        .mockResolvedValueOnce(20000)
    };

    const useCase = new CreatePoolUseCase(mockPoolRepo, mockComplianceRepo);
    await expect(useCase.execute(2024, ['ShipC', 'ShipD'])).rejects.toThrow('Pool total adjusted CB must be >= 0');
  });
});
