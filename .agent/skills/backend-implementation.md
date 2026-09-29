# Backend Architecture & Implementation Skill

This skill defines the technical standards, folder structure, Prisma ORM patterns, and NestJS conventions for Upskill CRM Phase 2 backend services.

---

## 📌 Key Locations & Tech Stack

| Component | Technology | Path / Location |
|---|---|---|
| **Framework** | NestJS 11+ (TypeScript) | `backend/src/` |
| **ORM & DB** | Prisma ORM + PostgreSQL | `backend/prisma/schema.prisma` |
| **Seeder** | TypeScript Seed Script | `backend/prisma/seed.ts` |
| **Architecture Guide** | Master Backend Blueprint | `BACKEND_IMPLEMENTATION_GUIDE.md` |
| **System Plan** | Master Implementation Plan | `CRM_PLAN.md` |

---

## 🏛️ Core Design Principles

1. **Single-Tenant Enterprise Architecture**:
   - No multi-tenant company ID isolation. All operational data belongs to the parent GPS company.
2. **Strict 3-Tier Authority Hierarchy**:
   - `SUPER_ADMIN`: Root owner. Exclusive management of Admins (`/api/v1/admins`).
   - `ADMIN`: Operational management. Creates and manages Staff (`/api/v1/team/members`) and grants/revokes module permissions.
   - `STAFF`: Strict RBAC. Operates only on modules granted in their `permissions` JSON.
   - `CLIENT`: Customer portal access (`/api/v1/portal/*`).
3. **Streamlined Invoicing & Partial Payment Recalculation**:
   - When a payment is recorded against an invoice, atomically recalculate:
     - `paidAmount = SUM(payments.amount)`
     - `dueBalance = totalAmount - paidAmount`
     - `status = paidAmount >= totalAmount ? 'PAID' : paidAmount > 0 ? 'PARTIALLY_PAID' : 'UNPAID'`
4. **Centralized Brand & Payment Presets**:
   - Align backend defaults with `src/config/companyConfig.ts` (bKash Merchant, DBBL Bank, standard GPS hardware models).

---

## 📂 Backend Modular Folder Structure

```
backend/
├── prisma/
│   ├── schema.prisma              # Database entities (User, Lead, Client, Invoice, Payment, Task, Ticket)
│   └── seed.ts                    # Default Super Admin, Admin, and initial GPS hardware presets
├── src/
│   ├── common/
│   │   ├── decorators/            # @CurrentUser(), @Roles(), @RequirePermissions()
│   │   ├── guards/                # JwtAuthGuard, RolesGuard, PermissionsGuard
│   │   ├── filters/               # AllExceptionsFilter
│   │   └── interceptors/          # TransformResponseInterceptor
│   └── modules/
│       ├── auth/                  # JWT Access & Refresh token rotation
│       ├── admins/                # Super Admin exclusive Admin provisioning
│       ├── team/                  # Staff members & HR leaves/timesheets
│       ├── leads/                 # Lead pipeline & 1-click client conversion
│       ├── customers/             # Clients & authorized client users
│       ├── invoices/              # Line-item invoices & partial payment balance recalculator
│       ├── payments/              # Payment ledger & multi-channel receipts
│       ├── subscriptions/         # Monthly recurring GPS cloud tracking fees
│       ├── tasks/                 # Field technician installation & repair dispatch
│       ├── support/               # Technical support tickets & device RMA
│       ├── proposals/             # Quotations, proposal items & standardized proposal templates
│       ├── contracts/             # Service contracts, fleet AMCs & standardized contract templates
│       ├── projects/              # Fleet deployment rollouts & standardized installation templates
│       ├── reports/               # Aggregated analytics & cash flow queries
│       ├── dashboard/             # Live KPI metrics, calculation formulas & cron recalculator
│       └── portal/                # Authenticated customer self-service fleet portal
```

---

## 🔑 Verification & Quality Checklist

- [ ] All database queries utilize Prisma transactions (`prisma.$transaction`) for balance/inventory updates.
- [ ] Routes protected with `@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)`.
- [ ] Strict DTO validation with `class-validator` and `ValidationPipe({ whitelist: true })`.
- [ ] No hardcoded passwords; passwords hashed with `bcrypt` (salt rounds 12).
- [ ] Endpoints documented with Swagger annotations (`@ApiTags()`, `@ApiOperation()`).
- [ ] Dashboard KPI engine implements `/api/v1/dashboard/kpi-details/:metricId` with explicit formula metadata, cron schedules (`0 0 * * *` BST), and Redis cache invalidation on payment/lead mutations.
- [ ] Enforce Row-Level Security (RLS) in Dashboard and Analytics: Staff members (`role === 'STAFF'`) only see their personal revenue and assigned leads (`where: { salesRepId: user.id }`), whereas Super Admin and Admins receive enterprise-wide totals.
- [ ] Track User KPIs via `StaffTarget` and `StaffKpiSnapshot` entities: Quota achievement rate, lead conversion efficiency, average deal size, delinquent debt balance, and attendance compliance.
