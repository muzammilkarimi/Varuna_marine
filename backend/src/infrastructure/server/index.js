"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const routeRoutes_1 = require("../../adapters/inbound/http/routes/routeRoutes");
const complianceRoutes_1 = require("../../adapters/inbound/http/routes/complianceRoutes");
const bankingRoutes_1 = require("../../adapters/inbound/http/routes/bankingRoutes");
const poolRoutes_1 = require("../../adapters/inbound/http/routes/poolRoutes");
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes – proper hexagonal wiring
app.use('/routes', (0, routeRoutes_1.routeRouter)(prisma));
app.use('/compliance', (0, complianceRoutes_1.complianceRouter)(prisma));
app.use('/banking', (0, bankingRoutes_1.bankingRouter)(prisma));
app.use('/pools', (0, poolRoutes_1.poolRouter)(prisma));
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Backend server listening on port ${port}`);
});
