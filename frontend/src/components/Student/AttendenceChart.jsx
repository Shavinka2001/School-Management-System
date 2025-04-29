// src/components/Student/AttendanceChart.jsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const AttendanceChart = ({ attendance = null }) => {
  const defaultData = {
    present: 0,
    absent: 0,
    late: 0,
    total: 0,
    rate: "0%"
  };
  
  const data = attendance || defaultData;
  
  // Calculate percentages for chart
  const chartData = [
    { name: 'Present', value: data.present, color: '#10B981' },
    { name: 'Absent', value: data.absent, color: '#EF4444' },
    { name: 'Late', value: data.late, color: '#F59E0B' }
  ].filter(item => item.value > 0);
  
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Attendance</h2>
      
      {data.total > 0 ? (
        <>
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} days`, '']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500">Present</p>
              <p className="text-2xl font-bold text-green-500">{data.present}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Absent</p>
              <p className="text-2xl font-bold text-red-500">{data.absent}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Late</p>
              <p className="text-2xl font-bold text-yellow-500">{data.late}</p>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">Overall Attendance Rate</p>
            <p className="text-2xl font-bold">{data.rate}</p>
          </div>
        </>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <p>No attendance data available</p>
        </div>
      )}
    </div>
  );
};

export default AttendanceChart;