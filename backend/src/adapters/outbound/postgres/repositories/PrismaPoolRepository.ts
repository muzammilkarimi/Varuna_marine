import type { PrismaClient } from '@prisma/client';
import type { IPoolRepository } from '../../../ports/outbound/IPoolRepository';
import type { Pool, PoolMember } from '../../../domain/pool.entity';

export class PrismaPoolRepository implements IPoolRepository {
  constructor(private prisma: PrismaClient) {}

  async createPool(year: number, members: PoolMember[]): Promise<Pool> {
    const pool = await this.prisma.pool.create({
      data: {
        year,
        members: {
          create: members.map(m => ({
            shipId: m.shipId,
            cbBefore: m.cbBefore,
            cbAfter: m.cbAfter,
          })),
        },
      },
      include: { members: true },
    });

    return {
      id: pool.id,
      year: pool.year,
      createdAt: pool.createdAt,
      members: pool.members.map(m => ({
        id: m.id,
        poolId: m.poolId,
        shipId: m.shipId,
        cbBefore: m.cbBefore,
        cbAfter: m.cbAfter,
      })),
    };
  }

  async findPoolsByYear(year: number): Promise<Pool[]> {
    const pools = await this.prisma.pool.findMany({
      where: { year },
      include: { members: true },
    });

    return pools.map(pool => ({
      id: pool.id,
      year: pool.year,
      createdAt: pool.createdAt,
      members: pool.members.map(m => ({
        id: m.id,
        poolId: m.poolId,
        shipId: m.shipId,
        cbBefore: m.cbBefore,
        cbAfter: m.cbAfter,
      })),
    }));
  }
}
