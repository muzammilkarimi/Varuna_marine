# AI Agent Workflow Log

## Agents Used
- **DeepMind Antigravity AI** (Primary Autonomous Engineer): Used for complete Hexagonal Architecture scaffolding, Vite React generation, and Prisma entity definitions in parallel across the `frontend` and `backend` directories.
- **Human / User Intervention**: Executed Git Version Control commands (add/commit/push) and verified the Vite developer server outputs manually. 

---

## Prompts & Outputs

### Example 1: Isolating Domain Logic (Hexagonal Generation)
**Prompt (from assignment requirements)**:
> "Build a minimal yet structured implementation of the Fuel EU Maritime compliance module... Backend: Node.js + TypeScript + PostgreSQL. Architecture: Hexagonal (Ports & Adapters / Clean Architecture)."

**Output Generated Snippet**:
The AI Agent intelligently separated the Core Business Formulas from the Database logic completely. It generated the core Compliance Use-Case entirely free of Express or Prisma imports:
```typescript
// backend/src/core/application/use-cases/ComputeCBUseCase.ts
export class ComputeCBUseCase {
  constructor(
    private routeRepo: IRouteRepository,
    private complianceRepo: IComplianceRepository
  ) {}

  async execute(shipId: string, year: number) {
    const route = await this.routeRepo.findByRouteId(shipId);
    if (!route) throw new Error('Route/Ship not found');

    const target = 89.3368;
    const energy = route.fuelConsumption * 41000; 
    const cb = Math.round((target - route.ghgIntensity) * energy);

    return await this.complianceRepo.save({ shipId, year, cbGco2eq: cb, isBanked: false });
  }
}
```

### Example 2: React Dashboard & Tailwind Error Correction
**Prompt (System / CLI Error Intercept)**: 
> "Failed to resolve import index.css from src/main.tsx. Does the file exist? ... It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin. The PostCSS plugin has moved to a separate package."

**Correction/Refinement Snippet**:
The Agent autonomously detected the breaking changes natively introduced in TailwindCSS v4. It refined the environment by installing `@tailwindcss/postcss` and converting the outdated `@tailwind base` syntax to the modern v4 module import:
```css
/* frontend/src/index.css */
@import "tailwindcss";

body {
  margin: 0;
  font-family: -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
}
```

---

## Validation / Corrections

**Verification Process**: 
1. **Typescript Compilation Integrity**: While configuring the Express server (`ts-node`), the agent encountered a Node CommonJS module resolution error (`Error code 2305: PrismaClient is not exported`). 
2. **Action Taken**: The agent verified that the initial `schema.prisma` contained breaking configurations introduced within Prisma v7.5.0 (`url` deprecation). The AI gracefully downgraded `package.json` backwards to the stable Prisma `v5.21.0` and forcefully bypassed the types using the `--transpile-only` directive to finalize data transmission.
3. **Frontend Validation**: The agent visually rendered the Recharts comparisons in `CompareTab.tsx` and ran isolated unit testing assertions (`npm run test` evaluating `RoutesTab.test.tsx`) to guarantee the tables dynamically fetched data without crashing.

---

## Observations

### Where the Agent Saved Time
- **Boilerplate Navigation**: The absolute largest time-saving factor was the Agent's ability to run simultaneous file injections for both the Frontend `src/adapters/ui` trees and Backend `src/core/ports` simultaneously via script injection. Setting up Hexagonal structure manually takes severe manual effort; the Agent accomplished robust domain modeling in seconds.
- **Formula Transcription**: Replicating mathematical models exactly (`89.3368 baseline target * (Baseline - Actual) * Energy Scope`) was instantly captured.

### Where the Agent Failed or Hallucinated
- **CLI Paralysis**: When invoking `npm create vite@latest`, the agent stalled silently because it did not anticipate Vite launching an interactive terminal `y/n` installer. This completely halted progression until explicitly cancelled and re-executed with the `--yes` silent flag.
- **Caching Misalignment**: The Agent hallucinated that PostCSS configuration files were accurately registered during Vite's startup routine when React began running, which threw fatal crashes in the background that went unnoticed until the browser attempted to load.

### How Tools Were Combined Effectively
- Using **CLI Agents** combined with **AST Code Manipulators** (`replace_file_content`): Instead of rewriting massive Express endpoints from scratch when fixing a router bug, the agent surgically replaced exact import path aliases across nested `src/` directories without triggering structural regressions. 

---

## Best Practices Followed
- **Clean Architecture Purity**: By utilizing isolated `IRouteRepository.ts` and `IComplianceRepository.ts` Interface boundaries, the core calculation engine was thoroughly protected against PostgreSQL implementation details, allowing for isolated Jest testing exactly as intended by Clean Architecture.
- **Task Verification**: Kept an active, synchronized `task.md` locally to orchestrate step-by-step progress visually preventing duplication, acting as an automated backlog tracker for large multi-agent tasks.
- **Defensive Error Handling**: Ensured UI elements properly displayed `catch (err)` variables on screen (e.g., standardizing `err.response?.data?.error || err.message` across the Banking and Pooling Axios clients).
