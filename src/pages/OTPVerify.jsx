import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, Slide } from "react-toastify";
import styles from './OtpVerify.module.css'; // 👈 CSS Module

function OTPVerify({ email, setStep }) {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(300);
  const inputRefs = useRef([]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const handleChange = (index, value) => {
    if (/^\d$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value !== "" && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const resendOtp = async () => {
    try {
      await axios.post("http://localhost:8000/api/send-otp/", { email });
      setTimer(300);
      toast.info("OTP resent", { transition: Slide });
    } catch {
      toast.error("Resend failed", { transition: Slide });
    }
  };

  const handleVerify = async () => {
    try {
      const joinedOtp = otp.join("");
      const res = await axios.post("http://localhost:8000/api/verify-otp/", {
        email,
        otp: joinedOtp,
      });
      toast.success(res.data.message, { transition: Slide });
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed", {
        transition: Slide,
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.heading}>OTP Verification</h2>
        <p className={styles.subtext}>Enter the 6-digit OTP sent to your email</p>
        <div className={styles.otpBox}>
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              className={styles.otpInput}
            />
          ))}
        </div>
        <div className={styles.timer}>
          Time left: <span>{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}</span>
        </div>
        <button onClick={handleVerify} className={styles.verifyButton}>
          Verify OTP
        </button>
        <button onClick={resendOtp} className={styles.resendLink}>
          Resend OTP
        </button>
      </div>
    </div>
  );
}

export default OTPVerify;
