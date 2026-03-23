import type { IBankRepository } from '../../ports/outbound/IComplianceRepository';
import type { IComplianceRepository } from '../../ports/outbound/IComplianceRepository';

export class BankSurplusUseCase {
  constructor(
    private complianceRepo: IComplianceRepository,
    private bankRepo: IBankRepository
  ) {}

  async execute(shipId: string, year: number, amountToBank: number) {
    const compliance = await this.complianceRepo.findByShipAndYear(shipId, year);
    if (!compliance) throw new Error('Compliance record not found');

    if (compliance.cbGco2eq <= 0) {
      throw new Error('No positive surplus to bank');
    }

    const availableToBank = compliance.cbGco2eq;
    if (amountToBank > availableToBank) {
      throw new Error('Cannot bank more than the surplus amount');
    }

    await this.bankRepo.bankSurplus(shipId, year, amountToBank);
  }
}
