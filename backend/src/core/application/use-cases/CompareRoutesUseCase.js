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
exports.CompareRoutesUseCase = void 0;
class CompareRoutesUseCase {
    constructor(routeRepo) {
        this.routeRepo = routeRepo;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const routes = yield this.routeRepo.findAll();
            const baseline = routes.find(r => r.isBaseline);
            if (!baseline) {
                throw new Error('No baseline route set');
            }
            const targetIntensity = 89.3368;
            return routes.map(route => {
                const percentDiff = ((route.ghgIntensity / baseline.ghgIntensity) - 1) * 100;
                const compliant = route.ghgIntensity <= targetIntensity;
                return Object.assign(Object.assign({}, route), { percentDiff,
                    compliant });
            });
        });
    }
}
exports.CompareRoutesUseCase = CompareRoutesUseCase;
