import React, { useState } from "react";
import axios from "axios";
import { toast, Slide } from "react-toastify";
import { MailIcon } from "lucide-react";
import "./ForgotPassword.css";


function ForgotPassword({ setStep, setEmail }) {
  const [inputEmail, setInputEmail] = useState("");

  const handleSendOtp = async () => {
    try {
      const res = await axios.post("http://localhost:8000/api/send-otp/", {
        email: inputEmail,
      });
      toast.success(res.data.message, { transition: Slide });
      setEmail(inputEmail);
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP", {
        transition: Slide,
      });
    }
  };

  return (
    <div className="forgotpassword-container">
      <div className="forgotpassword-wrapper">
      

        {/* Right Side Form */}
        <div className="forgotpassword-right">
          <div className="forgotpassword-form">
            <h2 className="forgotpassword-title">Forgot Password</h2>
            <p className="forgotpassword-subtitle">
              Enter your email and we’ll send you an OTP.
            </p>

            <div className="forgotpassword-input-group">
              <label htmlFor="email" className="forgotpassword-label">
                Email Address
              </label>
              <div className="forgotpassword-input-wrapper">
                <MailIcon className="forgotpassword-icon" size={20} />
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  className="forgotpassword-input"
                />
              </div>
            </div>

            <button
              onClick={handleSendOtp}
              className="forgotpassword-button"
            >
              Send OTP
            </button>

            <div className="forgotpassword-info">
              Registered email only | OTP valid for 5 minutes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;