import type { IBankRepository } from '../../ports/outbound/IComplianceRepository';
import type { IComplianceRepository } from '../../ports/outbound/IComplianceRepository';

export class ApplyBankedUseCase {
  constructor(
    private complianceRepo: IComplianceRepository,
    private bankRepo: IBankRepository
  ) {}

  async execute(shipId: string, year: number, amountToApply: number) {
    const totalBanked = await this.bankRepo.getTotalBanked(shipId, year - 1);
    
    if (amountToApply > totalBanked) {
      throw new Error('Not enough banked surplus available');
    }

    await this.bankRepo.applyBanked(shipId, year, amountToApply);
  }
}
