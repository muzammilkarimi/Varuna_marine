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
exports.poolRouter = void 0;
const express_1 = require("express");
const PrismaComplianceRepository_1 = require("../../../outbound/postgres/repositories/PrismaComplianceRepository");
const PrismaPoolRepository_1 = require("../../../outbound/postgres/repositories/PrismaPoolRepository");
const CreatePoolUseCase_1 = require("../../../../core/application/use-cases/CreatePoolUseCase");
const poolRouter = (prisma) => {
    const router = (0, express_1.Router)();
    const complianceRepo = new PrismaComplianceRepository_1.PrismaComplianceRepository(prisma);
    const poolRepo = new PrismaPoolRepository_1.PrismaPoolRepository(prisma);
    // POST /pools
    router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { year, shipIds } = req.body;
            if (!year || !shipIds || !Array.isArray(shipIds)) {
                return res.status(400).json({ error: 'year and shipIds array are required' });
            }
            const useCase = new CreatePoolUseCase_1.CreatePoolUseCase(poolRepo, complianceRepo);
            const pool = yield useCase.execute(year, shipIds);
            res.json(pool);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }));
    // GET /pools?year=YYYY
    router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { year } = req.query;
            if (!year) {
                return res.status(400).json({ error: 'year is required' });
            }
            const pools = yield poolRepo.findPoolsByYear(Number(year));
            res.json(pools);
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }));
    return router;
};
exports.poolRouter = poolRouter;
