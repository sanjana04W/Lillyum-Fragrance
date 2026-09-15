'use client';

import { useState, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  Users,
  Search,
  Plus,
  Eye,
  Power,
  Edit2,
  Trash2,
  X,
  Check,
  LayoutDashboard,
  ShoppingBag,
  Layers,
  MessageSquare,
  BarChart2,
  Settings,
  CheckSquare,
  Square,
  AlertCircle,
} from 'lucide-react';
import { CustomerProfile } from '@/types';
import { getAllCustomers } from '@/services/firestoreService';
import toast from 'react-hot-toast';

type RoleType = 'Super Admin' | 'Staff';

interface PermissionItem {
  id: string;
  label: string;
}

interface PermissionGroup {
  id: string;
  name: string;
  icon: any;
  items: PermissionItem[];
}

const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    id: 'dashboard',
    name: 'DASHBOARD',
    icon: LayoutDashboard,
    items: [
      { id: 'dashboard_view', label: 'View Dashboard' },
    ],
  },
  {
    id: 'orders',
    name: 'ORDERS',
    icon: ShoppingBag,
    items: [
      { id: 'orders_view', label: 'View Orders' },
      { id: 'orders_update', label: 'Update Order Status' },
      { id: 'orders_whatsapp', label: 'Contact Customers via WhatsApp' },
    ],
  },
  {
    id: 'inventory',
    name: 'PRODUCTS & INVENTORY',
    icon: Layers,
    items: [
      { id: 'inventory_manage', label: 'Manage Stock & Inventory' },
      { id: 'products_view', label: 'View Products' },
      { id: 'products_add', label: 'Add New Products' },
      { id: 'products_edit', label: 'Edit Existing Products' },
      { id: 'products_delete', label: 'Delete Products' },
    ],
  },
  {
    id: 'messages',
    name: 'MESSAGES',
    icon: MessageSquare,
    items: [
      { id: 'messages_view', label: 'View Messages' },
      { id: 'messages_reply', label: 'Reply to Customer Inquiries' },
    ],
  },
  {
    id: 'customers',
    name: 'CUSTOMERS',
    icon: Users,
    items: [
      { id: 'customers_view', label: 'View Customer Profiles' },
    ],
  },
  {
    id: 'analytics',
    name: 'ANALYTICS',
    icon: BarChart2,
    items: [
      { id: 'analytics_view', label: 'View Analytics & Revenue' },
      { id: 'analytics_reports', label: 'View Sales Reports' },
    ],
  },
  {
    id: 'settings',
    name: 'SETTINGS',
    icon: Settings,
    items: [
      { id: 'settings_system', label: 'System Settings' },
      { id: 'settings_promotions', label: 'Promotions & Discounts' },
      { id: 'settings_audit', label: 'Audit Logs' },
      { id: 'settings_users', label: 'User Management' },
    ],
  },
];

// All permission IDs
const ALL_PERMISSION_IDS: string[] = PERMISSION_GROUPS.flatMap((g) =>
  g.items.map((i) => i.id)
);

// Staff access ONLY to Dashboard, Order Management, Stock & Inventory, and Messages
const STAFF_RECOMMENDED_PERMISSIONS: string[] = [
  'dashboard_view',
  'orders_view',
  'orders_update',
  'orders_whatsapp',
  'inventory_manage',
  'messages_view',
  'messages_reply',
];

interface AdminStaff {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  department: string;
  status: 'Active' | 'Inactive';
  permissions: string[];
}

const DEFAULT_STAFF: AdminStaff[] = [
  {
    id: 'staff-1',
    name: 'Lillyum Owner',
    email: 'admin@lillyumfragrance.lk',
    role: 'Super Admin',
    department: 'Executive Management',
    status: 'Active',
    permissions: [...ALL_PERMISSION_IDS],
  },
  {
    id: 'staff-2',
    name: 'Kasun Perera',
    email: 'kasun@lillyumfragrance.lk',
    role: 'Staff',
    department: 'Order Processing & Fulfillment',
    status: 'Active',
    permissions: [...STAFF_RECOMMENDED_PERMISSIONS],
  },
  {
    id: 'staff-3',
    name: 'Nadeesha Fernando',
    email: 'nadeesha@lillyumfragrance.lk',
    role: 'Staff',
    department: 'Inventory & Operations',
    status: 'Active',
    permissions: [...STAFF_RECOMMENDED_PERMISSIONS],
  },
];

