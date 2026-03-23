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
exports.bankingRouter = void 0;
const express_1 = require("express");
const PrismaComplianceRepository_1 = require("../../../outbound/postgres/repositories/PrismaComplianceRepository");
const BankSurplusUseCase_1 = require("../../../../core/application/use-cases/BankSurplusUseCase");
const ApplyBankedUseCase_1 = require("../../../../core/application/use-cases/ApplyBankedUseCase");
const bankingRouter = (prisma) => {
    const router = (0, express_1.Router)();
    const complianceRepo = new PrismaComplianceRepository_1.PrismaComplianceRepository(prisma);
    // POST /banking/bank
    router.post('/bank', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { shipId, year, amount } = req.body;
            if (!shipId || !year || amount === undefined) {
                return res.status(400).json({ error: 'shipId, year, and amount are required' });
            }
            const useCase = new BankSurplusUseCase_1.BankSurplusUseCase(complianceRepo, complianceRepo);
            yield useCase.execute(shipId, year, amount);
            res.json({ success: true, message: `Banked ${amount} gCO2eq for ${shipId} in ${year}` });
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }));
    // POST /banking/apply
    router.post('/apply', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { shipId, year, amount } = req.body;
            if (!shipId || !year || amount === undefined) {
                return res.status(400).json({ error: 'shipId, year, and amount are required' });
            }
            const useCase = new ApplyBankedUseCase_1.ApplyBankedUseCase(complianceRepo, complianceRepo);
            yield useCase.execute(shipId, year, amount);
            res.json({ success: true, message: `Applied ${amount} gCO2eq banked surplus for ${shipId} in ${year}` });
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }));
    return router;
};
exports.bankingRouter = bankingRouter;
