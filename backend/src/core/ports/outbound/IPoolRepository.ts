import type { Pool, PoolMember } from '../../domain/pool.entity';

export interface IPoolRepository {
  createPool(year: number, members: PoolMember[]): Promise<Pool>;
  findPoolsByYear(year: number): Promise<Pool[]>;
}