export default function UserManagementPage() {
  const [tab, setTab] = useState<'staff' | 'customers'>('staff');
  const [staffList, setStaffList] = useState<AdminStaff[]>(DEFAULT_STAFF);
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [search, setSearch] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedStaff, setSelectedStaff] = useState<AdminStaff | null>(null);

  // View modal state
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewStaff, setViewStaff] = useState<AdminStaff | null>(null);

  // Form fields inside Add/Edit modal
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formStatus, setFormStatus] = useState<'Active' | 'Inactive'>('Active');
  const [formRole, setFormRole] = useState<RoleType>('Staff');
  const [formPermissions, setFormPermissions] = useState<string[]>(STAFF_RECOMMENDED_PERMISSIONS);

  // Load staff from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('lillyum_backend_staff');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setStaffList(parsed as AdminStaff[]);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveStaffList = (updated: AdminStaff[]) => {
    setStaffList(updated);
    localStorage.setItem('lillyum_backend_staff', JSON.stringify(updated));
  };

  // Load customers on tab change
  useEffect(() => {
    if (tab === 'customers' && customers.length === 0) {
      setLoadingCustomers(true);
      getAllCustomers()
        .then((data) => setCustomers(data))
        .finally(() => setLoadingCustomers(false));
    }
  }, [tab, customers.length]);

  // Open Add Modal
  const handleOpenAddModal = () => {
    setModalMode('add');
    setSelectedStaff(null);
    setFormName('');
    setFormEmail('');
    setFormStatus('Active');
    setFormRole('Staff');
    setFormPermissions([...STAFF_RECOMMENDED_PERMISSIONS]);
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (staff: AdminStaff) => {
    setModalMode('edit');
    setSelectedStaff(staff);
    setFormName(staff.name);
    setFormEmail(staff.email);
    setFormStatus(staff.status);
    setFormRole(staff.role);
    setFormPermissions([...staff.permissions]);
    setModalOpen(true);
  };

  // Open View Modal
  const handleOpenViewModal = (staff: AdminStaff) => {
    setViewStaff(staff);
    setViewModalOpen(true);
  };

  // Toggle active status in table
  const handleToggleStatus = (staff: AdminStaff) => {
    const nextStatus: 'Active' | 'Inactive' = staff.status === 'Active' ? 'Inactive' : 'Active';
    const updated: AdminStaff[] = staffList.map((s) =>
      s.id === staff.id ? { ...s, status: nextStatus } : s
    );
    saveStaffList(updated);
    toast.success(`${staff.name} is now ${nextStatus}`);
  };

  // Delete staff member
  const handleDeleteStaff = (staff: AdminStaff) => {
    if (staff.role === 'Super Admin') {
      toast.error('Cannot delete the primary Super Admin account.');
      return;
    }
    if (confirm(`Are you sure you want to remove ${staff.name}?`)) {
      const updated = staffList.filter((s) => s.id !== staff.id);
      saveStaffList(updated);
      toast.success(`${staff.name} removed successfully.`);
    }
  };

  // Role selector click in modal
  const handleSelectRoleInModal = (role: RoleType) => {
    setFormRole(role);
    if (role === 'Super Admin') {
      setFormPermissions([...ALL_PERMISSION_IDS]);
      toast('Full access granted for Super Admin', { icon: '👑' });
    } else {
      setFormPermissions([...STAFF_RECOMMENDED_PERMISSIONS]);
      toast('Staff permissions set (Dashboard, Orders, Stock, Messages)', { icon: '👤' });
    }
  };

  // Toggle individual permission checkbox
  const handleTogglePermission = (permId: string) => {
    setFormPermissions((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
    );
  };

  // Toggle all permissions in a group
  const handleToggleGroup = (group: PermissionGroup) => {
    const groupIds = group.items.map((i) => i.id);
    const allSelected = groupIds.every((id) => formPermissions.includes(id));

    if (allSelected) {
      setFormPermissions((prev) => prev.filter((id) => !groupIds.includes(id)));
    } else {
      setFormPermissions((prev) => Array.from(new Set([...prev, ...groupIds])));
    }
  };

  // Select All Permissions
  const handleSelectAllPermissions = () => {
    setFormPermissions([...ALL_PERMISSION_IDS]);
  };

  // Clear All Permissions
  const handleClearAllPermissions = () => {
    setFormPermissions([]);
  };

  // Submit Modal Form
  const handleSubmitModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) {
      toast.error('Please enter full name and email address.');
      return;
    }

    if (modalMode === 'add') {
      const newStaff: AdminStaff = {
        id: `staff-${Date.now()}`,
        name: formName.trim(),
        email: formEmail.trim(),
        role: formRole,
        department: formRole === 'Super Admin' ? 'Executive Management' : 'Operations & Support',
        status: formStatus,
        permissions: formPermissions,
      };
      saveStaffList([...staffList, newStaff]);
      toast.success(`Staff member "${newStaff.name}" added successfully.`);
    } else if (modalMode === 'edit' && selectedStaff) {
      const updated = staffList.map((s) =>
        s.id === selectedStaff.id
          ? {
              ...s,
              name: formName.trim(),
              email: formEmail.trim(),
              status: formStatus,
              role: formRole,
              permissions: formPermissions,
            }
          : s
      );
      saveStaffList(updated);
      toast.success(`Profile for "${formName}" updated successfully.`);
    }

    setModalOpen(false);
  };

  // Filtered staff list
  const filteredStaff = staffList.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl border border-brand-light p-6 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-gold-soft border border-brand-gold/30 text-brand-gold flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck size={26} />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-brand-charcoal">
              Backend Staff Profiles
            </h1>
            <p className="text-brand-charcoal/60 text-xs mt-0.5">
              Manage Role-Based Access Control (RBAC) permissions &amp; staff logins.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="bg-brand-gold hover:bg-brand-gold-dark text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-full flex items-center gap-2 shadow-soft hover:shadow-gold transition-all shrink-0 cursor-pointer"
        >
          <Plus size={16} />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-brand-light pb-2">
        <button
          onClick={() => setTab('staff')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            tab === 'staff'
              ? 'bg-brand-gold-soft text-brand-gold-dark border border-brand-gold/30 font-bold shadow-2xs'
              : 'text-brand-charcoal/60 hover:text-brand-charcoal hover:bg-brand-cream/60'
          }`}
        >
          Staff &amp; Access Roles ({staffList.length})
        </button>
        <button
          onClick={() => setTab('customers')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            tab === 'customers'
              ? 'bg-brand-gold-soft text-brand-gold-dark border border-brand-gold/30 font-bold shadow-2xs'
              : 'text-brand-charcoal/60 hover:text-brand-charcoal hover:bg-brand-cream/60'
          }`}
        >
          Customer Accounts
        </button>
      </div>

      {tab === 'staff' ? (
        <div className="bg-white rounded-3xl border border-brand-light shadow-soft overflow-hidden">
          {/* Table Search Header */}
          <div className="p-4 border-b border-brand-light bg-brand-cream/30 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-charcoal/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search staff by name or email..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-brand-light rounded-xl text-xs text-brand-charcoal placeholder-brand-charcoal/40 focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
              />
            </div>
            <div className="text-[11px] font-semibold text-brand-charcoal/50">
              Showing {filteredStaff.length} member{filteredStaff.length !== 1 ? 's' : ''}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-light bg-brand-cream/50 text-[11px] font-bold text-brand-charcoal/60 uppercase tracking-wider">
                  <th className="text-left px-5 py-3.5">Member</th>
                  <th className="text-left px-4 py-3.5">Role</th>
                  <th className="text-left px-4 py-3.5">Permissions</th>
                  <th className="text-left px-4 py-3.5">Status</th>
                  <th className="text-right px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-light">
                {filteredStaff.map((member) => {
                  const isOwner = member.role === 'Super Admin';
                  const permCount = member.permissions.length;
                  const isAllPerms = permCount >= ALL_PERMISSION_IDS.length;

                  return (
                    <tr key={member.id} className="hover:bg-brand-cream/40 transition-colors">
                      {/* Member Info */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-2xs ${
                              isOwner ? 'bg-brand-gold' : 'bg-brand-charcoal/80'
                            }`}
                          >
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-brand-charcoal">{member.name}</p>
                            <p className="text-[11px] text-brand-charcoal/50">{member.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="px-4 py-4">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border inline-flex items-center gap-1 ${
                            isOwner
                              ? 'bg-amber-50 text-amber-900 border-amber-200'
                              : 'bg-blue-50 text-blue-800 border-blue-200'
                          }`}
                        >
                          {isOwner ? '👑 Super Admin' : '👤 Staff'}
                        </span>
                      </td>

                      {/* Permissions Summary */}
                      <td className="px-4 py-4">
                        {isAllPerms ? (
                          <span className="text-xs font-semibold text-brand-charcoal/80">
                            All permissions
                          </span>
                        ) : (
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-brand-gold-dark">
                              {permCount} permissions
                            </span>
                            <span className="text-[10px] text-brand-charcoal/40">
                              Dashboard, Orders, Stock, Messages
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span
                          className={`text-[11px] font-semibold px-3 py-1 rounded-full inline-flex items-center gap-1.5 border ${
                            member.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                              : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              member.status === 'Active' ? 'bg-emerald-500' : 'bg-neutral-400'
                            }`}
                          />
                          <span className="uppercase tracking-wider text-[10px] font-bold">
                            {member.status}
                          </span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Details */}
                          <button
                            onClick={() => handleOpenViewModal(member)}
                            className="p-1.5 rounded-lg text-brand-charcoal/50 hover:text-brand-gold hover:bg-brand-gold-soft transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>

                          {/* Power Toggle */}
                          <button
                            onClick={() => handleToggleStatus(member)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              member.status === 'Active'
                                ? 'text-emerald-600 hover:bg-emerald-50'
                                : 'text-neutral-400 hover:bg-neutral-100'
                            }`}
                            title={member.status === 'Active' ? 'Deactivate Account' : 'Activate Account'}
                          >
                            <Power size={16} />
                          </button>

                          {/* Edit Pencil */}
                          <button
                            onClick={() => handleOpenEditModal(member)}
                            className="p-1.5 rounded-lg text-brand-charcoal/50 hover:text-brand-gold hover:bg-brand-gold-soft transition-colors"
                            title="Edit Staff Member"
                          >
                            <Edit2 size={16} />
                          </button>

                          {/* Delete Trash */}
                          {!isOwner && (
                            <button
                              onClick={() => handleDeleteStaff(member)}
                              className="p-1.5 rounded-lg text-brand-charcoal/40 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete Member"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Customer Accounts Tab */
        <div className="bg-white rounded-3xl border border-brand-light shadow-soft overflow-hidden">
          {loadingCustomers ? (
            <div className="p-12 text-center text-xs text-brand-charcoal/50">
              Loading customer accounts...
            </div>
          ) : customers.length === 0 ? (
            <div className="p-12 text-center text-xs text-brand-charcoal/50">
              No customer records found.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-light bg-brand-cream/50 text-[11px] font-bold text-brand-charcoal/60 uppercase tracking-wider">
                  <th className="text-left px-5 py-3.5">Customer</th>
                  <th className="text-left px-4 py-3.5">Phone</th>
                  <th className="text-left px-4 py-3.5">Orders</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-light">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-brand-cream/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-xs font-semibold text-brand-charcoal">{c.name}</p>
                      <p className="text-[11px] text-brand-charcoal/50">{c.email}</p>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-brand-charcoal/70">{c.phone || '-'}</td>
                    <td className="px-4 py-3.5 text-xs font-bold text-brand-gold">
                      {c.orderHistory?.length ?? 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* EDIT / ADD STAFF MEMBER MODAL                           */}
      {/* ======================================================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-charcoal/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-brand-light shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-brand-light flex items-start justify-between bg-brand-cream/30">
              <div>
                <h2 className="font-serif text-xl font-bold text-brand-charcoal">
                  {modalMode === 'edit' ? 'Edit Staff Member' : 'Add Staff Member'}
                </h2>
                <p className="text-brand-charcoal/50 text-xs mt-0.5">
                  Assign a role and choose individual permissions.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-brand-charcoal/40 hover:text-brand-charcoal hover:bg-brand-cream rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitModal} className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* Full Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-charcoal">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Kasun Perera"
                    className="w-full px-3.5 py-2.5 bg-brand-cream/50 border border-brand-light rounded-xl text-xs text-brand-charcoal placeholder-brand-charcoal/30 focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-charcoal">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="e.g. kasun@lillyumfragrance.lk"
                    className="w-full px-3.5 py-2.5 bg-brand-cream/50 border border-brand-light rounded-xl text-xs text-brand-charcoal placeholder-brand-charcoal/30 focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
                  />
                </div>
              </div>

              {/* Account Status Card */}
              <div className="p-4 rounded-2xl border border-brand-light bg-brand-cream/30 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-brand-charcoal">Account Status</p>
                  <p className="text-[11px] text-brand-charcoal/50">
                    Inactive accounts cannot access the admin panel.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormStatus((prev) => (prev === 'Active' ? 'Inactive' : 'Active'))
                  }
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer p-0.5 ${
                    formStatus === 'Active' ? 'bg-emerald-500' : 'bg-neutral-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                      formStatus === 'Active' ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Role Selection Cards */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-charcoal">
                  Role <span className="text-red-500">*</span>{' '}
                  <span className="font-normal text-brand-charcoal/50 text-[11px]">
                    — Selecting a role pre-fills recommended permissions
                  </span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Staff Card */}
                  <div
                    onClick={() => handleSelectRoleInModal('Staff')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      formRole === 'Staff'
                        ? 'border-brand-gold bg-brand-gold-soft/30 shadow-xs'
                        : 'border-brand-light hover:border-brand-gold/40 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          formRole === 'Staff'
                            ? 'border-brand-gold bg-brand-gold text-white'
                            : 'border-brand-charcoal/30'
                        }`}
                      >
                        {formRole === 'Staff' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="font-bold text-xs text-brand-charcoal">Staff</span>
                    </div>
                    <p className="text-[11px] text-brand-charcoal/60 pl-6 leading-relaxed">
                      Access to Dashboard, Orders, Stock &amp; Messages only.
                    </p>
                  </div>

                  {/* Super Admin Card */}
                  <div
                    onClick={() => handleSelectRoleInModal('Super Admin')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      formRole === 'Super Admin'
                        ? 'border-brand-gold bg-brand-gold-soft/30 shadow-xs'
                        : 'border-brand-light hover:border-brand-gold/40 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          formRole === 'Super Admin'
                            ? 'border-brand-gold bg-brand-gold text-white'
                            : 'border-brand-charcoal/30'
                        }`}
                      >
                        {formRole === 'Super Admin' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="font-bold text-xs text-brand-charcoal">Super Admin</span>
                    </div>
                    <p className="text-[11px] text-brand-charcoal/60 pl-6 leading-relaxed">
                      Full unrestricted access to all features.
                    </p>
                  </div>
                </div>
              </div>

              {/* Access Permissions Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-brand-light pb-2">
                  <h3 className="font-bold text-xs text-brand-charcoal uppercase tracking-wider">
                    Access Permissions
                  </h3>
                  <div className="flex items-center gap-3 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={handleSelectAllPermissions}
                      className="text-brand-gold hover:text-brand-gold-dark cursor-pointer underline"
                    >
                      Select All
                    </button>
                    <span className="text-brand-light">|</span>
                    <button
                      type="button"
                      onClick={handleClearAllPermissions}
                      className="text-brand-charcoal/40 hover:text-brand-charcoal cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {/* Permission Category Groups */}
                <div className="space-y-3">
                  {PERMISSION_GROUPS.map((group) => {
                    const GroupIcon = group.icon;
                    const groupIds = group.items.map((i) => i.id);
                    const selectedCount = groupIds.filter((id) =>
                      formPermissions.includes(id)
                    ).length;
                    const allSelected = selectedCount === groupIds.length;
                    const someSelected = selectedCount > 0 && !allSelected;

                    return (
                      <div
                        key={group.id}
                        className="rounded-2xl border border-brand-light overflow-hidden bg-white shadow-2xs"
                      >
                        {/* Group Header */}
                        <div className="px-4 py-2.5 bg-brand-cream/40 border-b border-brand-light flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <GroupIcon size={14} className="text-brand-gold" />
                            <span className="text-xs font-bold text-brand-charcoal tracking-wide">
                              {group.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-semibold text-brand-charcoal/50">
                              {selectedCount}/{groupIds.length} selected
                            </span>
                            <button
                              type="button"
                              onClick={() => handleToggleGroup(group)}
                              className="text-brand-gold hover:text-brand-gold-dark cursor-pointer p-0.5"
                              title={allSelected ? 'Deselect group' : 'Select entire group'}
                            >
                              {allSelected ? (
                                <CheckSquare size={16} className="text-brand-gold" />
                              ) : someSelected ? (
                                <div className="w-4 h-4 rounded border border-brand-gold flex items-center justify-center">
                                  <div className="w-2 h-2 bg-brand-gold rounded-xs" />
                                </div>
                              ) : (
                                <Square size={16} className="text-brand-charcoal/30" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Group Items */}
                        <div className="p-3.5 space-y-2">
                          {group.items.map((item) => {
                            const isChecked = formPermissions.includes(item.id);
                            return (
                              <label
                                key={item.id}
                                className="flex items-center gap-2.5 cursor-pointer select-none group"
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleTogglePermission(item.id)}
                                  className="hidden"
                                />
                                <div
                                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                    isChecked
                                      ? 'bg-brand-gold border-brand-gold text-white'
                                      : 'border-brand-charcoal/30 group-hover:border-brand-gold/60'
                                  }`}
                                >
                                  {isChecked && <Check size={12} strokeWidth={3} />}
                                </div>
                                <span
                                  className={`text-xs ${
                                    isChecked
                                      ? 'font-semibold text-brand-charcoal'
                                      : 'text-brand-charcoal/70'
                                  }`}
                                >
                                  {item.label}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-brand-light flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-brand-light text-brand-charcoal/70 hover:bg-brand-cream text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-gold hover:bg-brand-gold-dark text-white text-xs font-bold shadow-soft transition-all"
                >
                  {modalMode === 'edit' ? 'Save Changes' : 'Add Staff Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW STAFF MEMBER MODAL                                  */}
      {/* ======================================================== */}
      {viewModalOpen && viewStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-charcoal/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-brand-light shadow-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-gold text-white font-bold text-lg flex items-center justify-center shadow-xs">
                  {viewStaff.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-brand-charcoal">{viewStaff.name}</h3>
                  <p className="text-xs text-brand-charcoal/50">{viewStaff.email}</p>
                </div>
              </div>
              <button
                onClick={() => setViewModalOpen(false)}
                className="p-1 text-brand-charcoal/40 hover:text-brand-charcoal rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-brand-light">
                <span className="text-brand-charcoal/50">Assigned Role</span>
                <span className="font-bold text-brand-charcoal">{viewStaff.role}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-brand-light">
                <span className="text-brand-charcoal/50">Status</span>
                <span className="font-bold text-emerald-600">● {viewStaff.status}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-brand-light">
                <span className="text-brand-charcoal/50">Department</span>
                <span className="font-bold text-brand-charcoal">{viewStaff.department}</span>
              </div>
              <div className="py-2">
                <span className="text-brand-charcoal/50 block mb-2 font-bold uppercase tracking-wider text-[10px]">
                  Granted Permissions ({viewStaff.permissions.length}):
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1">
                  {viewStaff.permissions.map((p) => {
                    const item = ALL_PERMISSION_IDS.find((id) => id === p);
                    return (
                      <span
                        key={p}
                        className="bg-brand-cream border border-brand-light px-2.5 py-1 rounded-lg text-[11px] font-semibold text-brand-charcoal"
                      >
                        ✓ {p.replace(/_/g, ' ')}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewModalOpen(false)}
                className="px-4 py-2 bg-brand-gold text-white font-bold text-xs rounded-xl hover:bg-brand-gold-dark transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

