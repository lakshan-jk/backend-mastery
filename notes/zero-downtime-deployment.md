# Zero-Downtime Deployment (interview notes)

## What it is
Deploying new code WITHOUT users ever seeing an outage. Core idea:
> Never turn everything off at once. Keep the old version serving until the new one is proven
> healthy, then shift traffic. (Old + new coexist briefly during the switch.)

Why it matters: for e-commerce/revenue apps, **downtime = lost orders = lost revenue.**

---

## The 3 strategies
| Strategy | How | Rollback | Cost |
|---|---|---|---|
| **Rolling** | update a few instances at a time (K8s default) | slow-ish | cheap ✅ |
| **Blue-Green** | 2 environments; switch load balancer to the new one | instant ✅ | 2x infra |
| **Canary** | send small % of users to new first, then ramp up | early ✅ | complex |

## The supporting pieces (what makes it actually work)
- **Health / readiness checks** — traffic only goes to instances that are ready
- **Graceful shutdown / connection draining** — old instances finish in-flight requests before dying
- **Backward-compatible DB migrations (expand-contract)** — old + new code run together, so:
  add the new column -> deploy -> later remove the old one. NEVER rename/drop in one step.
- **Feature flags** — deploy code "off", enable later (decouple deploy from release)
- **Auto-rollback** — if health checks fail, roll back automatically

---

## ✅ Pros
1. No outage for users (critical for e-commerce = revenue)
2. Deploy anytime — no maintenance windows
3. Safer releases — canary/gradual rollout + instant rollback
4. Enables frequent deploys (ship many times a day)
5. Better UX — no lost sessions/orders

## ❌ Cons
1. More complexity (orchestration, health checks, LB config)
2. Old + new versions coexist -> everything must be backward-compatible (DB migrations = the hard part)
3. More infra / cost (blue-green ~2x resources)
4. Harder to debug (two versions live at once)
5. Requires discipline (health checks, graceful shutdown, migration strategy)

## 🛠️ How to AVOID the cons
| Con | Mitigation |
|---|---|
| Complexity | Use managed platforms (Kubernetes/ECS) — zero-downtime is their DEFAULT; don't hand-build it |
| Backward-compat / migrations | Expand-contract migrations + feature flags + API versioning (additive first, remove later) |
| 2x cost (blue-green) | Default to **rolling** (no extra env); reserve blue-green for when instant rollback is worth it |
| Hard debugging | Observability + tag logs/metrics/traces with the version/deploy ID |
| Needs discipline | Automate in CI/CD — health-check gates + auto-rollback so humans can't skip steps |

## When it's worth it vs not
- ✅ Worth it: e-commerce, payments, user-facing, high-traffic, revenue-critical
- ❌ Maybe overkill: internal tools, low traffic, can tolerate a 1-min restart

---

## For an AI service (e.g., VibeCheck) — two meanings
1. **Resilience** (app never crashes because of the AI): timeouts, graceful fallback, caching,
   health check, try/catch — a slow/failing model must NOT block the core app.
2. **Zero-downtime deploys**: rolling/blue-green + health checks (same as any service).

---

## Interview one-liners
- **What:** "Never take everything down at once — keep old serving until new is healthy, then shift traffic."
- **How:** "Rolling or blue-green, with health checks, graceful shutdown, and backward-compatible (expand-contract) DB migrations since old and new coexist."
- **Trade-off:** "It trades simplicity for availability — worth it for revenue-critical apps, maybe overkill for a low-traffic internal tool."
- **Mitigate cons:** "Rolling to avoid 2x cost, expand-contract + feature flags for compatibility, managed K8s for the orchestration, CI/CD auto-rollback for discipline, observability with version tags for debugging."

## Keywords
rolling · blue-green · canary · readiness/health check · graceful shutdown / connection draining ·
backward-compatible migration (expand-contract) · feature flags · auto-rollback · load balancer ·
Kubernetes rolling update · CI/CD · observability + version tags · downtime = lost revenue
