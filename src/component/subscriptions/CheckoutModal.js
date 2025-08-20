import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "../../styles/checkout.module.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLoginBtn from "../account/googleLogin";
import { useDispatch } from "react-redux";
import MobileVerifyModal from "../Common/verifyMobile";
import { updateUserEmail } from "../../store/slice/userSlice";
import Image from "next/image";
import LoadingButton from "../global/LoadingButton";
import { formatDecimal } from "@/utils/apiUtils";

// SVG Icons as components
const XIcon = () => (
  <svg
    width="20"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const TagIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
    <line x1="7" y1="7" x2="7.01" y2="7"></line>
  </svg>
);

const MailIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const PhoneIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const MapPinIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20,6 9,17 4,12"></polyline>
  </svg>
);

// Enhanced Sparkly Confetti Component
const confettiCount = 30;
const gravityConfetti = 0.3;
const dragConfetti = 0.075;
const terminalVelocity = 3;

// Enhanced color palette for white background
const colors = [
  { front: "#e74c3c", back: "#c0392b" }, // Red
  { front: "#3498db", back: "#2980b9" }, // Blue
  { front: "#2ecc71", back: "#27ae60" }, // Green
  { front: "#f39c12", back: "#e67e22" }, // Orange
  { front: "#9b59b6", back: "#8e44ad" }, // Purple
  { front: "#1abc9c", back: "#16a085" }, // Turquoise
  { front: "#e91e63", back: "#ad1457" }, // Pink
  { front: "#34495e", back: "#2c3e50" }, // Dark Blue Gray
];

const randomRange = (min, max) => Math.random() * (max - min) + min;

const initConfettoVelocity = (xRange, yRange) => {
  const x = randomRange(xRange[0], xRange[1]);
  const range = yRange[1] - yRange[0] + 1;
  let y =
    yRange[1] - Math.abs(randomRange(0, range) + randomRange(0, range) - range);
  if (y >= yRange[1] - 1) {
    y += Math.random() < 0.25 ? randomRange(1, 3) : 0;
  }
  return { x, y: -y };
};

function Confetto(triggerElement) {
  this.randomModifier = randomRange(0, 99);
  this.color = colors[Math.floor(randomRange(0, colors.length))];
  this.dimensions = {
    x: randomRange(6, 12),
    y: randomRange(8, 16),
  };
  const rect = triggerElement.getBoundingClientRect();
  this.position = {
    x: randomRange(
      rect.left + rect.width / 4,
      rect.left + (3 * rect.width) / 4
    ),
    y: randomRange(
      rect.top + rect.height / 2 + 8,
      rect.top + 1.5 * rect.height - 8
    ),
  };
  this.rotation = randomRange(0, 2 * Math.PI);
  this.scale = { x: 1, y: 1 };
  this.velocity = initConfettoVelocity([-12, 12], [6, 15]);
}

Confetto.prototype.update = function () {
  this.velocity.x -= this.velocity.x * dragConfetti;
  this.velocity.y = Math.min(
    this.velocity.y + gravityConfetti,
    terminalVelocity
  );
  this.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;
  this.scale.y = Math.cos((this.position.y + this.randomModifier) * 0.09);
};

const Confetti = ({ isActive, triggerElement }) => {
  const [confetti, setConfetti] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isActive || !triggerElement || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const initBurst = () => {
      const newConfetti = [];
      for (let i = 0; i < confettiCount; i++) {
        newConfetti.push(new Confetto(triggerElement));
      }
      setConfetti(newConfetti);
    };

    initBurst();

    let animationId;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      confetti.forEach((confetto, index) => {
        const width = confetto.dimensions.x * confetto.scale.x;
        const height = confetto.dimensions.y * confetto.scale.y;

        ctx.translate(confetto.position.x, confetto.position.y);
        ctx.rotate(confetto.rotation);
        confetto.update();
        ctx.fillStyle =
          confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;
        ctx.fillRect(-width / 2, -height / 2, width, height);
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        if (confetto.velocity.y < 0) {
          ctx.clearRect(
            canvas.width / 2 - triggerElement.offsetWidth / 2,
            canvas.height / 2 + triggerElement.offsetHeight / 2,
            triggerElement.offsetWidth,
            triggerElement.offsetHeight
          );
        }
      });

      setConfetti((prev) =>
        prev.filter((confetto) => confetto.position.y < canvas.height)
      );

      if (confetti.length > 0) {
        animationId = requestAnimationFrame(render);
      }
    };

    animationId = requestAnimationFrame(render);

    const timeout = setTimeout(() => {
      cancelAnimationFrame(animationId);
      setConfetti([]);
    }, 4000);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(timeout);
      window.removeEventListener("resize", handleResize);
    };
  }, [isActive, triggerElement]);

  if (!isActive) return null;

  return <canvas ref={canvasRef} className={styles.confettiContainer} />;
};

