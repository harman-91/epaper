"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Timer from "./timer";
import useThrottle from "../hooks/useThrottle";
import css from "@/styles/common.module.css";
import LoadingButton from "../global/LoadingButton";

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/20/solid";

const MobileVerifyModal = ({ isOpen, onClose, onVerify, token }) => {
  const [step, setStep] = useState(1);
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verifiedNumber, setVerifiedNumber] = useState(null);
  const [error, setError] = useState(null);
  const [seconds, setSeconds] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const startTimer = () => {
    setIsActive(true);
    setSeconds(60);
  };
  useEffect(() => {
    if(step === 2) 
    document.getElementById(`otp-input${1}`).focus();
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
        const domain = new URL(process.env.NEXT_PUBLIC_BASE_URL_DOMAIN).hostname;
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL}api/v1/customer/update/mobile`,
          { mobile_no: mobileNumber, sms_reference_domain: domain },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (data.code === 200) {
          setStep(2);
          setError(null);
          handleOTPAutoFill();
        } else if (data.code === 412) {
          setError(data?.data?.errors[0].mobile_no || "Invalid mobile number");
        } else if ([409, 417, 401].includes(data.code)) {
          setError(data?.message || "Request failed");
        } else {
          setError("Something went wrong");
        }
      } catch (err) {
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
          `${process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL}api/v1/customer/update/verify-otp`,
          { otp: otpString },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (data.code === 200) {
          setVerifiedNumber(mobileNumber);
          setStep(3);
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
      setError("Please enter a valid 4-digit OTP");
    }
  };

  const handleResend = async () => {
    setOtp(["", "", "", "", "", ""]);
    try {
      const { data } = await axios.post(
        process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL +
          "api/v1/customer/update/resend-otp",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
       if (data.code == 200) {
         //   setStatus(2);
         startTimer(true);
        setError(null)
       } else if (data.code == 409 || data.code == 417 || data.code == 401) {
         setError(data?.message);
       } else if (data.code == 404) {
         setError("Wrong OTP.Please try again.");
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
      <div className="w-[400px] rounded-lg bg-white overflow-hidden shadow-xl">
        {step === 1 && (
          <>
            <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4 ">
              <div className="text-md font-semibold">Enter Your Mobile Number</div>
              <p className="text-xs text-gray-500 mb-4">We will send you a confirmation code</p>
              <div className="input-container">
                <input
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="Ex: 9876541234"
                  className="block w-full rounded-md bg-white px-4 py-3 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-1 focus:-outline-offset-1 focus:outline-gray-600 sm:text-sm/6"
                  maxLength="10"
                />
              </div>
              {error && <div className="p-2 mt-2 text-xs text-red-800 rounded-md bg-red-50" role="alert">{error}</div>}
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
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
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      {step === 2 && (
            <>
            <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4 ">
              <div className="text-md font-semibold">Enter verification code</div>
              <p className="text-xs text-gray-500 mb-4">We have sent a verification code to your mobile number</p>
              <div className="input-container mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-input${index + 1}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    maxLength="1"
                    className="block w-full text-center font-bold rounded-md bg-white px-4 py-3 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-1 focus:-outline-offset-1 focus:outline-gray-600 sm:text-sm/6"
                    />
                ))}
              </div>
              {error && <div className="p-2 mt-2 text-xs text-red-800 rounded-md bg-red-50" role="alert">{error}</div>}
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
                <div className="text-xs text-gray-500 text-center">
                  <p>Didn&apos;t receive the code?</p>
                  <button onClick={throttleResendOtp} className="py-2.5 px-5 text-sm font-medium text-gray-900 hover:text-red-700">
                    Resend Code
                  </button>
                </div>
              )}
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
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
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>              
            </>
          )}
          {step === 3 &&  (
            <>
              <div className="px-4 py-10 relative">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon aria-hidden="true" className="size-6" />
                  </button>
                </div>
                <CheckBadgeIcon className="h-20 w-20 text-green-500 mx-auto mb-2" />
                <div className="text-lg font-semibold text-center mb-1">Verification Successful!</div>
                <p className="text-sm text-gray-500 text-center">Your mobile number has been verified.</p>
                
                {error && <div className="p-2 mt-2 text-xs text-red-800 rounded-md bg-red-50" role="alert">{error}</div>}
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
        .otp-form {
          width: 430px;
          background-color: rgb(255, 255, 255);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px 30px;
          gap: 20px;
          position: relative;
          box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.082);
          border-radius: 15px;
        }
        .main-heading {
          font-size: 1.1em;
          color: rgb(15, 15, 15);
          font-weight: 700;
        }
        .main-heading.success {
          color: rgb(22, 163, 74);
        }
        .otp-subheading {
          font-size: 0.7em;
          color: black;
          line-height: 17px;
          text-align: center;
        }
        .input-container {
          width: 100%;
          display: flex;
          flex-direction: row;
          gap: 10px;
          align-items: center;
          justify-content: center;
        }
        .mobile-input {
          width: 100%;
          height: 40px;
          background-color: rgb(228, 228, 228);
          text-align: center;
          border: none;
          border-radius: 7px;
          color: rgb(44, 44, 44);
          outline: none;
          font-weight: 600;
        }
        .mobile-input:focus,
        .mobile-input:valid {
          background-color: rgba(127, 129, 255, 0.199);
          transition-duration: 0.3s;
        }
        .otp-input {
          background-color: rgb(228, 228, 228);
          width: 40px;
          height: 40px;
          text-align: center;
          border: none;
          border-radius: 7px;
          caret-color: rgb(127, 129, 255);
          color: rgb(44, 44, 44);
          outline: none;
          font-weight: 600;
        }
        .otp-input:focus,
        .otp-input:valid {
          background-color: rgba(127, 129, 255, 0.199);
          transition-duration: 0.3s;
        }
        .verify-button {
          width: 100%;
          height: 40px;
          border: none;
          background-color: rgb(127, 129, 255);
          color: white;
          font-weight: 600;
          cursor: pointer;
          border-radius: 10px;
          transition-duration: 0.2s;
        }
        .verify-button:hover {
          background-color: rgb(144, 145, 255);
          transition-duration: 0.2s;
        }
        .exit-btn {
          position: absolute;
          top: 5px;
          right: 5px;
          box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.171);
          background-color: rgb(255, 255, 255);
          border-radius: 50%;
          width: 25px;
          height: 25px;
          border: none;
          color: black;
          font-size: 1.1em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .resend-note {
          font-size: 0.7em;
          color: black;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }
        .resend-btn {
          background-color: transparent;
          border: none;
          color: rgb(127, 129, 255);
          cursor: pointer;
          font-size: 1.1em;
          font-weight: 700;
        }
        .error {
          color: red;
          font-size: 0.8em;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default MobileVerifyModal;
