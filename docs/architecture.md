# Gatherly AI — Architecture & Engineering Specification

## 1. Architectural Overview & Separation of Concerns

Gatherly AI follows a strict **Clean Hexagonal Architecture** separating core domain logic, application orchestration, presentation components, and infrastructure adapters.

```mermaid
graph TD
  subgraph Presentation ["Presentation Layer (React, Accessible UI, Tailwind)"]
    Pages["Pages (Welcome, Planner Studio)"]
    Components["Components (Dashboard, Budget, Timeline, Vendors, What-If)"]
    Theme["Kawaii Scrapbook Design System"]
  end

  subgraph Application ["Application Layer (Use Cases & Orchestration)"]
    CreateEventUC["Create Event"]
    RecalculateBudgetUC["Recalculate Budget"]
    SimulateWhatIfUC["Simulate What-If Constraints"]
    ApplyChangesUC["Validate & Apply Changes"]
    ManageVendorsUC["Manage Vendors & Tasks"]
  end

  subgraph Domain ["Domain Layer (Pure TypeScript, Zero External Dependencies)"]
    EventEntity["Event Entity & Aggregates"]
    BudgetEngine["Deterministic Budget Engine (Minor Units)"]
    TimelineEngine["Deterministic Timeline & Cycle Detection"]
    ConstraintEngine["Constraint-Aware Replanning Engine"]
    ValidationSchemas["Zod Domain Schemas & Value Objects"]
  end

  subgraph Infrastructure ["Infrastructure Layer (Adapters & External Systems)"]
    StorageAdapter["Storage Adapter (Versioned LocalStorage/IndexedDB)"]
    AIProvider["AI Provider Interface"]
    OllamaAdapter["Local Ollama Adapter (qwen2.5:3b)"]
    DemoAdapter["Deterministic Demo Provider (Production-Safe)"]
    RemoteAdapter["FastAPI Proxy Adapter"]
  end

  Presentation --> Application
  Application --> Domain
  Application --> Infrastructure
  Infrastructure ..|> Domain
```

---

## 2. Layer Definitions & Strict Rules

1. **Domain Layer (`src/domain/`)**:
   - Pure, deterministic business logic and rules.
   - Zero dependencies on React, browser APIs, or external AI endpoints.
   - **Financial Arithmetic**: Conducted exclusively in integer minor units (paise for INR: 1 INR = 100 paise) to avoid floating-point inaccuracies.
   - **Timeline & Graph Engine**: Directed graph with topological sorting and cycle detection (`detectCycle`, `getTopologicalOrder`) to prevent invalid task dependencies.
   - **Constraint Re-planner**: Deterministically computes delta consequences of guest count adjustments, budget slashes, or date shifts before any AI suggestion is requested.

2. **Application Layer (`src/application/`)**:
   - Use cases and state management orchestration.
   - Connects user intents to domain logic and infrastructure adapters.
   - Validates all external inputs (including AI outputs) using Zod runtime schemas before modifying application state.

3. **Infrastructure Layer (`src/infrastructure/`)**:
   - `StorageAdapter`: Handles schema versioning, automated migrations, record validation, and graceful recovery from corrupt state.
   - `AIProvider`: Abstraction defining `generatePlan`, `revisePlan`, and `generateInspiration`. Implementations include `OllamaAdapter` (connecting to `qwen2.5:3b` with timeout and abort support) and `DemoAdapter` (ensuring 100% production functionality without a local machine running).

4. **Presentation Layer (`src/presentation/`)**:
   - Kawaii Scrapbook Neo-Brutalism design system.
   - Adorable, tactile, accessible components adhering to WCAG 2.1 AA.
   - No duplicated domain calculations; relies strictly on domain outputs.

---

## 3. Data Integrity & Minor Currency Units

- Currency: **INR (₹)** as base currency.
- Storage: **Paise** (Integer minor units, 100 paise = 1 INR).
- Calculations:
  - Estimated Total = $\sum \text{expense.estimatedCostPaise}$
  - Actual Total = $\sum \text{expense.actualCostPaise}$
  - Remaining Budget = $\text{budgetLimitPaise} - \text{actualTotal}$
  - Overrun = $\max(0, \text{actualTotal} - \text{budgetLimitPaise})$

---

## 4. What-If Constraint-Aware Replanning Workflow

1. User proposes constraint changes (e.g. Budget -20%, Guest count +50, Event date moved earlier).
2. **Step 1 (Deterministic)**: The Domain Constraint Engine computes math deltas:
   - Identifies impossible task due dates (due date > new event date).
   - Identifies budget overruns and per-guest category changes (catering, venue capacity).
   - Flags non-negotiable / essential expenses versus optional items.
3. **Step 2 (AI Proposal)**: The AI Provider is queried with the exact diff context to produce creative trade-offs (e.g., swapping plated dinners for high-end food stations, adjusting venue floorplans).
4. **Step 3 (Validation & Review)**: Proposal passes strict Zod validation. The UI presents a side-by-side **Before vs After** comparison card with explicit trade-off explanations.
5. **Step 4 (Explicit User Approval)**: Changes are **never** silently applied. The user must review and click "Apply Approved Changes". User-confirmed actual costs and completed tasks are permanently preserved.
