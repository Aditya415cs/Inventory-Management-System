import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import "./Dashboard.css";
// Demo Data (replace with your model later)
const dailyData = [
  { day: "Mon", sales: 1200 },
  { day: "Tue", sales: 1500 },
  { day: "Wed", sales: 1800 },
  { day: "Thu", sales: 1700 },
  { day: "Fri", sales: 2100 },
  { day: "Sat", sales: 2500 },
  { day: "Sun", sales: 2300 },
];

const weeklyData = [
  { week: "Week 1", sales: 9000 },
  { week: "Week 2", sales: 11000 },
  { week: "Week 3", sales: 12500 },
  { week: "Week 4", sales: 13100 },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="layout">

      {/* Sidebar */}
      
      {/* Main Content */}
      <div className="main">

        {/* Top Bar */}
        <div className="topbar">
          <h1>Sales Dashboard</h1>
          <input placeholder="Search..." />
        </div>

        {/* Cards */}
        <div className="cards">
          <div className="card">
            <h3>Total Weekly Sales</h3>
            <p>₹13,100</p>
          </div>

          <div className="card">
            <h3>Best Day</h3>
            <p>Saturday</p>
          </div>

          <div className="card">
            <h3>Growth</h3>
            <p>+12%</p>
          </div>

          <div className="card">
            <h3>Orders</h3>
            <p>245</p>
          </div>
        </div>

        {/* Charts */}
        <div className="charts">

          {/* Daily Graph */}
          <div className="chart-box">
            <h2>Daily Sales Prediction</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Graph */}
          <div className="chart-box">
            <h2>Weekly Sales Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;