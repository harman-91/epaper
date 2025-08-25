"use client";
import React from "react";
import LoadingButton from "../global/LoadingButton";

const reasons = [
  "बहुत महंगा है",
  "ग्राहक सेवा अच्छी नहीं है",
  "मैं ज़्यादा इस्तेमाल नहीं कर रहा/रही हूँ",
  "मुझे इससे बेहतर विकल्प मिल गया है",
  "ज़रूरी फीचर नहीं मिल रहे",
  "थोड़े समय का ब्रेक चाहिए",
  "तकनीकी दिक्कतें आ रही हैं",
  "कुछ और कारण",
];

const CancelSubscriptionModal = ({
  onClose,
  cancelSubscription,
  loading,
  setReason,
  error,
  end_date,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000]">
      <div className="bg-white p-8 rounded-lg max-w-lg w-full relative">
        <button
          className="absolute top-3 right-3 text-lg bg-transparent border-none cursor-pointer"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-4">
          Cancel Your Subscription?
        </h2>
        <p className="text-gray-600 mb-6">
          आप एक सक्रिय ऑटो-रिन्यू सब्सक्रिप्शन कैंसल करने जा रहे हैं। आपको{" "}
          <b>{end_date?.split("T")?.[0]}</b> तक पूरा एक्सेस मिलता रहेगा, इसके
          बाद आपकी योजना रिन्यू नहीं होगी।
        </p>
        <div className="flex flex-wrap gap-2 mt-5">
          {reasons.map((reason, idx) => (
            <label key={idx} className="flex items-center w-[48%]">
              <input
                type="radio"
                name="cancelReason"
                value={reason}
                onClick={(e) => setReason(e.target.value)}
                className="mr-2"
              />
              {reason}
            </label>
          ))}
        </div>
        {error && (
          <div className="text-red-600 text-base mt-2 text-center capitalize">
            {error}
          </div>
        )}
        <div className="mt-8 flex justify-end gap-3">
          <button
            className="px-5 py-2 bg-gray-300 rounded-md text-gray-800 hover:bg-gray-400 transition"
            onClick={onClose}
            type="button"
          >
            सब्सक्रिप्शन जारी रखें
          </button>
          <LoadingButton
            className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            loadingClassName="px-5 py-2 bg-red-600 text-white rounded-md opacity-75"
            onClick={cancelSubscription}
            loading={loading}
            type="button"
            dotColor="#ffff"
            size="8px"
          >
            सब्सक्रिप्शन कैंसल करें
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

export default CancelSubscriptionModal;
