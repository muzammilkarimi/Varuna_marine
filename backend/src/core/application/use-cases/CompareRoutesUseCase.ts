import type { IRouteRepository } from '../../ports/outbound/IRouteRepository';

export class CompareRoutesUseCase {
  constructor(private routeRepo: IRouteRepository) {}

  async execute() {
    const routes = await this.routeRepo.findAll();
    const baseline = routes.find(r => r.isBaseline);
    if (!baseline) {
      throw new Error('No baseline route set');
    }

    const targetIntensity = 89.3368;

    return routes.map(route => {
      const percentDiff = ((route.ghgIntensity / baseline.ghgIntensity) - 1) * 100;
      const compliant = route.ghgIntensity <= targetIntensity;
      
      return {
        ...route,
        percentDiff,
        compliant,
      };
    });
  }
}
