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
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const routesData = [
            { routeId: 'R001', vesselType: 'Container', fuelType: 'HFO', year: 2024, ghgIntensity: 91.0, fuelConsumption: 5000, distance: 12000, totalEmissions: 4500, isBaseline: true },
            { routeId: 'R002', vesselType: 'BulkCarrier', fuelType: 'LNG', year: 2024, ghgIntensity: 88.0, fuelConsumption: 4800, distance: 11500, totalEmissions: 4200, isBaseline: false },
            { routeId: 'R003', vesselType: 'Tanker', fuelType: 'MGO', year: 2024, ghgIntensity: 93.5, fuelConsumption: 5100, distance: 12500, totalEmissions: 4700, isBaseline: false },
            { routeId: 'R004', vesselType: 'RoRo', fuelType: 'HFO', year: 2025, ghgIntensity: 89.2, fuelConsumption: 4900, distance: 11800, totalEmissions: 4300, isBaseline: false },
            { routeId: 'R005', vesselType: 'Container', fuelType: 'LNG', year: 2025, ghgIntensity: 90.5, fuelConsumption: 4950, distance: 11900, totalEmissions: 4400, isBaseline: false },
        ];
        for (const r of routesData) {
            yield prisma.route.upsert({
                where: { routeId: r.routeId },
                update: {},
                create: r,
            });
        }
        // Seed ShipCompliance data for Banking/Pooling features
        const complianceData = [
            { shipId: 'R001', year: 2024, cbGco2eq: -341320000 }, // Deficit (91.0 > 89.3368 target)
            { shipId: 'R002', year: 2024, cbGco2eq: 263080640 }, // Surplus (88.0 < 89.3368 target)
            { shipId: 'R003', year: 2024, cbGco2eq: -870336800 }, // Deficit (93.5 > 89.3368 target)
            { shipId: 'R004', year: 2025, cbGco2eq: -27548480 }, // Small deficit (89.2 ~≈ target)
            { shipId: 'R005', year: 2025, cbGco2eq: -236070360 }, // Deficit (90.5 > 89.3368 target)
        ];
        for (const c of complianceData) {
            yield prisma.shipCompliance.upsert({
                where: { shipId_year: { shipId: c.shipId, year: c.year } },
                update: { cbGco2eq: c.cbGco2eq },
                create: c,
            });
        }
        console.log('Database seeded with routes and compliance data!');
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
