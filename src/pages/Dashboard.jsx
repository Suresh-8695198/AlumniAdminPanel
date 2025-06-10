import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Chart as ChartJS, LineElement, BarElement, ArcElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import Sidebar from "../components/Sidebar";

// Register Chart.js components
ChartJS.register(LineElement, BarElement, ArcElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const GlassCard = ({ title, value, color, icon }) => (
  <motion.div
    className={`glassmorphism p-6 rounded-2xl shadow-lg ${color} flex items-center space-x-4 transition-all duration-500 hover:scale-105 hover:shadow-2xl`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="text-4xl">{icon}</div>
    <div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="text-3xl font-bold text-white mt-1">{value}</p>
    </div>
  </motion.div>
);

const LineChart = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{
      label: "Alumni Engagement",
      data: [65, 59, 80, 81, 56, 55],
      borderColor: "rgba(147, 51, 234, 1)",
      backgroundColor: "rgba(147, 51, 234, 0.2)",
      fill: true,
      tension: 0.4,
    }],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: "#1f2937" } } },
    scales: { x: { ticks: { color: "#1f2937" } }, y: { ticks: { color: "#1f2937" } } },
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
      <div className="chart-container"><Line data={data} options={options} /></div>
    </motion.div>
  );
};

const BarChart = () => {
  const data = {
    labels: ["CS", "EE", "ME", "CE"],
    datasets: [{
      label: "Department Enrollment",
      data: [120, 90, 150, 80],
      backgroundColor: "rgba(34, 197, 94, 0.7)",
      borderColor: "rgba(34, 197, 94, 1)",
      borderWidth: 1,
    }],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: "#1f2937" } } },
    scales: { x: { ticks: { color: "#1f2937" } }, y: { ticks: { color: "#1f2937" } } },
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
      <div className="chart-container"><Bar data={data} options={options} /></div>
    </motion.div>
  );
};

const PieChart = () => {
  const data = {
    labels: ["Employed", "Unemployed", "Pursuing Studies"],
    datasets: [{
      label: "Alumni Status",
      data: [300, 50, 100],
      backgroundColor: ["rgba(236, 72, 153, 0.7)", "rgba(59, 130, 246, 0.7)", "rgba(234, 179, 8, 0.7)"],
      borderColor: ["rgba(236, 72, 153, 1)", "rgba(59, 130, 246, 1)", "rgba(234, 179, 8, 1)"],
      borderWidth: 1,
    }],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: "#1f2937" } } },
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
      <div className="chart-container"><Pie data={data} options={options} /></div>
    </motion.div>
  );
};

const Histogram = () => {
  const data = {
    labels: ["0-1", "1-2", "2-3", "3-4", "4-5"],
    datasets: [{
      label: "Job Placements (Years Post-Graduation)",
      data: [50, 80, 60, 30, 20],
      backgroundColor: "rgba(255, 99, 132, 0.7)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1,
    }],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: "#1f2937" } } },
    scales: { x: { ticks: { color: "#1f2937" } }, y: { ticks: { color: "#1f2937" } } },
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
      <div className="chart-container"><Bar data={data} options={options} /></div>
    </motion.div>
  );
};

const Dashboard = () => {
  const [adminData, setAdminData] = useState({
    email: "Loading...",
    profileIcon: "fa-user-circle", // Default Font Awesome icon class
  });

  // Mock API call to fetch admin data
  useEffect(() => {
    // Replace with your actual API call
    const fetchAdminData = async () => {
      try {
        // Simulated API response
        const response = {
          email: "admin@periyaruniversity.ac.in",
          profileIcon: "fa-user-circle", // Use Font Awesome icon class
        };
        setAdminData(response);
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
        setAdminData({
          email: "admin@periyaruniversity.ac.in",
          profileIcon: "fa-user-circle",
        });
      }
    };
    fetchAdminData();
  }, []);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-purple-50 via-gray-100 to-purple-100 text-gray-800">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-100 text-gray-900 rounded-tl-3xl overflow-y-auto max-h-screen">
        <motion.div
          className="flex justify-end items-center mb-6 space-x-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-3">
            <i className={`fas ${adminData.profileIcon} text-4xl text-purple-500 transition-transform duration-300 hover:scale-110`}></i>
            <span className="font-medium text-gray-700">{adminData.email}</span>
          </div>
          <motion.button
            className="flex items-center bg-gradient-to-r from-gray-600 to-gray-800 text-white px-4 py-2 rounded-full hover:from-gray-700 hover:to-gray-900 transition-all duration-300 shadow-lg hover:ring-2 hover:ring-gray-400"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
          Logout
          </motion.button>
        </motion.div>
        <motion.div
          className="text-center glassmorphism rounded-2xl shadow-xl p-4 mb-4 border-l-4 border-purple-700 bg-gradient-to-r from-purple-100 to-blue-100"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-extrabold text-purple-800 tracking-tight drop-shadow-md">
            Welcome to Admin Portal Periyar University
          </h1>
          <img
            src="/Logo.png"
            alt="Periyar University Logo"
            className="mx-auto mt-4 h-32 transition-transform duration-500 hover:scale-110"
          />
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <GlassCard
            title="Total Departments"
            value="12"
            color="bg-gradient-to-r from-purple-600 to-purple-400"
            icon="📚"
          />
          <GlassCard
            title="Total Students"
            value="1,200"
            color="bg-gradient-to-r from-blue-600 to-blue-400"
            icon="🎓"
          />
          <GlassCard
            title="Alumni Status"
            value="450"
            color="bg-gradient-to-r from-green-600 to-green-400"
            icon="🌟"
          />
          <GlassCard
            title="Total Jobs Counts"
            value="300"
            color="bg-gradient-to-r from-pink-600 to-pink-400"
            icon="💼"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            className="glassmorphism p-6 rounded-2xl shadow-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Alumni Engagement Over Time</h3>
            <LineChart />
          </motion.div>
          <motion.div
            className="glassmorphism p-6 rounded-2xl shadow-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Department Enrollment</h3>
            <BarChart />
          </motion.div>
          <motion.div
            className="glassmorphism p-6 rounded-2xl shadow-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Alumni Status Distribution</h3>
            <PieChart />
          </motion.div>
          <motion.div
            className="glassmorphism p-6 rounded-2xl shadow-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Job Placements Histogram</h3>
            <Histogram />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;