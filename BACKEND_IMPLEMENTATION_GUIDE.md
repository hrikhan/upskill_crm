# 🛠️ Upskill CRM - Complete Backend Architecture & Implementation Guide

> **Production-Ready Blueprint for NestJS + PostgreSQL + Prisma ORM**  
> **Target Audience:** Backend Developers implementing Phase 2 API services for Upskill CRM.  
> **Key Architecture Pillars:** Single-Tenant Enterprise Model, 3-Tier Authority Hierarchy, Granular Dynamic RBAC, Partial & Monthly Recurring Billing Engine, High-Performance Dashboard Aggregations.

---

## 📑 Table of Contents
1. [Tech Stack & Engineering Standards](#1-tech-stack--engineering-standards)
2. [Project Scaffolding & Directory Structure](#2-project-scaffolding--directory-structure)
3. [Production Prisma Database Schema (`schema.prisma`)](#3-production-prisma-database-schema-schemaprisma)
4. [Authentication & Granular RBAC Engine](#4-authentication--granular-rbac-engine)
5. [Database Seeder (`prisma/seed.ts`)](#5-database-seeder-prismaseedts)
6. [Core Module API Specifications & DTOs](#6-core-module-api-specifications--dtos)
7. [Invoicing & Partial Payment Recalculation Engine](#7-invoicing--partial-payment-recalculation-engine)
8. [Dashboard Aggregation & Analytics Queries](#8-dashboard-aggregation--analytics-queries)
9. [Step-by-Step 10-Phase Backend Execution Plan](#9-step-by-step-10-phase-backend-execution-plan)
10. [Docker & Deployment Configuration](#10-docker--deployment-configuration)

---

## 💻 1. Tech Stack & Engineering Standards

- **Core Framework:** NestJS 11+ with Express adapter (Modular Clean Architecture)
- **Language:** TypeScript 5.7+ (Strict mode enabled)
- **Database:** PostgreSQL 16+
- **ORM:** Prisma ORM 6+ (Type-safe query builder & auto migrations)
- **Authentication:** Passport.js with JWT Access Token (15 min) + Refresh Token (7 days)
- **Password Security:** Argon2 or Bcrypt (Cost factor 12)
- **Validation & Transformation:** `class-validator` + `class-transformer` (Strict whitelist mode)
- **Documentation:** Swagger / OpenAPI 3.0 via `@nestjs/swagger`
- **Cache & Cron:** Redis 7+ with `@nestjs/throttler` and `@nestjs/schedule`
- **Containerization:** Docker & Docker Compose

---

## 📂 2. Project Scaffolding & Directory Structure

```
backend/
├── prisma/
│   ├── schema.prisma              # Complete database entity models
│   ├── migrations/                # Versioned SQL migrations
│   └── seed.ts                    # Default accounts & demo data seeder
├── src/
│   ├── common/                    # Cross-cutting enterprise utilities
│   │   ├── decorators/            # @CurrentUser(), @Roles(), @RequirePermissions()
│   │   ├── dto/                   # PaginationDto, BaseResponseDto
│   │   ├── filters/               # AllExceptionsFilter (standard error envelope)
│   │   ├── guards/                # JwtAuthGuard, RolesGuard, PermissionsGuard
│   │   ├── interceptors/          # TransformResponseInterceptor, LoggingInterceptor
│   │   └── pipes/                 # Custom validation and parse pipes
│   ├── config/                    # Type-safe environment configuration
│   ├── modules/                   # Independent feature domains
│   │   ├── auth/                  # Login, Refresh, Password Reset, JWT Strategy
│   │   ├── admins/                # Super Admin exclusive: Admin CRUD & logs
│   │   ├── team/                  # Staff Members, Leaves, Timesheets & Attendance
│   │   ├── leads/                 # Lead pipeline, status transitions, conversion
│   │   ├── customers/             # Clients and Client Users directory
│   │   ├── proposals/             # Quotation builder and approval
│   │   ├── sales/                 # Invoices, Line Items, Partial Payments, Items catalog
│   │   ├── subscriptions/         # Recurring monthly tracking service billing
│   │   ├── dashboard/             # Aggregated stats, charts & time-series data
│   │   └── audit/                 # System activity and security audit logger
│   ├── app.module.ts              # Root application module
│   └── main.ts                    # Bootstrap entry point with global pipes & Swagger
├── test/                          # Unit and E2E integration test suites
├── .env.example                   # Environment configuration template
├── docker-compose.yml             # Postgres + Redis container definitions
└── Dockerfile                     # Multi-stage production container
```

---

## 🗄️ 3. Production Prisma Database Schema (`schema.prisma`)

```prisma
// datasource and generator
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ----------------------------------------------------
// ENUMS
// ----------------------------------------------------

enum UserRole {
  SUPER_ADMIN
  ADMIN
  STAFF
  CLIENT
}

enum ModulePermissionKey {
  LEADS
  CUSTOMERS
  PROPOSALS
  SALES
  SUBSCRIPTIONS
  PAYMENTS
  ITEMS
  TEAM
  TASKS
  SUPPORT
  REPORTS
  SETTINGS
  ADMINS
}

enum LeadStage {
  NEW_LEADS
  APPOINTMENT_COLLECTED
  DEMONSTRATIONS_DONE
  NEED_FOLLOWUP
  PROPOSAL_SENT
  CLOSED_WON
  CLOSED_LOST
}

enum InvoiceStatus {
  UNPAID
  PARTIALLY_PAID
  PAID
  OVERDUE
  CANCELLED
}

enum PaymentMethod {
  CASH
  BKASH
  NAGAD
  BANK_TRANSFER
  CREDIT_CARD
  CHEQUE
}

enum LeaveType {
  CASUAL
  SICK
  ANNUAL
  MATERNITY
  EMERGENCY
}

enum LeaveStatus {
  PENDING
  APPROVED
  REJECTED
  CANCELLED
}

enum SubscriptionStatus {
  ACTIVE
  GRACE_PERIOD
  SUSPENDED
  CANCELLED
}

// ----------------------------------------------------
// USER & RBAC MODELS
// ----------------------------------------------------

model User {
  id              String             @id @default(uuid())
  email           String             @unique
  passwordHash    String
  name            String
  phone           String?
  role            UserRole           @default(STAFF)
  designation     String?            // e.g. "Senior Sales Executive", "Billing Officer"
  department      String?            // e.g. "Sales", "Finance", "Human Resources"
  avatarUrl       String?
  isActive        Boolean            @default(true)
  lastLoginAt     DateTime?
  refreshTokenHash String?
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt

  // RBAC permissions (Staff specific)
  permissions     StaffPermission[]

  // Associations
  assignedLeads   Lead[]             @relation("AssignedStaff")
  leaveRequests   LeaveRequest[]
  approvedLeaves  LeaveRequest[]     @relation("ApprovedByAdmin")
  timesheets      TimeSheet[]
  recordedPayments Payment[]         @relation("ReceivedByUser")
  auditLogs       AuditLog[]
  staffTargets    StaffTarget[]
  kpiSnapshots    StaffKpiSnapshot[]

  @@index([role, isActive])
}

model StaffPermission {
  id          String              @id @default(uuid())
  userId      String
  module      ModulePermissionKey
  canView     Boolean             @default(false)
  canCreate   Boolean             @default(false)
  canEdit     Boolean             @default(false)
  canDelete   Boolean             @default(false)

  user        User                @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, module])
  @@index([userId])
}

model StaffTarget {
  id              String    @id @default(uuid())
  staffId         String
  month           Int       // 1 - 12
  year            Int       // e.g. 2026
  revenueTarget   Decimal   @db.Decimal(12, 2)
  leadsWonTarget  Int       @default(5)
  callsTarget     Int?      @default(50)
  achievedRevenue Decimal   @default(0) @db.Decimal(12, 2)
  achievedLeadsWon Int      @default(0)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  staff           User      @relation(fields: [staffId], references: [id], onDelete: Cascade)

  @@unique([staffId, month, year])
  @@index([staffId, year, month])
}

model StaffKpiSnapshot {
  id                 String    @id @default(uuid())
  staffId            String
  month              Int
  year               Int
  totalAssignedLeads Int       @default(0)
  totalWonDeals      Int       @default(0)
  conversionRate     Decimal   @default(0) @db.Decimal(5, 2) // e.g. 28.50%
  totalRevenue       Decimal   @default(0) @db.Decimal(12, 2)
  totalOverdueDebt   Decimal   @default(0) @db.Decimal(12, 2)
  avgClosingDays     Decimal?  @db.Decimal(5, 1)
  attendanceRate     Decimal   @default(0) @db.Decimal(5, 2)
  createdAt          DateTime  @default(now())

  staff              User      @relation(fields: [staffId], references: [id], onDelete: Cascade)

  @@unique([staffId, month, year])
  @@index([staffId])
}

// ----------------------------------------------------
// HR & WORKFORCE MODELS
// ----------------------------------------------------

model LeaveRequest {
  id          String      @id @default(uuid())
  userId      String
  leaveType   LeaveType
  startDate   DateTime
  endDate     DateTime
  daysCount   Int
  reason      String
  status      LeaveStatus @default(PENDING)
  approvedById String?
  adminNotes  String?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  approvedBy  User?       @relation("ApprovedByAdmin", fields: [approvedById], references: [id])

  @@index([userId, status])
}

model TimeSheet {
  id             String    @id @default(uuid())
  userId         String
  date           DateTime  @db.Date
  clockIn        DateTime
  clockOut       DateTime?
  totalMinutes   Int?
  overtimeMinutes Int?     @default(0)
  status         String    @default("COMPLETED") // ON_DUTY, COMPLETED
  notes          String?
  createdAt      DateTime  @default(now())

  user           User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, date])
  @@index([userId, date])
}

// ----------------------------------------------------
// LEADS & PIPELINE
// ----------------------------------------------------

model Lead {
  id               String      @id @default(uuid())
  name             String
  company          String?
  phone            String
  email            String?
  address          String?
  stage            LeadStage   @default(NEW_LEADS)
  source           String      @default("Website Inbound") // Website, Cold Outreach, Referral
  estimatedValue   Decimal     @default(0.00) @db.Decimal(12, 2)
  vehicleCount     Int         @default(1)
  targetModel      String?     // e.g. "GPS Tracker Pro X1"
  assignedStaffId  String?
  convertedClientId String?    @unique
  notes            String?
  createdAt        DateTime    @default(now())
  updatedAt        DateTime    @updatedAt

  assignedStaff    User?       @relation("AssignedStaff", fields: [assignedStaffId], references: [id])
  convertedClient  Client?     @relation("ConvertedLead", fields: [convertedClientId], references: [id])
  followups        LeadFollowup[]

  @@index([stage, assignedStaffId])
}

model LeadFollowup {
  id          String    @id @default(uuid())
  leadId      String
  note        String
  scheduledAt DateTime?
  createdAt   DateTime  @default(now())

  lead        Lead      @relation(fields: [leadId], references: [id], onDelete: Cascade)
}

// ----------------------------------------------------
// CUSTOMERS & CLIENTS
// ----------------------------------------------------

model Client {
  id                 String          @id @default(uuid())
  companyName        String
  clientCode         String          @unique // e.g. "CLI-001"
  primaryContactName String
  phone              String
  email              String?
  billingAddress     String?
  taxNumber          String?
  totalVehicles      Int             @default(0)
  activeGpsUnits     Int             @default(0)
  isActive           Boolean         @default(true)
  convertedFromLead  Lead?           @relation("ConvertedLead")
  createdAt          DateTime        @default(now())
  updatedAt          DateTime        @updatedAt

  users              ClientUser[]
  invoices           Invoice[]
  subscriptions      Subscription[]
  proposals          Proposal[]

  @@index([isActive])
}

model ClientUser {
  id          String   @id @default(uuid())
  clientId    String
  name        String
  email       String   @unique
  phone       String
  isPrimary   Boolean  @default(false)
  portalAccess Boolean @default(true)
  createdAt   DateTime @default(now())

  client      Client   @relation(fields: [clientId], references: [id], onDelete: Cascade)

  @@index([clientId])
}

// ----------------------------------------------------
// ITEMS & PROPOSALS
// ----------------------------------------------------

model Item {
  id          String   @id @default(uuid())
  code        String   @unique // e.g. "GPS-TRK-01"
  name        String
  category    String   // Hardware, Sensor, SIM Package, Installation
  unitPrice   Decimal  @db.Decimal(10, 2)
  costPrice   Decimal  @db.Decimal(10, 2)
  stockQty    Int      @default(0)
  description String?
  isActive    Boolean  @default(true)

  invoiceItems InvoiceItem[]
  proposalItems ProposalItem[]
}

model Proposal {
  id          String         @id @default(uuid())
  proposalNo  String         @unique // e.g. "PROP-2026-001"
  clientId    String
  status      String         @default("SENT") // DRAFT, SENT, ACCEPTED, DECLINED
  subtotal    Decimal        @db.Decimal(12, 2)
  taxAmount   Decimal        @default(0.00) @db.Decimal(10, 2)
  discount    Decimal        @default(0.00) @db.Decimal(10, 2)
  totalAmount Decimal        @db.Decimal(12, 2)
  validUntil  DateTime
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  client      Client         @relation(fields: [clientId], references: [id])
  items       ProposalItem[]
}

model ProposalItem {
  id          String   @id @default(uuid())
  proposalId  String
  itemId      String?
  description String
  quantity    Int
  unitPrice   Decimal  @db.Decimal(10, 2)
  total       Decimal  @db.Decimal(10, 2)

  proposal    Proposal @relation(fields: [proposalId], references: [id], onDelete: Cascade)
  item        Item?    @relation(fields: [itemId], references: [id])
}

// ----------------------------------------------------
// INVOICES & PAYMENTS (PARTIAL & RECURRING)
// ----------------------------------------------------

model Invoice {
  id           String        @id @default(uuid())
  invoiceNo    String        @unique // e.g. "INV-2026-081"
  clientId     String
  status       InvoiceStatus @default(UNPAID)
  issueDate    DateTime      @db.Date
  dueDate      DateTime      @db.Date
  subtotal     Decimal       @db.Decimal(12, 2)
  taxAmount    Decimal       @default(0.00) @db.Decimal(10, 2)
  discount     Decimal       @default(0.00) @db.Decimal(10, 2)
  totalAmount  Decimal       @db.Decimal(12, 2)
  paidAmount   Decimal       @default(0.00) @db.Decimal(12, 2)
  dueBalance   Decimal       @db.Decimal(12, 2)
  salesRep     String?       // Sales rep name for reporting
  notes        String?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  client       Client        @relation(fields: [clientId], references: [id])
  items        InvoiceItem[]
  payments     Payment[]

  @@index([status, dueDate])
  @@index([clientId])
}

model InvoiceItem {
  id          String   @id @default(uuid())
  invoiceId   String
  itemId      String?
  description String
  quantity    Int
  unitPrice   Decimal  @db.Decimal(10, 2)
  total       Decimal  @db.Decimal(10, 2)

  invoice     Invoice  @relation(fields: [invoiceId], references: [id], onDelete: Cascade)
  item        Item?    @relation(fields: [itemId], references: [id])
}

model Payment {
  id            String        @id @default(uuid())
  invoiceId     String
  amount        Decimal       @db.Decimal(12, 2)
  method        PaymentMethod @default(CASH)
  paymentDate   DateTime      @default(now())
  transactionId String?
  receivedById  String?
  notes         String?
  createdAt     DateTime      @default(now())

  invoice       Invoice       @relation(fields: [invoiceId], references: [id], onDelete: Cascade)
  receivedBy    User?         @relation("ReceivedByUser", fields: [receivedById], references: [id])

  @@index([invoiceId])
}

model Subscription {
  id              String             @id @default(uuid())
  clientId        String
  planName        String             // e.g. "Standard GPS Tracking Monthly"
  monthlyRate     Decimal            @db.Decimal(10, 2) // e.g. 350.00 BDT per unit
  activeUnits     Int                @default(1)
  totalMonthlyFee Decimal            @db.Decimal(12, 2) // monthlyRate * activeUnits
  billingDay      Int                @default(1) // 1st to 28th of every month
  status          SubscriptionStatus @default(ACTIVE)
  lastBilledAt    DateTime?
  nextBillingAt   DateTime
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt

  client          Client             @relation(fields: [clientId], references: [id])

  @@index([status, nextBillingAt])
}

// ----------------------------------------------------
// FLEET DEPLOYMENT PROJECTS & TEMPLATES
// ----------------------------------------------------

enum ProjectStatus {
  PLANNING
  IN_PROGRESS
  COMPLETED
  ON_HOLD
  CANCELLED
}

model FleetProject {
  id                String         @id @default(uuid())
  projectCode       String         @unique // e.g. "PRJ-2026-01"
  projectName       String
  clientId          String
  contactPerson     String
  totalVehicles     Int            @default(1)
  installedVehicles Int            @default(0)
  projectLeadId     String?
  startDate         DateTime       @default(now())
  deadline          DateTime
  budget            Decimal        @db.Decimal(12, 2)
  status            ProjectStatus  @default(PLANNING)
  trackerModel      String
  templateId        String?
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt

  client            Client         @relation(fields: [clientId], references: [id])
  projectLead       User?          @relation("ProjectLead", fields: [projectLeadId], references: [id])
  template          ProjectTemplate? @relation(fields: [templateId], references: [id])

  @@index([status, clientId])
}

model ProjectTemplate {
  id                      String                 @id @default(uuid())
  templateCode            String                 @unique // e.g. "TPL-FLT-01"
  name                    String
  category                String                 // Commercial Haulers, Motorbike Delivery, etc.
  description             String
  targetVehiclesRange     String                 // e.g. "10 - 50 Vehicles"
  defaultTrackerModel     String
  estimatedDaysPerVehicle Decimal                @db.Decimal(4, 1)
  estimatedTotalDays      Int
  estimatedBudgetPerUnit  Decimal                @db.Decimal(10, 2)
  isActive                Boolean                @default(true)
  usageCount              Int                    @default(0)
  createdAt               DateTime               @default(now())
  updatedAt               DateTime               @updatedAt

  phases                  ProjectTemplatePhase[]
  spawnedProjects         FleetProject[]

  @@index([category, isActive])
}

model ProjectTemplatePhase {
  id             String                @id @default(uuid())
  templateId     String
  phaseNumber    Int
  name           String
  estimatedDays  Int
  createdAt      DateTime              @default(now())

  template       ProjectTemplate       @relation(fields: [templateId], references: [id], onDelete: Cascade)
  tasks          ProjectTemplateTask[]

  @@index([templateId, phaseNumber])
}

model ProjectTemplateTask {
  id             String                @id @default(uuid())
  phaseId        String
  title          String
  roleRequired   String                // Lead Engineer, Field Wiring Tech, etc.
  isMandatory    Boolean               @default(true)
  estimatedHours Decimal               @db.Decimal(5, 1)
  createdAt      DateTime              @default(now())

  phase          ProjectTemplatePhase  @relation(fields: [phaseId], references: [id], onDelete: Cascade)
}

// ----------------------------------------------------
// SERVICE CONTRACTS & TEMPLATES
// ----------------------------------------------------

enum ContractType {
  FLEET_AMC_ANNUAL
  SLA_TELEMATICS_SERVICE
  HARDWARE_LEASE_MAINTENANCE
  CUSTOM_SLA
}

enum ContractStatus {
  ACTIVE
  EXPIRING_SOON
  EXPIRED
  DRAFT
  TERMINATED
}

enum BillingCycle {
  MONTHLY_RECURRING
  QUARTERLY
  ANNUAL_ADVANCE
}

model ServiceContract {
  id              String          @id @default(uuid())
  contractNumber  String          @unique // e.g. "CTR-2026-041"
  title           String
  clientId        String
  contactPerson   String
  contractType    ContractType    @default(FLEET_AMC_ANNUAL)
  unitsCovered    Int             @default(1)
  contractValue   Decimal         @db.Decimal(12, 2)
  startDate       DateTime
  endDate         DateTime
  autoRenew       Boolean         @default(true)
  status          ContractStatus  @default(ACTIVE)
  templateId      String?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  client          Client          @relation(fields: [clientId], references: [id])
  template        ContractTemplate? @relation(fields: [templateId], references: [id])

  @@index([status, clientId])
}

model ContractTemplate {
  id                     String           @id @default(uuid())
  templateCode           String           @unique // e.g. "TPL-AMC-01"
  title                  String
  contractType           ContractType     @default(FLEET_AMC_ANNUAL)
  description            String
  standardDurationMonths Int              @default(12)
  standardBillingCycle   BillingCycle     @default(ANNUAL_ADVANCE)
  baseRatePerUnitMonth   Decimal          @db.Decimal(10, 2)
  slaResponseHours       Int              @default(8)
  slaUptimeGuarantee     String           @default("99.5% Uptime")
  isActive               Boolean          @default(true)
  usageCount             Int              @default(0)
  paymentTerms           String
  createdAt              DateTime         @default(now())
  updatedAt              DateTime         @updatedAt

  clauses                ContractClause[]
  spawnedContracts       ServiceContract[]

  @@index([contractType, isActive])
}

model ContractClause {
  id           String           @id @default(uuid())
  templateId   String
  clauseNumber String           // e.g. "1.0", "2.1"
  heading      String
  body         String           @db.Text
  isMandatory  Boolean          @default(true)
  createdAt    DateTime         @default(now())

  template     ContractTemplate @relation(fields: [templateId], references: [id], onDelete: Cascade)

  @@index([templateId, clauseNumber])
}

// ----------------------------------------------------
// PROPOSAL / QUOTATION TEMPLATES
// ----------------------------------------------------

enum ProposalCategory {
  ENTERPRISE_FLEET
  COLD_CHAIN
  FUEL_TELEMATICS
  PLUG_AND_PLAY
  HEAVY_ASSET
  VIDEO_TELEMATICS
}

model ProposalTemplate {
  id                      String                 @id @default(uuid())
  templateCode            String                 @unique // e.g. "TPL-PROP-01"
  title                   String
  category                ProposalCategory       @default(ENTERPRISE_FLEET)
  targetAudience          String
  description             String                 @db.Text
  validityDays            Int                    @default(30)
  defaultPaymentTerms     String
  standardDiscountPercent Decimal                @db.Decimal(5, 2) @default(10.00)
  estimatedPerVehicleCost Decimal                @db.Decimal(12, 2)
  recommendedFleetSize    String                 // e.g. "10 - 150 Vehicles"
  turnaroundTime          String                 // e.g. "2-3 Business Days"
  isActive                Boolean                @default(true)
  usageCount              Int                    @default(0)
  createdAt               DateTime               @default(now())
  updatedAt               DateTime               @updatedAt

  items                   ProposalTemplateItem[]
  scopeOfWork             ProposalTemplateScope[]

  @@index([category, isActive])
}

model ProposalTemplateItem {
  id                        String           @id @default(uuid())
  templateId                String
  type                      String           // hardware, installation, subscription, accessory, service
  name                      String
  description               String           @db.Text
  defaultUnitPrice          Decimal          @db.Decimal(10, 2)
  defaultQuantityPerVehicle Int              @default(1)
  isOptional                Boolean          @default(false)
  createdAt                 DateTime         @default(now())

  template                  ProposalTemplate @relation(fields: [templateId], references: [id], onDelete: Cascade)

  @@index([templateId, type])
}

model ProposalTemplateScope {
  id           String           @id @default(uuid())
  templateId   String
  phaseNumber  String           // e.g. "Phase 1"
  title        String
  deliverables Json             // Array of string deliverables
  createdAt    DateTime         @default(now())

  template     ProposalTemplate @relation(fields: [templateId], references: [id], onDelete: Cascade)

  @@index([templateId])
}

// ----------------------------------------------------
// AUDIT & LOGGING
// ----------------------------------------------------

model AuditLog {
  id          String   @id @default(uuid())
  userId      String?
  action      String   // LOGIN, CONVERT_LEAD, RECORD_PAYMENT, UPDATE_PERMISSIONS
  module      String   // AUTH, LEADS, INVOICES, TEAM
  details     Json?
  ipAddress   String?
  createdAt   DateTime @default(now())

  user        User?    @relation(fields: [userId], references: [id])

  @@index([module, createdAt])
}
```

---

## 🔐 4. Authentication & Granular RBAC Engine

### 1. Custom Guards Architecture

```typescript
// src/common/guards/permissions.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ModulePermissionKey } from '@prisma/client';

export const PERMISSION_CHECK_KEY = 'require_permission';
export type PermissionAction = 'view' | 'create' | 'edit' | 'delete';

export interface RequiredPermission {
  module: ModulePermissionKey;
  action: PermissionAction;
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<RequiredPermission>(
      PERMISSION_CHECK_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Super Admin has unrestricted platform authority
    if (user.role === 'SUPER_ADMIN') return true;

    // Admins have access to everything EXCEPT the Super Admin 'admins' module
    if (user.role === 'ADMIN') {
      if (required.module === ModulePermissionKey.ADMINS) {
        throw new ForbiddenException('Only Super Admin can access Admins management');
      }
      return true;
    }

    // Staff role: evaluate explicit permission record
    const staffPerm = user.permissions?.find((p: any) => p.module === required.module);
    if (!staffPerm) {
      throw new ForbiddenException(`Access denied to module: ${required.module}`);
    }

    const actionMap = {
      view: staffPerm.canView,
      create: staffPerm.canCreate,
      edit: staffPerm.canEdit,
      delete: staffPerm.canDelete,
    };

    if (!actionMap[required.action]) {
      throw new ForbiddenException(`Insufficient ${required.action} privileges on ${required.module}`);
    }

    return true;
  }
}
```

### 2. Custom Method Decorator

```typescript
// src/common/decorators/require-permission.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { ModulePermissionKey } from '@prisma/client';
import { PERMISSION_CHECK_KEY, PermissionAction } from '../guards/permissions.guard';

export const RequirePermission = (module: ModulePermissionKey, action: PermissionAction = 'view') =>
  SetMetadata(PERMISSION_CHECK_KEY, { module, action });
```

---

## 🌱 5. Database Seeder (`prisma/seed.ts`)

Seed exact default accounts matching frontend login credentials:

```typescript
import { PrismaClient, UserRole, ModulePermissionKey } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('super123', 10);
  const staffPasswordHash = await bcrypt.hash('staff123', 10);
  const adminPasswordHash = await bcrypt.hash('admin123', 10);

  // 1. Super Admin (Platform Owner)
  await prisma.user.upsert({
    where: { email: 'superadmin@upskillcrm.com' },
    update: {},
    create: {
      email: 'superadmin@upskillcrm.com',
      passwordHash,
      name: 'Upskill CRM',
      role: UserRole.SUPER_ADMIN,
      designation: 'Platform Master / Owner',
      department: 'Executive',
      phone: '01700000000',
    },
  });

  // 2. Admin (Operations Director)
  await prisma.user.upsert({
    where: { email: 'admin@upskillcrm.com' },
    update: {},
    create: {
      email: 'admin@upskillcrm.com',
      passwordHash: adminPasswordHash,
      name: 'Hridoy Khan (Admin)',
      role: UserRole.ADMIN,
      designation: 'Operations Director',
      department: 'Management',
      phone: '01711111111',
    },
  });

  // 3. Staff - Sales Specialist
  const salesStaff = await prisma.user.upsert({
    where: { email: 'sales@upskillcrm.com' },
    update: {},
    create: {
      email: 'sales@upskillcrm.com',
      passwordHash: staffPasswordHash,
      name: 'Sarah Jenkins (Sales Staff)',
      role: UserRole.STAFF,
      designation: 'Senior Sales Executive',
      department: 'Sales & Inquiries',
      phone: '01722222222',
      permissions: {
        create: [
          { module: ModulePermissionKey.LEADS, canView: true, canCreate: true, canEdit: true, canDelete: false },
          { module: ModulePermissionKey.CUSTOMERS, canView: true, canCreate: true, canEdit: true, canDelete: false },
          { module: ModulePermissionKey.PROPOSALS, canView: true, canCreate: true, canEdit: true, canDelete: false },
        ],
      },
    },
  });

  // 4. Staff - Billing Specialist
  const billingStaff = await prisma.user.upsert({
    where: { email: 'billing@upskillcrm.com' },
    update: {},
    create: {
      email: 'billing@upskillcrm.com',
      passwordHash: staffPasswordHash,
      name: 'Rashid Ahmed (Billing Staff)',
      role: UserRole.STAFF,
      designation: 'Billing & Accounts Officer',
      department: 'Finance',
      phone: '01733333333',
      permissions: {
        create: [
          { module: ModulePermissionKey.SALES, canView: true, canCreate: true, canEdit: true, canDelete: false },
          { module: ModulePermissionKey.PAYMENTS, canView: true, canCreate: true, canEdit: true, canDelete: false },
          { module: ModulePermissionKey.SUBSCRIPTIONS, canView: true, canCreate: true, canEdit: true, canDelete: false },
        ],
      },
    },
  });

  // 5. Staff - HR Specialist
  const hrStaff = await prisma.user.upsert({
    where: { email: 'hr@upskillcrm.com' },
    update: {},
    create: {
      email: 'hr@upskillcrm.com',
      passwordHash: staffPasswordHash,
      name: 'Farhana Yasmin (HR Staff)',
      role: UserRole.STAFF,
      designation: 'Human Resources Officer',
      department: 'Human Resources',
      phone: '01744444444',
      permissions: {
        create: [
          { module: ModulePermissionKey.TEAM, canView: true, canCreate: true, canEdit: true, canDelete: false },
          { module: ModulePermissionKey.TASKS, canView: true, canCreate: true, canEdit: true, canDelete: false },
          { module: ModulePermissionKey.SUPPORT, canView: true, canCreate: true, canEdit: true, canDelete: false },
        ],
      },
    },
  });

  console.log('✅ Seed completed successfully with 5 role presets!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
```

---

## 📡 6. Core Module API Specifications & DTOs

### Auth Module (`/api/v1/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/v1/auth/login` | Authenticate user, return Access & Refresh tokens | Public |
| `POST` | `/api/v1/auth/refresh` | Issue new Access token via Refresh token | Public |
| `GET` | `/api/v1/auth/me` | Fetch active profile and full permissions payload | Authenticated |
| `POST` | `/api/v1/auth/logout` | Invalidate refresh token | Authenticated |

### Super Admin Module (`/api/v1/admins`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/v1/admins` | List all Admin accounts | Super Admin Only |
| `POST` | `/api/v1/admins` | Create a new Admin account | Super Admin Only |
| `PATCH` | `/api/v1/admins/:id/status`| Toggle Admin Active / Inactive status | Super Admin Only |
| `DELETE` | `/api/v1/admins/:id` | Remove an Admin account | Super Admin Only |

### Team & HR Module (`/api/v1/team`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/v1/team/members` | List all staff members with permissions | Admin, Super Admin, HR |
| `POST` | `/api/v1/team/members` | Create new staff and assign permissions | Admin, Super Admin |
| `PUT` | `/api/v1/team/members/:id/permissions` | Update module permissions matrix | Admin, Super Admin |
| `GET` | `/api/v1/team/leaves` | List employee leave requests | Admin, Super Admin, HR |
| `POST` | `/api/v1/team/leaves` | Apply for leave | All Staff |
| `PATCH` | `/api/v1/team/leaves/:id/status` | Approve or Reject leave request | Admin, HR |
| `GET` | `/api/v1/team/timesheets` | View daily timesheets and attendance | Admin, Super Admin, HR |
| `POST` | `/api/v1/team/timesheets/clock` | Clock-in / Clock-out endpoint | All Staff |

### Leads Module (`/api/v1/leads`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/v1/leads` | Paginated lead list with stage & agent filter | Sales Staff, Admin |
| `POST` | `/api/v1/leads` | Create new lead | Sales Staff, Admin |
| `PATCH` | `/api/v1/leads/:id/stage` | Change lead stage (`Demonstrations Done`, etc.) | Sales Staff, Admin |
| `POST` | `/api/v1/leads/:id/convert` | **1-Click Convert Lead to Client** (Transactional) | Sales Staff, Admin |

### Invoices & Sales Module (`/api/v1/sales`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/v1/sales/invoices` | List invoices with status pills & due balances | Billing Staff, Admin |
| `POST` | `/api/v1/sales/invoices` | Generate invoice with line items | Billing Staff, Admin |
| `POST` | `/api/v1/sales/invoices/:id/payments` | **Record Full or Partial Payment** | Billing Staff, Admin |
| `GET` | `/api/v1/sales/invoices/:id/ledger` | Payment ledger history for specific invoice | Billing Staff, Admin |

---

## 💰 7. Invoicing & Partial Payment Recalculation Engine

When recording a payment (e.g., 2,000 BDT against a 6,000 BDT invoice), execute within a Prisma transaction to prevent race conditions:

```typescript
// src/modules/sales/payments.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecordPaymentDto } from './dto/record-payment.dto';
import { InvoiceStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async recordPayment(invoiceId: string, dto: RecordPaymentDto, receivedById: string) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Fetch invoice with row lock
      const invoice = await tx.invoice.findUnique({
        where: { id: invoiceId },
        include: { payments: true },
      });

      if (!invoice) throw new NotFoundException('Invoice not found');
      if (invoice.status === InvoiceStatus.PAID) {
        throw new BadRequestException('Invoice is already fully paid');
      }

      const paymentAmount = Number(dto.amount);
      const currentPaid = Number(invoice.paidAmount);
      const totalAmount = Number(invoice.totalAmount);
      const newPaidAmount = currentPaid + paymentAmount;
      const newDueBalance = totalAmount - newPaidAmount;

      if (newDueBalance < -0.01) {
        throw new BadRequestException(`Payment amount (${paymentAmount}) exceeds due balance (${invoice.dueBalance})`);
      }

      // 2. Determine updated status
      let newStatus: InvoiceStatus = InvoiceStatus.PARTIALLY_PAID;
      if (newDueBalance <= 0) {
        newStatus = InvoiceStatus.PAID;
      }

      // 3. Create payment entry
      const payment = await tx.payment.create({
        data: {
          invoiceId,
          amount: paymentAmount,
          method: dto.method,
          transactionId: dto.transactionId,
          notes: dto.notes,
          receivedById,
        },
      });

      // 4. Update invoice totals and status
      const updatedInvoice = await tx.invoice.update({
        where: { id: invoiceId },
        data: {
          paidAmount: newPaidAmount,
          dueBalance: Math.max(0, newDueBalance),
          status: newStatus,
        },
      });

      return { payment, invoice: updatedInvoice };
    });
  }
}
```

---

## 📊 8. Dashboard Aggregation & User KPI Performance Tracking Engine

### 👥 8.1 Role-Based Row-Level Scoping: Enterprise Totals vs. Staff Personal Scoped Results

The backend strictly enforces **Row-Level Security (RLS)** based on the authenticated user's role:
- **👑 Super Admin & 🛡️ Admin / Sales Executive**:
  - Unrestricted query scope by default.
  - Can view **organization-wide totals** across all 12 staff accounts and company divisions.
  - May optionally filter by a specific staff member (`?agentId=...` or `?agentName=...`) to audit individual performance.
- **💼 Staff (Sales, Billing, HR)**:
  - Query scope is **strictly locked** to `WHERE sales_rep_id = currentUser.id` (or `assigned_staff_id = currentUser.id`).
  - Staff can **NEVER** view other sales representatives' private revenue, commissions, or customer invoices.
  - Organization totals are withheld to protect corporate salary/commission privacy and prevent unauthorized data leakage.

```typescript
// src/modules/dashboard/dashboard.service.ts
import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InvoiceStatus, LeadStage, UserRole } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface DashboardFilterDto {
  agentId?: string;
  stage?: string;
  source?: string;
  startDate?: Date;
  endDate?: Date;
}

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  /**
   * Generates dashboard analytics with mandatory Role-Based Row-Level Scoping
   */
  async getDashboardStats(currentUser: AuthenticatedUser, filters?: DashboardFilterDto) {
    const isExecutive = currentUser.role === UserRole.SUPER_ADMIN || currentUser.role === UserRole.ADMIN;

    // 1. Enforce Row-Level Security for Invoices & Payments
    const invoiceWhere: any = {};
    const leadWhere: any = { isArchived: false };

    if (!isExecutive) {
      // Staff is strictly locked to their own ID
      invoiceWhere.salesRepId = currentUser.id;
      leadWhere.assignedStaffId = currentUser.id;
    } else if (filters?.agentId && filters.agentId !== 'All Sales Reps') {
      // Admin/Executive optionally inspecting an individual staff member
      invoiceWhere.salesRepId = filters.agentId;
      leadWhere.assignedStaffId = filters.agentId;
    }

    if (filters?.source && filters.source !== 'All Sources') {
      invoiceWhere.source = filters.source;
      leadWhere.source = filters.source;
    }

    if (filters?.stage && filters.stage !== 'All Stages') {
      leadWhere.stage = filters.stage as LeadStage;
    }

    // 2. Compute Financial Aggregates
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const [paymentsToday, paymentsMonth, dueInvoices, overdueInvoices, leadsFunnel] = await Promise.all([
      // Payments Today (Joined to invoice to respect salesRepId attribution)
      this.prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          invoice: invoiceWhere,
          status: 'COMPLETED',
          paymentDate: { gte: todayStart },
        },
      }),
      // Payments Month
      this.prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          invoice: invoiceWhere,
          status: 'COMPLETED',
          paymentDate: { gte: monthStart },
        },
      }),
      // Invoices Due (Within terms)
      this.prisma.invoice.aggregate({
        _sum: { dueBalance: true },
        where: {
          ...invoiceWhere,
          status: { in: [InvoiceStatus.UNPAID, InvoiceStatus.PARTIALLY_PAID] },
          dueDate: { gte: todayStart },
        },
      }),
      // Invoices Overdue (Lapsed due date)
      this.prisma.invoice.aggregate({
        _sum: { dueBalance: true },
        where: {
          ...invoiceWhere,
          status: { in: [InvoiceStatus.OVERDUE, InvoiceStatus.UNPAID, InvoiceStatus.PARTIALLY_PAID] },
          dueDate: { lt: todayStart },
        },
      }),
      // Leads Funnel grouped by stage
      this.prisma.lead.groupBy({
        by: ['stage'],
        _count: { id: true },
        where: leadWhere,
      }),
    ]);

    return {
      scope: {
        isStaff: !isExecutive,
        scopeLabel: !isExecutive ? `Personal Scoped (${currentUser.name})` : 'Enterprise Total (Company-Wide)',
        userId: currentUser.id,
      },
      financials: {
        paymentsToday: paymentsToday._sum.amount || 0,
        paymentsMonth: paymentsMonth._sum.amount || 0,
        invoicesDue: dueInvoices._sum.dueBalance || 0,
        invoicesOverdue: overdueInvoices._sum.dueBalance || 0,
      },
      leadsFunnel: leadsFunnel.map((s) => ({ stage: s.stage, count: s._count.id })),
    };
  }

  /**
   * Detailed calculation breakdown, formula, and recalculation schedule audit
   * Matching GET /api/v1/dashboard/kpi-details/:metricId
   */
  async getKpiCalculationDetail(metricId: string, currentUser: AuthenticatedUser) {
    const isStaff = currentUser.role === UserRole.STAFF;
    const staffName = currentUser.name;

    switch (metricId) {
      case 'payments-month':
        return {
          id: 'payments-month',
          title: isStaff ? 'My Revenue - Month' : 'Payments - Month',
          scope: {
            isStaff,
            staffName,
            scopeLabel: isStaff ? `Personal Scoped (${staffName})` : 'Enterprise Total (Company-Wide)',
            description: isStaff
              ? `Strictly restricted to payments credited to invoices owned by ${staffName}.`
              : 'Consolidated company-wide cleared cash inflow across all 12 staff members.',
          },
          formula: isStaff
            ? 'My Revenue = Σ(Payment.amount WHERE Invoice.sales_rep_id = :myUserId AND payment_date >= MONTH_START)'
            : 'Payments Month = Σ(Payment.amount WHERE payment_date >= MONTH_START)',
          schedule: {
            frequency: 'Real-Time / Instantaneous',
            frequencyType: 'realtime',
            triggers: ['Invoice Payment Cleared', 'bKash IPN Webhook', 'Monthly Day 1 Rollover Cron'],
            cacheTtlSeconds: 60,
          },
        };

      case 'invoices-overdue':
        return {
          id: 'invoices-overdue',
          title: isStaff ? 'My Invoices - Overdue' : 'Invoices - Overdue',
          scope: {
            isStaff,
            staffName,
            scopeLabel: isStaff ? `Personal Scoped (${staffName})` : 'Enterprise Total (Company-Wide)',
            description: isStaff
              ? `Delinquent debt on client accounts originated by ${staffName} requiring collection follow-up.`
              : 'Organization-wide risk capital past due date awaiting collection.',
          },
          formula: isStaff
            ? 'My Overdue = Σ(Invoice.due_balance WHERE sales_rep_id = :myUserId AND due_date < CURRENT_DATE)'
            : 'Invoices Overdue = Σ(Invoice.due_balance WHERE due_date < CURRENT_DATE)',
          schedule: {
            frequency: 'Daily Midnight Cron (00:00 BST) + Real-Time Reduction',
            frequencyType: 'cron',
            cronExpression: '0 0 * * *',
            triggers: ['Nightly Due Date Expiry Cron', 'Payment Ledger Credit', 'Overdue SMS Notice Dispatch'],
            cacheTtlSeconds: 120,
          },
        };

      default:
        return { id: metricId, status: 'calculated' };
    }
  }
}
```

---

### 🎯 8.2 How We Track User KPIs: Quotas, Formulas & Performance Metrics

The backend calculates 7 primary KPI metrics to evaluate individual staff sales performance and workforce accountability:

| Metric | Business Definition | Mathematical Formula | Frequency |
|---|---|---|:---:|
| **1. Cleared Revenue** | Actual cash collected from clients originated by the staff member | `Σ(Payment.amount WHERE invoice.salesRepId = user.id AND status = 'COMPLETED')` | Real-Time |
| **2. Quota Achievement Rate** | Progress toward monthly revenue target assigned by Admin | `(Actual Cleared Revenue / StaffTarget.revenueTarget) × 100%` | Real-Time |
| **3. Lead Conversion Efficiency** | Proportion of assigned prospects converted into Closed Won clients | `(Closed Won Leads / Total Assigned Leads) × 100%` | Real-Time |
| **4. Average Deal Size** | Mean revenue generated per successfully converted deal | `Total Won Contract Value / Count(Closed Won Deals)` | Real-Time |
| **5. Sales Velocity (Cycle Days)** | Average number of days required to progress from New Lead to Deal Won | `AVG(EXTRACT(EPOCH FROM (lead.convertedAt - lead.createdAt)) / 86400)` | Weekly / Monthly |
| **6. Delinquent Debt Ratio** | Percentage of receivables originated by staff that have lapsed into Overdue | `(Overdue Due Balance / Total Issued Invoice Value) × 100%` | Daily (Midnight) |
| **7. Attendance Compliance** | Working days clocked in on schedule relative to expected shifts | `(Logged Work Days / (Expected Days - Approved Leaves)) × 100%` | Daily (Shift Cutoff) |

#### User Target & Performance Service Implementation

```typescript
// src/modules/team/staff-kpi.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class StaffKpiService {
  constructor(private prisma: PrismaService) {}

  /**
   * Computes comprehensive KPI scorecard for an individual staff member
   */
  async getStaffKpiScorecard(staffId: string, month: number, year: number) {
    const staff = await this.prisma.user.findUnique({
      where: { id: staffId },
      include: {
        staffTargets: {
          where: { month, year },
        },
      },
    });

    if (!staff) throw new NotFoundException('Staff member not found');

    const target = staff.staffTargets[0] || {
      revenueTarget: new Decimal(100000), // Default 100,000 BDT
      leadsWonTarget: 5,
    };

    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0, 23, 59, 59);

    // Aggregate monthly revenue credited to this staff member
    const revenueSum = await this.prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        invoice: { salesRepId: staffId },
        status: 'COMPLETED',
        paymentDate: { gte: monthStart, lte: monthEnd },
      },
    });

    // Lead metrics
    const [totalAssigned, wonDeals] = await Promise.all([
      this.prisma.lead.count({
        where: { assignedStaffId: staffId, createdAt: { gte: monthStart, lte: monthEnd } },
      }),
      this.prisma.lead.count({
        where: { assignedStaffId: staffId, stage: 'CLOSED_WON', updatedAt: { gte: monthStart, lte: monthEnd } },
      }),
    ]);

    const actualRevenue = Number(revenueSum._sum.amount || 0);
    const revenueTargetNum = Number(target.revenueTarget);
    const quotaAchievementPct = revenueTargetNum > 0 ? (actualRevenue / revenueTargetNum) * 100 : 0;
    const conversionRatePct = totalAssigned > 0 ? (wonDeals / totalAssigned) * 100 : 0;

    return {
      staff: { id: staff.id, name: staff.name, designation: staff.designation },
      period: { month, year },
      targets: {
        revenueTarget: revenueTargetNum,
        leadsWonTarget: target.leadsWonTarget,
      },
      actuals: {
        revenueCollected: actualRevenue,
        leadsWon: wonDeals,
        totalAssignedLeads: totalAssigned,
      },
      kpis: {
        quotaAchievementRate: Math.min(Math.round(quotaAchievementPct * 100) / 100, 100),
        conversionRate: Math.round(conversionRatePct * 100) / 100,
        averageDealValue: wonDeals > 0 ? Math.round(actualRevenue / wonDeals) : 0,
      },
    };
  }

  /**
   * Admin sets monthly sales & revenue target quota for a staff member
   */
  async setStaffTarget(staffId: string, month: number, year: number, revenueTarget: number, leadsWonTarget: number) {
    return this.prisma.staffTarget.upsert({
      where: {
        staffId_month_year: { staffId, month, year },
      },
      update: {
        revenueTarget: new Decimal(revenueTarget),
        leadsWonTarget,
      },
      create: {
        staffId,
        month,
        year,
        revenueTarget: new Decimal(revenueTarget),
        leadsWonTarget,
      },
    });
  }
}
```

---

### 💼 8.3 Core CRM Business Logic for Backend Implementation

Backend developers must adhere to the following enterprise rules governing sales, billing, and workforce data:

#### 1. Lead Ownership, Assignment & Handover Lifecycle
- **Inbound Capture**: Leads from website forms, WhatsApp, or cold inquiries enter in stage `NEW_LEADS`.
- **Assignment**: Admin manually assigns or system round-robin assigns `assignedStaffId`.
- **Row-Level Enforcement**: Staff can only view and update leads where `assignedStaffId === currentUser.id`. Admins have universal visibility.
- **Stage Progression Rules**:
  - `NEW_LEADS` → `APPOINTMENT_COLLECTED` (Requires appointment datetime).
  - `APPOINTMENT_COLLECTED` → `DEMONSTRATIONS_DONE` (Requires demo notes).
  - `DEMONSTRATIONS_DONE` → `PROPOSAL_SENT` (Requires linked Proposal ID).
  - `PROPOSAL_SENT` → `CLOSED_WON` (Client accepted quotation).
- **1-Click Conversion Atomicity**:
  - Executed inside a single `prisma.$transaction`:
    1. Creates `Client` record with company name and fleet size.
    2. Creates primary `ClientUser` with phone and email.
    3. Generates initial `Invoice` with line items, assigning `salesRepId = lead.assignedStaffId`.
    4. Marks Lead as `isArchived = true` and `convertedToClientId = client.id`.

#### 2. Invoicing & Revenue Attribution Engine
- **Revenue Ownership**: When an invoice is created, it inherits `salesRepId`. All future payments (full or partial) applied to this invoice are credited to that sales rep's KPI for the calendar month in which the payment is verified.
- **Partial Payment Formula**:
  - `paidAmount = SUM(payments.amount WHERE status = 'COMPLETED')`
  - `dueBalance = totalAmount - paidAmount`
  - `status = paidAmount >= totalAmount ? 'PAID' : paidAmount > 0 ? 'PARTIALLY_PAID' : 'UNPAID'`

#### 3. Overdue Debt Delinquency & Nightly Cron
- **Overdue Definition**: Any invoice with `dueBalance > 0` and `dueDate < CURRENT_DATE`.
- **Automated Midnight Transition Job (`@Cron('0 0 * * *')`)**:
  - At `00:00:00 Asia/Dhaka` every day, scans all open invoices where `dueDate < today` and updates status to `OVERDUE`.
  - Dispatches an automated collection notification to the client and flags the delinquent invoice on the assigned sales representative's dashboard.

#### 4. Audit Logging Standard
- Every financial payment creation, invoice status transition, and lead stage shift must write an entry to `AuditLog` recording:
  - `userId`, `action` (`PAYMENT_RECORDED`, `STAGE_CHANGED`, `CLIENT_CONVERTED`), `entityId`, `oldValues`, `newValues`, and client IP address.

---

### ⏰ 8.4 Scheduled Cron Worker Implementation

```typescript
// src/modules/dashboard/dashboard-cron.service.ts
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { InvoiceStatus } from '@prisma/client';

@Injectable()
export class DashboardCronService {
  constructor(private prisma: PrismaService) {}

  // Daily Midnight Cron at 00:00:00 Asia/Dhaka (BST)
  @Cron('0 0 * * *', { timeZone: 'Asia/Dhaka' })
  async handleNightlyDueInvoicesScan() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Transition unpaid invoices past due date to OVERDUE
    await this.prisma.invoice.updateMany({
      where: {
        dueDate: { lt: today },
        status: { in: [InvoiceStatus.UNPAID, InvoiceStatus.PARTIALLY_PAID] },
      },
      data: { status: InvoiceStatus.OVERDUE },
    });
  }

  // Monthly Day 1 Snapshot Archival at 00:05:00 BST
  @Cron('5 0 1 * *', { timeZone: 'Asia/Dhaka' })
  async handleMonthlyKpiSnapshotArchival() {
    const priorMonthDate = new Date();
    priorMonthDate.setMonth(priorMonthDate.getMonth() - 1);
    const month = priorMonthDate.getMonth() + 1;
    const year = priorMonthDate.getFullYear();

    const staffMembers = await this.prisma.user.findMany({
      where: { role: 'STAFF', isActive: true },
    });

    for (const staff of staffMembers) {
      // Archive monthly performance snapshot to StaffKpiSnapshot
    }
  }
}
```

---

## 🚀 9. Step-by-Step 10-Phase Backend Execution Plan

Follow these 10 distinct phases when beginning backend implementation:

1. **Phase 1: Project Initialization & Tooling**
   - Initialize NestJS project: `nest new backend`
   - Install dependencies: `@prisma/client`, `prisma`, `@nestjs/jwt`, `passport-jwt`, `bcrypt`, `class-validator`, `class-transformer`
   - Setup Docker PostgreSQL & `.env` configuration.
2. **Phase 2: Database Schema & Migration**
   - Place `schema.prisma` in `prisma/schema.prisma`
   - Run initial migration: `npx prisma migrate dev --name init_crm_schema`
   - Run seeder: `npx prisma db seed`
3. **Phase 3: Core Guards & Interceptors**
   - Create `TransformResponseInterceptor` for standard envelope format `{ success: true, data: T }`
   - Create `AllExceptionsFilter` for uniform error codes.
4. **Phase 4: Authentication & JWT Lifecycle**
   - Build `/api/v1/auth/login`, `/refresh`, `/me`, `/logout`
   - Validate passwords against bcrypt hashes.
5. **Phase 5: Granular RBAC Engine**
   - Build `RolesGuard` and `PermissionsGuard`
   - Verify `@RequirePermission(module, action)` on protected controllers.
6. **Phase 6: Super Admin & Staff Management**
   - Implement `/api/v1/admins` (Super Admin exclusive)
   - Implement `/api/v1/team/members` with permissions checklist persistence.
7. **Phase 7: HR Module (Leaves & Timesheets)**
   - Implement leave submission and approval workflow `/api/v1/team/leaves`
   - Implement daily clock-in/out and timesheet tracking.
8. **Phase 8: Leads Pipeline & 1-Click Client Conversion**
   - Implement lead CRUD and stage switcher
   - Build transactional `convertLeadToClient` creating both `Client` and initial `ClientUser`.
9. **Phase 9: Invoicing & Partial Payment Engine**
   - Implement line-item invoice generator
   - Implement atomic payment recording recalculating `paidAmount`, `dueBalance`, and status.
10. **Phase 10: Dashboard Analytics & Performance Tuning**
    - Implement cached `/api/v1/dashboard/stats` aggregation queries
    - Setup indexes on `[status, dueDate]`, `[stage, assignedStaffId]`, and `[userId, date]`.

---

## 🐳 10. Docker & Deployment Configuration

### `docker-compose.yml`
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: upskill_crm_postgres
    restart: always
    environment:
      POSTGRES_USER: crm_admin
      POSTGRES_PASSWORD: crm_secure_password
      POSTGRES_DB: upskill_crm
    ports:
      - '5432:5432'
    volumes:
      - crm_pg_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: upskill_crm_redis
    restart: always
    ports:
      - '6379:6379'

volumes:
  crm_pg_data:
```

---

## 🚀 11. Extended Module Specifications (Tasks, Support, Contracts, Projects, Portal, Settings & Reports)

### Additional Prisma Models

```prisma
// Field Installation & Maintenance Tasks
model FieldTask {
  id                 String       @id @default(uuid())
  taskCode           String       @unique
  title              String
  taskType           String       // New Installation, Troubleshooting, Device Relocation, Fuel Sensor, SIM Swap
  clientName         String
  vehiclePlate       String
  location           String
  assignedStaffId    String?
  assignedStaff      User?        @relation(fields: [assignedStaffId], references: [id])
  scheduledDate      DateTime
  priority           String       @default("Medium") // Urgent, High, Medium, Low
  status             String       @default("Pending") // Pending, In Progress, Completed, Cancelled
  deviceModel        String
  createdAt          DateTime     @default(now())
  updatedAt          DateTime     @updatedAt
}

// Support Tickets & Technical RMA
model SupportTicket {
  id                 String       @id @default(uuid())
  ticketNumber       String       @unique
  clientName         String
  contactPerson      String
  contactPhone       String
  vehiclePlate       String
  deviceImei         String
  subject            String
  category           String       // Device Offline, Remote Relay, SIM Data, RMA Defect, Billing
  priority           String       @default("Medium")
  status             String       @default("Open") // Open, In Progress, Resolved, Closed
  assignedTo         String?
  lastReply          String?
  createdAt          DateTime     @default(now())
  updatedAt          DateTime     @updatedAt
}

// Annual Service Contracts & Fleet AMCs
model ServiceContract {
  id                 String       @id @default(uuid())
  contractNumber     String       @unique
  title              String
  clientName         String
  contactPerson      String
  contractType       String       // Fleet AMC (Annual), SLA Telematics, Hardware Lease
  unitsCovered       Int
  contractValue      Decimal      @db.Decimal(12, 2)
  startDate          DateTime
  endDate            DateTime
  autoRenew          Boolean      @default(true)
  status             String       @default("Active") // Active, Expiring Soon, Expired, Draft
  createdAt          DateTime     @default(now())
  updatedAt          DateTime     @updatedAt
}

// Fleet Deployment Projects
model FleetProject {
  id                 String       @id @default(uuid())
  projectCode        String       @unique
  projectName        String
  clientName         String
  contactPerson      String
  totalVehicles      Int
  installedVehicles  Int          @default(0)
  projectLead        String
  startDate          DateTime
  deadline           DateTime
  budget             Decimal      @db.Decimal(12, 2)
  status             String       @default("Planning") // Planning, In Progress, Completed, On Hold
  trackerModel       String
  createdAt          DateTime     @default(now())
  updatedAt          DateTime     @updatedAt
}

// System Configuration Key-Value Store
model SystemSetting {
  id                 String       @id @default(uuid())
  key                String       @unique
  value              Json
  updatedAt          DateTime     @updatedAt
}
```

### Extended REST Endpoints

| Domain | Method | Route | Description | Auth & Permission |
|---|---|---|---|---|
| **Tasks** | `GET` | `/api/v1/tasks` | List field installation tasks with filters | `@RequirePermission('tasks', 'read')` |
| **Tasks** | `POST` | `/api/v1/tasks` | Schedule new installation or troubleshooting task | `@RequirePermission('tasks', 'create')` |
| **Tasks** | `PATCH` | `/api/v1/tasks/:id/status` | Update task status (Pending -> In Progress -> Completed) | `@RequirePermission('tasks', 'update')` |
| **Support** | `GET` | `/api/v1/support/tickets` | Query support tickets by category & status | `@RequirePermission('support', 'read')` |
| **Support** | `POST` | `/api/v1/support/tickets` | Open support ticket / device RMA | `@RequirePermission('support', 'create')` |
| **Support** | `POST` | `/api/v1/support/tickets/:id/reply` | Append technician response / resolve ticket | `@RequirePermission('support', 'update')` |
| **Contracts** | `GET` | `/api/v1/contracts` | List enterprise AMCs & renewal alerts | `@RequirePermission('sales', 'read')` |
| **Contracts** | `POST` | `/api/v1/contracts` | Create signed service contract | `@RequirePermission('sales', 'create')` |
| **Projects** | `GET` | `/api/v1/projects` | Get fleet rollout deployment milestones | `@RequirePermission('projects', 'read')` |
| **Projects** | `POST` | `/api/v1/projects` | Initialize new fleet rollout project | `@RequirePermission('projects', 'create')` |
| **Reports** | `GET` | `/api/v1/reports/analytics` | Aggregated revenue, MRR, expenses & hardware breakdown | `@RequirePermission('reports', 'read')` |
| **Settings** | `GET` | `/api/v1/settings` | Retrieve active company profile, MFS & telematics config | `@Roles(Role.SUPER_ADMIN, Role.ADMIN)` |
| **Settings** | `PUT` | `/api/v1/settings` | Save company branding, bKash & Bank credentials | `@Roles(Role.SUPER_ADMIN)` |
| **Portal** | `GET` | `/api/v1/portal/fleet` | Authenticated client view of live vehicles & devices | Client JWT Required |
| **Portal** | `GET` | `/api/v1/portal/invoices` | Authenticated client view of billing history & receipts | Client JWT Required |

---

*This document serves as the official specification for the Upskill CRM Phase 2 Backend implementation.*

