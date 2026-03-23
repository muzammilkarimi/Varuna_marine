import type { PrismaClient } from '@prisma/client';
import type { IComplianceRepository, IBankRepository } from '../../../../core/ports/outbound/IComplianceRepository';
import type { ShipCompliance } from '../../../../core/domain/compliance.entity';

export class PrismaComplianceRepository implements IComplianceRepository, IBankRepository {
  constructor(private prisma: PrismaClient) {}

  async save(compliance: ShipCompliance): Promise<ShipCompliance> {
    return this.prisma.shipCompliance.upsert({
      where: { shipId_year: { shipId: compliance.shipId, year: compliance.year } },
      update: { cbGco2eq: compliance.cbGco2eq },
      create: {
        shipId: compliance.shipId,
        year: compliance.year,
        cbGco2eq: compliance.cbGco2eq,
      },
    });
  }

  async findByShipAndYear(shipId: string, year: number): Promise<ShipCompliance | null> {
    return this.prisma.shipCompliance.findUnique({
      where: { shipId_year: { shipId, year } },
    });
  }

  async findAdjustedCb(shipId: string, year: number): Promise<number> {
    const compliance = await this.findByShipAndYear(shipId, year);
    if (!compliance) return 0;

    // Adjusted CB = base CB minus any amounts already banked for this year
    const banked = await this.prisma.bankEntry.aggregate({
      where: { shipId, year },
      _sum: { amountGco2eq: true },
    });

    return compliance.cbGco2eq - (banked._sum.amountGco2eq || 0);
  }

  async bankSurplus(shipId: string, year: number, amountGco2eq: number): Promise<void> {
    await this.prisma.bankEntry.create({
      data: { shipId, year, amountGco2eq },
    });
  }

  async getTotalBanked(shipId: string, year: number): Promise<number> {
    const result = await this.prisma.bankEntry.aggregate({
      where: { shipId, year },
      _sum: { amountGco2eq: true },
    });
    return result._sum.amountGco2eq || 0;
  }

  async applyBanked(shipId: string, year: number, amount: number): Promise<void> {
    // Record a negative bank entry for the application year
    await this.prisma.bankEntry.create({
      data: { shipId, year, amountGco2eq: -amount },
    });
  }

  async findBankEntries(shipId: string, year: number): Promise<any[]> {
    return this.prisma.bankEntry.findMany({
      where: { shipId, year }
    });
  }
}
