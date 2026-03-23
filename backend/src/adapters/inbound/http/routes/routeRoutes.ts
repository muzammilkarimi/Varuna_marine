import { Router } from 'express';
import type { PrismaClient } from '@prisma/client';
import { PrismaRouteRepository } from '../../../outbound/postgres/repositories/PrismaRouteRepository';
import { CompareRoutesUseCase } from '../../../../core/application/use-cases/CompareRoutesUseCase';

export const routeRouter = (prisma: PrismaClient) => {
  const router = Router();
  const repo = new PrismaRouteRepository(prisma);

  router.get('/', async (req, res) => {
    try {
      const routes = await repo.findAll();
      res.json(routes);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/:id/baseline', async (req, res) => {
    try {
      const route = await repo.setBaseline(req.params.id);
      res.json(route);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/comparison', async (req, res) => {
    try {
      const useCase = new CompareRoutesUseCase(repo);
      const comparison = await useCase.execute();
      res.json(comparison);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
