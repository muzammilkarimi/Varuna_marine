# AI Agent Workflow Log

## Agents Used
- DeepMind Antigravity AI Agent (Primary Coding Agent / Task CLI executor)
- Post-Generation Manual Git Committing (User)

## Prompts & Outputs

### Example 1: Domain-Driven Routing Initialization
**Prompt Context**: Initially mapping the Hexagonal logic for Compliance Balance computation.
**Agent Output (Domain & Use Case synthesis)**:
The agent automatically created `src/core/application/use-cases/ComputeCBUseCase.ts` to strictly separate Core formula logic from any Database connection, following architectural rules.
```typescript
const target = 89.3368;
const energy = route.fuelConsumption * 41000;
const cb = Math.round((target - route.ghgIntensity) * energy);
```

### Example 2: Resolving the Vite Tailwind Configuration
**Prompt Context**: "Failed to resolve import index.css"
**Agent Output**:
The agent instantly synthesized `postcss.config.js`, `tailwind.config.js`, and `index.css` via code action commands to bootstrap Vite with Tailwind CSS V4, upgrading legacy configurations.

## Validation / Corrections
- **Tailwind V4 Upgrade Bug**: During the Vite development server refresh, PostCSS threw a fatal error because `tailwindcss` dropped direct postcss plugin support in V4. 
- **Correction Applied**: The agent organically intercepted the CLI error, executed `npm install -D @tailwindcss/postcss`, modified `postcss.config.js` to point to the new adapter alias `@tailwindcss/postcss`, and refactored `index.css` from `@tailwind base` to `@import "tailwindcss";` completely migrating the project to the modern system autonomously.

## Observations
- **Where Agent Saved Time**: Writing Hexagonal Ports and Express adapters. Writing the Prisma ORM schema manually and translating standard TS definitions to Postgres bindings would have consumed significant overhead. Generating the React Table layouts and Recharts integration was nearly immediate.
- **Where Agent Failed/Hallucinated**: The agent initially failed to inject interactive CLI responses when triggering `npm create vite@latest`, which stalled the generation script until the terminal was manually overridden with `--no-interactive`. 
- **Combination**: Parallel execution of `npm install` across frontend and backend directories saved massive block-time when generating the application footprint.

## Best Practices Followed
- **Iterative Checkpoints**: Developed strictly sequentially from Backend Schema -> Core Entities -> Express Routes -> Frontend Dashboard. 
- **Decoupled Architecture**: Strictly prevented Prisma clients from leaking into `src/core/application` by exporting `IRouteRepository.ts` outbound ports.
- **Self-Healing**: Continuously monitored `git rm --cached` loops when `node_modules` were improperly staged.
