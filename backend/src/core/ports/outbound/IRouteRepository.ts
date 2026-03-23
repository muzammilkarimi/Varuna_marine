import type { Route } from '../../domain/route.entity';

export interface IRouteRepository {
  findAll(): Promise<Route[]>;
  findById(id: number): Promise<Route | null>;
  findByRouteId(routeId: string): Promise<Route | null>;
  setBaseline(routeId: string): Promise<Route>;
  getBaseline(): Promise<Route | null>;
}
