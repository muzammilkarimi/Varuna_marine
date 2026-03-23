import { Router } from 'express';
import type { PrismaClient } from '@prisma/client';
import { PrismaRouteRepository } from '../../../outbound/postgres/repositories/PrismaRouteRepository';
import { PrismaComplianceRepository } from '../../../outbound/postgres/repositories/PrismaComplianceRepository';
import { ComputeCBUseCase } from '../../../../core/application/use-cases/ComputeCBUseCase';

export const complianceRouter = (prisma: PrismaClient) => {
  const router = Router();
  const routeRepo = new PrismaRouteRepository(prisma);
  const complianceRepo = new PrismaComplianceRepository(prisma);

  // GET /compliance/cb?year=YYYY&shipId=XXXX
  router.get('/cb', async (req, res) => {
    try {
      const { year, shipId } = req.query;
      if (!year || !shipId) {
        return res.status(400).json({ error: 'year and shipId are required' });
      }

      const useCase = new ComputeCBUseCase(routeRepo, complianceRepo);
      const result = await useCase.execute(shipId as string, Number(year));
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /compliance/adjusted-cb?year=YYYY&shipId=XXXX
  router.get('/adjusted-cb', async (req, res) => {
    try {
      const { year, shipId } = req.query;
      if (!year || !shipId) {
        return res.status(400).json({ error: 'year and shipId are required' });
      }

      const adjustedCb = await complianceRepo.findAdjustedCb(shipId as string, Number(year));
      res.json({ shipId, year: Number(year), adjustedCb });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
