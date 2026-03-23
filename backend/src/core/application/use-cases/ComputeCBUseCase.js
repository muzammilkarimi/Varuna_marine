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
exports.ComputeCBUseCase = void 0;
class ComputeCBUseCase {
    constructor(routeRepo, complianceRepo) {
        this.routeRepo = routeRepo;
        this.complianceRepo = complianceRepo;
    }
    execute(shipId, year) {
        return __awaiter(this, void 0, void 0, function* () {
            const route = yield this.routeRepo.findByRouteId(shipId);
            if (!route) {
                throw new Error('Route/Ship not found');
            }
            // Formula: (Target - Actual) * Energy
            // Target = 89.3368
            // Energy = fuelConsumption * 41000
            const target = 89.3368;
            const energy = route.fuelConsumption * 41000;
            const cb = Math.round((target - route.ghgIntensity) * energy);
            const compliance = yield this.complianceRepo.save({
                shipId,
                year,
                cbGco2eq: cb
            });
            return compliance;
        });
    }
}
exports.ComputeCBUseCase = ComputeCBUseCase;
