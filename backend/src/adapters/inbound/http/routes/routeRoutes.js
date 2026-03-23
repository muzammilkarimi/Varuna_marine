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
exports.routeRouter = void 0;
const express_1 = require("express");
const PrismaRouteRepository_1 = require("../../../outbound/postgres/repositories/PrismaRouteRepository");
const CompareRoutesUseCase_1 = require("../../../../core/application/use-cases/CompareRoutesUseCase");
const routeRouter = (prisma) => {
    const router = (0, express_1.Router)();
    const repo = new PrismaRouteRepository_1.PrismaRouteRepository(prisma);
    router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const routes = yield repo.findAll();
            res.json(routes);
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }));
    router.post('/:id/baseline', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const route = yield repo.setBaseline(req.params.id);
            res.json(route);
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }));
    router.get('/comparison', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const useCase = new CompareRoutesUseCase_1.CompareRoutesUseCase(repo);
            const comparison = yield useCase.execute();
            res.json(comparison);
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }));
    return router;
};
exports.routeRouter = routeRouter;
