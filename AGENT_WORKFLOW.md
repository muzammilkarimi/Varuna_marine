# AI Agent Workflow Log

## Agents Used
- DeepMind Antigravity AI Agent (Coding capabilities via CLI/Tool calling interface)
- Github Copilot / IDE context tracking

## Prompts & Outputs
- **Example 1**: "Build APIs backing the Fuel EU Dashboard... Hexagonal Architecture"
  - *Output*: The agent actively synthesized `src/core/domain/route.entity.ts` decoupling the data definition (`IComplianceRepository.ts`) entirely from Prisma. It generated `backend/prisma/schema.prisma` completely aligned with the formulas mapping inputs to DB.
- **Example 2**: "The user requested step-by-step github commits..."
  - *Output*: The agent cleared the `fueleu-maritime` active workspace automatically using Powershell `Remove-Item` to satisfy a restart requirement, executed isolated `git init`, and iteratively broke down the commits via dynamic terminal commands.

## Validation / Corrections
- **Jest Precision**: The agent wrote `ComputeCBUseCase.test.ts` where JS floating point multiplication returned `-340955999.99999846` instead of `-340956000`. The test visibly failed. The agent corrected itself actively in the next step by appending `Math.round()` inside the Use Case to align with exact integer CO2eq metrics.
- **Node Modules & Git**: When the user typed `git add .`, they accidentally staged over 6000 dependency files. The agent immediately created `.gitignore` and ran `git rm -r --cached .` to sanitize the tree.

## Observations
- **Where Agent saved time**: Generating massive hexagonal boilerplate (Inbound/Outbound Ports, Use Cases). It also completely wired up TailwindCSS instantly over Vite, eliminating manual styling layout configurations.
- **Where it failed**: `create-vite` prompts timed out or stalled expecting terminal inputs dynamically inside CLI tool calls. Required adapting to non-interactive script flags `npm create vite@latest frontend -- --template react-ts`.
- **Combination**: Parallelized backend tests Execution alongside frontend component scaffolding heavily optimized time limits.

## Best Practices Followed
- Employed `task.md` meticulously.
- Strict dependency inversion inside `backend/src/core/application` where Express or Prisma packages are never exported or imported statically into `use-cases`.
