'use client';
import React, { useState } from 'react';
import axios from 'axios';

import CancelSubscriptionModal from './cancelSubscriptionModal'; // Adjust path as needed
import { convertDateFormat } from '../utility/formatDate';

const SubscriptionHistory = ({
  query,
  profileData,
  auth,
  subscription,
  subscriptionActive,
  subscriptionHistory,
}) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [error, setError] = useState('');
  const [reason, setReason] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [activeSubscription, setActiveSubscription] = useState(subscriptionActive);
  const [history, setHistory] = useState(subscriptionHistory);
  const [loading, setLoading] = useState(false);

  const cancelSubscription = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL}api/v1/subscription/cancel`,
        {
          subscription_id: String(activeSubscription.id),
          cancel_reason: reason,
          row_id: String(activeSubscription.row_id),
        },
        { headers: { Authorization: `Bearer ${auth}` } }
      );
      if (data.code === 200) {
        const year = new Date().getFullYear();
        const subscriptionHistory = await axios
          .post(
            `${process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL}api/v1/subscription/get-txn-history`,
            { domain_url: `${process.env.DOMAIN}`, year },
            { headers: { Authorization: `Bearer ${auth}` } }
          )
          .then((res) => res.data.data.txnHistory)
          .catch(() => []);
        setShowModal(false);
        setActiveSubscription(null);
        setHistory(subscriptionHistory);
      } else {
        setError('Something went wrong');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const getSubscriptionHistory = async (year) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL}api/v1/subscription/get-txn-history`,
        { domain_url: `${process.env.DOMAIN}`, year },
        { headers: { Authorization: `Bearer ${auth}` } }
      );
      if (data.code === 200) {
        setHistory(data.data.txnHistory);
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error('Error fetching subscription history:', err);
    }
  };

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, index) => currentYear - index);
  };

  const onChangeHandler = (e) => {
    const year = e.target.value;
    setSelectedYear(year);
    getSubscriptionHistory(year);
  };

  return (
    <div>
    
      <div className="max-w-4xl mx-auto flex px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full md:w-[calc(100%-240px)] md:pl-12">
          {showModal && (
            <CancelSubscriptionModal
              cancelSubscription={cancelSubscription}
              onClose={() => setShowModal(false)}
              loading={loading}
              setReason={setReason}
              error={error}
            />
          )}
          <div className="max-w-3xl mx-auto">
            {activeSubscription ? (
              <div>
                <div className="bg-gradient-to-r from-orange-500 to-orange-400 text-white p-5 rounded-t-xl flex justify-between items-center">
                  <div className="text-lg font-semibold">MY ACTIVE SUBSCRIPTION</div>
                  {activeSubscription?.subscription_type === 'recurring' &&
                    !activeSubscription.is_cancelled && (
                      <button
                        type="button"
                        className="bg-white/20 text-white border border-white/30 px-4 py-2 rounded-md text-sm font-medium hover:bg-white/30 transition"
                        onClick={() => setShowModal(true)}
                      >
                        Cancel Subscription
                      </button>
                    )}
                </div>
                <div className="bg-white p-6 rounded-b-xl shadow-lg">
                  <div className="mb-0">
                    <div className="flex justify-between text-xl font-semibold text-gray-800 mb-4">
                      <span>{activeSubscription.subscription_name}</span>
                      <span>
                        {activeSubscription.currency === 'INR' ? '₹' : '$'}
                        {Number(activeSubscription?.sell_price)?.toFixed(0)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-2">
                      <div>
                        <strong>Start Date:</strong> {convertDateFormat(activeSubscription.start_date)}
                      </div>
                      <div>
                        <strong>End Date:</strong> {convertDateFormat(activeSubscription.end_date)}
                      </div>
                      <div className="text-gray-500 text-xs">
                        <strong>Transaction ID:</strong> {activeSubscription.transaction_id}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-10">
                <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-5 rounded-t-xl flex justify-between items-center shadow-md">
                  <div className="text-lg font-semibold">MY ACTIVE SUBSCRIPTION</div>
                </div>
                <div className="bg-white p-10 rounded-b-xl shadow-lg text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl text-gray-600">
                    📄
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-3">No Active Subscription</div>
                  <div className="text-base text-gray-600 max-w-md mx-auto">
                    You don&apos;t have any active subscription plan.
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-between items-center mt-8 mb-5 pb-2 border-b-2 border-gray-100">
              <span className="text-lg font-semibold text-gray-800">TRANSACTION DETAILS</span>
              <select
                name="year"
                onChange={onChangeHandler}
                value={selectedYear}
                className="border border-gray-300 px-3 py-1 rounded-md text-sm"
              >
                {getYearOptions().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            {history?.length > 0 ? (
              history.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-4 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-base font-semibold text-gray-800">
                      {item.subscription_name}
                    </div>
                    <div className="text-lg font-bold text-gray-800">
                      {item.currency === 'INR' ? '₹' : '$'}
                      {Number(item?.sell_price)?.toFixed(0)}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1.5">
                    <div>
                      <strong>Ordered on:</strong> {convertDateFormat(item.created_at)}
                    </div>
                    <div>
                      <strong>Order Status:</strong>{' '}
                      <span
                        className={`font-semibold capitalize ${
                          item.payment_status === 'success'
                            ? 'text-green-600'
                            : item.payment_status === 'failed'
                            ? 'text-red-600'
                            : ''
                        }`}
                      >
                        {item.payment_status}
                      </span>
                    </div>
                    <div className="text-gray-500 text-xs">
                      <strong>Transaction ID:</strong> {item.transaction_id}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-10 text-center">
                <div className="text-5xl mb-5 text-gray-400">💳</div>
                <div className="text-base text-gray-600 mb-2">No transactions</div>
                <div className="text-sm text-gray-500">
                  Your transaction history will appear here once you make a purchase
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionHistory;