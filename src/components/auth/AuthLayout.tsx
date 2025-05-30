import React from 'react';
import { CreditCard, BarChart3, TrendingUp } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
            <p className="text-gray-600">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden md:flex md:w-1/2 bg-primary-600 p-12 flex-col justify-center items-center text-white">
        <div className="max-w-md text-center">
          <h2 className="text-3xl font-bold mb-6">ExpenseTrack</h2>
          <p className="text-lg mb-12">Take control of your finances with our powerful expense tracking tool</p>
          
          <div className="grid grid-cols-1 gap-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-white/20 p-3 rounded-lg">
                <CreditCard className="h-6 w-6" />
              </div>
              <div className="ml-4 text-left">
                <h3 className="font-semibold">Track Your Expenses</h3>
                <p className="text-white/80 mt-1">Keep a detailed record of all your spending in one place</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-white/20 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div className="ml-4 text-left">
                <h3 className="font-semibold">Visualize Spending</h3>
                <p className="text-white/80 mt-1">See where your money goes with intuitive charts and reports</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-white/20 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="ml-4 text-left">
                <h3 className="font-semibold">Achieve Financial Goals</h3>
                <p className="text-white/80 mt-1">Make informed decisions to improve your financial health</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;