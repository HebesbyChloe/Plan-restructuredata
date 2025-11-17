export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  team: string;
  avatar?: string;
  status: "active" | "away" | "offline";
  lastActive?: string;
  permissions?: string[];
}

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Nguyen",
    email: "sarah.nguyen@company.com",
    role: "Sales Representative",
    team: "Sale Team",
    status: "active",
    lastActive: "Just now",
    permissions: ["sales", "customers", "orders"],
  },
  {
    id: "2",
    name: "Michael Tran",
    email: "michael.tran@company.com",
    role: "Sales Representative",
    team: "Sale Team",
    status: "active",
    lastActive: "5 min ago",
    permissions: ["sales", "customers", "orders"],
  },
  {
    id: "3",
    name: "David Chen",
    email: "david.chen@company.com",
    role: "Sales Manager",
    team: "Sale Team",
    status: "active",
    lastActive: "2 min ago",
    permissions: ["sales", "customers", "orders", "reports", "team_management"],
  },
  {
    id: "4",
    name: "Jessica Lee",
    email: "jessica.lee@company.com",
    role: "Customer Service Representative",
    team: "Operation Team",
    status: "active",
    lastActive: "10 min ago",
    permissions: ["customers", "orders", "returns"],
  },
  {
    id: "5",
    name: "Emily Davis",
    email: "emily.davis@company.com",
    role: "Sales Representative",
    team: "Sale Team",
    status: "away",
    lastActive: "1 hour ago",
    permissions: ["sales", "customers", "orders"],
  },
  {
    id: "6",
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    role: "Sales Representative",
    team: "Sale Team",
    status: "active",
    lastActive: "Just now",
    permissions: ["sales", "customers", "orders"],
  },
  {
    id: "7",
    name: "Alex Kim",
    email: "alex.kim@company.com",
    role: "Sales Representative",
    team: "Sale Team",
    status: "active",
    lastActive: "15 min ago",
    permissions: ["sales", "customers", "orders"],
  },
  {
    id: "8",
    name: "Lisa Wang",
    email: "lisa.wang@company.com",
    role: "Sales Representative",
    team: "Sale Team",
    status: "active",
    lastActive: "30 min ago",
    permissions: ["sales", "customers", "orders"],
  },
];
