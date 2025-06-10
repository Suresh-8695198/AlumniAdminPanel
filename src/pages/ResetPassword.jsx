import React, { useState } from "react";
import axios from "axios";
import { toast, Slide } from "react-toastify";

function ResetPassword({ email, setStep }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleReset = async () => {
    if (password !== confirm) {
      toast.error("Passwords do not match", { transition: Slide });
      return;
    }
    try {
      const res = await axios.post("http://localhost:8000/api/reset-password/", {
        email,
        password,
      });
      toast.success(res.data.message, { transition: Slide });
      setStep(1); // Return to login
    } catch {
      toast.error("Failed to reset password", { transition: Slide });
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Set New Password</h2>
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border px-4 py-2 w-full rounded"
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className="border px-4 py-2 w-full rounded"
      />
      <button onClick={handleReset} className="bg-purple-700 text-white px-6 py-2 rounded">
        Reset Password
      </button>
    </div>
  );
}

export default ResetPassword;
