import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { routeRouter } from '../../adapters/inbound/http/routes/routeRoutes';
import { complianceRouter } from '../../adapters/inbound/http/routes/complianceRoutes';
import { bankingRouter } from '../../adapters/inbound/http/routes/bankingRoutes';
import { poolRouter } from '../../adapters/inbound/http/routes/poolRoutes';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Routes – proper hexagonal wiring
app.use('/routes', routeRouter(prisma));
app.use('/compliance', complianceRouter(prisma));
app.use('/banking', bankingRouter(prisma));
app.use('/pools', poolRouter(prisma));

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});

export default app;
