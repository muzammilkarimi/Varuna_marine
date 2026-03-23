import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { routeRouter } from '../../adapters/inbound/http/routes/routeRoutes';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Main Routes Tab and Compare Tab API endpoints
app.use('/routes', routeRouter(prisma));

// We leave /banking and /pools for the next iteration or mock them in frontend

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
