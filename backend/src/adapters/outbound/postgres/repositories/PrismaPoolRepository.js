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
exports.PrismaPoolRepository = void 0;
class PrismaPoolRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    createPool(year, members) {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield this.prisma.pool.create({
                data: {
                    year,
                    members: {
                        create: members.map(m => ({
                            shipId: m.shipId,
                            cbBefore: m.cbBefore,
                            cbAfter: m.cbAfter,
                        })),
                    },
                },
                include: { members: true },
            });
            return {
                id: pool.id,
                year: pool.year,
                createdAt: pool.createdAt,
                members: pool.members.map(m => ({
                    id: m.id,
                    poolId: m.poolId,
                    shipId: m.shipId,
                    cbBefore: m.cbBefore,
                    cbAfter: m.cbAfter,
                })),
            };
        });
    }
    findPoolsByYear(year) {
        return __awaiter(this, void 0, void 0, function* () {
            const pools = yield this.prisma.pool.findMany({
                where: { year },
                include: { members: true },
            });
            return pools.map(pool => ({
                id: pool.id,
                year: pool.year,
                createdAt: pool.createdAt,
                members: pool.members.map(m => ({
                    id: m.id,
                    poolId: m.poolId,
                    shipId: m.shipId,
                    cbBefore: m.cbBefore,
                    cbAfter: m.cbAfter,
                })),
            }));
        });
    }
}
exports.PrismaPoolRepository = PrismaPoolRepository;
