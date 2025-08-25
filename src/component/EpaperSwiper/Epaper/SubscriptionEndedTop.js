import variable from "@/component/utility/variable";
import React, { useEffect, useState } from "react";

const SubscriptionEndedTop = ({ userDetail }) => {
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem(variable.SUBSCRIPTION_STATUS);
    const subscriptionStatus = storedData ? JSON.parse(storedData) : {};
    const expireDate = subscriptionStatus.expireDate ? new Date(subscriptionStatus.expireDate) : null;
    const currentDate = new Date();

    if (
      userDetail.expiredSubscriptionEndDate &&
      userDetail?.is_subscribed === false &&
      (!expireDate || expireDate < currentDate)
    ) {
      setIsExpired(true);
      const newExpireDate = new Date();
      newExpireDate.setDate(newExpireDate.getDate() + 1);
      localStorage.setItem(
        variable.SUBSCRIPTION_STATUS,
        JSON.stringify({
          expireDate: newExpireDate.toISOString(),
        })
      );
    } else if (userDetail?.is_subscribed === true) {
      setIsExpired(false);
      localStorage.removeItem(variable.SUBSCRIPTION_STATUS);
    }
  }, [userDetail]);

  const handleClose = () => {
    // const currentDate = new Date();
    // localStorage.setItem(
    //   variable.SUBSCRIPTION_STATUS,
    //   JSON.stringify({
    //     expireDate: currentDate.toISOString(),
    //   })
    // );
    setIsExpired(false);
  };

  if (isExpired) {
    return (
      <div className="bg-pink-50 px-4 py-3 flex items-center justify-between w-full">
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Left side with icon and message */}
          <div className="flex items-center">
            {/* Diamond/gem icon */}
            <div className="flex-shrink-0">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-purple-600"
              >
                <path
                  d="M6 3h12l4 6-10 12L2 9l4-6z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  fill="none"
                />
                <path
                  d="m6 3 6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="m2 9 6 6 6-6 6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Message text */}
            <span className="text-gray-700 text-sm font-medium ml-3">
              Your subscription has ended. Subscribe again to continue receiving
              the benefits
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              className="bg

-white border border-gray-300 text-gray-700 px-4 py-2 text-sm font-medium rounded hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Show Plans
            </button>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              aria-label="Close"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 18L18 6M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default SubscriptionEndedTop;