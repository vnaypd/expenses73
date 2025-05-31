import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  DollarSign, 
  BarChart2, 
  PieChart, 
  Tag, 
  Settings, 
  X,
  CreditCard
} from 'lucide-react';

interface SidebarProps {
  mobile: boolean;
  closeSidebar?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobile, closeSidebar }) => {
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Expenses', href: '/expenses', icon: DollarSign },
    { name: 'Categories', href: '/categories', icon: Tag },
    { name: 'Analytics', href: '/analytics', icon: BarChart2 },
    { name: 'Reports', href: '/reports', icon: PieChart },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="h-0 flex-1 flex flex-col overflow-y-auto border-r border-gray-200 bg-white">
      {mobile && (
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <div className="flex items-center">
            <CreditCard className="h-8 w-8 text-primary-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">ExpenseTrack</span>
          </div>
          <button
            type="button"
            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            onClick={closeSidebar}
          >
            <span className="sr-only">Close sidebar</span>
            <X className="h-6 w-6 text-gray-400" aria-hidden="true" />
          </button>
        </div>
      )}

      {!mobile && (
        <div className="flex items-center h-16 px-4">
          <CreditCard className="h-8 w-8 text-primary-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">ExpenseTrack</span>
        </div>
      )}

      <div className="mt-5 flex-1 flex flex-col">
        <nav className="flex-1 px-2 pb-4 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 text-primary-600 transform scale-105'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-primary-600'
                }`
              }
              onClick={mobile ? closeSidebar : undefined}
            >
              <item.icon
                className={`mr-3 flex-shrink-0 h-6 w-6 transition-colors duration-200`}
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="text-sm text-gray-500">
            <span className="block">ExpenseTrack</span>
            <span className="block text-xs">v0.1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;