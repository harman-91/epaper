import React, { useRef } from "react";
import css from "@/styles/accountModal.module.scss";
import { createPortal } from "react-dom";

import { useState } from "react";
import Timer from "./timer";
import useThrottle from "@/component/hooks/useThrottle";
import { resendUserOtp, sendOtp, verifyOtp } from "@/services/userService";
const Modal = ({ children }) => {
  const modalRoot = document.getElementById("mobile-root");
  return createPortal(<div className={css.modal}>{children}</div>, modalRoot);
};
const UpdateMobile = ({ showModal, token, onCloseModal, onClose }) => {
  const buttonSendOtpRef = useRef(null);
  const buttonVerifyOtpRef = useRef(null);
  const [status, setStatus] = useState(0);
  const [mobileOption, setMobileOption] = useState({
    mobile_no: "",
    otp: "",
    error: "",
    error_otp: "",
  });
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && event?.target?.name == "mobile_no") {
      buttonSendOtpRef.current.click();
    }
    if (event.key === "Enter" && event?.target?.name == "otp") {
      buttonVerifyOtpRef.current.click();
    }
  };
  const [seconds, setSeconds] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [msg, setMsg] = useState("");
  const startTimer = () => {
    setIsActive(true);
    setSeconds(60);
  };

  const stopTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setSeconds(60);
    setIsActive(false);
  };
  const handleOTPAutoFill = async () => {
    if ("OTPCredential" in window) {
      try {
        const ac = new AbortController();

        setTimeout(() => {
          ac.abort();
        }, 60000);

        const otp = await navigator.credentials.get({
          otp: {
            transport: ["sms"],
            pattern: "\\d{6}",
          },
          signal: ac.signal,
        });

        if (otp && otp.code) {
          // Get only the first 6 digits if the OTP is longer
          const otpValue = otp.code.slice(0, 6);

          // Update state
          setMobileOption((prev) => ({
            ...prev,
            otp: otpValue,
          }));

          const otpInput = document.getElementById("otp_input");
          if (otpInput) {
            otpInput.value = otpValue;
            const event = new Event("input", { bubbles: true });
            otpInput.dispatchEvent(event);
          }

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

  const close = () => {
    setMobileOption({
      mobile_no: "",
      otp: "",
      error: "",
      error_otp: "",
    });
    setStatus(0);
    onClose();
  };
  const onSendOtp = async () => {
    try {
      if (!mobileOption.mobile_no) {
        return setMobileOption({
          ...mobileOption,
          error: "Mobile number must be of 10 characters",
        });
      }

      // const domain = new URL(process.env.NEXT_PUBLIC_PRODUCT_ID).hostname;
      const body = {
        mobile_no: mobileOption.mobile_no,
        sms_reference_domain: process.env.NEXT_PUBLIC_PRODUCT_ID,
      };
      const data = await sendOtp({
        auth_token: token,
        body,
      });

      if (data.code == 200) {
        setStatus(1);
        setMobileOption({
          ...mobileOption,
          error: null,
        });
        handleOTPAutoFill();
      } else if (data.code == 412) {
        setMobileOption({
          ...mobileOption,
          error: data?.data?.errors[0].mobile_no,
        });
      } else if (data.code == 409 || data.code == 417 || data.code == 401) {
        setMobileOption({
          ...mobileOption,
          error: data?.message,
        });
      } else {
        setMobileOption({ ...mobileOption, error: "Something went wrong" });
      }
    } catch (err) {
      console.log("_",err)
      setMobileOption({ ...mobileOption, error: "Something went wrong" });
    }
  };
  const onVerifyOtp = async () => {
    try {
      console.log("verify otp", mobileOption.otp);
      if (!mobileOption.otp) {
        return setMobileOption({
          ...mobileOption,
          error_otp: "Invalid Otp",
        });
      }
      const body = {
        otp: mobileOption.otp,
      };
      const data = await verifyOtp({
        auth_token: token,
        body,
      });

      if (data.code == 200) {
        setStatus(2);
        setMobileOption({
          ...mobileOption,
          error_otp: null,
        });
        setTimeout(() => {
          onCloseModal(mobileOption.mobile_no);
        }, 3000);
      } else if (data.code == 412) {
        setMobileOption({
          ...mobileOption,
          error_otp: data?.data?.errors[0].mobile_no,
        });
      } else if (data.code == 404) {
        setMobileOption({
          ...mobileOption,
          error_otp: null,
          error: "Wrong OTP.Please try again.",
        });
        setStatus(0);
      } else {
        setMobileOption({ ...mobileOption, error_otp: "Wrong OTP" });
      }
    } catch (err) {
      setMobileOption({ ...mobileOption, error_otp: "Wrong OTP" });
    }
  };

  const onChangeHandler = (e) => {
    if (e.target.name == "mobile_no" && e.target.value.length > 10) {
      return;
    }
    if (e.target.name == "otp" && e.target.value.length > 6) {
      return;
    }
    setMobileOption((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  const resendOtp = async () => {
    try {
      console.log("resend otp", mobileOption.otp);
      const body = {};
      const data = await resendUserOtp({
        auth_token: token,
        body,
      });

      if (data.code == 200) {
        //   setStatus(2);
        startTimer(true);
        setMobileOption({
          ...mobileOption,
          error_otp: null,
        });
      } else if (data.code == 409 || data.code == 417 || data.code == 401) {
        setMobileOption({
          ...mobileOption,
          // error_otp: data?.data?.errors[0].mobile_no,
          error_otp: data?.message,
        });
      } else if (data.code == 404) {
        setMobileOption({
          ...mobileOption,
          error_otp: null,
          error: "Wrong OTP.Please try again.",
        });
        setStatus(0);
      } else {
        setMobileOption({ ...mobileOption, error_otp: "Wrong OTP" });
      }
    } catch (err) {
      console.log("resend otp error", err);
      setMobileOption({ ...mobileOption, error_otp: "Wrong OTP" });
    }
  };
  const throttleResendOtp = useThrottle(resendOtp, 1000);
  const throttleSendOtp = useThrottle(onSendOtp, 500);
  const throttleVerifyOtp = useThrottle(onVerifyOtp, 500);
  if (!showModal) {
    return;
  }
  function renderModalContent() {
    switch (status) {
      case 0:
        return (
          <>
            <h3 className={css.heading}>Update Mobile</h3>
            <div className={css.inputGroup}>
              <input
                type="number"
                maxLength="10"
                name="mobile_no"
                value={mobileOption.mobile_no}
                onChange={onChangeHandler}
                onKeyUp={handleKeyPress}
              />
            </div>
            {mobileOption.error && (
              <span className={`${css.alert} ${css.invalid}`}>
                {mobileOption.error}
              </span>
            )}
            {/* <span className={css.error}>Please enter valid number</span> */}
            <button
              className={css.button}
              onClick={throttleSendOtp}
              ref={buttonSendOtpRef}
            >
              Send OTP
            </button>
          </>
        );
      case 1:
        return (
          <>
            <h3 className={css.heading}>Verify OTP</h3>

            <div className={css.inputGroup}>
              <input
                type="text" // Changed from "number" to prevent spinner arrows
                inputMode="numeric" // This gives numeric keyboard on mobile
                pattern="[0-9]*" // Ensures only numbers can be entered
                maxLength="6" // Changed from 10 to 6 since OTP is 6 digits
                name="otp"
                value={mobileOption.otp}
                onChange={onChangeHandler}
                onKeyUp={handleKeyPress}
                id="otp_input"
              />
            </div>
            {mobileOption.error_otp && (
              <span className={`${css.alert} ${css.invalid}`}>
                {mobileOption.error_otp}
              </span>
            )}
            {isActive ? (
              <div className={css.resendotp}>
                <span>Please wait </span>
                <Timer
                  seconds={seconds}
                  setSeconds={setSeconds}
                  isActive={isActive}
                  stopTimer={stopTimer}
                />
              </div>
            ) : (
              <div className={css.resendotp} onClick={throttleResendOtp}>
                <button className={css.OTPbutton}>Resend OTP</button>
              </div>
            )}
            <button
              className={css.button}
              onClick={throttleVerifyOtp}
              ref={buttonVerifyOtpRef}
            >
              Verify OTP
            </button>
          </>
        );
      case 2:
        return (
          <>
            <h3 className={css.heading}>Mobile Updated</h3>
            <svg
              className="checkmark"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
            >
              <circle
                className="checkmark__circle"
                cx="26"
                cy="26"
                r="25"
                fill="none"
              />
              <path
                className="checkmark__check"
                fill="none"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
              />
            </svg>
            <button className={css.button} onClick={onCloseModal}>
              Close
            </button>
            <style jsx>{`
              .checkmark {
                width: 100px;
                height: 100px;
                border-radius: 50%;
                display: block;
                strokeWidth: 2;
                stroke: #4bb71b;
                stroke-miterlimit: 10;
                box-shadow: inset 0px 0px 0px #4bb71b;
                animation: fill 0.4s ease-in-out 0.4s forwards,
                  scale 0.3s ease-in-out 0.9s both;
                position: relative;
                margin: 0 auto 30px;
              }
              .checkmark__circle {
                stroke-dasharray: 166;
                stroke-dashoffset: 166;
                strokeWidth: 2;
                stroke-miterlimit: 10;
                stroke: #4bb71b;
                fill: #fff;
                animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
              }
              .checkmark__check {
                transform-origin: 50% 50%;
                stroke-dasharray: 48;
                stroke-dashoffset: 48;
                animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s
                  forwards;
              }
              @keyframes stroke {
                100% {
                  stroke-dashoffset: 0;
                }
              }
              @keyframes scale {
                0%,
                100% {
                  transform: none;
                }
                50% {
                  transform: scale3d(1.1, 1.1, 1);
                }
              }
              @keyframes fill {
                100% {
                  box-shadow: inset 0px 0px 0px 30px #4bb71b;
                }
              }
            `}</style>
          </>
        );
      default:
        return null;
    }
  }
  return (
    <Modal>
      <div className={css.modal__content}>
        <span className={css.modal__close} onClick={close}>
          <svg>
            <use href="/sprite.svg#close"></use>
          </svg>
        </span>
        {renderModalContent()}
      </div>
    </Modal>
  );
};
export default UpdateMobile;
