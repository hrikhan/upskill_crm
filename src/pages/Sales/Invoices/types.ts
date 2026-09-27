export type InvoiceStatus = "paid" | "partially_paid" | "unpaid" | "overdue";

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoicePaymentRecord {
  id: string;
  amount: number;
  paymentDate: string;
  method: "Cash" | "bKash" | "Nagad" | "Bank Transfer" | "Credit Card";
  transactionId?: string;
  receivedBy: string;
  notes?: string;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  clientId: string;
  clientName: string;
  companyName: string;
  clientPhone: string;
  clientEmail: string;
  billingAddress: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  salesRep: string;
  items: InvoiceLineItem[];
  subtotal: number;
  taxPercent: number;
  taxAmount: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  dueBalance: number;
  payments: InvoicePaymentRecord[];
  notes?: string;
}
