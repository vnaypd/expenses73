import React from 'react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { User, Settings, Bell, Lock, LogOut } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { user, signOut } = useAuthStore();
  const { darkMode, currency, toggleDarkMode, setCurrency } = useThemeStore();

  const handleSignOut = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      await signOut();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="card col-span-2">
          <div className="flex items-center space-x-3 mb-6">
            <User className="h-6 w-6 text-primary-600" />
            <h2 className="text-lg font-medium">Profile Settings</h2>
          </div>

          <div className="space-y-4">
            <div className="form-group">
              <label className="form-label">Display Name</label>
              <input
                type="text"
                className="input"
                value={user?.displayName || ''}
                placeholder="Your name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="input"
                value={user?.email || ''}
                disabled
              />
            </div>

            <button className="btn-primary">Update Profile</button>
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <Settings className="h-6 w-6 text-primary-600" />
              <h2 className="text-lg font-medium">Preferences</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Currency</span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="input w-auto"
                >
                  <option value="INR">₹ INR</option>
                  <option value="USD">$ USD</option>
                  <option value="EUR">€ EUR</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Dark Mode</span>
                <button
                  onClick={toggleDarkMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    darkMode ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="card bg-error-50">
            <div className="flex items-center space-x-3 mb-6">
              <Lock className="h-6 w-6 text-error-600" />
              <h2 className="text-lg font-medium text-error-700">Account Actions</h2>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleSignOut}
                className="btn w-full bg-error-600 text-white hover:bg-error-700 focus:ring-error-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};