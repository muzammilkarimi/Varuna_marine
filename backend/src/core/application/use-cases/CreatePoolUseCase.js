"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePoolUseCase = void 0;
class CreatePoolUseCase {
    constructor(poolRepo, complianceRepo) {
        this.poolRepo = poolRepo;
        this.complianceRepo = complianceRepo;
    }
    execute(year, shipIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const membersData = [];
            let totalAdjustedCb = 0;
            for (const shipId of shipIds) {
                const cbBefore = yield this.complianceRepo.findAdjustedCb(shipId, year);
                totalAdjustedCb += cbBefore;
                membersData.push({ shipId, cbBefore, cbAfter: cbBefore });
            }
            if (totalAdjustedCb < 0) {
                throw new Error('Pool total adjusted CB must be >= 0');
            }
            membersData.sort((a, b) => b.cbBefore - a.cbBefore);
            for (const member of membersData) {
                if (member.cbAfter < 0) {
                    const deficit = Math.abs(member.cbAfter);
                    const surplusProvider = membersData.find(m => m.cbAfter > 0);
                    if (surplusProvider && surplusProvider.cbAfter >= deficit) {
                        surplusProvider.cbAfter -= deficit;
                        member.cbAfter = 0;
                    }
                    else if (surplusProvider) {
                        const available = surplusProvider.cbAfter;
                        surplusProvider.cbAfter = 0;
                        member.cbAfter += available;
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
            return yield this.poolRepo.createPool(year, membersData);
        });
    }
}
exports.CreatePoolUseCase = CreatePoolUseCase;
