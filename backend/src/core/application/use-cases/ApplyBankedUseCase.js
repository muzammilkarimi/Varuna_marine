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
exports.ApplyBankedUseCase = void 0;
class ApplyBankedUseCase {
    constructor(complianceRepo, bankRepo) {
        this.complianceRepo = complianceRepo;
        this.bankRepo = bankRepo;
    }
    execute(shipId, year, amountToApply) {
        return __awaiter(this, void 0, void 0, function* () {
            const totalBanked = yield this.bankRepo.getTotalBanked(shipId, year - 1);
            if (amountToApply > totalBanked) {
                throw new Error('Not enough banked surplus available');
            }
            yield this.bankRepo.applyBanked(shipId, year, amountToApply);
        });
    }
}
exports.ApplyBankedUseCase = ApplyBankedUseCase;
