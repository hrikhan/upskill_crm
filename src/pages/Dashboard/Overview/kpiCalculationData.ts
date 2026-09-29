import { InvoiceItem, LeadItem } from "./_components/RecentActivitySection";

export interface KpiCalculationScope {
  isStaff: boolean;
  staffName?: string;
  scopeLabel: string;
  badgeClass: string;
  description: string;
}

export interface KpiCalculationDetail {
  id: string;
  title: string;
  category: string;
  currentValue: string;
  description: string;
  badge: string;
  scope: KpiCalculationScope;
  formula: {
    expression: string;
    explanation: string;
    variables: {
      name: string;
      value: string | number;
      description: string;
    }[];
    sqlQuery: string;
  };
  schedule: {
    frequency: string;
    frequencyType: "realtime" | "cron" | "continuous";
    cronExpression?: string;
    cronScheduleDescription: string;
    triggerEvents: {
      title: string;
      description: string;
      type: "webhook" | "cron" | "user_action" | "system";
    }[];
    lastCalculated: string;
    nextCalculation: string;
    cachingStrategy: string;
  };
  rules: {
    included: string[];
    excluded: string[];
  };
  contributingData: {
    title: string;
    subtitle: string;
    items: {
      id: string;
      primary: string;
      secondary?: string;
      amount?: string;
      status?: string;
      statusBadge?: string;
      date?: string;
    }[];
  };
  quickAction: {
    label: string;
    path: string;
  };
}

