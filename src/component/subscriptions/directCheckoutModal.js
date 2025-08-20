import React, { useState } from "react";
import styles from "../../styles/CheckoutModal.module.css";

import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLoginBtn from "../my-account/googleLogin";
import { updateUserEmail, updateUserMobile } from "../../store/slice/userSlice";
import { useDispatch } from "react-redux";
import MobileVerifyModal from "../Common/verifyMobile";
import GoogleSignIn from "../my-account/googleSignIn";
import MobileLoginModal from "../Common/mobileLogin";
const couponsData = [
  {
    code: "FLAT500",
    message: "Save ₹199 with this coupon!",
    description: "This coupon is valid only on 1 year plans",
    validity: "30-Mar-25",
  },
  {
    code: "FLAT200",
    message: "Save ₹199 with this coupon!",
    description: "This coupon is valid only on 1 year plans",
    validity: "30-Mar-25",
  },
  {
    code: "FLAT100",
    message: "Save ₹199 with this coupon!",
    description: "This coupon is valid only on 1 year plans",
    validity: "30-Mar-25",
  },
];
function formatDateToDDMMMYY(dateInput) {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

  if (isNaN(date)) {
    return "Invalid Date";
  }

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = date.getDate().toString().padStart(2, "0"); // Ensure 2 digits
  const month = months[date.getMonth()]; // Get month abbreviation
  const year = date.getFullYear().toString().slice(-2); // Get last 2 digits of year

  return `${day}-${month}-${year}`;
}
const DirectCheckoutModal = ({
  onClose,
  location,
  state,
  city,
  onChangeHandler,

  userDetail,
  selectedPlan,
  generateOrder,
  validateError,
  error,
}) => {
  const dispatch = useDispatch();
  const onUpdateEmail = (email) => {
    dispatch(updateUserEmail(email.email));
  };
  const onUpdateEmailError = (error) => {
    console.log("error", error);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleVerify = (number) => {
    setIsModalOpen(false);
  };
  return (
    <div className={styles.modalOverlay}>
      <MobileLoginModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onVerify={handleVerify}
      />
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <h2>Checkout</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            ×
          </button>
        </div>

        <div className={styles.planInfo}>
          <span>{selectedPlan.subscription_name_hi}</span>
          <span className={styles.planAmt}>
            <strong>
              {" "}
              {selectedPlan.currency == "INR"
                ? "₹" + selectedPlan.sell_price
                : "$" + selectedPlan.sell_price}
            </strong>
          </span>
        </div>

        <p className={styles.infoText}>
          Please confirm your details before making the payment.
        </p>

        {userDetail&&Object.keys(userDetail).length == 0 ? (
          <div className={styles.formGroup}>
            <label>Your Login Information</label>
            <div className={styles.userContact}>
              <div className={styles.userdetail}>
                {userDetail.email ? (
                  <div className={styles.loginInfo}>{userDetail.email}</div>
                ) : (
                  <GoogleOAuthProvider
                    clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
                  >
                    <GoogleSignIn
                      onSuccess={onUpdateEmail}
                      onError={onUpdateEmailError}
                      size="large"
                    />
                  </GoogleOAuthProvider>
                )}
                {validateError.email && (
                  <span className={styles.error}>{validateError.email}</span>
                )}
              </div>
              <span className={styles.circleor}>Or</span>
              <div className={styles.userdetail}>
                {userDetail.mobile_no ? (
                  <div className={styles.loginInfo}>
                    {" "}
                    {userDetail.mobile_no}
                  </div>
                ) : (
                  <div className={styles.loginInfo} onClick={handleOpenModal}>
                    Add mobile +
                  </div>
                )}
                {validateError.mobile && (
                  <span className={styles.error}>{validateError.mobile}</span>
                )}
              </div>
            </div>
            {/* <input type="text" placeholder="Enter email or phone number" /> */}
            <div>
              <small>The invoice will be sent to this email</small>
            </div>
          </div>
        ) : (
          <div className={styles.formGroup}>
            <label>Your Login Information</label>
            <div className={styles.userContact}>
              {userDetail.email && (
                <div className={styles.userdetail}>
                  <div className={styles.loginInfo}>{userDetail.email}</div>
                </div>
              )}
              {userDetail.mobile_no && (
                <div className={styles.userdetail}>
                  <div className={styles.loginInfo}>{userDetail.mobile_no}</div>
                </div>
              )}
            </div>
            {/* <input type="text" placeholder="Enter email or phone number" /> */}
            <div>
              <small>The invoice will be sent to this email</small>
            </div>
          </div>
        )}

        <div className={styles.formGroup}>
          <label>Choose your Region</label>
          <div className={styles.regionSelects}>
            <div className={styles.userdetail}>
              <select
                name="state"
                onChange={onChangeHandler}
                value={location?.state_code}
              >
                <option value="">Select State</option>
                {state?.map((item, index) => {
                  return (
                    <option
                      key={item.iso2}
                      value={item.iso2}
                      data-stateid={item.id}
                    >
                      {item.name}
                    </option>
                  );
                })}
              </select>
              {validateError.state && (
                <span className={styles.error}>{validateError.state}</span>
              )}
            </div>
            <div className={styles.userdetail}>
              <select
                name="city"
                onChange={onChangeHandler}
                value={location?.city_code}
              >
                <option value="">Select City</option>
                {city?.map((item, index) => {
                  return (
                    <option key={item.name} value={item.name}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
              {validateError.city && (
                <span className={styles.error}>{validateError.city}</span>
              )}
            </div>
          </div>
          <small>Learn more about why we need this information</small>
        </div>
        <div className={styles.totalpay}>
          <span>कुल </span>
          <span>₹3.00</span>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <div style={{ textAlign: "center" }}>
          <button className={styles.payBtn} onClick={generateOrder}>
            Pay Securely
          </button>
        </div>
      </div>
    </div>
  );
};

export default DirectCheckoutModal;
