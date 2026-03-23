# FuelEU Maritime Compliance Platform

## Overview
This Full-Stack system implements the Fuel EU Maritime compliance module using a strict Hexagonal Architecture. It administers Vessel tracking, Baseline Comparison (Target 89.33 gCO2e), Banking modules (Article 20), and Pooling simulations (Article 21).

---

## Architecture Summary
The application is bifurcated into a **Vite React Frontend** and an **Express.js Backend**, strictly implementing Clean / Ports & Adapters Architecture.

### Core Domain Flow
- **Core (`backend/src/core`)**: Contains Domain Entities (`Route`, `Pool`) and highly isolated Application Use Cases (`ComputeCBUseCase`, `CreatePoolUseCase`). This layer contains zero HTTP or Database dependencies.
- **Adapters (`backend/src/adapters`)**: 
  - *Inbound*: Express Routes providing REST API access.
  - *Outbound*: Prisma Repository implementations speaking to PostgreSQL.

---

## Setup & Run Instructions

### 1. Database Configuration
1. Ensure your local PostgreSQL server is actively running (Port `5432`).
2. Inside the `backend` directory, create a `.env` file containing your Postgres URL:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/fueleu?schema=public"
   ```

### 2. Launching the Backend Server
From the root terminal, run:
```bash
cd backend
npm install
npx prisma db push
npx prisma generate
npm run seed
npx ts-node src/infrastructure/server/index.ts
```
*(The backend serves API mockups and DB queries on `http://localhost:3001`!)*

### 3. Launching the Frontend Dashboard
Open a secondary terminal:
```bash
cd frontend
npm install
npm run dev
```

Browse to `http://localhost:5173`. The application features:
- **Routes Dashboard**: Rendered via Vite + TailwindCSS showcasing vessel baselines and categorical filters.
- **Compare Tab**: Renders dynamic interactive charts driven by `recharts`.
- **Banking & Pooling**: Features validated form interactions interacting with backend Mock endpoints verifying compliance limits!
