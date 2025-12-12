import React from 'react';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Sample data for grant analytics
const data = [
  { name: 'Jan', requested: 45000, approved: 30000, disbursed: 25000 },
  { name: 'Feb', requested: 52000, approved: 42000, disbursed: 38000 },
  { name: 'Mar', requested: 48000, approved: 35000, disbursed: 30000 },
  { name: 'Apr', requested: 60000, approved: 45000, disbursed: 40000 },
  { name: 'May', requested: 70000, approved: 55000, disbursed: 48000 },
  { name: 'Jun', requested: 65000, approved: 50000, disbursed: 42000 },
];

const GrantAnalyticsChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={(value) => `₹${value / 1000}K`} />
        <Tooltip 
          formatter={(value) => [`₹${value.toLocaleString()}`, '']}
          labelFormatter={(label) => `Month: ${label}`}
        />
        <Legend />
        <Bar dataKey="requested" name="Requested" fill="#94a3b8" radius={[4, 4, 0, 0]} />
        <Bar dataKey="approved" name="Approved" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
        <Bar dataKey="disbursed" name="Disbursed" fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default GrantAnalyticsChart;
