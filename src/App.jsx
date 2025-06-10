import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SetAdmin from "./pages/SetAdmin";
import Login from "./pages/Login";
import SetPassword from "./pages/SetPassword";
import Dashboard from "./pages/Dashboard";
import ForgotPasswordFlow from "./pages/ForgotPasswordFlow";
import AddDepartment from "./pages/AddDepartment";
import ManageDepartment from "./pages/ManageDepartment";
import ViewDegrees from './pages/ViewDegrees';
import ViewStudents from './pages/ViewStudents';
import Newsletter from "./pages/NewsLetter";
import Surveys from "./pages/Surveys";
import SuccessStories from './pages/SuccessStories';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Feedback from "./pages/Feedback";

axios.defaults.baseURL = "http://localhost:8000";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CheckFirstAdmin />} />
        <Route path="/set-admin" element={<SetAdmin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/set-password" element={<SetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgotPasswordFlow />} />
        <Route path="/departments" element={<AddDepartment />} />
        <Route path="/add-department" element={<AddDepartment />} />
        <Route path="/manage-department" element={<ManageDepartment />} />
        <Route path="/view-degrees/:departmentId" element={<ViewDegrees />} />
        <Route path="/view-students/:degreeId" element={<ViewStudents />} />
        <Route path="/newsletter" element={<Newsletter />} />
        <Route path="/surveys" element={<Surveys />} />
        <Route path="/success-stories" element={<SuccessStories />} />
        <Route path="/" element={<SuccessStories />} />
        <Route path="/feedback" element={<Feedback/>} />
      </Routes>
    </Router>
  );
}

const CheckFirstAdmin = () => {
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("/api/check-admin-exists/")
      .then((res) => {
        if (res.data.exists) {
          navigate("/login");
        } else {
          navigate("/set-admin");
        }
      })
      .catch((err) => {
        console.error("Error checking admin:", err);
        navigate("/login");
      });
  }, [navigate]);
  return <div>Loading...</div>;
};

export default App;