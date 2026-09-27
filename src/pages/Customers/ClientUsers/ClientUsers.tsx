import React, { useState, useMemo } from "react";
import AnimatedContainer from "@/common/AnimatedContainer";
import {
  Search,
  Plus,
  Filter,
  Star,
  Trash2,
  Mail,
  Phone,
  ArrowUpDown,
  Building2,
  CheckSquare,
  Square,
} from "lucide-react";
import { toast } from "sonner";
import { ClientUser } from "../types";
import { CreateClientUserModal } from "./_components/CreateClientUserModal";
import { Avatar } from "@/common/Avatar";

// Initial Demo Client Users matching the second screenshot
const initialClientUsersData: ClientUser[] = [
  {
    id: "user-1",
    name: "Dr Golam Mahmud Suhash",
    isStarred: true,
    clientId: 15,
    clientName: "Nitor",
    email: "sanirjhar@gmail.com",
    phone: "---",
    lastSeen: "---",
    role: "Director",
  },
  {
    id: "user-2",
    name: "Smile Dental Plan 9 Furler Steet Totowa, NJ 07512",
    isStarred: true,
    clientId: 6,
    clientName: "Smile Dental Pl...",
    email: "will@mdpsmile.com",
    phone: "---",
    lastSeen: "---",
    role: "Admin Contact",
  },
  {
    id: "user-3",
    name: "Software Software",
    isStarred: true,
    clientId: 19,
    clientName: "Eminence",
    email: "info@eminence.com",
    phone: "---",
    lastSeen: "---",
    role: "Operations Head",
  },
  {
    id: "user-4",
    name: "Tanvir Rahman",
    isStarred: true,
    clientId: 20,
    clientName: "XYZ Organiztaio...",
    email: "info@xyz.com",
    phone: "---",
    lastSeen: "---",
    role: "Managing Partner",
  },
];

const availableClients = [
  { id: 19, companyName: "Eminence" },
  { id: 15, companyName: "Nitor" },
  { id: 6, companyName: "Smile Dental Plan" },
  { id: 20, companyName: "XYZ Organization" },
];

