import React from "react";

const SubscriptionEndedTop = ({ userDetail }) => {
  if (
    userDetail.expiredSubscriptionEndDate &&
    userDetail?.is_subscribed == false
  )
    return (
      <div className="bg-pink-50 px-4 py-3 flex items-center justify-between w-full">
        <div className="container mx-auto px-4">
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
            <span className="text-gray-700 text-sm font-medium">
              Your subscription has ended. Subscribe again to continue receiving
              the benefits
            </span>
          </div>

          <div className="flex-shrink-0">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 text-sm font-medium rounded hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
              Show Plans
            </button>
          </div>
        </div>
      </div>
    );
};

export default SubscriptionEndedTop;
