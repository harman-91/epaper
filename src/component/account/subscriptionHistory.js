'use client';
import React, { useState } from 'react';
import axios from 'axios';

import CancelSubscriptionModal from './cancelSubscriptionModal'; // Adjust path as needed
import { convertDateFormat } from '../utility/formatDate';
import Image from 'next/image';
import { getAccountText } from '../meta/accountMeta';

function ClientSubscriptionHistory({
  query,
  profileData,
  auth,
  subscription,
  subscriptionActive,
  subscriptionHistory,
  domainInfo,
}) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showBenefits, setShowBenefits] = useState(false);
  const [error, setError] = useState('');
  const [reason, setReason] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(null);
  const [activeSubscription, setActiveSubscription] = useState(subscriptionActive);
  const [history, setHistory] = useState(subscriptionHistory);
  const [loading, setLoading] = useState(false);
  const text = getAccountText(domainInfo?.domainId);

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
            `${process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL}api/v1/subscription/get-currently-active`,
            { domain_url: `${process.env.DOMAIN}` },
            { headers: { Authorization: `Bearer ${auth}` } }
          )
          .then((res) => res.data.data.subscriptionData)
          .catch(() => []);
        setHistory(await fetchSubscriptionHistory(auth, process.env.DOMAIN, year));
        setShowModal(false);
        setActiveSubscription(subscriptionHistory);
      } else {
        setError('Something went wrong');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, index) => currentYear - index);
  };

  const onChangeHandler = async (e) => {
    const year = e.target.value;
    setSelectedYear(year);
    setHistory(await fetchSubscriptionHistory(auth, process.env.DOMAIN, year));
  };

  const handleCopy = async (transaction_id) => {
    try {
      await navigator.clipboard.writeText(transaction_id);
      setCopied(transaction_id);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const planBenefits = activeSubscription?.features || [];
  function getDaysDifference(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  function getMonthsDifference(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    let years = d2.getFullYear() - d1.getFullYear();
    let months = d2.getMonth() - d1.getMonth();
    return Math.abs(years * 12 + months);
  }

  const diff =
    activeSubscription?.free_trial_type === 'days'
      ? getDaysDifference(activeSubscription?.start_date, activeSubscription?.end_date)
      : getMonthsDifference(activeSubscription?.start_date, activeSubscription?.end_date);

  const browsePlans = () => {
    window.location.href = '/subscription/plan';
  };

  return (
    <>
      <div id="modal-root"></div>

      <div className="mx-auto max-w-5xl flex flex-col md:flex-row px-4 sm:px-6 md:px-0 py-12 sm:py-5">
        <div className="md:pl-12 w-full">
          {showModal && (
            <CancelSubscriptionModal
              cancelSubscription={cancelSubscription}
              onClose={() => setShowModal(false)}
              loading={loading}
              setReason={setReason}
              error={error}
              end_date={profileData?.subscriptionData?.end_date}
            />
          )}
          <div>
            {activeSubscription ? (
              <>
                <div className="bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white p-5 rounded-t-xl flex justify-between items-center sm:flex-row flex-col gap-2 sm:gap-0 text-center sm:text-left">
                  <div className="text-lg font-semibold">{text.mySubscription}</div>
                  {activeSubscription?.subscription_type === 'recurring' &&
                    !activeSubscription.is_cancelled && (
                      <button
                        type="button"
                        className="bg-white/20 text-white border border-white/30 px-4 py-2 rounded-md text-xs font-medium hover:bg-white/30 transition"
                        onClick={() => setShowModal(true)}
                      >
                        {text.cancelAutoRenew}
                      </button>
                    )}
                  {activeSubscription?.subscription_type === 'recurring' &&
                    activeSubscription.is_cancelled && (
                      <button type="button" className="text-white text-xs font-medium">
                        {text.cancelled}
                      </button>
                    )}
                </div>
                <div className="bg-white p-6 rounded-b-xl shadow-lg">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-semibold text-gray-800">
                        {activeSubscription.subscription_name_hi}
                      </span>
                      <span className="text-xl font-semibold">
                        {activeSubscription.currency === 'INR' ? '₹' : '$'}
                        {Number(activeSubscription?.sell_price)?.toFixed(0)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-2">
                      {diff !== activeSubscription.free_trial_duration ? (
                        <>
                          <div>
                            <strong>{text.startDate}:</strong>{' '}
                            {convertDateFormat(activeSubscription.start_date)}
                          </div>
                          <div>
                            <strong>{text.endDate}:</strong>{' '}
                            {convertDateFormat(activeSubscription.end_date)}
                          </div>
                        </>
                      ) : (
                        <div>
                          <strong>{text.remainingFreeTrial}:</strong>{' '}
                          {getDaysDifference(new Date(), activeSubscription?.end_date)}{' '}
                          {text.days}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <strong>{text.txnId}:</strong> {activeSubscription.transaction_id}
                      </div>
                      <div className="text-sm">
                        <strong>{text.bundlePackage}:</strong>{' '}
                        {activeSubscription?.bundle_products
                          ?.map((el) => el.product_name)
                          .join(', ')}
                      </div>
                    </div>
                    <div className="mt-5 pt-4 border-t border-gray-200">
                      <div
                        className="flex justify-between items-center cursor-pointer py-2 select-none hover:opacity-80"
                        onClick={() => setShowBenefits(!showBenefits)}
                      >
                        <span className="text-sm font-semibold uppercase text-gray-800">
                          {text.activePlanBenefits}
                        </span>
                        <span
                          className={`transform transition-transform ${
                            showBenefits ? 'rotate-180' : 'rotate-0'
                          }`}
                        >
                          <ArrowDownIcon />
                        </span>
                      </div>
                      {showBenefits && (
                        <div className="mt-4 animate-slideDown">
                          <div className="space-y-2">
                            {planBenefits.map((feature, index) => (
                              <div
                                key={feature.id || index}
                                className="flex items-center gap-5 py-2 border-b border-gray-100 last:border-b-0"
                              >
                                <div className="relative w-[100px] h-[65px]">
                                  <Image
                                    src={feature.web_image || feature.mweb_app_image}
                                    alt={feature.feature_text_hi || feature.feature_text}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <h4 className="text-base font-semibold text-gray-800">
                                    {feature.feature_text_hi || feature.feature_text}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {feature.description_hi || feature.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-r from-gray-500 to-gray-700 text-white p-5 rounded-t-xl flex justify-between items-center sm:flex-row flex-col gap-2 sm:gap-0 text-center sm:text-left shadow-lg">
                  <div className="text-lg font-semibold">{text.mySubscription}</div>
                </div>
                <div className="bg-white p-8 rounded-b-xl shadow-lg text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto text-gray-500 text-4xl sm:text-3xl">
                    📄
                  </div>
                  <div className="text-2xl sm:text-xl font-bold text-gray-800 mt-3">
                    {text.noActiveSubscription}
                  </div>
                  <div className="text-base sm:text-sm text-gray-500 mt-3 max-w-sm mx-auto">
                    {text.purchasePlanPrompt}
                  </div>
                  <button
                    className="mt-6 bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white px-8 py-3 rounded-lg font-semibold text-base hover:-translate-y-0.5 hover:shadow-xl transition transform"
                    onClick={browsePlans}
                  >
                    {text.browsePlans}
                  </button>
                </div>
              </div>
            )}
            <div className="flex justify-between items-center mt-8 mb-5 pb-2 border-b-2 border-gray-100">
              <span className="text-lg font-semibold text-gray-800">{text.transactionDetails}</span>
              <div>
                <select
                  name="year"
                  onChange={onChangeHandler}
                  value={selectedYear}
                  className="border border-gray-300 rounded px-3 py-1 bg-white text-gray-800 text-sm"
                >
                  {getYearOptions().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {history?.length > 0 ? (
              history.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-4 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-center mb-4 sm:items-start sm:gap-2">
                    <div className="text-base font-semibold text-gray-800">
                      {item.subscription_name_hi}
                    </div>
                    <div className="text-lg font-bold text-gray-800">
                      {item.currency === 'INR' ? '₹' : '$'}
                      {Number(item?.sell_price)?.toFixed(0)}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1.5">
                    <div>
                      <strong>{text.orderedOn}:</strong>{' '}
                      {convertDateFormat(item.created_at)}
                    </div>
                    <div>
                      <strong>{text.orderStatus}:</strong>{' '}
                      <span
                        className={
                          item.payment_status === 'success'
                            ? 'text-green-600 font-semibold capitalize'
                            : item.payment_status === 'failed'
                            ? 'text-red-600 font-semibold capitalize'
                            : 'font-semibold capitalize'
                        }
                      >
                        {item.payment_status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <strong>{text.txnId}:</strong> {item.transaction_id}
                      <button
                        onClick={() => handleCopy(item.transaction_id)}
                        className="p-0 bg-transparent border-none cursor-pointer"
                        title={text.copyTransactionId}
                      >
                        {copied === item.transaction_id ? <TickIcon /> : <CopyIcon />}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <div className="text-5xl sm:text-4xl text-gray-400 mb-5">💳</div>
                  <div className="text-base font-semibold text-gray-800">
                    {text.noTransactions}
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    {text.transactionHistoryPrompt}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const TickIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <path d="M20 6L9 17l-5-5"></path>
  </svg>
);

const CopyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const ArrowDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <path d="M6 9l6 6 6-6"></path>
  </svg>
);

export default ClientSubscriptionHistory;