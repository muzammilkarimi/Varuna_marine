import type { IPoolRepository } from '../../ports/outbound/IPoolRepository';
import type { IComplianceRepository } from '../../ports/outbound/IComplianceRepository';

export class CreatePoolUseCase {
  constructor(
    private poolRepo: IPoolRepository,
    private complianceRepo: IComplianceRepository
  ) {}

  async execute(year: number, shipIds: string[]) {
    const membersData = [];
    let totalAdjustedCb = 0;

    for (const shipId of shipIds) {
      const cbBefore = await this.complianceRepo.findAdjustedCb(shipId, year);
      totalAdjustedCb += cbBefore;
      membersData.push({ shipId, cbBefore, cbAfter: cbBefore });
    }

    if (totalAdjustedCb < 0) {
      throw new Error('Pool total adjusted CB must be >= 0');
    }

    membersData.sort((a, b) => b.cbBefore - a.cbBefore);
    
    for (const member of membersData) {
      if (member.cbAfter < 0) {
        let deficit = Math.abs(member.cbAfter);
        let surplusProvider = membersData.find(m => m.cbAfter > 0);
        
        // Loop continuously to exhaust all available surplus sources if needed
        while (deficit > 0 && surplusProvider) {
          if (surplusProvider.cbAfter >= deficit) {
            surplusProvider.cbAfter -= deficit;
            member.cbAfter = 0;
            deficit = 0;
          } else {
            const available = surplusProvider.cbAfter;
            surplusProvider.cbAfter = 0;
            member.cbAfter += available;
            deficit -= available;
          }
          // Fetch the next available surplus provider if current deficit is still > 0
          if (deficit > 0) {
            surplusProvider = membersData.find(m => m.cbAfter > 0);
          }
        }
      }
    }

    for (const m of membersData) {
      if (m.cbBefore < 0 && m.cbAfter < m.cbBefore) {
        throw new Error(`Ship ${m.shipId} cannot exit pool worse than before`);
      }
      if (m.cbBefore > 0 && m.cbAfter < 0) {
        throw new Error(`Ship ${m.shipId} cannot exit pool with a deficit`);
      }
    }

    return await this.poolRepo.createPool(year, membersData);
  }
}
