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
   - *Note*: Customers/Clients are strictly commercial database records managed by internal staff; there is NO external client portal.
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
│       └── dashboard/             # Live KPI metrics, calculation formulas & cron recalculator
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

---

## 🔌 Frontend to Backend Local Integration Rule

1. **Frontend Base API URL**:
   - `c:/All Project/upskill_crm/.env`: `VITE_API_BASE_URL=http://localhost:5000/api/v1`
   - Read by `src/store/Api/BaseApi/BaseApi.ts` using `import.meta.env.VITE_API_BASE_URL`.
2. **CORS Requirement**:
   - NestJS `main.ts` must allow `http://localhost:5173` with `credentials: true`.
3. **Authorization Header**:
   - Redux automatically sends `Authorization: Bearer <token>` from `state.auth.user.accessToken`.

---

## 🗺️ 14-Step Feature-by-Feature Backend Implementation Roadmap

1. **Step 01 - Foundation Config**: Neon Postgres + Upstash Redis URL configuration & Prisma initialization.
2. **Step 02 - System Design Architecture**: Global Interceptors, Exception Filters, CORS & DTO Pipes.
3. **Step 03 - Auth & 3-Tier Dynamic RBAC Engine**: `/api/v1/auth/login`, Refresh Tokens, `@Roles()`, `@RequirePermissions()`.
4. **Step 04 - Super Admin Provisioning**: `/api/v1/admins` (Exclusive to `SUPER_ADMIN`).
5. **Step 05 - Staff Management & Dynamic RBAC**: `/api/v1/team/members` with checklist permission updater.
6. **Step 06 - HR Operations**: Leaves (`/api/v1/team/leaves`) & Timesheets (`/api/v1/team/timesheets`).
7. **Step 07 - Leads Pipeline**: 6-stage kanban + 1-click transactional conversion to Client.
8. **Step 08 - Customers & Client Users**: Commercial fleet records & contact directory.
9. **Step 09 - Invoices & Partial Payments Engine**: Atomic calculation of `paidAmount`, `dueBalance`, and status.
10. **Step 10 - Subscriptions**: Monthly recurring GPS cloud tracking subscriptions & automated renewals.
11. **Step 11 - Payments & Expenses**: Payment receipt ledger & hardware/SIM expenditure logs.
12. **Step 12 - Proposals, Contracts & Projects**: Deployment rollouts with standardized templates.
13. **Step 13 - Analytics & Dashboard with Redis**: KPI cache-aside, cron recalculator, and Row-Level Security.
14. **Step 14 - Production Deployment**: Render Web Service + Cheap Custom Subdomain (`api.yourdomain.com`).