const CheckoutModal = ({
  onClose,
  location,
  state,
  city,
  onChangeHandler,
  couponCode,
  applyCoupon,
  selectedCoupon,
  removeCoupon,
  userDetail,
  selectedPlan,
  generateOrder,
  validateError,
  error,
  applyCouponn,
  showSuccess,
  showConfetti,
  confettiTrigger,
  emailValidation,
  loading,
  duration,
  name,
}) => {
  console.log("--", selectedPlan);
  const SelectedDuration = duration.find(
    (d) => d.duration_type === selectedPlan.duration_type
  );
  const [isProcessing, setIsProcessing] = useState(false);
  useEffect(() => {
    if (selectedPlan.displayPrice !== selectedPlan.displayPrice) {
      const difference = selectedPlan.sell_price - selectedPlan.displayPrice;
      const step =
        difference > 0
          ? Math.ceil(difference / 20)
          : Math.floor(difference / 20);
      const timer = setInterval(() => {
        const next = prev + step;
        if (
          (step > 0 && next >= selectedPlan.sell_price) ||
          (step < 0 && next <= selectedPlan.sell_price)
        ) {
          clearInterval(timer);
          return selectedPlan.sell_price;
        }
      }, 30);
      return () => clearInterval(timer);
    }
  }, [selectedPlan.displayPrice, selectedPlan.sell_price]);
  const dispatch = useDispatch();
  const onUpdateEmail = (email) => {
    dispatch(updateUserEmail(email.email));
    emailValidation("");
  };
  const onUpdateEmailError = (error) => {
    emailValidation(error);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleVerify = (number) => {
    dispatch(updateUserMobile(number));

    setIsModalOpen(false);
  };
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const handleCouponCardApply = async (coupon, e) => {
    if (selectedCoupon?.promo_code !== coupon.promo_code && !isApplyingCoupon) {
      setIsApplyingCoupon(true);
      await applyCouponn(coupon, e.target);
      setIsApplyingCoupon(false);
    }
  };
  const couponList = couponCode.filter(
    (item) => Number(selectedPlan.sell_price) > Number(item?.discount_value)
  );
  const modalContentRef = useRef(null);
  const scrollToTop = () => {
    if (modalContentRef.current) {
      setTimeout(() => {
        modalContentRef.current.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 2000);
    }
  };
  return (
    <>
      <MobileVerifyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onVerify={handleVerify}
        token={userDetail?.auth_token}
      />
      <div className={styles.modalOverlay}>
        <div className={styles.modalContainer}>
          <div className={styles.header}>
            <h2 className={styles.headerTitle}>चेकआउट</h2>
            <button onClick={onClose} className={styles.closeButton}>
              <XIcon />
            </button>
          </div>

          <div className={styles.content} ref={modalContentRef}>
            {/* {showSuccess && selectedCoupon.discount_value && (
              <div className={styles.successMessage}>
                <CheckIcon />
                <span className={styles.successText}>
                  आपने{" "}
                  {selectedPlan.currency == "INR"
                    ? "₹" + selectedCoupon.discount_value
                    : "$" + selectedCoupon.discount_value}{" "}
                  बचाए इस कूपन से!
                </span>
              </div>
            )} */}

            <div className={styles.planCard}>
              <div className={styles.planCardContent}>
                <div>
                  <h3 className={styles.planTitle}>
                    {selectedPlan.subscription_name_hi}
                  </h3>

                  {selectedCoupon.isVerified != 0 && (
                    <div className={styles.couponInfo}>
                      <span className={styles.couponTag}>
                        {selectedCoupon.promo_code} Applied
                      </span>
                      <button
                        onClick={removeCoupon}
                        className={styles.removeCoupon}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div className={styles.priceContainer}>
                  {selectedCoupon.isVerified != 0 && (
                    <div className={styles.originalPrice}>
                      {" "}
                      {selectedPlan.currency == "INR"
                        ? "₹" + formatDecimal(selectedPlan?.sell_price)
                        : "$" + formatDecimal(selectedPlan?.sell_price)}
                    </div>
                  )}
                  {selectedPlan.subscription_type == "recurring" &&
                  selectedPlan.free_trial_duration > 0 ? (
                    <div className={styles.currentPrice}>
                      {" "}
                      {selectedPlan.currency == "INR" ? "₹" + 0 : "$" + 0}
                    </div>
                  ) : (
                    <div className={styles.currentPrice}>
                      {" "}
                      {selectedPlan.currency == "INR"
                        ? "₹" + formatDecimal(selectedPlan?.displayPrice)
                        : "$" + formatDecimal(selectedPlan?.displayPrice)}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {selectedPlan.subscription_type == "recurring" ? (
              <>
                {selectedPlan.free_trial_duration != 0 ? (
                  <p className={styles.planDescriptionInfo}>
                    {selectedPlan.free_trial_duration}{" "}
                    {selectedPlan.free_trial_type == "days" ? "दिन " : "महीना "}{" "}
                    मुफ़्त पढ़ें, ₹5 वेरिफिकेशन (ऑटो रिफंडेबल), फिर आपका प्लान{" "}
                    {selectedPlan.currency == "INR" ? "₹" : "$"}
                    {formatDecimal(selectedPlan.displayPrice)}/
                    {SelectedDuration.duration} पर ऑटो-रिन्यू हो जाएगा।{" "}
                    <Link
                      href="https://www.jagran.com/subscription-policy.html"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      शर्तें लागू।
                    </Link>
                  </p>
                ) : (
                  <p className={styles.planDescriptionInfo}>
                    ऑटो-रिन्यू प्लान | कभी भी प्रोफ़ाइल से कैंसल करें |{" "}
                    <Link
                      href="https://www.jagran.com/subscription-policy.html"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      शर्तें लागू।
                    </Link>
                  </p>
                )}
              </>
            ) : (
              <p className={styles.planDescriptionInfo}>
                यह एक बार का प्लान है,{" "}
                <Link
                  href="https://www.jagran.com/subscription-policy.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  शर्तें लागू।
                </Link>
              </p>
            )}
            <div className={styles.loginSection}>
              {/* <h3 className={styles.loginTitle}>आपके अकाउंट की जानकारी</h3> */}
              <div className={styles.inputGroup}>
                {!userDetail.first_name && (
                  <div className={styles.inputWrapper}>
                    {/* <div className={styles.inputIcon}>
                      <PhoneIcon />
                    </div> */}
                    <input
                      type="text"
                      placeholder="नाम लिखें"
                      value={name}
                      className={styles.input}
                      onChange={onChangeHandler}
                      name="first_name"
                    />
                  </div>
                )}
                <div className={styles.inputWrapper}>
                  {userDetail.email ? (
                    <>
                      {/* <div className={styles.inputIcon}>
                        <MailIcon />
                      </div> */}
                      <div className={styles.input}>{userDetail.email}</div>
                    </>
                  ) : (
                    <GoogleOAuthProvider
                      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
                    >
                      <GoogleLoginBtn
                        onSuccess={onUpdateEmail}
                        onError={onUpdateEmailError}
                        auth={userDetail.auth_token}
                        size="large"
                      />
                    </GoogleOAuthProvider>
                  )}
                  {validateError.email && (
                    <span className={styles.error}>{validateError.email}</span>
                  )}
                </div>
              </div>
              <div className={styles.planDescription}>
                इनवॉइस पाने के लिए ये जानकारी दें।
              </div>
              {/* <p className={styles.getinvoice}>इनवॉइस पाने के लिए ये जानकारी दें।</p> */}
              {/* <p className={styles.planDescription}>
                  The invoice will be sent to this email
                </p> */}
            </div>

            <div className={styles.regionSection}>
              {/* <h3 className={styles.regionTitle}>राज्य चुनें</h3> */}
              <div className={styles.regionGroup}>
                <div className={styles.inputWrapper}>
                  <div className={styles.inputIcon}>
                    <MapPinIcon />
                  </div>
                  <select
                    onChange={onChangeHandler}
                    value={location?.state_code}
                    className={`${styles.select} ${styles.selectWithIcon}`}
                    name="state"
                  >
                    <option value="">राज्य चुनें *</option>
                    {state.map((item) => (
                      <option
                        key={item.iso2}
                        value={item.iso2}
                        data-stateid={item.id}
                      >
                        {item.name}
                      </option>
                    ))}
                  </select>
                  {validateError.state && (
                    <span className={styles.error}>{validateError.state}</span>
                  )}
                </div>
                <div className={styles.inputWrapper}>
                  <div className={styles.inputIcon}>
                    <MapPinIcon />
                  </div>
                  <select
                    onChange={onChangeHandler}
                    value={location?.city_code}
                    className={`${styles.select} ${styles.selectWithIcon}`}
                    name="city"
                  >
                    <option value="">शहर चुनें</option>
                    {city.map((item) => (
                      <option
                        key={item.city_code}
                        value={item.city_code}
                        data-stateid={item.city_code}
                      >
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.planDescription}>
                यह GST के लिए आवश्यक है!
              </div>
            </div>

            <div className={styles.couponSection}>
              <div className={styles.couponInputGroup}>
                <input
                  type="text"
                  placeholder="कूपन कोड लिखें"
                  value={selectedCoupon.promo_code}
                  onChange={onChangeHandler}
                  name="promo_code"
                  className={styles.couponInput}
                />
                {selectedCoupon?.promo_code &&
                selectedCoupon?.isVerified != 0 ? (
                  <button className={styles.applyButton} onClick={removeCoupon}>
                    कूपन हटाएँ

                  </button>
                ) : (
                  <button
                    onClick={(e) =>
                      applyCoupon(
                        { promo_code: selectedCoupon.promo_code },
                        e.target
                      )
                    }
                    // disabled={!couponCode.trim() || appliedCoupon}
                    className={styles.applyButton}
                  >
                    अप्लाई करें
                  </button>
                )}
              </div>
            </div>
            {error && <div className={styles.error}>{error}</div>}

            <LoadingButton
              onClick={generateOrder}
              // disabled={isProcessing}
              loadingClassName={styles.subscribeBtn}
              className={`${styles.subscribeBtn}`}
              type="button"
              dotColor="#ffff"
              loading={loading}
              size={"8px"}
            >
              <>
                <Image
                  height={15}
                  width={15}
                  alt="pay"
                  src={"/images/shieldcheck.svg"}
                  style={{ paddingBottom: "6px" }}
                />
                सेफ़ली पेमेंट करें
              </>
            </LoadingButton>

            <div className={styles.couponsSection}>
              {couponList.length > 0 && (
                <div className={styles.couponsHeader}>
                  <TagIcon />
                  <h3 className={styles.couponsTitle}>डिस्काउंट कूपन</h3>
                </div>
              )}

              <div className={styles.couponList}>
                {couponList.length > 0 ? (
                  couponList.map((item) => {
                    return (
                      <div
                        key={item.id}
                        className={`${styles.couponCard} ${
                          selectedCoupon.promo_code === item.promo_code
                            ? styles.couponCardApplied
                            : ""
                        }`}
                      >
                        <div className={styles.couponCardHeader}>
                          <span className={styles.couponCode}>
                            {item.promo_code}
                          </span>
                          <button
                            disabled={isApplyingCoupon}
                            onClick={(e) => {
                              if (
                                selectedCoupon.promo_code === item.promo_code
                              ) {
                                removeCoupon();
                                return;
                              }
                              scrollToTop();
                              handleCouponCardApply(item, e);
                            }}
                            className={`${styles.couponApplyButton} ${
                              selectedCoupon.promo_code === item.promo_code
                                ? styles.couponApplyButtonApplied
                                : styles.couponApplyButtonNormal
                            }`}
                          >
                            {selectedCoupon.promo_code === item.promo_code
                              ? "REMOVE"
                              : "APPLY"}
                          </button>
                        </div>
                        <p className={styles.couponDiscount}>
                          इस कूपन से{" "}
                          {item.discount_type === "flat" ? (
                            <>
                              {selectedPlan.currency == "INR"
                                ? "₹" + formatDecimal(item?.discount_value)
                                : "$" +
                                  formatDecimal(item?.discount_value)}{" "}
                            </>
                          ) : (
                            <>{formatDecimal(item?.discount_value)}% </>
                          )}
                          बचाएं!
                        </p>
                        <p className={styles.couponDescription}>
                          जानकारी: {item.description}
                        </p>
                        <p className={styles.couponValidity}>
                          इस डेट तक मान्य:{" "}
                          {formatDateToDDMMMYY(item.start_date)}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  // <p>
                  //   अभी कोई ऑफ़र चालू नहीं है! अगला बड़ा ऑफ़र बस आने ही वाला है
                  //   — इस जगह पर नज़र बनाए रखें!
                  // </p>
                  <div className={styles.noCouponsCard}>
                    {/* <img src={"/images/discount.svg"} alt="No Coupons" /> */}
                    <Image
                      height={30}
                      width={30}
                      alt="No Coupons"
                      src={"/images/discount.svg"}
                      className={styles.image}
                    />
                    <h2>अभी कोई ऑफ़र चालू नहीं है!</h2>
                    <p>
                      अगला बड़ा ऑफ़र बस आने ही वाला है! इस जगह पर नज़र बनाए
                      रखें!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <Confetti isActive={showConfetti} triggerElement={confettiTrigger} /> */}
    </>
  );
};

export default CheckoutModal;
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
