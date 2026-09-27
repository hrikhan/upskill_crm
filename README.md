# 🚀 Upskill CRM - GPS Tracker Sales & Service Management Platform

> **Single-Company Dedicated CRM with Granular RBAC, 3-Tier Hierarchy & Streamlined Billing**  
> **Tech Stack:** React 19, TypeScript, Redux Toolkit, Tailwind CSS, Lucide Icons, Vite

---

## 📌 Core Business Rules & Scope

1. **Dedicated Architecture (Single-Company)**:  
   This CRM is engineered specifically for a GPS tracker selling, installment/monthly subscription, and fleet service company. There is **no multi-tenant isolation** — all users belong to the same parent organization.

2. **3-Tier Authority Hierarchy**:
   - **👑 Super Admin (Platform Owner / Root Master)**:
     - Unrestricted root access across the entire platform.
     - **Exclusive authority** to create, edit, activate, or deactivate **Admins** (`/admin/admins`).
     - Master system, security, and global settings.
   - **🛡️ Admin (Operations Director / General Manager)**:
     - Controls day-to-day business operations (Leads, Customers, Sales, Subscriptions, Reports).
     - **Staff Authority**: Hires, manages, and assigns **Staff accounts** (`/admin/team/members`).
     - **Permission Delegation**: Toggles individual module permissions for each staff member.
     - *Admins cannot see or edit other Admins or access `/admin/admins`.*
   - **💼 Staff (Sales, Billing, HR Officers)**:
     - Strictly restricted to modules enabled by the Admin.
     - **Zero Unauthorized Visibility**: Hidden modules do not appear in the sidebar navigation and direct URL access redirects with an Access Denied shield.

---

## 🔑 Demo Login Credentials

You can log in directly using the following credentials or use the 1-click role cards on the login screen (`/login`):

| Role | Email | Password | Scope & Primary Focus |
|---|---|---|---|
| **👑 Super Admin** | `superadmin@upskillcrm.com` | `super123` | Upskill Consultancy (Full root access + Admins management `/admin/admins`) |
| **🛡️ Admin** | `admin@upskillcrm.com` | `admin123` | Operational control + **Staff RBAC management** (`/admin/team/members`) |
| **💼 Staff (Sales)** | `sales@upskillcrm.com` | `staff123` | Leads Pipeline, Clients, Proposals *(Billing, Invoices & Reports hidden)* |
| **💳 Staff (Billing)** | `billing@upskillcrm.com` | `staff123` | Invoices, Monthly Subscriptions, Payments *(Leads hidden)* |
| **👥 Staff (HR)** | `hr@upskillcrm.com` | `staff123` | Employee Directory, Leave Requests, and Attendance/Timesheets |
| **🌐 Client Portal** | `client@upskillcrm.com` | `client123` | Customer view for GPS tracking units and payment invoices (`/user/overview`) |

---

## 📂 Modular File Structure

All feature modules are organized outside of `src/pages/Admin/` as clean, standalone top-level feature directories in `src/pages/`:

```
src/
├── pages/
│   ├── Admins/                   # Super Admin Exclusive: Admin Provisioning & Logs
│   │   └── Admins.tsx
│   ├── Team/                     # Admin & HR: Staff Members, Leaves & Timesheets
│   │   ├── TeamMembers/          # Staff list & dynamic module permission checklist modal
│   │   ├── Leaves/               # Employee leave applications & approvals
│   │   └── TimeSheets/           # Daily employee work logs & timesheets
│   ├── Dashboard/                # Central Business & Operations Analytics
│   ├── Leads/                    # Lead Generation, 6-Stage Drag-and-Drop Pipeline, Convert to Client
│   ├── Customers/
│   │   ├── Clients/              # Client Company directory & GPS fleet details
│   │   └── ClientUsers/          # Client contact persons & authorized users
│   ├── Sales/
│   │   ├── Invoices/             # Invoices with partial payment tracking & installments
│   │   ├── Subscriptions/        # Monthly GPS tracking software recurring subscriptions
│   │   ├── Payments/             # Payment receipts & transaction ledger
│   │   └── Items/                # GPS hardware models, sensors & accessories catalog
│   ├── Proposals/                # Sales Quotations & Proposals
│   ├── Contracts/                # Service Agreements & Annual Maintenance Contracts (AMC)
│   ├── Projects/                 # GPS fleet deployment projects
│   ├── Tasks/                    # Field installation & support tasks
│   ├── Support/                  # Customer device tickets & RMA
│   ├── Reports/                  # Sales, revenue, and tracking subscription reports
│   ├── Settings/                 # Company profile, VAT/Tax rules, alerts
│   ├── Auth/                     # Login (with Demo Role Switcher), Register, Forgot Password
│   └── UserDashboard/            # Customer / Client self-service portal
├── routes/
│   ├── AdminRoutes.tsx           # Route guards with lazy-loaded top-level pages
│   └── UserRoutes.tsx            # Customer portal routes
├── store/
│   └── features/AuthSlice/       # Redux RBAC slice, role presets, permission updater
├── hooks/
│   ├── usePermissions.ts         # Granular permission validation hook
│   └── useRedux.ts               # Typed Redux dispatch & selector
├── utils/
│   └── permissionMapping.ts      # URL route to ModulePermissionKey mapping
└── Layout/
    └── DashboardLayout/          # Dynamic RBAC sidebar, top header with live role switcher
```

---

## 🛠️ Development & Local Run

- **Start Development Server**: `npm run dev` (Runs on `http://localhost:5173`)
- **Type Checking**: `npx tsc --noEmit`
- **Lint Check**: `npm run lint`

All developers and agents working on this repository must read this file before making modifications.