const ClientUsers: React.FC = () => {
  const [users, setUsers] = useState<ClientUser[]>(initialClientUsersData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Sorting
  const [sortField, setSortField] = useState<keyof ClientUser>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (field: keyof ClientUser) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Toggle Favorite Star
  const handleToggleStar = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isStarred: !u.isStarred } : u))
    );
  };

  // Select all or single
  const handleSelectAll = () => {
    if (selectedUserIds.length === users.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(users.map((u) => u.id));
    }
  };

  const handleToggleSelectRow = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  // Create User
  const handleCreateUser = (newUserData: Omit<ClientUser, "id">) => {
    const newUser: ClientUser = {
      ...newUserData,
      id: `user-${Date.now().toString().slice(-4)}`,
    };
    setUsers((prev) => [newUser, ...prev]);
    toast.success(`Client contact "${newUser.name}" added successfully!`);
  };

  // Delete User
  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setSelectedUserIds((prev) => prev.filter((id) => id !== userId));
    toast.error("Contact user removed.");
  };

  // Filtered & Sorted
  const filteredUsers = useMemo(() => {
    return users
      .filter((u) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          u.name.toLowerCase().includes(q) ||
          u.clientName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.phone.includes(q)
        );
      })
      .sort((a, b) => {
        const valA = String(a[sortField] || "").toLowerCase();
        const valB = String(b[sortField] || "").toLowerCase();
        return sortOrder === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      });
  }, [users, searchQuery, sortField, sortOrder]);

  return (
    <AnimatedContainer>
      <div className="space-y-6">
        {/* Top Header Row matching screenshot */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Users
            </h1>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
              APP &gt; CLIENTS &gt; USERS
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-44 sm:w-56 pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-brand/30 shadow-2xs"
              />
            </div>

            {/* Filter Funnel Icon Button */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1 shadow-2xs">
              <button
                type="button"
                title="Filter Users"
                onClick={() => toast.info("Filter client users")}
                className="p-1.5 rounded-lg text-sky-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>

            {/* Circular Floating Plus Button matching demo */}
            <button
              type="button"
              title="Add Client User"
              onClick={() => setIsCreateModalOpen(true)}
              className="w-9 h-9 rounded-full bg-primary-brand hover:bg-primary-brand/90 text-white flex items-center justify-center shadow-md hover:shadow-primary-brand/30 transition-all hover:scale-105 active:scale-95 cursor-pointer ml-1"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Selected row action bar */}
        {selectedUserIds.length > 0 && (
          <div className="flex items-center justify-between px-4 py-2 bg-primary-brand/10 border border-primary-brand/20 rounded-xl text-xs font-semibold text-primary-brand animate-in fade-in">
            <span>{selectedUserIds.length} contact(s) selected</span>
            <button
              onClick={() => {
                setUsers((prev) => prev.filter((u) => !selectedUserIds.includes(u.id)));
                setSelectedUserIds([]);
                toast.success("Selected contacts deleted.");
              }}
              className="text-rose-600 hover:underline flex items-center gap-1 font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Selected
            </button>
          </div>
        )}

        {/* Client Users Data Table matching demo screenshot */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3.5 w-10">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {selectedUserIds.length === users.length && users.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-primary-brand" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th
                    onClick={() => handleSort("name")}
                    className="px-5 py-3.5 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    <div className="flex items-center gap-1">
                      <span>Name</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort("clientName")}
                    className="px-5 py-3.5 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    <div className="flex items-center gap-1">
                      <span>Client</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort("email")}
                    className="px-5 py-3.5 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    <div className="flex items-center gap-1">
                      <span>Email</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <span>Phone</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <span>Last Seen</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3.5 text-right w-16">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredUsers.map((user) => {
                  const isSelected = selectedUserIds.includes(user.id);

                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group ${
                        isSelected ? "bg-primary-brand/5 dark:bg-primary-brand/10" : ""
                      }`}
                    >
                      {/* Checkbox column */}
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          onClick={() => handleToggleSelectRow(user.id)}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-primary-brand" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Name + Avatar + Star matching screenshot */}
                      <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-slate-100">
                        <div className="flex items-center gap-2.5 max-w-sm">
                          <Avatar name={user.name} size="sm" />
                          <span className="text-sky-600 dark:text-sky-400 font-semibold hover:underline cursor-pointer truncate">
                            {user.name}
                          </span>
                          <button
                            type="button"
                            title={user.isStarred ? "Primary Contact" : "Mark as Primary"}
                            onClick={() => handleToggleStar(user.id)}
                            className="text-amber-400 hover:scale-110 transition-transform shrink-0"
                          >
                            <Star
                              className={`w-3.5 h-3.5 ${
                                user.isStarred ? "fill-amber-400 text-amber-400" : "text-slate-300"
                              }`}
                            />
                          </button>
                        </div>
                      </td>

                      {/* Client Company Link */}
                      <td className="px-5 py-3.5">
                        <span className="text-sky-600 dark:text-sky-400 font-medium hover:underline cursor-pointer">
                          {user.clientName}
                        </span>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                        {user.email || "---"}
                      </td>

                      {/* Phone */}
                      <td className="px-5 py-3.5 text-slate-400">
                        {user.phone || "---"}
                      </td>

                      {/* Last Seen */}
                      <td className="px-5 py-3.5 text-slate-400">
                        {user.lastSeen || "---"}
                      </td>

                      {/* Row Delete Action */}
                      <td className="px-4 py-3.5 text-right">
                        <button
                          type="button"
                          title="Delete contact"
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 opacity-70 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No client users found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Client User Modal */}
        <CreateClientUserModal
          isOpen={isCreateModalOpen}
          clients={availableClients}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateUser}
        />
      </div>
    </AnimatedContainer>
  );
};

export default ClientUsers;