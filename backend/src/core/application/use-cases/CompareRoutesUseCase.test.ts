import { CompareRoutesUseCase } from './CompareRoutesUseCase';
import type { IRouteRepository } from '../../ports/outbound/IRouteRepository';
import type { Route } from '../../domain/route.entity';

describe('CompareRoutesUseCase', () => {
  it('should list baseline and comparison differences correctly', async () => {
    const mockBaseline: Route = {
      routeId: 'R001', vesselType: 'Container', fuelType: 'HFO', year: 2024,
      ghgIntensity: 91.0, fuelConsumption: 4500, distance: 12000, totalEmissions: 4300, isBaseline: true
    };
    const mockComparison: Route = {
      routeId: 'R002', vesselType: 'BulkCarrier', fuelType: 'MDO', year: 2024,
      ghgIntensity: 88.0, fuelConsumption: 4800, distance: 11500, totalEmissions: 4200, isBaseline: false
    };

    const mockRepo: IRouteRepository = {
      findAll: jest.fn().mockResolvedValue([mockBaseline, mockComparison]),
      findById: jest.fn(),
      findByRouteId: jest.fn(),
      setBaseline: jest.fn(),
      getBaseline: jest.fn().mockResolvedValue(mockBaseline)
    };

    const useCase = new CompareRoutesUseCase(mockRepo);
    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    const comparisonResult = result.find(r => r.routeId === 'R002');
    expect(comparisonResult).toBeDefined();
    // Formula check: ((88 / 91) - 1) * 100 = -3.2967
    expect(comparisonResult?.percentDiff).toBeCloseTo(-3.2967, 4);
    expect(comparisonResult?.compliant).toBe(true); // 88.0 < 89.3368 Target
  });
});
