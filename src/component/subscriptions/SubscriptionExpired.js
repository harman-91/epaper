"use client";

import { useState, useEffect } from "react";

export default function SubscriptionPopup() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
      <div
        className={`fixed ${
          isMobile
            ? "bottom-0 left-0 right-0"
            : "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        } bg-white p-4 shadow-lg z-50 flex flex-col items-center gap-4 w-full max-w-md`}
      >
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
            ⏳
          </span>
          <span className="text-lg font-semibold">Your subscription has ended</span>
        </div>
        <p className="text-center text-sm text-gray-600">
          Subscribe again to continue receiving the benefits
        </p>
        <button className="bg-black text-white px-6 py-2 rounded-full text-sm">
          Show Plans
        </button>
        <button className="text-sm text-gray-500 underline">Maybe later</button>
      </div>
    </>
  );
}