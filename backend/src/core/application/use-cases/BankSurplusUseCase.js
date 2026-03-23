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
exports.BankSurplusUseCase = void 0;
class BankSurplusUseCase {
    constructor(complianceRepo, bankRepo) {
        this.complianceRepo = complianceRepo;
        this.bankRepo = bankRepo;
    }
    execute(shipId, year, amountToBank) {
        return __awaiter(this, void 0, void 0, function* () {
            const compliance = yield this.complianceRepo.findByShipAndYear(shipId, year);
            if (!compliance)
                throw new Error('Compliance record not found');
            if (compliance.cbGco2eq <= 0) {
                throw new Error('No positive surplus to bank');
            }
            const availableToBank = compliance.cbGco2eq;
            if (amountToBank > availableToBank) {
                throw new Error('Cannot bank more than the surplus amount');
            }
            yield this.bankRepo.bankSurplus(shipId, year, amountToBank);
        });
    }
}
exports.BankSurplusUseCase = BankSurplusUseCase;
