import React from "react";
import Sidebar from "../components/Sidebar";

const SuccessStories = () => {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-purple-800 to-indigo-900 text-white">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-100 text-gray-900 rounded-tl-3xl">
        <div className="text-center bg-white rounded-2xl shadow-md p-6 mb-8 border-l-4 border-purple-700">
          <h1 className="text-2xl font-bold text-purple-800">Success Stories</h1>
        </div>
        <p className="text-gray-600">This is the Success Stories page. Functionality to be implemented.</p>
      </main>
    </div>
  );
};

export default SuccessStories;