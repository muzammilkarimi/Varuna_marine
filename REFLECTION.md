# Reflection & Self-Evaluation

## What I Learned Using AI Agents
Developing this dashboard with AI showed me how to expedite the initial project setup. The main takeaway was that **keeping strict structural boundaries is mandatory**. If you don’t separate your interfaces early, the agent starts leaking outer library logic (like database annotations) directly into the formulas code. Maintaining Clean Architecture kept everything testable from day one.

## Efficiency Gains vs Manual Coding
The speeds gains are most obvious during scaffolding and boilerplate generation. Building both the Axios handlers for the frontend and the Prisma repositories for the backend simultaneously saved me hours of manual wiring and interface creation scripts. Also, resolving random setup breaking bugs (like Tailwind v4 dependencies) saved significant debug timelines.

## Improvements I’d Make Next Time
Next time, I'd enforce automated integration test runners upfront rather than deploying them later in the cycle. Running automated verification cycles after every autonomous edit directly protects formula variables arithmetic math from regressions completely upfront. 
