import { useState, useEffect } from "react";
import DirectCheckoutModal from "./directCheckoutModal";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import useLogin from "../hooks/useLogin";
import axios from "axios";
import Image from "next/image";

const DirectSubscription = ({ articleId = "", category = "" }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const userDetail = useSelector((state) => state.userData.user);
  const router = useRouter();
  const [validateError, setValidateError] = useState({});
  const pathname = router.asPath;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [state, setState] = useState([]);
  const [city, setCity] = useState([]);

  const getPlans = async () => {
    try {
      const { data: fetchLocation } = await axios.get("/api/fetchIp");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL}api/v1/subscription/quick-plan`,
        {
          domain_url: process.env.DOMAIN,
          device_type: "WEB",
          country_code: fetchLocation.country_code,
        }
      );
      if (response.status == 200) {
        setLocation((prev) => {
          return { ...prev, country_code: fetchLocation.country_code };
        });

        setSelectedPlan(response?.data?.data?.subscriptionPlanData);
      }
    } catch (err) {
      console.log("err-", err);
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
  const [location, setLocation] = useState({
    country_code: "IN",
    state_code: "",
    city_code: "",
    state_id: "",
  });
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
      return;
    }
  };
  const validateFields = () => {
    const errors = {};
    if (!location.state_code || String(location.state_code).trim() === "") {
      errors.state = "Please select State";
    }

    if (!location.city_code || String(location.city_code).trim() === "") {
      errors.city = "Please select City";
    }
    if (!userDetail.email && !userDetail.mobile_no) {
      errors.email = "Email or Mobile is required";
    }

    setValidateError(errors);
    return Object.keys(errors).length === 0;
  };
  const generateOrder = async () => {
    try {
      if (!validateFields()) {
        setError("Please fill all required fields");
        return;
      }
      let url = window.location.href?.split("?")?.[0];

      const payload = {
        domain_url: process.env.DOMAIN,
        id: String(selectedPlan.id),
        device_type: "WEB",
        return_url: process.env.NEXT_PUBLIC_BASE_URL,
        country_code: String(location.country_code),
        state_code: String(location.state_code),
        city_name: String(location.city_code),
        coupon_code: "",
        page_url: url,
        article_id: articleId,
        article_category: category,
      };
      setError(null);

      const { data: order } = await axios.post(
        `${process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL}api/v1/subscription/init-purchase`,
        payload,
        { headers: { Authorization: "Bearer " + userDetail?.auth_token } }
      );
      if (order.code == 200) {
        window.location.href = `${process.env.NEXT_PUBLIC_PAYMNT_ROUTE}?txn=${order?.data?.transationData?.transaction_id}&url=${process.env.NEXT_PUBLIC_BASE_URL}&lang=hi
    `;
      } else {
        setError("Something went wrong1");
      }
    } catch (err) {
      setError("Something went wrong2");
    }
  };
  const hideModalHandler = () => {
    setShowModal(false);
  };
  const showModalHandler = () => {
    setShowModal(true);
    getStateList();
    getPlans();
  };
  useEffect(() => {
    if (userDetail.country_id == 101 && state.length > 0) {
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
  }, [userDetail, state]);
  if (userDetail.is_subscribed == true) {
    return;
  }

  return (
    <>
      {showModal && selectedPlan && (
        <DirectCheckoutModal
          location={location}
          onClose={hideModalHandler}
          state={state}
          city={city}
          onChangeHandler={onChangeHandler}
          userDetail={userDetail}
          selectedPlan={selectedPlan}
          generateOrder={generateOrder}
          validateError={validateError}
          error={error}
        />
      )}
      <div className="oneDay">
        <p className="adsHead">विज्ञापन से परेशान?</p>
        <div className="adsHolder">
          <Image
            src="/images/feature2.png"
            height={200}
            width={200}
            alt="ads free"
            className="adsImage"
          />
          <button type="button" onClick={showModalHandler}>
            ₹3 में विज्ञापन हटायें
          </button>
        </div>
      </div>
      <style>
        {`
       .oneDay > .adsHolder > .adsImage{
            min-width: inherit; 
            max-width: inherit;
       }
        .oneDay{
          margin:15px auto;
          text-align: center;
          max-width: 400px;
          box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
          padding:10px;
          border-radius:25px;
          display:flex;
          justify-content:center;
          flex-direction:column;
          
        }
          .oneDay .adsHead{
            margin-bottom:15px;
            font-size:18px;
            font-weight:600;
          }
          .adsHolder{
          display:flex;
          gap:10px;
          justify-content:center;
          }
        
        .oneDay button{
        font-size:14px;
        align-self: center;
        background-color: #f9fafb; border:1px solid #da251d; padding:14px 14px; color:#da251d; cursor:pointer}
        .oneDay button:hover{background-color:#da251d; color:#fff; opacity:1;}
        `}
      </style>
    </>
  );
};

export default DirectSubscription;
