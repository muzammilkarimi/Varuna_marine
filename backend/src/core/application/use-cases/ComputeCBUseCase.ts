import type { IRouteRepository } from '../../ports/outbound/IRouteRepository';
import type { IComplianceRepository } from '../../ports/outbound/IComplianceRepository';

export class ComputeCBUseCase {
  constructor(
    private routeRepo: IRouteRepository,
    private complianceRepo: IComplianceRepository
  ) {}

  async execute(shipId: string, year: number) {
    const route = await this.routeRepo.findByRouteId(shipId);
    if (!route) {
      throw new Error('Route/Ship not found');
    }

    // Formula: (Target - Actual) * Energy
    // Target = 89.3368
    // Energy = fuelConsumption * 41000
    const target = 89.3368;
    const energy = route.fuelConsumption * 41000;
    const cb = Math.round((target - route.ghgIntensity) * energy);

    const compliance = await this.complianceRepo.save({
      shipId,
      year,
      cbGco2eq: cb
    });

    return compliance;
  }
}