export function getKpiCalculationDetails(
  cardId: string,
  filteredInvoices: InvoiceItem[],
  filteredLeads: LeadItem[],
  userScope?: { isStaff: boolean; staffName?: string }
): KpiCalculationDetail {
  const isStaff = Boolean(userScope?.isStaff);
  const staffName = userScope?.staffName || "Staff Member";

  const defaultScope: KpiCalculationScope = isStaff
    ? {
        isStaff: true,
        staffName,
        scopeLabel: `Personal Scoped (${staffName})`,
        badgeClass:
          "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-700",
        description: `Scoped strictly to your personal revenue, invoices, and assigned deals. Organization-wide calculations are restricted to Admins & Sales Executives.`,
      }
    : {
        isStaff: false,
        scopeLabel: "Enterprise Total (Company-Wide)",
        badgeClass:
          "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border-sky-300 dark:border-sky-700",
        description: `Consolidated executive total aggregating performance across all company sales representatives and departments.`,
      };

  const hrScope: KpiCalculationScope = {
    isStaff: false,
    scopeLabel: "🏢 HR Workforce Operations",
    badgeClass:
      "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300 dark:border-purple-700",
    description:
      "Workforce headcount, attendance records, and leave requests across all company staff departments.",
  };

  const now = new Date();
  const todayFormatted = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const paidInvoices = filteredInvoices.filter((i) => i.status === "paid");
  const unpaidInvoices = filteredInvoices.filter((i) => i.status === "unpaid");
  const overdueInvoices = filteredInvoices.filter((i) => i.status === "overdue");

  const paidSum = paidInvoices.reduce((sum, i) => sum + i.amount, 0);
  const dueSum = unpaidInvoices.reduce((sum, i) => sum + i.amount, 0);
  const overdueSum = overdueInvoices.reduce((sum, i) => sum + i.amount, 0);

  switch (cardId) {
    // ----------------------------------------------------
    // Financial: Payments - Today
    // ----------------------------------------------------
    case "payments-today":
      return {
        id: "payments-today",
        title: isStaff ? "My Payments - Today" : "Payments - Today",
        category: isStaff ? "Personal Sales / Daily Cash" : "Financial / Daily Cash Inflow",
        currentValue: "Tk,0.00",
        badge: "Real-Time Event Driven",
        scope: defaultScope,
        description: isStaff
          ? `Cleared payments credited to your personal sales accounts for deals completed today (${staffName}).`
          : "Total cleared monetary receipts recorded and cleared from client payments across all channels during today's operating window (00:00:00 to 23:59:59 BST).",
        formula: {
          expression: isStaff
            ? "My Payments Today = Σ (Payment.amount WHERE Invoice.sales_rep_id = :myUserId)"
            : "Payments Today = Σ (Payment.amount)",
          explanation: isStaff
            ? `Sum of payment amounts received today on invoices owned by ${staffName}. Excludes other reps' receipts.`
            : "Calculated as the arithmetic sum of all transaction amounts from recorded payments where payment date is equal to the current system date and transaction status is Verified/Completed.",
          variables: [
            {
              name: "Active Date Window",
              value: todayFormatted,
              description: "Current enterprise day bounds (UTC+6 / BST)",
            },
            {
              name: "Scope Authority",
              value: isStaff ? `Personal (${staffName})` : "Company-Wide Total",
              description: isStaff
                ? "Enforcing staff row-level data isolation"
                : "Aggregating all 12 staff accounts",
            },
            {
              name: "Total Today Sum",
              value: "Tk 0.00",
              description: "Sum of valid payment ledger entries for today",
            },
          ],
          sqlQuery: isStaff
            ? `-- [STAFF ROW-LEVEL SECURITY ENFORCED]
-- Staff: ${staffName}
SELECT COALESCE(SUM(p.amount), 0) AS my_payments_today
FROM payments p
INNER JOIN invoices i ON i.id = p.invoice_id
WHERE i.sales_rep_id = :current_user_id
  AND DATE(p.recorded_at AT TIME ZONE 'Asia/Dhaka') = CURRENT_DATE
  AND p.status = 'COMPLETED';`
            : `-- [ADMIN / EXECUTIVE TOTAL CALCULATION]
-- Company-Wide Master Inflow
SELECT COALESCE(SUM(amount), 0) AS total_today 
FROM payments 
WHERE DATE(recorded_at AT TIME ZONE 'Asia/Dhaka') = CURRENT_DATE 
  AND status = 'COMPLETED';`,
        },
        schedule: {
          frequency: "Real-Time / Instantaneous",
          frequencyType: "realtime",
          cronScheduleDescription:
            "Recalculated on demand whenever a payment transaction is recorded, with an automated midnight boundary rollover.",
          triggerEvents: [
            {
              title: "Payment Receipt Saved",
              description:
                "Immediate recalculation when an admin or billing staff records a partial or full payment via bKash, Bank, or Cash.",
              type: "user_action",
            },
            {
              title: "Online Gateway Webhook",
              description:
                "Instant recalculation when digital payment confirmation is received from bKash Merchant API or SSLCommerz IPN.",
              type: "webhook",
            },
            {
              title: "Midnight Date Rollover Cron",
              description:
                "At 00:00:00 BST every day, the counter rolls over to start aggregating the new calendar day.",
              type: "cron",
            },
          ],
          lastCalculated: "Live (just now with active filters)",
          nextCalculation:
            "Instant on next payment receipt or at 23:59:59 BST rollover",
          cachingStrategy: isStaff
            ? `Redis key 'kpi:staff:${staffName.toLowerCase().replace(/\s+/g, '_')}:today' with 60-second TTL.`
            : "Redis key 'kpi:payments:today:enterprise' with 60-second TTL.",
        },
        rules: {
          included: [
            isStaff
              ? `Payments received on invoices issued by ${staffName}`
              : "All company payments recorded and marked 'Completed' today",
            "Bank transfers (DBBL, City Bank) confirmed today",
            "bKash / Nagad mobile financial service payments settled today",
            "Partial payments allocated to open invoices",
          ],
          excluded: [
            isStaff
              ? "Payments credited to other sales representatives or team members"
              : "Payments with status 'Pending' or 'Under Verification'",
            "Refunded, disputed, or voided transactions",
            "Future-dated cheques or uncashed instruments",
            "Payments recorded on previous calendar dates",
          ],
        },
        contributingData: {
          title: isStaff ? "Your Transactions Today" : "Today's Transaction Ledger",
          subtitle: isStaff
            ? `Receipts credited to ${staffName} today`
            : "Cleared payment entries contributing to today's revenue figure",
          items: [
            {
              id: "no-today-payments",
              primary: "No new payment receipts recorded yet today",
              secondary: isStaff
                ? `Transactions will populate here in real-time as clients pay invoices assigned to ${staffName}.`
                : "Transactions will populate here in real-time as payments are recorded in the Payments module.",
              amount: "Tk 0.00",
              status: "Awaiting Entries",
              statusBadge:
                "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
              date: todayFormatted,
            },
          ],
        },
        quickAction: {
          label: "View All Payments",
          path: "/admin/sales/payments",
        },
      };

    // ----------------------------------------------------
    // Financial: Payments - Month
    // ----------------------------------------------------
    case "payments-month":
      return {
        id: "payments-month",
        title: isStaff ? "My Revenue - Month" : "Payments - Month",
        category: isStaff ? "Personal Quota / Monthly Inflow" : "Financial / Monthly Cash Inflow",
        currentValue: `Tk,${paidSum.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        badge: "Real-Time Aggregate",
        scope: defaultScope,
        description: isStaff
          ? `Cumulative revenue collected this month from invoices and client subscriptions attributed to you (${staffName}).`
          : "Cumulative cleared revenue collected across all GPS device sales, installations, and recurring monthly tracking subscriptions during the current calendar month.",
        formula: {
          expression: isStaff
            ? "My Monthly Revenue = Σ (Payment.amount WHERE Invoice.sales_rep_id = :myUserId)"
            : "Monthly Payments = Σ (Payment.amount)",
          explanation: isStaff
            ? `Sum of all completed payments recorded this month for invoices attributed to ${staffName}. Used to calculate individual sales quota achievement.`
            : "Sum of all completed payments recorded between the first day of the current calendar month and the current timestamp across all company accounts.",
          variables: [
            {
              name: "Active Month Period",
              value: now.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              }),
              description: "Current billing calendar month",
            },
            {
              name: "Contributing Paid Invoices",
              value: `${paidInvoices.length} invoices`,
              description: isStaff
                ? `Invoices owned by ${staffName}`
                : "Total paid invoices across all company reps",
            },
            {
              name: "Revenue Realized",
              value: `Tk ${paidSum.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
              description: isStaff
                ? `Personal cleared revenue for ${staffName}`
                : "Cleared enterprise aggregate for this period",
            },
          ],
          sqlQuery: isStaff
            ? `-- [STAFF ROW-LEVEL SECURITY ENFORCED]
-- Staff: ${staffName}
SELECT COALESCE(SUM(p.amount), 0) AS my_monthly_revenue 
FROM payments p
INNER JOIN invoices i ON i.id = p.invoice_id
WHERE i.sales_rep_id = :current_user_id
  AND DATE_TRUNC('month', p.recorded_at AT TIME ZONE 'Asia/Dhaka') = DATE_TRUNC('month', CURRENT_DATE) 
  AND p.status = 'COMPLETED';`
            : `-- [ADMIN / EXECUTIVE TOTAL CALCULATION]
-- Company-Wide Master Inflow
SELECT COALESCE(SUM(amount), 0) AS total_month 
FROM payments 
WHERE DATE_TRUNC('month', recorded_at AT TIME ZONE 'Asia/Dhaka') = DATE_TRUNC('month', CURRENT_DATE) 
  AND status = 'COMPLETED';`,
        },
        schedule: {
          frequency: "Real-Time / Instantaneous",
          frequencyType: "realtime",
          cronScheduleDescription:
            "Continuous live updates upon invoice settlement. Monthly rollover executes at 00:00:00 BST on the 1st of each month.",
          triggerEvents: [
            {
              title: "Invoice Marked Paid",
              description:
                "Immediate addition when full or partial payment is applied to an invoice.",
              type: "user_action",
            },
            {
              title: "Subscription Recurring Renewal",
              description:
                "Automated addition when recurring monthly SIM & tracking subscription fee clears.",
              type: "system",
            },
            {
              title: "Monthly Cycle Reset",
              description:
                "At 00:00:00 BST on Day 1 of the new month, aggregates reset and previous month is archived to Reports.",
              type: "cron",
            },
          ],
          lastCalculated: "Live (updated on active filter change)",
          nextCalculation:
            "Continuous real-time sync with database payment records",
          cachingStrategy: isStaff
            ? `Redis key 'kpi:staff:${staffName.toLowerCase().replace(/\s+/g, '_')}:month' with write-invalidation.`
            : "Redis cache with cache-aside pattern. Auto-eviction on any payment ledger write.",
        },
        rules: {
          included: [
            isStaff
              ? `Hardware sales and subscription payments credited to ${staffName}`
              : "Hardware tracker unit sales payments settled this month across all reps",
            "Monthly recurring software & SIM tracking charges",
            "Fleet installation service fee receipts",
            "Installment and partial payments credited this month",
          ],
          excluded: [
            isStaff
              ? "Revenues and payments credited to other sales officers"
              : "Outstanding invoice balances (unpaid amounts)",
            "Overdue accounts not yet collected",
            "Payments made in prior calendar months",
            "Draft or cancelled invoices",
          ],
        },
        contributingData: {
          title: isStaff ? "Your Settled Invoices This Month" : "Settled Invoices This Month",
          subtitle: isStaff
            ? `Invoices credited to ${staffName} totaling Tk ${paidSum.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
            : `Invoices contributing to the monthly revenue of Tk ${paidSum.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
          items: paidInvoices.map((inv) => ({
            id: inv.id,
            primary: `${inv.invoiceNo} • ${inv.client}`,
            secondary: `Sales Rep: ${inv.salesRep} | Source: ${inv.source}`,
            amount: `Tk ${inv.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
            status: "Paid",
            statusBadge:
              "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
            date: `Due: ${inv.dueDate}`,
          })),
        },
        quickAction: {
          label: "View Invoices Ledger",
          path: "/admin/sales/invoices",
        },
      };

    // ----------------------------------------------------
    // Financial: Invoices - Due
    // ----------------------------------------------------
    case "invoices-due":
      return {
        id: "invoices-due",
        title: isStaff ? "My Invoices - Due" : "Invoices - Due",
        category: isStaff ? "Personal Accounts / Receivables" : "Accounts Receivable / Pending Inflow",
        currentValue: `Tk,${dueSum.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        badge: "Real-Time + Nightly Due Check",
        scope: defaultScope,
        description: isStaff
          ? `Outstanding balances on open invoices originated by you (${staffName}) that are within active payment terms.`
          : "Total outstanding receivable balance awaiting client payment that has not yet passed its stated payment due date across all accounts.",
        formula: {
          expression: isStaff
            ? "My Due Invoices = Σ (Invoice.due_balance WHERE sales_rep_id = :myUserId)"
            : "Invoices Due = Σ (Invoice.due_balance)",
          explanation: isStaff
            ? `Sum of due balances on active invoices owned by ${staffName} awaiting client payment.`
            : "Sum of due balances on all issued invoices where status is 'Unpaid' or 'Partially Paid' and the due date is today or in the future.",
          variables: [
            {
              name: "Pending Invoices Count",
              value: `${unpaidInvoices.length} invoices`,
              description: isStaff ? `Owned by ${staffName}` : "Company-wide open invoices",
            },
            {
              name: "Due Cutoff Date",
              value: "Due Date ≥ Current Date",
              description: "Only within-term active receivables are counted",
            },
            {
              name: "Total Due Balance",
              value: `Tk ${dueSum.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
              description: "Sum of pending balances under active filters",
            },
          ],
          sqlQuery: isStaff
            ? `-- [STAFF ROW-LEVEL SECURITY ENFORCED]
-- Staff: ${staffName}
SELECT COALESCE(SUM(due_balance), 0) AS my_total_due 
FROM invoices 
WHERE sales_rep_id = :current_user_id
  AND status IN ('UNPAID', 'PARTIALLY_PAID') 
  AND due_date >= CURRENT_DATE;`
            : `-- [ADMIN / EXECUTIVE TOTAL CALCULATION]
SELECT COALESCE(SUM(due_balance), 0) AS total_due 
FROM invoices 
WHERE status IN ('UNPAID', 'PARTIALLY_PAID') 
  AND due_date >= CURRENT_DATE;`,
        },
        schedule: {
          frequency: "Real-Time Sync + Scheduled Midnight Transition",
          frequencyType: "continuous",
          cronScheduleDescription:
            "Recalculated on every invoice modification. At midnight (00:01 BST), any due invoices exceeding their deadline transition to 'Overdue'.",
          triggerEvents: [
            {
              title: "Invoice Issued or Updated",
              description:
                "Immediate update whenever a sales quote is converted into an invoice or a partial payment is recorded.",
              type: "user_action",
            },
            {
              title: "Nightly Due Date Expiry Scan",
              description:
                "Scheduled worker runs at 00:01:00 BST to identify unpaid invoices whose due date has passed, moving them to Overdue.",
              type: "cron",
            },
            {
              title: "Payment Credited",
              description:
                "Balance is immediately subtracted when client pays full or partial amount.",
              type: "webhook",
            },
          ],
          lastCalculated: "Live (synchronized with active filters)",
          nextCalculation:
            "Real-time on next payment or nightly scan at 00:01:00 BST",
          cachingStrategy:
            "Stored in Redis with 120-second TTL. Automatically purged on invoice/payment mutations.",
        },
        rules: {
          included: [
            isStaff
              ? `Unpaid invoices originated by ${staffName}`
              : "Invoices with status 'Unpaid' within payment terms",
            "Invoices with status 'Partially Paid' (only remaining balance counted)",
            "Active monthly tracking fee invoices before due date",
          ],
          excluded: [
            isStaff
              ? "Invoices originated by other team members"
              : "Invoices already settled in full (Paid)",
            "Invoices that exceeded due date (moved to Invoices Overdue)",
            "Draft, voided, or cancelled invoices",
          ],
        },
        contributingData: {
          title: isStaff ? "Your Pending Due Invoices" : "Pending Due Invoices",
          subtitle: isStaff
            ? `Your active within-term receivables totaling Tk ${dueSum.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
            : `Active within-term receivables totaling Tk ${dueSum.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
          items: unpaidInvoices.map((inv) => ({
            id: inv.id,
            primary: `${inv.invoiceNo} • ${inv.client}`,
            secondary: `Sales Rep: ${inv.salesRep} | Company: ${inv.company}`,
            amount: `Tk ${inv.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
            status: "Pending Due",
            statusBadge:
              "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
            date: `Due: ${inv.dueDate}`,
          })),
        },
        quickAction: {
          label: "Manage Invoices",
          path: "/admin/sales/invoices",
        },
      };

    // ----------------------------------------------------
    // Financial: Invoices - Overdue
    // ----------------------------------------------------
    case "invoices-overdue":
      return {
        id: "invoices-overdue",
        title: isStaff ? "My Invoices - Overdue" : "Invoices - Overdue",
        category: isStaff ? "Personal Follow-Up / Risk Debt" : "Accounts Receivable / Overdue Risk",
        currentValue: `Tk,${overdueSum.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        badge: "Daily Midnight Cron + Real-Time Sync",
        scope: defaultScope,
        description: isStaff
          ? `Past-due invoices originated by you (${staffName}) that require immediate collection follow-up or reminder calls.`
          : "High-priority past-due accounts receivable across all company clients where the payment deadline has expired without full settlement.",
        formula: {
          expression: isStaff
            ? "My Overdue Invoices = Σ (Invoice.due_balance WHERE sales_rep_id = :myUserId)"
            : "Invoices Overdue = Σ (Invoice.due_balance)",
          explanation: isStaff
            ? `Outstanding debt balance on expired invoices belonging to ${staffName}. Staff are held accountable for debt collection on their client accounts.`
            : "Sum of outstanding balances on all invoices where the due date is strictly earlier than the current date and payment status is not 'Paid'.",
          variables: [
            {
              name: "Overdue Invoices Count",
              value: `${overdueInvoices.length} invoices`,
              description: isStaff ? `Assigned to ${staffName}` : "Delinquent invoices needing follow-up",
            },
            {
              name: "Condition Check",
              value: "Due Date < Current Date",
              description: "Grace period expired without settlement",
            },
            {
              name: "Total Overdue Amount",
              value: `Tk ${overdueSum.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
              description: "Total risk capital awaiting collection",
            },
          ],
          sqlQuery: isStaff
            ? `-- [STAFF ROW-LEVEL SECURITY ENFORCED]
-- Staff: ${staffName}
SELECT COALESCE(SUM(due_balance), 0) AS my_total_overdue 
FROM invoices 
WHERE sales_rep_id = :current_user_id
  AND status IN ('OVERDUE', 'UNPAID', 'PARTIALLY_PAID') 
  AND due_date < CURRENT_DATE;`
            : `-- [ADMIN / EXECUTIVE TOTAL CALCULATION]
SELECT COALESCE(SUM(due_balance), 0) AS total_overdue 
FROM invoices 
WHERE status IN ('OVERDUE', 'UNPAID', 'PARTIALLY_PAID') 
  AND due_date < CURRENT_DATE;`,
        },
        schedule: {
          frequency: "Daily Midnight Cron (00:00 BST) + Real-Time Reduction",
          frequencyType: "cron",
          cronExpression: "0 0 * * *",
          cronScheduleDescription:
            "Daily cron worker runs every midnight at 00:00:00 BST (UTC+6) to scan all open invoices and transition lapsed due dates into OVERDUE.",
          triggerEvents: [
            {
              title: "Midnight Due Date Transition Cron",
              description:
                "Background daemon checks 'WHERE due_date < CURRENT_DATE AND status != PAID', updates status to 'OVERDUE' and raises alerts.",
              type: "cron",
            },
            {
              title: "Automated SMS / WhatsApp Notification",
              description:
                "When an invoice becomes overdue, client payment reminder dispatch is triggered.",
              type: "system",
            },
            {
              title: "Instant Reduction on Payment",
              description:
                "When overdue payment is received, overdue total immediately decrements in real-time.",
              type: "user_action",
            },
          ],
          lastCalculated: "Today at 00:00:00 BST (synchronized live with filters)",
          nextCalculation: "Tomorrow at 00:00:00 BST (or instantly upon payment)",
          cachingStrategy:
            "Aggregated into Redis hash 'crm:kpi:overdue'. Recomputed nightly and invalidated upon payment receipt.",
        },
        rules: {
          included: [
            isStaff
              ? `Delinquent invoices originated by ${staffName}`
              : "Invoices with due date strictly prior to today's date across all reps",
            "Partially paid invoices where the deadline passed and balance remains",
            "Invoices flagged with status 'Overdue'",
          ],
          excluded: [
            isStaff
              ? "Overdue accounts assigned to other sales representatives"
              : "Invoices with due date today or in future",
            "Fully paid invoices regardless of when paid",
            "Cancelled or written-off invoices",
          ],
        },
        contributingData: {
          title: isStaff ? "Your Overdue Accounts" : "Overdue Receivables List",
          subtitle: isStaff
            ? `Your past-due client accounts totaling Tk ${overdueSum.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
            : `Delinquent invoices totaling Tk ${overdueSum.toLocaleString("en-US", { minimumFractionDigits: 2 })} requiring collections action`,
          items: overdueInvoices.map((inv) => ({
            id: inv.id,
            primary: `${inv.invoiceNo} • ${inv.client}`,
            secondary: `Company: ${inv.company} | Rep: ${inv.salesRep}`,
            amount: `Tk ${inv.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
            status: "Overdue",
            statusBadge:
              "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
            date: `Expired: ${inv.dueDate}`,
          })),
        },
        quickAction: {
          label: "View Overdue Invoices",
          path: "/admin/sales/invoices",
        },
      };

    // ----------------------------------------------------
    // Sales: Total Leads
    // ----------------------------------------------------
    case "total-leads":
      return {
        id: "total-leads",
        title: isStaff ? "My Assigned Leads" : "Total Leads",
        category: isStaff ? "Personal Pipeline / Inbound" : "Sales Pipeline / Inbound Volume",
        currentValue: `${filteredLeads.length} Leads`,
        badge: "Real-Time Stream",
        scope: defaultScope,
        description: isStaff
          ? `Prospective sales inquiries assigned directly to you (${staffName}) currently in the 6-stage pipeline.`
          : "Total active prospective client inquiries and leads registered across the entire organization matching filter criteria.",
        formula: {
          expression: isStaff
            ? "My Leads = COUNT(Lead.id WHERE assigned_staff_id = :myUserId)"
            : "Total Leads = COUNT(Lead.id)",
          explanation: isStaff
            ? `Count of distinct leads assigned to ${staffName} across all pipeline stages.`
            : "Count of distinct lead records in the database matching selected Sales Rep, Stage, and Lead Acquisition Source filters.",
          variables: [
            {
              name: "Filtered Leads",
              value: filteredLeads.length,
              description: isStaff ? `Assigned to ${staffName}` : "Total company pipeline leads",
            },
            {
              name: "Total Pipeline Value",
              value: `Tk ${filteredLeads.reduce((acc, l) => acc + l.value, 0).toLocaleString("en-US")}`,
              description: "Estimated cumulative deal value in pipeline",
            },
          ],
          sqlQuery: isStaff
            ? `-- [STAFF ROW-LEVEL SECURITY ENFORCED]
-- Staff: ${staffName}
SELECT COUNT(id) AS my_leads, COALESCE(SUM(deal_value), 0) AS my_pipeline_value 
FROM leads 
WHERE assigned_staff_id = :current_user_id 
  AND is_archived = FALSE;`
            : `-- [ADMIN / EXECUTIVE TOTAL CALCULATION]
SELECT COUNT(id) AS total_leads, COALESCE(SUM(deal_value), 0) AS pipeline_value 
FROM leads 
WHERE is_archived = FALSE;`,
        },
        schedule: {
          frequency: "Real-Time / Instantaneous",
          frequencyType: "realtime",
          cronScheduleDescription:
            "Updated in sub-second latency whenever a lead is created, imported, or assigned.",
          triggerEvents: [
            {
              title: "Website Form / WhatsApp Inbound",
              description:
                "Instant capture when a potential customer submits a GPS quote request on the website.",
              type: "webhook",
            },
            {
              title: "Manual Lead Entry",
              description:
                "Updated when sales officers add a walk-in or cold-call lead.",
              type: "user_action",
            },
            {
              title: "CSV Bulk Import",
              description:
                "Aggregated counter updates immediately upon CSV batch upload.",
              type: "system",
            },
          ],
          lastCalculated: "Live (just now with active filters)",
          nextCalculation: "Continuous / Real-time on lead mutations",
          cachingStrategy:
            "Redis cache invalidated on Lead entity lifecycle hooks (create, update, archive).",
        },
        rules: {
          included: [
            isStaff
              ? `Leads assigned explicitly to ${staffName}`
              : "All active leads across the 6 pipeline stages",
            "Website inbound, direct referrals, and social campaign leads",
          ],
          excluded: [
            isStaff
              ? "Leads assigned to other sales executives"
              : "Archived or soft-deleted leads",
            "Spam or rejected inquiries marked 'Unqualified'",
            "Converted clients (moved to Customer Directory)",
          ],
        },
        contributingData: {
          title: isStaff ? "Your Active Pipeline" : "Active Pipeline Leads",
          subtitle: isStaff
            ? `Inquiries assigned to ${staffName} (${filteredLeads.length})`
            : `Active inquiries contributing to total count (${filteredLeads.length})`,
          items: filteredLeads.map((l) => ({
            id: l.id,
            primary: `${l.name} • ${l.company}`,
            secondary: `Stage: ${l.stage} | Rep: ${l.salesRep}`,
            amount: `Tk ${l.value.toLocaleString("en-US")}`,
            status: l.stage,
            statusBadge:
              "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300",
            date: l.date,
          })),
        },
        quickAction: {
          label: "Open Leads Pipeline",
          path: "/admin/leads",
        },
      };

    // ----------------------------------------------------
    // Sales: Demos & Meetings
    // ----------------------------------------------------
    case "active-demos": {
      const demoLeads = filteredLeads.filter(
        (l) =>
          l.stage === "Appointment Collected" ||
          l.stage === "Demonstrations Done"
      );
      return {
        id: "active-demos",
        title: isStaff ? "My Active Demos" : "Demos & Meetings",
        category: isStaff ? "Personal Engagement / Demos" : "Sales Pipeline / High-Intent Engagement",
        currentValue: `${demoLeads.length} Active`,
        badge: "Real-Time Stage Sync",
        scope: defaultScope,
        description: isStaff
          ? `Prospective fleet clients scheduled for live demonstration with you (${staffName}).`
          : "Number of qualified prospects currently in product demonstration or appointment meeting stages.",
        formula: {
          expression: isStaff
            ? "My Demos = COUNT(Lead WHERE assigned_staff_id = :myUserId AND stage IN ('Appointment Collected', 'Demonstrations Done'))"
            : "Active Demos = COUNT(Lead WHERE stage IN ('Appointment Collected', 'Demonstrations Done'))",
          explanation: isStaff
            ? `Counts appointment consultations and software demonstrations assigned to ${staffName}.`
            : "Counts leads that have passed initial screening and are actively scheduled for live fleet demo or appointment consultation.",
          variables: [
            {
              name: "Appointments Collected",
              value: filteredLeads.filter(
                (l) => l.stage === "Appointment Collected"
              ).length,
              description: "Scheduled consultation meetings",
            },
            {
              name: "Demonstrations Done",
              value: filteredLeads.filter(
                (l) => l.stage === "Demonstrations Done"
              ).length,
              description: "Product software demo completed",
            },
          ],
          sqlQuery: isStaff
            ? `-- [STAFF ROW-LEVEL SECURITY ENFORCED]
SELECT COUNT(id) FROM leads 
WHERE assigned_staff_id = :current_user_id
  AND stage IN ('Appointment Collected', 'Demonstrations Done') 
  AND is_archived = FALSE;`
            : `-- [ADMIN / EXECUTIVE TOTAL CALCULATION]
SELECT COUNT(id) FROM leads 
WHERE stage IN ('Appointment Collected', 'Demonstrations Done') 
  AND is_archived = FALSE;`,
        },
        schedule: {
          frequency: "Real-Time / Instantaneous",
          frequencyType: "realtime",
          cronScheduleDescription:
            "Synchronized immediately when sales officers drag-and-drop a card or change lead stage.",
          triggerEvents: [
            {
              title: "Kanban Drag-and-Drop",
              description:
                "Immediate update when a card is dragged into Appointment or Demonstration columns.",
              type: "user_action",
            },
            {
              title: "Meeting Scheduled",
              description:
                "Calendar integration webhook updates lead stage upon calendar invite confirmation.",
              type: "system",
            },
          ],
          lastCalculated: "Live (synced with active filters)",
          nextCalculation: "Continuous real-time update on stage movement",
          cachingStrategy: "Real-time reactive state with optimistic UI updates.",
        },
        rules: {
          included: [
            isStaff
              ? `Demos and meetings scheduled with ${staffName}`
              : "Leads in 'Appointment Collected' stage across all reps",
            "Leads in 'Demonstrations Done' stage",
          ],
          excluded: [
            isStaff
              ? "Demos conducted by other sales reps"
              : "Brand new unqualified leads (New Leads stage)",
            "Leads moved forward into Proposal Sent or Closed Won",
            "Lost or dropped prospects",
          ],
        },
        contributingData: {
          title: isStaff ? "Your Scheduled Demos" : "Active Demos & Meetings",
          subtitle: isStaff
            ? `Consultations assigned to ${staffName} (${demoLeads.length})`
            : `Prospects in active demonstration stages (${demoLeads.length})`,
          items: demoLeads.map((l) => ({
            id: l.id,
            primary: `${l.name} • ${l.company}`,
            secondary: `Stage: ${l.stage} | Rep: ${l.salesRep}`,
            amount: `Tk ${l.value.toLocaleString("en-US")}`,
            status: l.stage,
            statusBadge:
              l.stage === "Demonstrations Done"
                ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300"
                : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
            date: l.date,
          })),
        },
        quickAction: {
          label: "View Kanban Board",
          path: "/admin/leads",
        },
      };
    }

    // ----------------------------------------------------
    // Sales: Proposals Sent
    // ----------------------------------------------------
    case "proposals-sent": {
      const proposalLeads = filteredLeads.filter(
        (l) => l.stage === "Proposal Sent"
      );
      return {
        id: "proposals-sent",
        title: isStaff ? "My Proposals Sent" : "Proposals Sent",
        category: isStaff ? "Personal Pipeline / Quotes" : "Sales Pipeline / Quotations",
        currentValue: `${proposalLeads.length} Sent`,
        badge: "Real-Time / Document Triggered",
        scope: defaultScope,
        description: isStaff
          ? `Official GPS fleet quotations issued by you (${staffName}) awaiting client sign-off.`
          : "Proposals and quotation contracts sent to prospective fleet customers currently awaiting decision across all agents.",
        formula: {
          expression: isStaff
            ? "My Proposals = COUNT(Lead WHERE assigned_staff_id = :myUserId AND stage = 'Proposal Sent')"
            : "Proposals Sent = COUNT(Lead WHERE stage = 'Proposal Sent')",
          explanation: isStaff
            ? `Tracks quotations dispatched by ${staffName} awaiting client signature.`
            : "Tracks high-probability leads that have received an official GPS pricing proposal or SLA proposal.",
          variables: [
            {
              name: "Active Proposals",
              value: proposalLeads.length,
              description: isStaff ? `Issued by ${staffName}` : "Company-wide quotations pending",
            },
            {
              name: "Estimated Quotation Value",
              value: `Tk ${proposalLeads.reduce((acc, l) => acc + l.value, 0).toLocaleString("en-US")}`,
              description: "Combined value of open proposals",
            },
          ],
          sqlQuery: isStaff
            ? `-- [STAFF ROW-LEVEL SECURITY ENFORCED]
SELECT COUNT(id) FROM leads 
WHERE assigned_staff_id = :current_user_id 
  AND stage = 'Proposal Sent' 
  AND is_archived = FALSE;`
            : `-- [ADMIN / EXECUTIVE TOTAL CALCULATION]
SELECT COUNT(id) FROM leads WHERE stage = 'Proposal Sent' AND is_archived = FALSE;`,
        },
        schedule: {
          frequency: "Real-Time / Instantaneous",
          frequencyType: "realtime",
          cronScheduleDescription:
            "Updated instantly whenever a quotation is emailed or a lead is moved to 'Proposal Sent'.",
          triggerEvents: [
            {
              title: "Quotation Generated & Dispatched",
              description:
                "Auto-updated when a sales proposal PDF is created and sent via email.",
              type: "user_action",
            },
            {
              title: "Stage Updated to Proposal Sent",
              description:
                "Manual or automated stage progression from demonstration.",
              type: "user_action",
            },
          ],
          lastCalculated: "Live",
          nextCalculation: "Instant upon next proposal dispatch",
          cachingStrategy: "Live state with local and server sync.",
        },
        rules: {
          included: [
            isStaff
              ? `Quotations issued by ${staffName}`
              : "Leads actively in 'Proposal Sent' stage across all reps",
            "Quotations awaiting customer signature or PO",
          ],
          excluded: [
            isStaff
              ? "Quotations issued by other sales representatives"
              : "Proposals rejected or marked expired",
            "Proposals converted to closed won deals",
            "Draft quotes not yet finalized",
          ],
        },
        contributingData: {
          title: isStaff ? "Your Open Proposals" : "Proposals Awaiting Decision",
          subtitle: isStaff
            ? `Quotations dispatched by ${staffName} (${proposalLeads.length})`
            : `Active quotations pending approval (${proposalLeads.length})`,
          items: proposalLeads.map((l) => ({
            id: l.id,
            primary: `${l.name} • ${l.company}`,
            secondary: `Sales Rep: ${l.salesRep} | Source: ${l.source}`,
            amount: `Tk ${l.value.toLocaleString("en-US")}`,
            status: "Proposal Sent",
            statusBadge:
              "bg-lime-100 text-lime-800 dark:bg-lime-950/40 dark:text-lime-300",
            date: l.date,
          })),
        },
        quickAction: {
          label: "View Proposals",
          path: "/admin/proposals",
        },
      };
    }

    // ----------------------------------------------------
    // Sales: Closed Won Deals
    // ----------------------------------------------------
    case "deals-won": {
      const wonLeads = filteredLeads.filter((l) => l.stage === "Closed Won");
      return {
        id: "deals-won",
        title: isStaff ? "My Deals Won" : "Closed Won Deals",
        category: isStaff ? "Personal Success / Conversions" : "Sales Pipeline / Conversions",
        currentValue: `${wonLeads.length} Won`,
        badge: "Real-Time Conversion Sync",
        scope: defaultScope,
        description: isStaff
          ? `Successfully converted deals where you (${staffName}) closed the client contract and deployed GPS hardware.`
          : "Successfully converted deals where client agreement has been executed and GPS trackers are deployed across all company agents.",
        formula: {
          expression: isStaff
            ? "My Won Deals = COUNT(Lead WHERE assigned_staff_id = :myUserId AND stage = 'Closed Won')"
            : "Closed Won = COUNT(Lead WHERE stage = 'Closed Won')",
          explanation: isStaff
            ? `Total converted client contracts closed by ${staffName}. Directly powers your sales commission and quota achievement percentage.`
            : "Calculates total leads converted to confirmed clients within the current filtering scope.",
          variables: [
            {
              name: "Converted Won Deals",
              value: wonLeads.length,
              description: isStaff ? `Closed by ${staffName}` : "Total company converted clients",
            },
            {
              name: "Total Won Contract Value",
              value: `Tk ${wonLeads.reduce((acc, l) => acc + l.value, 0).toLocaleString("en-US")}`,
              description: "Realized sales volume from closed deals",
            },
          ],
          sqlQuery: isStaff
            ? `-- [STAFF ROW-LEVEL SECURITY ENFORCED]
SELECT COUNT(id) FROM leads 
WHERE assigned_staff_id = :current_user_id 
  AND stage = 'Closed Won' 
  AND is_archived = FALSE;`
            : `-- [ADMIN / EXECUTIVE TOTAL CALCULATION]
SELECT COUNT(id) FROM leads WHERE stage = 'Closed Won' AND is_archived = FALSE;`,
        },
        schedule: {
          frequency: "Real-Time / Instantaneous",
          frequencyType: "realtime",
          cronScheduleDescription:
            "Recalculated in real-time when 'Convert to Client' is clicked or a lead stage moves to Closed Won.",
          triggerEvents: [
            {
              title: "1-Click Convert to Client",
              description:
                "Lead converted into client account and invoice generated.",
              type: "user_action",
            },
            {
              title: "Stage Updated to Closed Won",
              description:
                "Deal marked successful upon contract execution.",
              type: "user_action",
            },
          ],
          lastCalculated: "Live",
          nextCalculation: "Instant upon next deal conversion",
          cachingStrategy: "Event-driven real-time update.",
        },
        rules: {
          included: [
            isStaff
              ? `Contracts successfully closed by ${staffName}`
              : "Deals in Closed Won stage across all company sales officers",
            "Leads successfully converted to customer directory",
          ],
          excluded: [
            isStaff
              ? "Deals closed by other team members"
              : "Lost or dropped deals",
            "Active unconverted pipeline leads",
          ],
        },
        contributingData: {
          title: isStaff ? "Your Closed Deals" : "Closed Won Deals",
          subtitle: isStaff
            ? `Deals closed by ${staffName} (${wonLeads.length})`
            : `Successfully closed deals (${wonLeads.length})`,
          items: wonLeads.map((l) => ({
            id: l.id,
            primary: `${l.name} • ${l.company}`,
            secondary: `Sales Rep: ${l.salesRep} | Source: ${l.source}`,
            amount: `Tk ${l.value.toLocaleString("en-US")}`,
            status: "Closed Won",
            statusBadge:
              "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
            date: l.date,
          })),
        },
        quickAction: {
          label: "View Client Directory",
          path: "/admin/customers/clients",
        },
      };
    }

    // ----------------------------------------------------
    // HR: Total Staff Team
    // ----------------------------------------------------
    case "total-staff":
      return {
        id: "total-staff",
        title: "Total Staff Team",
        category: "Human Resources / Headcount",
        currentValue: "12 Members",
        badge: "Real-Time Directory Sync",
        scope: hrScope,
        description:
          "Total active, verified company employees registered in the Upskill CRM staff directory across all departments.",
        formula: {
          expression: "Total Staff = COUNT(User WHERE role = 'STAFF' AND is_active = TRUE)",
          explanation:
            "Calculates active verified staff members currently provisioned in the enterprise team roster.",
          variables: [
            {
              name: "Active Staff Count",
              value: "12 Members",
              description: "Current active employees",
            },
            {
              name: "Departments Represented",
              value: "Sales, Billing, HR, Support",
              description: "Active business units",
            },
          ],
          sqlQuery: `SELECT COUNT(id) FROM users WHERE role = 'STAFF' AND is_active = TRUE;`,
        },
        schedule: {
          frequency: "Real-Time / Instantaneous",
          frequencyType: "realtime",
          cronScheduleDescription:
            "Recalculated immediately upon staff onboarding, deactivation, or profile update in Team module.",
          triggerEvents: [
            {
              title: "Staff Member Hired / Created",
              description:
                "Admin provisions a new staff member account in /admin/team/members.",
              type: "user_action",
            },
            {
              title: "Staff Deactivation / Status Change",
              description:
                "Status toggled between Active and Inactive.",
              type: "user_action",
            },
          ],
          lastCalculated: "Live (synced with active directory)",
          nextCalculation: "Instant upon next staff roster modification",
          cachingStrategy: "Cache evicted immediately on staff mutation.",
        },
        rules: {
          included: [
            "All active staff members with verified credentials",
            "Sales, Billing, HR, and Support officers",
          ],
          excluded: [
            "Deactivated or terminated employee accounts",
            "Super Admin & Admin management accounts",
            "Client portal customer accounts",
          ],
        },
        contributingData: {
          title: "Active Staff Roster",
          subtitle: "Employees currently active in the organization",
          items: [
            {
              id: "staff-1",
              primary: "Sarah Jenkins",
              secondary: "Department: Sales • Role: Senior Sales Rep",
              status: "Active",
              statusBadge:
                "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
              date: "Joined Jan 2026",
            },
            {
              id: "staff-2",
              primary: "Michael Chang",
              secondary: "Department: Sales • Role: Enterprise Account Exec",
              status: "Active",
              statusBadge:
                "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
              date: "Joined Feb 2026",
            },
            {
              id: "staff-3",
              primary: "David Miller",
              secondary: "Department: Sales • Role: Business Development",
              status: "Active",
              statusBadge:
                "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
              date: "Joined Mar 2026",
            },
            {
              id: "staff-4",
              primary: "Nusrat Jahan",
              secondary: "Department: HR • Role: HR Officer",
              status: "Active",
              statusBadge:
                "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
              date: "Joined Jan 2026",
            },
          ],
        },
        quickAction: {
          label: "View Staff Directory",
          path: "/admin/team/members",
        },
      };

    // ----------------------------------------------------
    // HR: On Leave Today
    // ----------------------------------------------------
    case "on-leave":
      return {
        id: "on-leave",
        title: "On Leave Today",
        category: "Human Resources / Daily Availability",
        currentValue: "1 Member",
        badge: "Daily Midnight Cron + Instant Approval",
        scope: hrScope,
        description:
          "Count of active staff members with an approved leave request spanning today's calendar date.",
        formula: {
          expression:
            "On Leave Today = COUNT(LeaveRequest WHERE status = 'APPROVED' AND CURRENT_DATE BETWEEN start_date AND end_date)",
          explanation:
            "Identifies staff who have approved annual, sick, or casual leave active on today's operating date.",
          variables: [
            {
              name: "Active Date",
              value: todayFormatted,
              description: "Date evaluated for leave coverage",
            },
            {
              name: "Staff on Leave",
              value: "1 Member",
              description: "Employees with active approved leave today",
            },
          ],
          sqlQuery: `SELECT COUNT(id) FROM leave_requests 
WHERE status = 'APPROVED' 
  AND CURRENT_DATE BETWEEN start_date AND end_date;`,
        },
        schedule: {
          frequency: "Daily Midnight Cron (00:00 BST) + Instant on Approval",
          frequencyType: "cron",
          cronExpression: "0 0 * * *",
          cronScheduleDescription:
            "Midnight cron updates daily leave statuses at 00:00:00 BST. Also recalculates immediately when HR approves a leave.",
          triggerEvents: [
            {
              title: "Leave Request Approved",
              description:
                "Immediate increment when HR or Admin approves a leave request in /admin/team/leaves.",
              type: "user_action",
            },
            {
              title: "Midnight Date Rollover Cron",
              description:
                "Evaluates start_date and end_date ranges for each staff member as the date advances.",
              type: "cron",
            },
          ],
          lastCalculated: "Today at 00:00:00 BST (live synchronized)",
          nextCalculation: "Tomorrow at 00:00:00 BST (or upon leave approval)",
          cachingStrategy: "Cached daily with event invalidation on leave approval.",
        },
        rules: {
          included: [
            "Approved Annual, Sick, Casual, or Emergency leaves active today",
          ],
          excluded: [
            "Pending leave applications (unapproved)",
            "Rejected or cancelled leave requests",
            "Leaves scheduled for future or expired dates",
          ],
        },
        contributingData: {
          title: "Employees on Approved Leave Today",
          subtitle: "Staff members with active leave approved for today",
          items: [
            {
              id: "leave-1",
              primary: "David Miller",
              secondary: "Type: Annual Leave • Approver: HR Manager",
              status: "Approved",
              statusBadge:
                "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
              date: "Jun 28, 2026 - Jun 30, 2026",
            },
          ],
        },
        quickAction: {
          label: "Manage Leaves",
          path: "/admin/team/leaves",
        },
      };

    // ----------------------------------------------------
    // HR: Today's Attendance
    // ----------------------------------------------------
    case "clocked-in":
      return {
        id: "clocked-in",
        title: "Today's Attendance",
        category: "Human Resources / Shift Compliance",
        currentValue: "91.6%",
        badge: "Real-Time Clock-in Sync",
        scope: hrScope,
        description:
          "Percentage of expected working employees who have successfully completed clock-in for today's work shift.",
        formula: {
          expression:
            "Attendance Rate = (Clocked-In Staff / (Total Active Staff - Approved On Leave Today)) × 100%",
          explanation:
            "Computed by dividing employees with recorded clock-in today by the total working staff expected (excluding approved leaves).",
          variables: [
            {
              name: "Clocked-In Employees",
              value: "11 Staff",
              description: "Staff with clock-in logged today",
            },
            {
              name: "Expected Working Employees",
              value: "12 - 1 = 11 Staff",
              description: "Total staff minus those on approved leave",
            },
            {
              name: "Calculated Compliance",
              value: "(11 / 12) = 91.6%",
              description: "Overall workforce attendance rate today",
            },
          ],
          sqlQuery: `SELECT ROUND((COUNT(t.id)::decimal / NULLIF(COUNT(u.id), 0)) * 100, 1) AS attendance_pct 
FROM users u 
LEFT JOIN timesheets t ON t.user_id = u.id AND DATE(t.clock_in) = CURRENT_DATE 
WHERE u.role = 'STAFF' AND u.is_active = TRUE;`,
        },
        schedule: {
          frequency: "Continuous / Real-Time on Clock-In",
          frequencyType: "continuous",
          cronScheduleDescription:
            "Recalculated dynamically each time an employee clocks in or logs their shift in the Timesheet module.",
          triggerEvents: [
            {
              title: "Employee Clock-In Event",
              description:
                "Instant update when staff member clicks 'Clock In' in /admin/team/timesheets.",
              type: "user_action",
            },
            {
              title: "Shift Cutoff Time (10:30 AM BST)",
              description:
                "Shift cutoff evaluation triggers to flag missing clock-ins as Late or Absent.",
              type: "cron",
            },
          ],
          lastCalculated: "Live",
          nextCalculation: "Real-time on next employee clock-in action",
          cachingStrategy: "Live session state with atomic DB updates.",
        },
        rules: {
          included: [
            "Staff members who logged clock-in today before shift cutoff",
            "Normalized against total active working headcount",
          ],
          excluded: [
            "Staff on pre-approved leave (excluded from denominator)",
            "Weekend or company-wide public holidays",
          ],
        },
        contributingData: {
          title: "Today's Clock-in Status",
          subtitle: "Summary of attendance recorded across departments",
          items: [
            {
              id: "att-1",
              primary: "11 of 12 Employees Clocked In",
              secondary: "1 on approved annual leave (David Miller)",
              status: "On Schedule",
              statusBadge:
                "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
              date: "Shift Start: 09:30 AM",
            },
          ],
        },
        quickAction: {
          label: "View Timesheets",
          path: "/admin/team/timesheets",
        },
      };

    // ----------------------------------------------------
    // HR: Pending Approvals
    // ----------------------------------------------------
    case "pending-leaves":
      return {
        id: "pending-leaves",
        title: "Pending Approvals",
        category: "Human Resources / Action Queue",
        currentValue: "2 Requests",
        badge: "Real-Time Action Queue",
        scope: hrScope,
        description:
          "Number of employee leave applications or timesheet modification requests awaiting HR or Admin review and approval.",
        formula: {
          expression: "Pending Approvals = COUNT(LeaveRequest WHERE status = 'PENDING')",
          explanation:
            "Active queue count of leave submissions that require management action to approve or decline.",
          variables: [
            {
              name: "Pending Leave Requests",
              value: "2 Requests",
              description: "Awaiting HR decision",
            },
          ],
          sqlQuery: `SELECT COUNT(id) FROM leave_requests WHERE status = 'PENDING';`,
        },
        schedule: {
          frequency: "Real-Time / Instantaneous",
          frequencyType: "realtime",
          cronScheduleDescription:
            "Updated in real-time when employees submit leave requests or when HR takes action.",
          triggerEvents: [
            {
              title: "New Leave Application",
              description:
                "Triggered when a staff member submits a leave form.",
              type: "user_action",
            },
            {
              title: "Leave Approved or Rejected",
              description:
                "Queue counter decrements immediately upon approval/rejection.",
              type: "user_action",
            },
          ],
          lastCalculated: "Live",
          nextCalculation: "Instant upon next submission or approval action",
          cachingStrategy: "Direct reactive database query.",
        },
        rules: {
          included: [
            "All leave requests with status 'Pending'",
            "Timesheet modification requests requiring approval",
          ],
          excluded: [
            "Approved requests",
            "Rejected or withdrawn requests",
          ],
        },
        contributingData: {
          title: "Pending Action Queue",
          subtitle: "Requests awaiting HR decision",
          items: [
            {
              id: "req-1",
              primary: "Sarah Jenkins • Casual Leave",
              secondary: "Requested: Next Monday (1 day) • Reason: Personal",
              status: "Pending Review",
              statusBadge:
                "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
              date: "Submitted Yesterday",
            },
            {
              id: "req-2",
              primary: "Michael Chang • Sick Leave",
              secondary: "Requested: Jul 2 (2 days) • Medical certificate attached",
              status: "Pending Review",
              statusBadge:
                "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
              date: "Submitted Today",
            },
          ],
        },
        quickAction: {
          label: "Review Leave Requests",
          path: "/admin/team/leaves",
        },
      };

    default:
      return {
        id: cardId,
        title: "Metric Details",
        category: "Analytics",
        currentValue: "---",
        badge: "Real-Time",
        scope: defaultScope,
        description: "Detailed calculation formula and timing for this KPI metric.",
        formula: {
          expression: "Metric = Calculated Aggregate",
          explanation: "Aggregated from active filtered dataset.",
          variables: [],
          sqlQuery: "SELECT ...",
        },
        schedule: {
          frequency: "Real-Time",
          frequencyType: "realtime",
          cronScheduleDescription: "Updated continuously upon data changes.",
          triggerEvents: [],
          lastCalculated: "Live",
          nextCalculation: "Continuous",
          cachingStrategy: "In-memory reactive cache",
        },
        rules: { included: [], excluded: [] },
        contributingData: { title: "Contributing Data", subtitle: "", items: [] },
        quickAction: { label: "Go to Overview", path: "/admin/dashboard" },
      };
  }
}
