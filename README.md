# 🚢 FuelEU Maritime Compliance Platform

![Dashboard Routes](./screenshots/dashboard_routes.png)

## Overview
A Full-Stack dashboard for tracking **FuelEU Maritime** compliance. Features:
- **Dashboard (Routes)**: View and manage vessel tracking grids and baseline metrics.
- **Comparison Visualizer**: Predictive analytics matching threshold targets accurately.
- **Banking Module (Article 20)**: Balance adjustments with absolute Banking surpluses allocations.
- **Pooling Simulator (Article 21)**: Iterative allocation setups securely combining vessel pools.

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
   DATABASE_URL="postgresql://postgres:xxxxxx@localhost:5432/fueleu?schema=public"
   ```

### 2. Run Backend
```bash
cd backend
npm install
npx prisma db push
npx prisma generate
npx prisma db seed
npm run dev
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

## 📖 API Documentation

The backend operates on `http://localhost:3001`. 

### 📊 Vessel Routes (`/routes`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/routes` | Fetch all vessel routes. |
| `POST` | `/routes/:id/baseline` | Set a route as the baseline. |
| `GET` | `/routes/comparison` | Run predictive comparison analysis. |

### ⚖️ Compliance (`/compliance`)
| Method | Endpoint | Parameters | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/compliance/cb` | `?year=YYYY&shipId=XXXX` | Compute compliance balance (`cbGco2eq`). |
| `GET` | `/compliance/adjusted-cb` | `?year=YYYY&shipId=XXXX` | Fetch adjusted balance with banking offsets. |

### 🏦 Banking Module (`/banking`)
| Method | Endpoint | Body Shape | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/banking/bank` | `{ shipId, year, amount }` | Create surplus banking records. |
| `POST` | `/banking/apply` | `{ shipId, year, amount }` | Apply banked surplus offsets. |
| `GET` | `/banking/records`| `?shipId=XXXX&year=YYYY` | Retrieve adjustment history records. |

### 🧬 Pooling Simulator (`/pools`)
| Method | Endpoint | Body Shape | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/pools` | `{ year, shipIds: [] }` | Form compliance pools combination securely. |
| `GET` | `/pools` | `?year=YYYY` | Retrieves pools setups grouped by year. |

---

## 🧮 Core Formulas
*   **Compliance Balance (CB)**: `(Target - Actual) * Energy`
    *   `Target`: `89.3368` gCO₂e/MJ
    *   `Energy`: `fuelConsumption * 41000`
