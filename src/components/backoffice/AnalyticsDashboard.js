import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import MetricCard from '../common/MetricCard';

const AnalyticsDashboard = ({ analytics }) => {
  const [timeRange, setTimeRange] = useState('week'); // week, month, year
  
  // Colors for charts
  const COLORS = ['#6A75CA', '#23C16B', '#3ABFE4', '#8447FF', '#FF6D5A']; // n8n-inspired colors
  
  if (!analytics) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-cursor-muted">No analytics data available.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 glow-container">
      {/* Time range selector */}
      <div className="flex justify-end">
        <div className="inline-flex shadow-sm rounded-md">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-md ${
              timeRange === 'week'
                ? 'bg-n8n-green text-white'
                : 'bg-cursor-gray text-cursor-text hover:bg-cursor-lightgray'
            } border border-cursor-lightgray/30`}
            onClick={() => setTimeRange('week')}
          >
            Last Week
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${
              timeRange === 'month'
                ? 'bg-n8n-green text-white'
                : 'bg-cursor-gray text-cursor-text hover:bg-cursor-lightgray'
            } border-t border-b border-cursor-lightgray/30`}
            onClick={() => setTimeRange('month')}
          >
            Last Month
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-md ${
              timeRange === 'year'
                ? 'bg-n8n-green text-white'
                : 'bg-cursor-gray text-cursor-text hover:bg-cursor-lightgray'
            } border border-cursor-lightgray/30`}
            onClick={() => setTimeRange('year')}
          >
            Last Year
          </button>
        </div>
      </div>
      
      {/* Key metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Conversations"
          value={analytics.totalConversations}
          icon="chat"
          change={+12}
          color="indigo"
        />
        <MetricCard
          title="Avg. Response Time"
          value={`${analytics.averageResponseTime}s`}
          icon="clock"
          change={-0.3}
          color="green"
        />
        <MetricCard
          title="Satisfaction Rate"
          value={`${analytics.satisfactionRate}%`}
          icon="thumbs-up"
          change={+2.1}
          color="blue"
        />
        <MetricCard
          title="Active Users"
          value={analytics.activeUsers}
          icon="users"
          change={+5}
          color="purple"
        />
      </div>
      
      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages by Day Chart */}
        <div className="glassmorphism-card p-6 glow-container">
          <h3 className="text-lg font-medium text-cursor-text mb-4">Messages by Day</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.messagesByDay} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => {
                    const d = new Date(date);
                    return `${d.getMonth() + 1}/${d.getDate()}`;
                  }}
                  stroke="#A9A9B1"
                />
                <YAxis stroke="#A9A9B1" />
                <Tooltip 
                  formatter={(value) => [`${value} messages`, 'Count']}
                  labelFormatter={(date) => {
                    const d = new Date(date);
                    return `${d.toLocaleDateString()}`;
                  }}
                  contentStyle={{ 
                    backgroundColor: '#1E2024', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#F7F8F8'
                  }}
                />
                <Bar dataKey="count" fill="#6A75CA" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Top Topics Chart */}
        <div className="glassmorphism-card p-6 glow-container">
          <h3 className="text-lg font-medium text-cursor-text mb-4">Top Discussion Topics</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.topTopics}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="topic"
                  label={({ topic, percent }) => `${topic}: ${(percent * 100).toFixed(0)}%`}
                >
                  {analytics.topTopics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [`${value} conversations`, props.payload.topic]} 
                  contentStyle={{ 
                    backgroundColor: '#1E2024', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#F7F8F8'
                  }}
                />
                <Legend formatter={(value) => <span className="text-cursor-text">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Satisfaction Trend Chart */}
        <div className="glassmorphism-card p-6 glow-container">
          <h3 className="text-lg font-medium text-cursor-text mb-4">Satisfaction Rate Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.satisfactionTrend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => {
                    const d = new Date(date);
                    return `${d.getMonth() + 1}/${d.getDate()}`;
                  }}
                  stroke="#A9A9B1"
                />
                <YAxis domain={[80, 100]} stroke="#A9A9B1" />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Satisfaction Rate']}
                  labelFormatter={(date) => {
                    const d = new Date(date);
                    return `${d.toLocaleDateString()}`;
                  }}
                  contentStyle={{ 
                    backgroundColor: '#1E2024', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#F7F8F8'
                  }}
                />
                <Line type="monotone" dataKey="rate" stroke="#23C16B" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Response Time Trend Chart */}
        <div className="glassmorphism-card p-6 glow-container">
          <h3 className="text-lg font-medium text-cursor-text mb-4">Response Time Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.responseTimeTrend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => {
                    const d = new Date(date);
                    return `${d.getMonth() + 1}/${d.getDate()}`;
                  }}
                  stroke="#A9A9B1"
                />
                <YAxis domain={[1, 2]} stroke="#A9A9B1" />
                <Tooltip 
                  formatter={(value) => [`${value}s`, 'Avg. Response Time']}
                  labelFormatter={(date) => {
                    const d = new Date(date);
                    return `${d.toLocaleDateString()}`;
                  }}
                  contentStyle={{ 
                    backgroundColor: '#1E2024', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#F7F8F8'
                  }}
                />
                <Line type="monotone" dataKey="time" stroke="#3ABFE4" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;