import type { PrismaClient } from '@prisma/client';
import type { IRouteRepository } from '../../../ports/outbound/IRouteRepository';
import type { Route } from '../../../domain/route.entity';

export class PrismaRouteRepository implements IRouteRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Route[]> {
    return this.prisma.route.findMany();
  }

  async findById(id: number): Promise<Route | null> {
    return this.prisma.route.findUnique({ where: { id } });
  }

  async findByRouteId(routeId: string): Promise<Route | null> {
    return this.prisma.route.findUnique({ where: { routeId } });
  }

  async setBaseline(routeId: string): Promise<Route> {
    await this.prisma.route.updateMany({ data: { isBaseline: false } });
    return this.prisma.route.update({
      where: { routeId },
      data: { isBaseline: true }
    });
  }

  async getBaseline(): Promise<Route | null> {
    return this.prisma.route.findFirst({ where: { isBaseline: true } });
  }
}
