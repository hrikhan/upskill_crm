export interface Client {
  id: number;
  companyName: string;
  accountOwner: {
    name: string;
    avatar?: string;
  };
  pendingProjects: number;
  invoices: number; // e.g. 1000
  payments: number; // e.g. 2000
  tags: string[];
  phone?: string;
  email?: string;
  address?: string;
  createdDate?: string;
  industry?: string;
}

export interface ClientUser {
  id: string;
  name: string;
  avatar?: string;
  isStarred: boolean;
  clientId: number;
  clientName: string;
  email: string;
  phone: string;
  lastSeen: string;
  role?: string;
}
