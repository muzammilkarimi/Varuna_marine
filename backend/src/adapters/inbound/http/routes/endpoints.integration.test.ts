import request from 'supertest';
import app from '../../../../infrastructure/server/index';
// Mock Prisma so we don't need real DB connection for integration layer mocks
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        route: {
          findMany: jest.fn().mockResolvedValue([
            { id: 1, routeId: 'R001', vesselType: 'Container', fuelType: 'HFO', year: 2024, ghgIntensity: 91.0, fuelConsumption: 4000, distance: 10000, totalEmissions: 3000, isBaseline: false }
          ]),
          findFirst: jest.fn(),
          update: jest.fn()
        }
      };
    })
  };
});

describe('Endpoints Integration', () => {
  it('GET /routes should return list of routes', async () => {
    const res = await request(app).get('/routes');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].routeId).toBe('R001');
  });
});
