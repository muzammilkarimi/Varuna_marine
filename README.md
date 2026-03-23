# FuelEU Maritime Compliance Platform

## Overview
This platform implements the Fuel EU Maritime compliance module using a strict Hexagonal Architecture. It manages Route tracking, Baseline Comparison (Target 89.33gCO2e), Banking (Article 20), and Pooling (Article 21).

## Architecture Summary
The codebase is divided into **Frontend (React)** and **Backend (Express)**.

Both employ Clean / Ports & Adapters Architecture:
- **Core (`src/core`)**: Contains Domain Entities (e.g. `Route`, `Pool`) and Application Use Cases (`ComputeCBUseCase`, `CreatePoolUseCase`). This layer is entirely agnostic to HTTP or DB logic.
- **Adapters (`src/adapters`)**: 
  - *Inbound*: React Components (UI) & Express Routers.
  - *Outbound*: Prisma Postgres Repositories & Axios API Clients.

## Setup & Run Instructions

### 1. Database Configuration
1. Make sure PostgreSQL is running.
2. In the `backend` directory, create a `.env` file:
   `DATABASE_URL="postgresql://postgres:pass@localhost:5432/fueleu?schema=public"`

### 2. Backend Server
```bash
cd backend
npm install
npx prisma db push
npm run seed
npm run dev
```

### 3. Frontend Dashboard
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` to view the comprehensive FuelEU application UI.
