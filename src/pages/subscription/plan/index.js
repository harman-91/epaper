import React, { use, useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/Subscription.module.css";

import SubscriptionCard from "@/component/subscriptions/MobileSubscriptionCard";
import PrimeFeaturesMobile from "@/component/subscriptions/PrimeFeaturesMobile";
import CheckoutModal from "@/component/subscriptions/CheckoutModal";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import useLogin from "@/component/hooks/useLogin";
// import MyAccountDropdown from "@/component/my-account/MyAccountDropdown";
import { saveUserData, toggleShowLogin } from "@/store/slice/userSlice";
import LoginModal from "@/component/account/loginmodel";
import SuccessDisplay from "@/component/subscriptions/successDisplay";
import Confetti from "@/component/subscriptions/Confetti";
import FAQSection from "@/component/subscriptions/FaqsSubscriptions";
import {
  checkdeviceType,
  formatDecimal,
  generateReturnUrl,
} from "@/utils/apiUtils";
import { SkeletonTheme } from "@/component/skeleton/SkeletonTheme";
import { Skeleton } from "@/component/skeleton/Skeleton";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import ThankYouModal from "@/component/subscriptions/subscriptionThankYou";

// import CustomBanner from "../../component/Global/customBanner";
import TabbedPlans from "@/component/subscriptions/TabbedPlans";
import { getDomain } from "@/component/utility/CommonUtils";
import { updateUserProfile } from "@/services/userService";
import GlobalLink from "@/component/global/GlobalLink";

const duration = [
  { duration_type: "daily", duration: "दैनिक", days: 1, type: "दिन" },
  { duration_type: "monthly", duration: "मासिक", days: 30 },
  { duration_type: "quarterly", duration: "3 महीने", days: 90 },
  { duration_type: "halfyear", duration: "6 महीना", days: 180 },
  { duration_type: "yearly", duration: "वार्षिक", days: 365 },
  { duration_type: "all", duration: "all", days: 365 },
];

function calculateDailyCost(price, duration_type) {
  const selectedDuration = duration.find(
    (d) => d.duration_type === duration_type
  );

  if (!selectedDuration) {
    return "";
  }

  const dailyCost = price / selectedDuration.days;

  // For daily and monthly, return cost per day
  if (["daily", "monthly"].includes(selectedDuration.duration_type)) {
    // Use Math.ceil to round up if there's any fractional part
    return Math.ceil(dailyCost) + "/ दिन";
  }

  // For quarterly, halfyear, and yearly, return cost per month
  const monthlyCost = dailyCost * 30;
  // Use Math.ceil to round up if there's any fractional part
  return Math.ceil(monthlyCost) + "/ महीना";
}
export default function Subscription({domainInfo}) {
  const [openIndex, setOpenIndex] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showBottomBar, setShowBottomBar] = useState(false);
  const userDetail = useSelector((state) => state.userData.user);
  const router = useRouter();
  const dispatch = useDispatch();

  const [validateError, setValidateError] = useState({});
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [thanksModal, setThanksModal] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(null);
  const [location, setLocation] = useState({
    country_code: "IN",
    state_code: "",
    city_code: "",
    state_id: "",
  });
  const [name, setName] = useState("");
  const { login, logout, getUserData } = useLogin("subscription_login_btn", {
    google_action_ref: "subscription_one_tap",
  });
  const loginRef = useRef(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const txn = searchParams.get("txn");
  const returnStatus = searchParams.get("success");
  const action_ref = searchParams.get("utm_login");
  const closeThanksModal = () => {
    setThanksModal(2);
  };
  const saveSelectedPlan = (plan, tab) => {
    if (plan && tab) {
      sessionStorage.setItem(
        "selectedPlan",
        JSON.stringify({ plan, activeTab: tab })
      );
    }
  };

  const restoreSelectedPlan = () => {
    const savedData = sessionStorage.getItem("selectedPlan");
    if (savedData) {
      const { plan, activeTab } = JSON.parse(savedData);
      setSelectedPlan(plan);
      setActiveTab(activeTab);
      return { plan, activeTab };
    }
    return null;
  };

  console.log("domainInfo, plan", domainInfo)

  useEffect(() => {
    if (!loginRef.current || token) {
      loginRef.current = true;
      getUserData();
    }
    if ((returnStatus == "1" || returnStatus == "true") && txn) {
      setIsSuccess("success");
    }
    if (
      (returnStatus == "" || returnStatus == "0" || returnStatus == "false") &&
      txn
    ) {
      setIsSuccess("fail");
    }
    if (txn) {
      const baseUrl = pathname?.split("?")?.[0];
      router.replace(baseUrl);
    }
  }, [token, txn, returnStatus]);

  const [couponCode, setCouponCode] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState({ isVerified: 0 });
  const [isSuccess, setIsSuccess] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent =
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        100;

      if (scrollPercent >= 15) {
        setShowBottomBar(true);
      } else {
        setShowBottomBar(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [activeTab, setActiveTab] = useState("all");
  const [state, setState] = useState([]);
  const [city, setCity] = useState([]);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const getPlans = async () => {
    try {
      const host = window.location.hostname;
      const domainInfo = getDomain(host);
      setLoadingPlans(true);
      const time = new Date().getTime();
      const { data: fetchLocation } = await axios.post("/api/fetchIp?" + time);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL}api/v1/subscription/plans`,
        {
          domain_url: domainInfo.domainId,

          device_type: "WEB",
          country_code: fetchLocation.country_code,
        }
      );
      if (response.status == 200) {
        setLocation((prev) => {
          return { ...prev, country_code: fetchLocation.country_code };
        });
        const reducedPlans = { all: response?.data?.data?.subscriptionPlanData }
        if (reducedPlans[activeTab] && reducedPlans[activeTab].length > 0) {
          setSelectedPlan(reducedPlans[activeTab][0]);
        }

        setPlans(reducedPlans);
        setLoadingPlans(false);
      }
      //    setLoadingPlans(false);
    } catch (err) {
      setLoadingPlans(false);
    }
  };
  const subRef = useRef(false);
  useEffect(() => {
    if (subRef.current) return;
    subRef.current = true;
    getPlans();
  }, []);

  const selectedPlanHandler = (curr) => {
    setActiveTab(curr.duration_type);
    setSelectedPlan(
      plans?.[curr.duration_type]?.[0] ? plans?.[curr.duration_type]?.[0] : null
    );
  };
  const handlePlanSelection = (plan) => {
    setSelectedPlan({ ...plan, displayPrice: plan.sell_price });
  };

  const onCloseSuccess = () => {
    setIsSuccess(null);
    window.location.href = "/";
  };
  const onCloseFail = () => {
    setIsSuccess(null);
  };
  const showModalHandler = (plan) => {
    if (Object.keys(userDetail).length == 0) {
      saveSelectedPlan(plan, activeTab);

      dispatch(
        toggleShowLogin({
          actionRef: "subscription_btn",
          message: {
            title: "प्लान ख़रीदने के लिए लॉगिन करें",
            desc: "तुरंत प्रीमियम सुविधाओं का लाभ उठाएं",
            btn: "अभी लॉगिन करें",
            pageType: "na",
            ctaText: "subscription",
            sectionName: "subscription_page",
          },
        })
      );
      return;
    }
    setSelectedPlan({ ...plan, displayPrice: plan.sell_price });
    setShowModal(true);
    setError("");
    getStateList();
    getCouponCode(plan.id);
  };
  const hideModalHandler = () => {
    setShowModal(false);
    setError("");
    setSelectedCoupon({ isVerified: 0 });
  };
  const discount = (mrp_price, sell_price) => {
    try {
      return Math.round(((mrp_price - sell_price) / mrp_price) * 100);
    } catch (r) {
      return 0;
    }
  };
  const getStateList = async () => {
    try {
      const { data: state } = await axios(
        `${process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL}api/get-state/101`
      );
      if (state.code == 200) {
        setState(state?.data?.stateData || []);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getCityList = async (id) => {
    try {
      const { data: state } = await axios(
        `${process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL}api/get-city/101/${id}`
      );
      if (state.code == 200) {
        setCity(state?.data?.cityData || []);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const onChangeHandler = (e) => {
    if (e.target.name == "state") {
      const selectedOption = e.target.options[e.target.selectedIndex];
      const stateId = selectedOption.dataset.stateid;
      setLocation((prev) => {
        return {
          ...prev,
          state_code: e.target.value,
          city_code: "",
          state_id: stateId,
        };
      });
      getCityList(stateId);
      return;
    }
    if (e.target.name == "city") {
      setLocation((prev) => {
        return { ...prev, city_code: e.target.value };
      });
      return;
    }
    if (e.target.name == "promo_code") {
      setSelectedCoupon({
        ...selectedCoupon,
        promo_code: e.target.value,
        isVerified: 0,
      });
      setSelectedPlan({
        ...selectedPlan,
        displayPrice: Number(selectedPlan.sell_price),
      });
      return;
    }
    if (e.target.name == "first_name") {
      setName(e.target.value);
    }
  };
  const getCouponCode = async (id) => {
    try {
      if (!id) return;
      const { data: couponCode } = await axios.post(
        `${process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL}api/v1/coupon/get`,
        {
          subscription_id: String(id),
        },
        { headers: { Authorization: "Bearer " + userDetail?.auth_token } }
      );
      if (couponCode.code == 200) {
        setCouponCode(couponCode?.data?.promoCodes || []);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const applyCoupon = (code, triggerElement) => {
    verifyCoupon(code, triggerElement);
  };

  const verifyCoupon = async (code, triggerElement = null) => {
    try {
      if (!code) return;
      setSelectedCoupon({ ...code, isVerified: 0 });
      setError(null);
      setShowConfetti(false); // Reset before new animation
      setConfettiTrigger(null);
      const { data: couponCode } = await axios.post(
        `${process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL}api/v1/coupon/validate`,
        {
          coupon_code: String(code.promo_code),
          subscription_id: String(selectedPlan.id),
        },
        { headers: { Authorization: "Bearer " + userDetail?.auth_token } }
      );
      if (couponCode.code == 200) {
        setSelectedPlan({
          ...selectedPlan,
          displayPrice:
            couponCode?.data?.promoCode?.discount_type === "flat"
              ? Number(selectedPlan?.sell_price) -
                Number(couponCode?.data?.promoCode?.discount_value)
              : Number(selectedPlan.sell_price) *
                (1 - Number(couponCode?.data?.promoCode?.discount_value) / 100),
        });
        setSelectedCoupon({
          ...code,
          isVerified: 2,
          promo_code: couponCode?.data?.promoCode?.promo_code,
        });
        if (triggerElement) {
          setConfettiTrigger(triggerElement);

          setShowSuccess(true);
          setShowConfetti(true);

          setTimeout(() => {
            setShowSuccess(false);
            setShowConfetti(false);
            setConfettiTrigger(null);
          }, 4000);
        }
      } else if (couponCode.code == 404) {
        removeCoupon();
        setError(couponCode?.message || "Something went wrong");
      } else {
        removeCoupon();

        setSelectedCoupon({ ...code, isVerified: 0 });
        setError("Invalid Coupon Code");
      }
    } catch (err) {
      removeCoupon();

      setError("Invalid Coupon Code");

      setSelectedCoupon({ ...code, isVerified: 0 });
    }
  };
  const removeCoupon = (code) => {
    setSelectedCoupon({ isVerified: 0, promo_code: "" });
    setSelectedPlan({
      ...selectedPlan,
      displayPrice: Number(selectedPlan.sell_price),
    });
  };
  const validateFields = () => {
    const errors = {};

    if (!location.state_code || String(location.state_code).trim() === "") {
      errors.state = "कृपया राज्य सेलेक्ट करें।";
    }

    // if (!location.city_code || String(location.city_code).trim() === "") {
    //   errors.city = "Please select City";
    // }
    // if (!userDetail.email) {
    //   errors.email = "Email is required";
    // }
    // if (!userDetail.mobile_no && location.country_code == "IN") {
    //   errors.mobile = "Mobile Number is required";
    // }
    setValidateError(errors);
    return Object.keys(errors).length === 0;
  };
  const emailValidation = (email) => {
    setValidateError({ ...validateError, email: email });
  };
  const generateOrder = async () => {
    try {
      if (!validateFields()) {
        setError("कृपया सभी आवश्यक फ़ील्ड भरें।");
        return;
      }
      const host = window.location.hostname;
      const domainInfo = getDomain(host);
      setLoading(true);
      const newUrl = generateReturnUrl(domainInfo);
      const payload = {
        domain_url: domainInfo.domainId,

        id: String(selectedPlan.id),
        device_type: checkdeviceType() ? "MWEB" : "WEB",
        return_url: domainInfo.return_url,
        country_code: String(location.country_code),
        state_code: String(location.state_code),
        city_name: "",
        coupon_code: selectedCoupon.promo_code,
        page_url: newUrl.url,
        action_ref: action_ref || "plan_subscription",
        utm_source: newUrl.utm_source || "",
        utm_campaign: newUrl.utm_campaign || "",
        utm_medium: newUrl.utm_medium || "",
      };

      setError(null);
      const [firstName, ...rest] = name.split(" ", 2);
      const lastName = rest.join(" ");
      await updateUserProfile({
        auth_token: userDetail?.auth_token,
        body: { first_name: firstName, last_name: lastName },
      });
      // const { data } = await axios.post(
      //   `/api/middleware/updateProfile`,
      //   { first_name: firstName, last_name: lastName },
      //   { headers: { token: userDetail?.auth_token } }
      // );
      const { data: order } = await axios.post(
        `${process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL}api/v1/subscription/init-purchase`,
        payload,
        { headers: { Authorization: "Bearer " + userDetail?.auth_token } }
      );

      dispatch(saveUserData({ ...userDetail, first_name: name }));

      if (order.code == 200) {
        sessionStorage.removeItem("selectedPlan");
        window.location.href = `${process.env.NEXT_PUBLIC_PAYMNT_ROUTE}?txn=${order?.data?.transationData?.transaction_id}&url=${newUrl.url}&lang=hi
`;
      } else if (order.code == 409) {
        setError(order?.message || "Something went wrong");
      } else {
        setError("Something went wrong");
      }
    } catch (err) {
      console.error("Error generating order:", err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (userDetail.country_id == 101 && state?.length > 0) {
      setLocation({
        state_code: state.reduce((acc, curr) => {
          if (userDetail.state_id == curr.id) {
            return curr.iso2;
          }
          return acc;
        }, ""),
        city_code: userDetail.city_name,
        country_code: "IN",
        state_id: userDetail.state_id,
      });
      if (userDetail.state_id) {
        getCityList(userDetail.state_id);
      }
    }
    // if (userDetail.is_subscribed && !txn && thanksModal == 0) {
    //   setThanksModal(1);
    // }
    if (userDetail?.first_name) {
      setName(userDetail?.first_name);
    }
  }, [userDetail, state]);
  const applyCouponn = (coupon, triggerElement = null) => {
    // if (selectedCoupon) {
    //   setShowSuccess(false);
    // }
    applyCoupon(coupon, triggerElement);
    // setTimeout(() => {
    //   applyCoupon(coupon,triggerElement);
    //   setShowSuccess(true);
    //   setShowConfetti(true);
    //   setConfettiTrigger(triggerElement);

    //   setTimeout(() => {
    //     setShowSuccess(false);
    //     setShowConfetti(false);
    //     setConfettiTrigger(null);
    //   }, 4000);
    // }, 100);
  };
  useEffect(() => {
    if (
      plans &&
      Object.keys(plans)?.length > 0 &&
      Object.keys(userDetail)?.length > 0
    ) {
      const savedData = restoreSelectedPlan();
      if (savedData && plans[savedData.activeTab]) {
        const savedPlan = plans[savedData.activeTab].find(
          (plan) => plan.id === savedData.plan.id
        );
        if (savedPlan) {
          sessionStorage.removeItem("selectedPlan");
          setSelectedPlan({ ...savedPlan, displayPrice: savedPlan.sell_price });
          setActiveTab(savedData.activeTab);
          setShowModal(true);
          getStateList();
          getCouponCode(savedPlan.id);
          // Optionally clear sessionStorage after restoring
          // sessionStorage.removeItem("selectedPlan");
        }
      }
    }
  }, [userDetail, plans]);
  const selectedDuration = duration.find((d) => d.duration_type === activeTab);
  const renderTitle = (title) => {
    const words = title.trim().split(" ");
    if (words.length === 1) {
      return <span style={{ color: "#eb0d2a" }}>{title}</span>;
    }
    const lastWord = words.pop();
    const restOfTitle = words.join(" ");
    return (
      <>
        {restOfTitle} <span style={{ color: "red" }}>{lastWord}</span>
      </>
    );
  };

  return (
    <>
      <LoginModal />
      <script
        async
        src="https://www.googletagmanager.com/gtm.js?id=GTM-5CTQK3"
      ></script>
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5CTQK3" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
        }}
      />
      <script
        id="datalayer"
        dangerouslySetInnerHTML={{
          __html: `var dataLayer = window.dataLayer || []; dataLayer.push({'event':'pageview','tvc_page_type':'subscription_plan_page','language':'hindi','uid': 'na',
            'usertype': 'na',
            'registration_status': 'na}',
            'loggeduser_id': 'na'});`,
        }}
      ></script>
      <div>
        <div className="container">
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            <title>
              Jagran Subscriptions: Hindi ePaper, Ad-Free News Access and Jagran
              Prime Access
            </title>

            <meta
              name="description"
              content="Subscribe to Jagran premium offerings for full access to Hindi ePaper, ad-free news, premium articles & daily editions. Try free trials– seamless digital reading experience."
            />

            <meta
              name="keywords"
              content="Jagran Prime, Jagran Prime subscription, Jagran ePaper, Hindi ePaper, ePaper subscription, digital newspaper, Hindi digital newspaper, ad-free news, news subscription India, daily Hindi ePaper, newspaper PDF, ePaper download, mobile newspaper reading, today’s ePaper, premium news content, Jagran news plan, ePaper login, ePaper access, ePaper archive, ePaper without ads, UP Hindi ePaper, Bihar ePaper, MP ePaper, Rajasthan ePaper, Jharkhand ePaper, Hindi newspaper today, regional ePaper India, district wise ePaper, Lucknow ePaper, Patna ePaper, Bhopal ePaper, Jaipur ePaper, Ranchi ePaper, ad-free news subscription, Hindi newspaper subscription, regional Hindi news online, Jagran district ePaper, local news ePaper, Hindi ePaper cities, free Hindi ePaper trial"
            />
          </Head>

          <header className={styles.header}>
            {/* <div onClick={() => window.history.go(-1)} style={{position: 'absolute', top: '4rem', cursor: "pointer"}}><svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="36" height="36"><path d="M19,11H9l3.293-3.293L10.879,6.293,6.586,10.586a2,2,0,0,0,0,2.828l4.293,4.293,1.414-1.414L9,13H19Z"/></svg></div> */}
            <div className={styles.headerContent}>
              <h1 className={styles.logo}>
                {(() => {
                  if (domainInfo?.apiDomainValue === "naidunia") {
                    return (
                      <Image
                        src="/images/naidunia-logo.png"
                        alt="Logo Nai Dunia Epaper"
                        width={150}
                        height={50}
                      />
                    );
                  } else if (domainInfo?.apiDomainValue === "naidunia") {
                    return (
                      <Image
                        src="/images/punjabi-jagran-logo.png"
                        alt="Logo Punjabi Jagran Epaper"
                        width={150}
                        height={50}
                      />
                    );
                  } else {
                    return (
                      <Image
                        src="/images/jagran-epaper-logo.png"
                        alt="Logo Jagran Epaper"
                        width={150}
                        height={50}
                      />
                    );
                  }
                })()}
              </h1>
              {Object.keys(userDetail).length > 0 ? (
                <span
                  className={styles.web}
                  style={{ position: "absolute", right: 30 }}
                >
                  {/* <MyAccountDropdown
                    profile={userDetail}
                    userDetail={userDetail}
                    pathname={pathname}
                  /> */}
                </span>
              ) : (
                <span
                  className={styles.web}
                  style={{ position: "absolute", right: 30 }}
                >
                  पहले से सब्सक्राइबर हैं?{" "}
                  <button onClick={login} className={styles.btnLogin}>
                    लॉगिन करें।
                  </button>
                </span>
              )}
            </div>
          </header>

          <div id="pan"></div>
          <section className={styles.heroSection}>
            <div className="title">
              <h2 className={styles.web}>
                सब्सक्रिप्शन लेकर बनिए जागरण के प्रीमियम मेंबर
                <br /> और पाइए एक्सक्लूसिव कंटेंट और प्रीमियम बेनिफिट्स।
              </h2>
              <h2 className={styles.mobile}>
                सब्सक्रिप्शन लेकर बनिए जागरण के प्रीमियम मेंबर और पाइए
                एक्सक्लूसिव कंटेंट और प्रीमियम बेनिफिट्स।
              </h2>
            </div>
            {/* <CustomBanner /> */}
            {/* Plan for web and mobile */}
            {/* <div className={styles.plansWrapper}>
              <div className={`${styles.planCard} ${styles.featured}`}>
                <div className={styles.mostPopular}>Most Popular</div> 
                <div className={styles.planSummary}>
                  <div className={styles.planName}>Prime+ads free+epaper</div>
                  <h3 className={styles.planAmount}>₹365</h3>
                  <p className={styles.planAmountDay}>(₹1/ दिन)</p>
                </div>
                <ul>
                  <li><Image src={checkIcon} alt='' width={20} height={20} /> <div>अवधि  - 1 साल</div> </li>
                  <li><Image src={checkIcon} alt='' width={20} height={20} />  <div>सभी संस्करण पढ़ें</div></li>
                  <li><Image src={checkIcon} alt='' width={20} height={20} />  <div>जागरण प्राइम मेंबरशिप</div> <Image src={diamondIcon} alt='' width={20} height={20} /></li>
                  <li><Image src={checkIcon} alt='' width={20} height={20} />  <div>मित विज्ञापन</div></li>
                  <li><Image src={checkIcon} alt='' width={20} height={20} />  <div>आर्काइव अवधि</div></li>
                  <li><Image src={removeIcon} alt='' width={20} height={20} />  <div>बुकमार्क करें</div></li>
                  <li><Image src={removeIcon} alt='' width={20} height={20} />  <div>मोबाइल एप्प पर पढ़ें</div></li>
                </ul>
                <button className={styles.continueBtn}>CONTINUE</button>
                <button className={styles.selectCouponCode}><Image src={discountIcon} alt='' width={20} /> कूपन कोड लगाएं</button>            
              </div>
            </div>             */}

            <div>
              <div>
                <TabbedPlans
                  plansList={plans}
                  activeTab={activeTab}
                  selectedPlanHandler={selectedPlanHandler}
                  selectedPlan={selectedPlan}
                  handlePlanSelection={handlePlanSelection}
                  showModalHandler={showModalHandler}
                  duration={duration}
                  loadingPlans={loadingPlans}
                  calculateDailyCost={calculateDailyCost}
                />
              </div>
              {/* {showModal && (
                <CheckoutModal onClose={() => setShowModal(false)} />
              )} */}
            </div>
            <div className={`${styles.mobile}`} style={{ padding: "20px 0" }}>
              <div>
                <SubscriptionCard
                  plansList={plans}
                  activeTab={activeTab}
                  selectedPlanHandler={selectedPlanHandler}
                  selectedPlan={selectedPlan}
                  handlePlanSelection={handlePlanSelection}
                  showModalHandler={showModalHandler}
                  duration={duration}
                  showModal={showModal}
                  discount={discount}
                  loadingPlans={loadingPlans}
                  calculateDailyCost={calculateDailyCost}
                />
              </div>
            </div>
            {isSuccess && (
              <SuccessDisplay
                heading={"Subscrition success"}
                onClose={onCloseFail}
                onCloseModal={onCloseSuccess}
                status={isSuccess}
                userDetail={userDetail}
              />
            )}
            {/* <div className={`${styles.planContainer} ${styles.mt}50}`}>
              <div>Prime epaper only</div>
              <div className={styles.activePlan}>Prime + Ads free + epaper</div>
              <div>Epaper + ads Free</div>
            </div> */}
          </section>
          {Object.keys(userDetail).length == 0 && (
            <div className={`${styles.mobile} ${styles.mobilelogin}`}>
              <p>
                पहले से सब्सक्राइबर हैं?{" "}
                <button type="button" alt="login " onClick={login}>
                  लॉगिन करें।
                </button>
              </p>
            </div>
          )}
        </div>

        <section className={`${styles.primeFeatures} ${styles.web}`}>
          {/* {plans?.[activeTab]?.length > 0 && (
            <div className={styles.planTab}>
              {plans[activeTab].map((plan) => {
                return (
                  <span
                    onClick={() => handlePlanSelection(plan)}
                    key={plan.id}
                    className={
                      selectedPlan && selectedPlan.id === plan.id
                        ? styles.active
                        : ""
                    }
                  >
                    {plan.subscription_name_hi || "Subscription Plan"}
                  </span>
                );
              })}
            </div>
          )} */}
          <h2>
            {selectedPlan?.subscription_name_hi || "Subscription Plan"} मेंबरशिप
            में मिलेंगे ये स्पेशल बेनीफिट
          </h2>

          {loadingPlans ? (
            <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
              {[1, 2, 3].map((el) => (
                <div key={el} className={styles.featureRow}>
                  <Skeleton
                    width={150}
                    height={150}
                    style={{ marginBottom: "5px" }}
                  />
                  <aside>
                    <Skeleton
                      width={150}
                      height={30}
                      style={{ marginBottom: "5px" }}
                    />
                    <Skeleton
                      width={250}
                      height={15}
                      style={{ marginBottom: "5px", marginTop: "20px" }}
                    />
                    <Skeleton
                      width={250}
                      height={15}
                      style={{ marginBottom: "5px" }}
                    />
                    <Skeleton
                      width={250}
                      height={15}
                      style={{ marginBottom: "5px" }}
                    />
                    <Skeleton
                      width={250}
                      height={15}
                      style={{ marginBottom: "5px" }}
                    />
                  </aside>
                </div>
              ))}
            </SkeletonTheme>
          ) : (
            <>
              <div className={styles.featuresGrid}>
                {selectedPlan &&
                  selectedPlan?.features?.map((feature, idx) => {
                    if (feature.is_feature_active)
                      return (
                        <div className={styles.featuresCard} key={feature.id}>
                          <div className={styles.featuresImage}>
                            <Image
                              src={feature.web_image}
                              alt="Feature 1"
                              width={500}
                              height={280}
                            />
                          </div>
                          <div className={styles.featuresContent}>
                            <h3 className={styles.featuresTitle}>
                              {renderTitle(feature.feature_text_hi)}
                            </h3>
                            <p className={styles.featuresDescription}>
                              {feature.description_hi}
                            </p>
                          </div>
                        </div>
                      );
                  })}
              </div>
            </>
          )}
        </section>

        <section className={`${styles.mobile} ${styles.paddingAll}`}>
          <PrimeFeaturesMobile
            selectedPlan={selectedPlan}
            plans={plans}
            activeTab={activeTab}
            handlePlanSelection={handlePlanSelection}
            loadingPlans={loadingPlans}
          />
        </section>

        <FAQSection />
      </div>

      <div
        className={`${styles.bottomFixedBar} ${
          showBottomBar ? styles.show : ""
        }`}
      >
        <div className={styles.packageSelection}>
          <div className={styles.planGrid}>
            {plans?.[activeTab]?.length &&
              plans[activeTab].map((plan, idx) => {
                if (!plan) {
                  return null;
                }
                return (
                  <>
                    <label
                      className={`${styles.planCard} ${styles.featured}`}
                      key={plan.subscription_name}
                    >
                      <input
                        name="plan"
                        className={styles.planRadio}
                        type="radio"
                        checked={
                          selectedPlan?.subscription_name_hi ==
                          plan?.subscription_name_hi
                        }
                        onChange={() => {
                          handlePlanSelection(plan);
                        }}
                      />
                      {plan.highlight_text_hi && (
                        <div className={styles.mostPopular}>
                          {plan.highlight_text_hi}
                        </div>
                      )}
                      <span className={styles.planDetails}>
                        <span className={styles.planType}>
                          {plan.subscription_name_hi || "Subscription Plan"}
                        </span>
                        <div className={styles.planamt}>
                          <span className={styles.planCost}>
                            {" "}
                            {plan.currency == "INR"
                              ? "₹" + formatDecimal(plan.sell_price)
                              : "$" + formatDecimal(plan.sell_price)}
                          </span>
                          <span className={styles.discount}>
                            <span className={styles.regularPrice}>
                              {plan.currency == "INR"
                                ? "₹" + formatDecimal(plan.mrp_price)
                                : "$" + formatDecimal(plan.mrp_price)}{" "}
                            </span>
                            <span className={styles.saveupto}>
                              {" "}
                              SAVE {discount(plan.mrp_price, plan.sell_price)}%
                            </span>
                          </span>
                          {activeTab != "daily" && (
                            <div className={styles.pdc}>
                              {calculateDailyCost(plan.sell_price, activeTab)}
                            </div>
                          )}
                        </div>
                      </span>
                    </label>
                  </>
                );
              })}
            {showModal == false && (
              <button
                className={styles.continueBtn}
                onClick={() => showModalHandler(selectedPlan)}
              >
                आगे बढ़ें
              </button>
            )}
          </div>
        </div>
      </div>
      <Confetti isActive={showConfetti} triggerElement={confettiTrigger} />

      {showModal && (
        <CheckoutModal
          location={location}
          onClose={hideModalHandler}
          state={state}
          city={city}
          onChangeHandler={onChangeHandler}
          couponCode={couponCode}
          applyCoupon={applyCoupon}
          selectedCoupon={selectedCoupon}
          removeCoupon={removeCoupon}
          userDetail={userDetail}
          selectedPlan={selectedPlan}
          generateOrder={generateOrder}
          validateError={validateError}
          error={error}
          applyCouponn={applyCouponn}
          confettiTrigger={confettiTrigger}
          showConfetti={showConfetti}
          showSuccess={showSuccess}
          emailValidation={emailValidation}
          loading={loading}
          duration={duration}
          name={name}
        />
      )}
      <ThankYouModal
        isOpen={thanksModal}
        onClose={closeThanksModal}
        userDetail={userDetail}
      />
    </>
  );
}
export const getServerSideProps = async (context) => {
      //const { slug } = context.params;
      const host = context?.req?.headers?.host || "localhost";
      const domainInfo = getDomain(host);
  return { props: {domainInfo} };
};
