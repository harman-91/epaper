"use client";
import React, { useRef, useState, useEffect } from "react";
import css from "@/styles/DeleteAccount.module.scss";
import axios from "axios";
import variable from "../utility/variable";
import { removeCookie } from "../utility/cookie";
import { useAppSelector } from "@/store/reduxHooks";
import DeactivateModal from "./deactivateModal";

function MyProfileDelete(props) {
  // Profile Delete start
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showError, setShowError] = useState(false);
  const userDetail = useAppSelector((state) => state.userData.user);
  const [loading, setLoading] = useState(false);
  const [showModalError, setShowModalError] = useState(false);
  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setShowError(false);
      }, 5000); // hide after 5 seconds

      return () => clearTimeout(timer); // cleanup on re-render
    }
  }, [showError]);

  const reasonData = [
    { list: "Didn’t find the account useful" },
    { list: "Privacy concerns" },
    { list: "Not satisfied with the services" },
    { list: "Facing technical issues" },
    { list: "Account was created by mistake" },
  ];
  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      setShowModalError(false);

      if (activeIndex === null && inputRef.current.value === "") {
        setShowError(true);
        return;
      }
      const { data } = await axios.post(
        process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL +
          "api/v1/customer/delete/account",
        {
          delete_remarks:
            activeIndex !== null
              ? reasonData[activeIndex].list
              : inputRef.current.value,
        },
        {
          headers: {
            Authorization: `Bearer ${userDetail.auth_token || props.auth}`,
          },
        }
      );
      if (data.code == 200) {
        removeCookie(variable.LOGIN_DETAIL);
        localStorage.removeItem("uid_auth");
        setIsModalOpen(false);
        window.location.href = "/";
      } else {
        setShowModalError(true);
      }
    } catch (error) {
      setShowModalError(true);
    }
    setLoading(false);
  };
  const handleModal = () => {
    if (activeIndex === null && inputRef.current.value === "") {
      setShowError(true);
      return;
    }
    setShowError(false);

    setIsModalOpen(true);
  };
  const inputRef = useRef(null);

  const faqs = [
    {
      question: "लॉगिन सुविधा",
      answer: "आपके जागरण अकाउंट लॉगिन पर रोक लग जाएगी।",
    },
    {
      question: "प्रीमियम या पेड सर्विसेज़",
      answer:
        "जैसे – ई-पेपर, जागरण प्राइम, या एड-फ्री अनुभव – अगर आपने सब्सक्रिप्शन लिया था, तो वह बंद हो जाएगा।",
    },
    {
      question: "सेव किए हुए आर्टिकल्स बुकमार्क्स",
      answer: "जो भी लेख आपने बुकमार्क किए हैं, वे सब मिट जाएंगे।",
    },
    {
      question: "पर्सनलाइज़्ड कंटेंट",
      answer:
        " आपकी पढ़ने की आदतों के आधार पर मिलने वाली सुझाव सेवाएँ बंद हो जाएँगी।",
    },
    {
      question: "प्रोफ़ाइल सेटिंग्स",
      answer:
        "आपकी प्रोफ़ाइल में अपने हिसाब से किये गए बदलाव (नाम, फोटो आदि) मिट जाएंगे",
    },
  ];
  return (
    <>
      <div className="bg-white overflow-hidden">
        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            {" "}
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            />{" "}
          </div>
          <div className="mx-auto max-w-5xl py-32 sm:py-48 lg:py-20">
            <div className="rounded-2xl bg-white shadow-2xl px-5 md:px-8 py-10">
              <h1 className="text-xl lg:text-3xl mb-4">
                एकाउंट को डिलीट करने पर आप ये सब{" "}
                <span className="text-[#dc2626]">“खो”</span> देंगे{" "}
              </h1>
              <div className="mt-10 lg:col-span-7 lg:mt-0 mb-6">
                <ul className="space-y-6 list-disc pl-5">
                  {faqs.map((faq) => (
                    <li key={faq.question}>
                      <div className="text-base/7 font-semibold text-gray-900">
                        {faq.question}
                      </div>
                      <div className="text-base/7 text-gray-600">
                        {faq.answer}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <h2 className="text-xl lg:text-2xl mb-4">कारण</h2>
              <ul className="list-none inline-flex flex-wrap gap-4 mb-2">
                {reasonData.map((data, index) => {
                  return (
                    <li
                      key={index}
                      className={`px-4 py-3 border rounded-md text-sm cursor-pointer ${
                        activeIndex === index
                          ? "border-gray-600 bg-gray-600 text-gray-50"
                          : "bg-gray-100/10 text-gray-600 hover:bg-gray-100/100"
                      } ${showError ? css.errorBorder : ""}`}
                      onClick={() => {
                        setActiveIndex(index);
                        setShowError(false);
                      }}
                    >
                      {data.list}
                    </li>
                  );
                })}
              </ul>
              <div className="flex items-center mb-8">
                <input
                  type="text"
                  placeholder="Other reason"
                  // className={`${css.otherInput} ${ isInputFocused ? css.expandedInput : "" }`}
                  className="block w-full rounded-md bg-white px-3 py-2.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-1 focus:-outline-offset-1 focus:outline-red-600 sm:text-sm/6"
                  ref={inputRef}
                  onFocus={() => {
                    setIsInputFocused(true);
                    setShowError(false);
                    setActiveIndex(null); // Clear selected recommendation
                  }}
                  onBlur={() => setIsInputFocused(false)}
                />
              </div>
              {showError && (
                <div
                  className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                  role="alert"
                >
                  {" "}
                  <span className="font-medium">कृपया कारण चुनें </span>{" "}
                </div>
              )}
              <div className="flex justify-center mt-4">
                <button
                  className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-md text-sm text-md px-5 sm:px-6 py-3 me-2 uppercase"
                  onClick={() => (window.location.href = "/edit-profile")}
                >
                  कैंसिल
                </button>
                <button
                  className="text-gray-100 bg-red-600 border border-red-600 focus:outline-none hover:bg-red-700 focus:ring-4 focus:ring-red-100 font-medium rounded-md text-sm text-md px-5 sm:px-6 py-3 me-2 uppercase"
                  onClick={handleModal}
                >
                  डिलीट एकाउंट{" "}
                </button>
              </div>

              <div className={css.deleteAccount}></div>
              <DeactivateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDeleteAccount}
                error={showModalError}
                loading={loading}
              />
            </div>
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          >
            {" "}
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            />{" "}
          </div>
        </div>
      </div>
    </>
  );
}

export default MyProfileDelete;
