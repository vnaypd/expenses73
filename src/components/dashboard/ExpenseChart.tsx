import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Expense, Category } from '../../types';
import { useAnalytics } from '../../hooks/useAnalytics';
import { formatCurrency } from '../../utils/formatters';

interface ExpenseChartProps {
  expenses: Expense[];
  categories: Category[];
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ expenses, categories }) => {
  const { monthlyTrends, summary } = useAnalytics(expenses);
  
  // Get category color by name
  const getCategoryColor = (categoryName: string): string => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.color || '#6B7280'; // Default gray
  };
  
  // Format month labels for the chart
  const formatMonth = (monthYear: string) => {
    const [year, month] = monthYear.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short' });
  };
  
  // Custom tooltip for the bar chart
  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium">{formatMonth(payload[0].payload.month)} {payload[0].payload.month.split('-')[0]}</p>
          <p className="text-primary-600">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };
  
  // Custom tooltip for the pie chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium">{payload[0].name}</p>
          <p style={{ color: payload[0].payload.color }}>{formatCurrency(payload[0].value)}</p>
          <p className="text-gray-600">{payload[0].payload.percentage.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Trends</h3>
        <div className="h-64">
          {monthlyTrends.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrends} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis 
                  dataKey="month" 
                  tickFormatter={formatMonth} 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tickFormatter={(value) => `$${value}`}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar 
                  dataKey="amount" 
                  fill="#3B82F6" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">No data available</p>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Spending by Category</h3>
        <div className="h-64">
          {summary.categorySummary.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={summary.categorySummary.map(cat => ({
                    ...cat,
                    color: getCategoryColor(cat.category)
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                  nameKey="category"
                >
                  {summary.categorySummary.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={getCategoryColor(entry.category)}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">No data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseChart;