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
exports.PrismaRouteRepository = void 0;
class PrismaRouteRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.route.findMany();
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.route.findUnique({ where: { id } });
        });
    }
    findByRouteId(routeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.route.findUnique({ where: { routeId } });
        });
    }
    setBaseline(routeId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.route.updateMany({ data: { isBaseline: false } });
            return this.prisma.route.update({
                where: { routeId },
                data: { isBaseline: true }
            });
        });
    }
    getBaseline() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.route.findFirst({ where: { isBaseline: true } });
        });
    }
}
exports.PrismaRouteRepository = PrismaRouteRepository;
