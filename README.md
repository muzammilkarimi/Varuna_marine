# 🚢 FuelEU Maritime Compliance Platform

![Dashboard Routes](./screenshots/dashboard_routes.png)

## Overview
A Full-Stack dashboard for tracking **FuelEU Maritime** compliance. Features vessel tracking, baseline comparisons (Target `89.3368`), Banking adjustments, and Pooling simulators setup.

---

## Architecture Summary (Hexagonal Structure)
The system uses **Ports & Adapters (Hexagonal Architecture)**. Loop setups isolate arithmetic formulas from routers and databases.

```mermaid
graph TD
    subgraph "Frontend (React)"
        UI["React Grid & Charts"]
        Axios["Axios API Clients (Adapters)"]
    end

    subgraph "Backend (Express)"
        subgraph "Infrastructure (Adapters)"
            Express["Express Routes"]
            Prisma["Prisma ORM"]
        end

        subgraph "Core Domain Layer"
            UseCases["Application Use Cases"]
            Domain["Domain Entities"]
            Ports["Core Ports (Interfaces)"]
        end
    end

    UI --> Axios
    Axios --> Express
    Express --> UseCases
    Prisma --> Ports
    UseCases --> Ports
```

- **Domain Core**: No Prisma/Express imports. Pure logic and maths.
- **Adapters**: Inner logic connected outwards to client clients setup correctly.

---

## Setup & Run Instructions

### 1. Database Configuration
1. Make sure PostgreSQL is running on Port `5432`.
2. Add a `.env` file in the `backend/` folder:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/fueleu?schema=public"
   ```

### 2. Run Backend
```bash
cd backend
npm install
npx prisma db push
npx prisma generate
npm run seed
npx ts-node src/infrastructure/server/index.ts
```

### 3. Run Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## How to execute tests
Run the backend isolated Jest verify thresholds:
```bash
cd backend
npm run test
```

---

## Visual Previews

### 📊 **Vessel Routes Dashboard**
Comprehensive vessel tracking grids:
![Vessel Routes](./screenshots/dashboard_routes.png)

### 📈 **Comparison Visualizer**
Predictive analytics against absolute 2025 thresholds models:
![Comparison Analytics](./screenshots/dashboard_compare.png)

### 🏦 **Banking Module (Article 20)**
Balance safety verification modules:
![Banking Dashboard](./screenshots/dashboard_banking.png)

### 🧬 **Pooling Simulators (Article 21)**
Iterative allocation balances triggers offsets grids:
![Pooling allocation](./screenshots/dashboard_pooling.png)

---

## Sample Request & Response

### 📊 **Compliance Calculation**
**Endpoint**: `GET /api/compliance/:shipId/compute?year=2025`

**Sample Response**:
```json
{
  "shipId": "IMO9876543",
  "year": 2025,
  "cbGco2eq": 263082240,
  "status": "COMPLIANT",
  "isBanked": false
}
```
