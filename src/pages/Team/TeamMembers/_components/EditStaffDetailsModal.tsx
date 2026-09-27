import React, { useState, useEffect } from "react";
import { X, UserCheck } from "lucide-react";
import { StaffMember } from "./EditStaffPermissionsModal";

interface EditStaffDetailsModalProps {
  staff: StaffMember | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedStaff: StaffMember) => void;
}

export const EditStaffDetailsModal: React.FC<EditStaffDetailsModalProps> = ({
  staff,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");

  useEffect(() => {
    if (staff) {
      setName(staff.name);
      setEmail(staff.email);
      setPhone(staff.phone);
      setDepartment(staff.department);
      setDesignation(staff.designation);
    }
  }, [staff]);

  if (!isOpen || !staff) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      ...staff,
      name,
      email,
      phone,
      department,
      designation,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-card surface rounded-2xl w-full max-w-lg border border-border shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-primary-text">
                Edit Member Profile
              </h2>
              <p className="text-xs text-secondary-text">
                Update personal details and designation.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-secondary-text hover:text-primary-text hover:bg-light-background cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-primary-text mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-border bg-light-background text-primary-text focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-primary-text mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-border bg-light-background text-primary-text focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary-text mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-border bg-light-background text-primary-text focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-primary-text mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-border bg-light-background text-primary-text focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="Sales & Inquiries">Sales & Inquiries</option>
                <option value="Billing & Accounts">Billing & Accounts</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Operations & Fleet">Operations & Fleet</option>
                <option value="Customer Support">Customer Support</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary-text mb-1">
                Designation *
              </label>
              <input
                type="text"
                required
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Senior Sales Executive"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-border bg-light-background text-primary-text focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-secondary-text hover:text-primary-text hover:bg-light-background cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
