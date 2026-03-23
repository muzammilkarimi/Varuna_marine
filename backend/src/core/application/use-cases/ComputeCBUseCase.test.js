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
const ComputeCBUseCase_1 = require("./ComputeCBUseCase");
describe('ComputeCBUseCase', () => {
    it('should compute the correct positive Compliance Balance surplus', () => __awaiter(void 0, void 0, void 0, function* () {
        // Target = 89.3368
        // Route GHG = 88.0
        // Fuel Consumption = 4800
        // Energy = 4800 * 41000 = 196800000
        // Expected CB = (89.3368 - 88.0) * 196800000 = 263080640
        const mockRoute = {
            routeId: 'R002',
            vesselType: 'BulkCarrier',
            fuelType: 'LNG',
            year: 2024,
            ghgIntensity: 88.0,
            fuelConsumption: 4800,
            distance: 11500,
            totalEmissions: 4200,
            isBaseline: false
        };
        const mockRouteRepo = {
            findAll: jest.fn(),
            findById: jest.fn(),
            findByRouteId: jest.fn().mockResolvedValue(mockRoute),
            setBaseline: jest.fn(),
            getBaseline: jest.fn()
        };
        const mockComplianceRepo = {
            save: jest.fn().mockImplementation((val) => Promise.resolve(val)),
            findByShipAndYear: jest.fn(),
            findAdjustedCb: jest.fn()
        };
        const useCase = new ComputeCBUseCase_1.ComputeCBUseCase(mockRouteRepo, mockComplianceRepo);
        const result = yield useCase.execute('R002', 2024);
        expect(mockRouteRepo.findByRouteId).toHaveBeenCalledWith('R002');
        expect(result.cbGco2eq).toBe(263080640);
    }));
    it('should throw an error if the route tracking is not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockRouteRepo = {
            findAll: jest.fn(),
            findById: jest.fn(),
            findByRouteId: jest.fn().mockResolvedValue(null),
            setBaseline: jest.fn(),
            getBaseline: jest.fn()
        };
        const mockComplianceRepo = {};
        const useCase = new ComputeCBUseCase_1.ComputeCBUseCase(mockRouteRepo, mockComplianceRepo);
        yield expect(useCase.execute('INVALID', 2024)).rejects.toThrow('Route/Ship not found');
    }));
});
