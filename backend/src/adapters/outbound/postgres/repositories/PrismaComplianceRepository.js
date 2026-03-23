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
exports.PrismaComplianceRepository = void 0;
class PrismaComplianceRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    save(compliance) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.shipCompliance.upsert({
                where: { shipId_year: { shipId: compliance.shipId, year: compliance.year } },
                update: { cbGco2eq: compliance.cbGco2eq },
                create: {
                    shipId: compliance.shipId,
                    year: compliance.year,
                    cbGco2eq: compliance.cbGco2eq,
                },
            });
        });
    }
    findByShipAndYear(shipId, year) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.shipCompliance.findUnique({
                where: { shipId_year: { shipId, year } },
            });
        });
    }
    findAdjustedCb(shipId, year) {
        return __awaiter(this, void 0, void 0, function* () {
            const compliance = yield this.findByShipAndYear(shipId, year);
            if (!compliance)
                return 0;
            // Adjusted CB = base CB minus any amounts already banked for this year
            const banked = yield this.prisma.bankEntry.aggregate({
                where: { shipId, year },
                _sum: { amountGco2eq: true },
            });
            return compliance.cbGco2eq - (banked._sum.amountGco2eq || 0);
        });
    }
    bankSurplus(shipId, year, amountGco2eq) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.bankEntry.create({
                data: { shipId, year, amountGco2eq },
            });
        });
    }
    getTotalBanked(shipId, year) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.prisma.bankEntry.aggregate({
                where: { shipId, year },
                _sum: { amountGco2eq: true },
            });
            return result._sum.amountGco2eq || 0;
        });
    }
    applyBanked(shipId, year, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            // Record a negative bank entry for the application year
            yield this.prisma.bankEntry.create({
                data: { shipId, year, amountGco2eq: -amount },
            });
        });
    }
}
exports.PrismaComplianceRepository = PrismaComplianceRepository;
