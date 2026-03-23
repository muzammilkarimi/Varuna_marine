import type { ShipCompliance } from '../../domain/compliance.entity';

export interface IComplianceRepository {
  save(compliance: ShipCompliance): Promise<ShipCompliance>;
  findByShipAndYear(shipId: string, year: number): Promise<ShipCompliance | null>;
  findAdjustedCb(shipId: string, year: number): Promise<number>;
}

export interface IBankRepository {
  bankSurplus(shipId: string, year: number, amountGco2eq: number): Promise<void>;
  getTotalBanked(shipId: string, year: number): Promise<number>;
  applyBanked(shipId: string, year: number, amount: number): Promise<void>;
}
