import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { StaffMember } from "./EditStaffPermissionsModal";

interface DeleteStaffConfirmModalProps {
  staff: StaffMember | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (staffId: string) => void;
}

export const DeleteStaffConfirmModal: React.FC<DeleteStaffConfirmModalProps> = ({
  staff,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !staff) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-card surface rounded-2xl w-full max-w-md border border-border shadow-2xl overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-secondary-text hover:text-primary-text hover:bg-light-background cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h3 className="text-base font-bold text-primary-text">
            Remove Team Member
          </h3>
          <p className="text-xs text-secondary-text mt-1">
            Are you sure you want to remove <span className="font-semibold text-primary-text">{staff.name}</span> ({staff.designation}) from the team?
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-secondary-text hover:text-primary-text hover:bg-light-background cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(staff.id);
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-md cursor-pointer"
          >
            Confirm Removal
          </button>
        </div>
      </div>
    </div>
  );
};
