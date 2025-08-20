"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import useThrottle from "../hooks/useThrottle";
import css from "../../styles/common.module.css";
import { saveUserData } from "../../store/slice/userSlice";
import { useDispatch } from "react-redux";
import Timer from "../global/timer";
import LoadingButton from "../global/LoadingButton";
import variable from "../utility/variable";
import { setCookie } from "../utility/cookie";




const MobileLoginModal = ({ isOpen, onClose, onVerify, }) => {
  const [step, setStep] = useState(1);
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verifiedNumber, setVerifiedNumber] = useState(null);
  const [error, setError] = useState(null);
  const [seconds, setSeconds] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otptoken,setToken]=useState('')
  const startTimer = () => {
    setIsActive(true);
    setSeconds(60);
  };
  const dispatch = useDispatch();

  useEffect(() => {
    if (step === 2) document.getElementById(`otp-input${1}`).focus();
  }, [step]);

  const stopTimer = () => {
    setIsActive(false);
  };

  const handleOTPAutoFill = async () => {
    if ("OTPCredential" in window) {
      try {
        const ac = new AbortController();

        setTimeout(() => {
          ac.abort();
        }, 60000);

        const otpCredential = await navigator.credentials.get({
          otp: { transport: ["sms"] },
          signal: ac.signal,
        });

        if (otpCredential && otpCredential.code) {
          const otpValue = otpCredential.code.slice(0, 6).split("");
          setOtp(otpValue);
          ac.abort();
        }
      } catch (err) {
        console.error("Failed to read OTP via autofill:", err);
        if (err.name === "AbortError") {
          console.log("OTP autofill was aborted");
        }
      }
    } else {
      console.warn("WebOTP API not supported on this device or browser.");
    }
  };

  const handleMobileSubmit = async (e) => {
    e.preventDefault();
    if (/^\d{10}$/.test(mobileNumber)) {
      try {
        setLoading(true);
        const domain = new URL(process.env.NEXT_PUBLIC_BASE_URL).hostname;

        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL}api/v1/customer/login`,
          {
            mobile_no: mobileNumber,
            sms_reference_domain: domain,
            device_type: "WEB",
            client_ip: "1.1.1.1",
            domain_url: process.env.DOMAIN,
            action_ref: "mobile_login",
            utm_source: window.location.href,
          }
        );
        if (data.code === 200) {
          setStep(2);
          setError(null);
          handleOTPAutoFill();
          setToken(data?.data?.loginData?.login_token);
        } else if (data.code === 412) {
          setError(data?.data?.errors[0].mobile_no || "Invalid mobile number");
        } else if ([409, 417, 401].includes(data.code)) {
          setError(data?.message || "Request failed");
        } else {
          setError("Something went wrong");
        }
      } catch (err) {
        console.error("Error sending OTP:", err);
        setError("Something went wrong");
      }
      setLoading(false);
    } else {
      setError("Please enter a valid 10-digit mobile number");
    }
  };

  const handleOtpChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        document.getElementById(`otp-input${index + 2}`).focus();
      }
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length === 6 && /^\d{6}$/.test(otpString)) {
      try {
        setLoading(true);
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL}api/v1/customer/verify`,
          { otp: otpString, login_token: otptoken }
        );
        if (data.code === 200) {
          setVerifiedNumber(mobileNumber);
          setStep(3);
          const response = await axios.post(
            process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL +
              "api/v1/customer/get-profile",
            { domain_url: `${process.env.DOMAIN}` },
            {
              headers: {
                Authorization: "Bearer " + data?.data?.userData?.auth_token,
              },
            }
          );
          const obj = {
            first_name: response?.data?.data?.profileData?.first_name,
            last_name: response?.data?.data?.profileData?.last_name,
            profile_picture: response?.data?.data?.profileData?.profile_picture,
            mobile_no: response?.data?.data?.profileData?.mobile_no,
            user_id: response?.data?.data?.profileData?.user_id,
            auth_token: data?.data?.userData?.auth_token,
            email: response?.data?.data?.profileData?.email,
            is_new_user: response?.data?.data?.profileData?.is_new_user,
            registration_with:
              response?.data?.data?.profileData?.registration_with,
            isNewUser: true,
          };
          dispatch(saveUserData(obj));
          setCookie(variable.LOGIN_DETAIL, btoa(JSON.stringify(obj)), 365);
          onVerify(mobileNumber);
          setError(null);
          setTimeout(() => {
            onClose();
          }, 3000);
        } else if (data.code === 412) {
          setError(data?.data?.errors[0].otp || "Invalid OTP");
        } else if (data.code === 404) {
          setError("Wrong OTP. Please try again");
        } else {
          setError("Wrong OTP");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error verifying OTP:", err);
        setError("Wrong OTP");
      }
    } else {
      setError("Please enter a valid 6-digit OTP");
    }
  };

  const handleResend = async () => {
    setOtp(["", "", "", "", "", ""]);
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL}api/v1/customer/update/resend-otp`,
        { login_token: otptoken }
      );
      if (data.code === 200) {
        startTimer(true);
        setError(null);
      } else if (data.code === 409 || data.code === 417 || data.code === 401) {
        setError(data?.message);
      } else if (data.code === 404) {
        setError("Wrong OTP. Please try again.");
      } else {
        setError("Wrong OTP");
      }
    } catch (err) {
      setError("Failed to resend OTP");
    }
  };

  const handleClose = () => {
    setStep(1);
    setMobileNumber("");
    setOtp(["", "", "", "", "", ""]);
    setVerifiedNumber(null);
    setError(null);
    onClose();
  };

  const throttleResendOtp = useThrottle(handleResend, 1000);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {step === 1 && (
          <>
            <div className="modal-header">
              <div className="modal-title">Enter Your Mobile Number</div>
              <p className="modal-subtitle">
                We will send you a confirmation code
              </p>
              <div className="input-container">
                <input
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="Ex: 9876541234"
                  className="mobile-input"
                  maxLength="10"
                />
              </div>
              {error && <div className="error-message">{error}</div>}
            </div>
            <div className="modal-footer">
              <LoadingButton
                type="button"
                className={css.verifybutton}
                loadingClassName={css.verifybutton}
                dotColor="#ffff"
                onClick={(e) => handleMobileSubmit(e)}
                loading={loading}
                size={"8px"}
              >
                Send OTP
              </LoadingButton>
              <button
                type="button"
                data-autofocus
                onClick={handleClose}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div className="modal-header">
              <div className="modal-title">Enter verification code</div>
              <p className="modal-subtitle">
                We have sent a verification code to your mobile number
              </p>
              <div className="input-container otp-container">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-input${index + 1}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    maxLength="1"
                    className="otp-input"
                  />
                ))}
              </div>
              {error && <div className="error-message">{error}</div>}
              {isActive ? (
                <div className="resend-note">
                  <span>Please wait </span>
                  <Timer
                    seconds={seconds}
                    setSeconds={setSeconds}
                    isActive={isActive}
                    stopTimer={stopTimer}
                  />
                </div>
              ) : (
                <div className="resend-container">
                  <p>Didn&apos;t receive the code?</p>
                  <button onClick={throttleResendOtp} className="resend-btn">
                    Resend Code
                  </button>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <LoadingButton
                type="button"
                className={css.verifybutton}
                loadingClassName={css.verifybutton}
                dotColor="#ffff"
                onClick={(e) => handleOtpSubmit(e)}
                loading={loading}
                size={"8px"}
              >
                Verify
              </LoadingButton>
              <button
                type="button"
                data-autofocus
                onClick={handleClose}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <div className="modal-success">
              <div className="close-button-container">
                <button
                  type="button"
                  onClick={handleClose}
                  className="close-button"
                >
                  <span className="sr-only">Close</span>
                  {/* <XMarkIcon aria-hidden="true" className="close-icon" /> */}
                </button>
              </div>
              {/* <CheckBadgeIcon className="success-icon" /> */}
              <div className="modal-title success">
                Verification Successful!
              </div>
              <p className="modal-subtitle">
                Your mobile number has been verified.
              </p>
              {error && <div className="error-message">{error}</div>}
            </div>
          </>
        )}
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
        }
        .modal-container {
          width: 400px;
          background-color: #ffffff;
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        .modal-header {
          padding: 1.5rem;
          padding-bottom: 1rem;
        }
        .modal-title {
          font-size: 1.125rem;
          font-weight: 600;
          line-height: 1.5;
          color: #111827;
        }
        .modal-title.success {
          color: #16a34a;
          text-align: center;
          margin-bottom: 0.25rem;
        }
        .modal-subtitle {
          font-size: 0.75rem;
          color: #6b7280;
          margin-bottom: 1rem;
          text-align: left;
        }
        .input-container {
          width: 100%;
          display: flex;
          flex-direction: row;
          gap: 0.625rem;
          align-items: center;
          justify-content: center;
        }
        .otp-container {
          margin-bottom: 1rem;
        }
        .mobile-input {
          width: 100%;
          height: 40px;
          border-radius: 0.375rem;
          background-color: #ffffff;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          color: #111827;
          border: 1px solid #d1d5db;
          outline: none;
          transition: border-color 0.2s, background-color 0.3s;
        }
        .mobile-input:focus {
          border-color: #4b5563;
          background-color: rgba(127, 129, 255, 0.199);
        }
        .mobile-input::placeholder {
          color: #9ca3af;
        }
        .otp-input {
          width: 40px;
          height: 40px;
          text-align: center;
          font-weight: 700;
          border-radius: 0.375rem;
          background-color: #ffffff;
          padding: 0.75rem;
          font-size: 1rem;
          color: #111827;
          border: 1px solid #d1d5db;
          outline: none;
          transition: border-color 0.2s, background-color 0.3s;
          caret-color: rgb(127, 129, 255);
        }
        .otp-input:focus {
          border-color: #4b5563;
          background-color: rgba(127, 129, 255, 0.199);
        }
        .modal-footer {
          background-color: #f9fafb;
          padding: 0.75rem 1.5rem;
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
        }
        .cancel-button {
          display: inline-flex;
          justify-content: center;
          border-radius: 0.375rem;
          background-color: #ffffff;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: #111827;
          border: 1px solid #d1d5db;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .cancel-button:hover {
          background-color: #f3f4f6;
        }
        .modal-success {
          padding: 2.5rem 1rem;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .close-button-container {
          position: absolute;
          top: 1rem;
          right: 1rem;
          display: block;
        }
        .close-button {
          border-radius: 0.375rem;
          background-color: #ffffff;
          color: #9ca3af;
          padding: 0;
          border: none;
          cursor: pointer;
          transition: color 0.2s;
        }
        .close-button:hover {
          color: #6b7280;
        }
        .close-icon {
          width: 1.5rem;
          height: 1.5rem;
        }
        .success-icon {
          width: 5rem;
          height: 5rem;
          color: #16a34a;
          margin-bottom: 0.5rem;
        }
        .error-message {
          padding: 0.5rem;
          margin-top: 0.5rem;
          font-size: 0.75rem;
          color: #991b1b;
          background-color: #fef2f2;
          border-radius: 0.375rem;
          width: 100%;
          text-align: center;
        }
        .resend-note {
          font-size: 0.75rem;
          color: #111827;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.3125rem;
        }
        .resend-container {
          font-size: 0.75rem;
          color: #6b7280;
          text-align: center;
        }
        .resend-btn {
          background-color: transparent;
          border: none;
          color: #111827;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          padding: 0.625rem 1.25rem;
          transition: color 0.2s;
        }
        .resend-btn:hover {
          color: #b91c1c;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          border: 0;
        }
      `}</style>
    </div>
  );
};

export default MobileLoginModal;
