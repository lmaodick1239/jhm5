import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import './StatisticsView.css';

const StatisticsView = ({ tasks }) => {
  // Data preparation for chart visualization - groups tasks by status and priority
  const statusData = [
    { name: 'To-Do', value: tasks.filter((t) => t.status === 'To-Do').length },
    { name: 'In Progress', value: tasks.filter((t) => t.status === 'In Progress').length },
    { name: 'Done', value: tasks.filter((t) => t.status === 'Done').length },
  ];

  const priorityData = [
    { name: 'Low', count: tasks.filter((t) => t.priority === 'Low').length },
    { name: 'Medium', count: tasks.filter((t) => t.priority === 'Medium').length },
    { name: 'High', count: tasks.filter((t) => t.priority === 'High').length },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Done').length;
  const completionPercentage = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0;

  return (
    <div className="statistics-view">
      <h2>Statistics</h2>
      <div className="summary-card">
        <h3>Total Tasks: {totalTasks}</h3>
        <h3>Completion: {completionPercentage}%</h3>
      </div>
      {/* Interactive charts for visual task analysis using Recharts library */}
      <div className="charts">
        <div className="chart">
          <h3>Task Status</h3>
          <PieChart width={400} height={400}>
            <Pie
              data={statusData}
              cx={200}
              cy={200}
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
        <div className="chart">
          <h3>Task Priority</h3>
          <BarChart width={500} height={300} data={priorityData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default StatisticsView;
