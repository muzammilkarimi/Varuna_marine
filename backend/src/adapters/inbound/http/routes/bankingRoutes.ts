import { Router } from 'express';
import type { PrismaClient } from '@prisma/client';
import { PrismaComplianceRepository } from '../../../outbound/postgres/repositories/PrismaComplianceRepository';
import { BankSurplusUseCase } from '../../../../core/application/use-cases/BankSurplusUseCase';
import { ApplyBankedUseCase } from '../../../../core/application/use-cases/ApplyBankedUseCase';

export const bankingRouter = (prisma: PrismaClient) => {
  const router = Router();
  const complianceRepo = new PrismaComplianceRepository(prisma);

  // POST /banking/bank
  router.post('/bank', async (req, res) => {
    try {
      const { shipId, year, amount } = req.body;
      if (!shipId || !year || amount === undefined) {
        return res.status(400).json({ error: 'shipId, year, and amount are required' });
      }

      const useCase = new BankSurplusUseCase(complianceRepo, complianceRepo);
      await useCase.execute(shipId, year, amount);
      res.json({ success: true, message: `Banked ${amount} gCO2eq for ${shipId} in ${year}` });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // POST /banking/apply
  router.post('/apply', async (req, res) => {
    try {
      const { shipId, year, amount } = req.body;
      if (!shipId || !year || amount === undefined) {
        return res.status(400).json({ error: 'shipId, year, and amount are required' });
      }

      const useCase = new ApplyBankedUseCase(complianceRepo, complianceRepo);
      await useCase.execute(shipId, year, amount);
      res.json({ success: true, message: `Applied ${amount} gCO2eq banked surplus for ${shipId} in ${year}` });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
};
