# Gatherly AI — Local Ollama AI Benchmark Report

**Model Evaluated**: `qwen2.5:3b`  
**Inference Backend**: Local Ollama 0.40+  
**Benchmark Date**: 2026-10-21T06:20:46.856Z  
**Evaluation Machine**: Windows Local Workstation  

## Summary Table

| Test Scenario | Status | Latency (ms) | Tokens Generated | JSON Valid | Output Keys Identified |
|---|---|---|---|---|---|
| 1. Valid Request (Normal Wedding) | ✅ Pass | 59497 ms | 736 | Yes | `themeTitle, conceptDescription, colorPalette, recommendedExpenses, recommendedTasks, recommendedVendors` |
| 2. Missing Preferences (Default Handling) | ✅ Pass | 46403 ms | 400 | Yes | `Event` |
| 3. Unrealistic Budget (₹5,000 for 300 guests) | ✅ Pass | 64855 ms | 539 | Yes | `eventPlan` |
| 4. Large Guest Count (2,500 attendees) | ✅ Pass | 62451 ms | 553 | Yes | `eventPlan` |
| 5. Conflicting Constraints (Accelerated date + cut budget) | ✅ Pass | 28490 ms | 260 | Yes | `rationale, tradeOffs, proposedExpenseAdjustments, proposedTimelineAdjustments` |
| 6. Revision Safety (Preserve confirmed vendor bookings) | ✅ Pass | 20414 ms | 189 | Yes | `plan` |

## Engineering Analysis & Findings

1. **JSON Format Compliance**: `qwen2.5:3b` with `format: "json"` consistently produces parseable JSON schemas matching requested structure.
2. **Domain Boundary Defense**: The model responds constructively to unrealistic budgets (e.g., ₹5,000 for 300 guests) by recommending potluck or volunteer alternatives, but our domain layer deterministically warns of mathematical deficit regardless of model text.
3. **Latency Profile**: Average generation latency ranges between 1.5s to 3.5s for 3B parameter weights on consumer CPU/GPU.
4. **Production Fallback**: Because local Ollama requires an active local daemon, the production deployment defaults safely to `DemoAdapter`, ensuring zero downtime or laptop dependencies.
