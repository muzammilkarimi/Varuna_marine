import { Router } from 'express';
import type { PrismaClient } from '@prisma/client';
import { PrismaComplianceRepository } from '../../../outbound/postgres/repositories/PrismaComplianceRepository';
import { PrismaPoolRepository } from '../../../outbound/postgres/repositories/PrismaPoolRepository';
import { CreatePoolUseCase } from '../../../../core/application/use-cases/CreatePoolUseCase';

export const poolRouter = (prisma: PrismaClient) => {
  const router = Router();
  const complianceRepo = new PrismaComplianceRepository(prisma);
  const poolRepo = new PrismaPoolRepository(prisma);

  // POST /pools
  router.post('/', async (req, res) => {
    try {
      const { year, shipIds } = req.body;
      if (!year || !shipIds || !Array.isArray(shipIds)) {
        return res.status(400).json({ error: 'year and shipIds array are required' });
      }

      const useCase = new CreatePoolUseCase(poolRepo, complianceRepo);
      const pool = await useCase.execute(year, shipIds);
      res.json(pool);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // GET /pools?year=YYYY
  router.get('/', async (req, res) => {
    try {
      const { year } = req.query;
      if (!year) {
        return res.status(400).json({ error: 'year is required' });
      }
      const pools = await poolRepo.findPoolsByYear(Number(year));
      res.json(pools);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
