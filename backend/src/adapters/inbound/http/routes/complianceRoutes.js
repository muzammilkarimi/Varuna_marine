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
exports.complianceRouter = void 0;
const express_1 = require("express");
const PrismaRouteRepository_1 = require("../../../outbound/postgres/repositories/PrismaRouteRepository");
const PrismaComplianceRepository_1 = require("../../../outbound/postgres/repositories/PrismaComplianceRepository");
const ComputeCBUseCase_1 = require("../../../../core/application/use-cases/ComputeCBUseCase");
const complianceRouter = (prisma) => {
    const router = (0, express_1.Router)();
    const routeRepo = new PrismaRouteRepository_1.PrismaRouteRepository(prisma);
    const complianceRepo = new PrismaComplianceRepository_1.PrismaComplianceRepository(prisma);
    // GET /compliance/cb?year=YYYY&shipId=XXXX
    router.get('/cb', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { year, shipId } = req.query;
            if (!year || !shipId) {
                return res.status(400).json({ error: 'year and shipId are required' });
            }
            const useCase = new ComputeCBUseCase_1.ComputeCBUseCase(routeRepo, complianceRepo);
            const result = yield useCase.execute(shipId, Number(year));
            res.json(result);
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }));
    // GET /compliance/adjusted-cb?year=YYYY&shipId=XXXX
    router.get('/adjusted-cb', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { year, shipId } = req.query;
            if (!year || !shipId) {
                return res.status(400).json({ error: 'year and shipId are required' });
            }
            const adjustedCb = yield complianceRepo.findAdjustedCb(shipId, Number(year));
            res.json({ shipId, year: Number(year), adjustedCb });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }));
    return router;
};
exports.complianceRouter = complianceRouter;
