import { ComputeCBUseCase } from './ComputeCBUseCase';
import type { IRouteRepository } from '../../ports/outbound/IRouteRepository';
import type { IComplianceRepository } from '../../ports/outbound/IComplianceRepository';
import type { Route } from '../../domain/route.entity';

describe('ComputeCBUseCase', () => {
  it('should compute the correct positive Compliance Balance surplus', async () => {
    // Target = 89.3368
    // Route GHG = 88.0
    // Fuel Consumption = 4800
    // Energy = 4800 * 41000 = 196800000
    // Expected CB = (89.3368 - 88.0) * 196800000 = 263082240
    
    const mockRoute: Route = {
      routeId: 'R002',
      vesselType: 'BulkCarrier',
      fuelType: 'LNG',
      year: 2024,
      ghgIntensity: 88.0,
      fuelConsumption: 4800,
      distance: 11500,
      totalEmissions: 4200,
      isBaseline: false
    };

    const mockRouteRepo: IRouteRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByRouteId: jest.fn().mockResolvedValue(mockRoute),
      setBaseline: jest.fn(),
      getBaseline: jest.fn()
    };

    const mockComplianceRepo: IComplianceRepository = {
      save: jest.fn().mockImplementation((val) => Promise.resolve(val)),
      findByShipAndYear: jest.fn(),
      findAdjustedCb: jest.fn()
    };

    const useCase = new ComputeCBUseCase(mockRouteRepo, mockComplianceRepo);
    const result = await useCase.execute('R002', 2024);

    expect(mockRouteRepo.findByRouteId).toHaveBeenCalledWith('R002');
    expect(result.cbGco2eq).toBe(263082240);
  });

  it('should throw an error if the route tracking is not found', async () => {
    const mockRouteRepo: IRouteRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByRouteId: jest.fn().mockResolvedValue(null),
      setBaseline: jest.fn(),
      getBaseline: jest.fn()
    };

    const mockComplianceRepo = {} as IComplianceRepository;

    const useCase = new ComputeCBUseCase(mockRouteRepo, mockComplianceRepo);
    
    await expect(useCase.execute('INVALID', 2024)).rejects.toThrow('Route/Ship not found');
  });
});
