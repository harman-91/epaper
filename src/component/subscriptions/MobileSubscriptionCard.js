import React, { useState, useEffect } from "react";
import styles from "../../styles/Subscription.module.css";
import { SkeletonTheme } from "../skeleton/SkeletonTheme";
import { Skeleton } from "../skeleton/Skeleton";
import { formatDecimal } from "@/utils/apiUtils";
const SubscriptionPlanCard = ({
  plansList,
  activeTab,
  selectedPlanHandler,
  selectedPlan,
  handlePlanSelection,
  showModalHandler,
  duration,
  discount,
  showModal,
  loadingPlans,
  calculateDailyCost,
}) => {
  const [mounted, setMounted] = useState(false);

  // Only render after component mounts to avoid SSR/hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Function to scroll to prime features section
  const scrollToFeatures = () => {
    const featuresSection = document.querySelector(`.${styles.primeFeaturesM}`);
    if (featuresSection) {
      featuresSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Don't render anything until mounted
  if (!mounted) {
    return <div>Loading...</div>;
  }

  // Safety checks
  if (
    !plansList ||
    !activeTab ||
    !plansList[activeTab] ||
    !Array.isArray(plansList[activeTab])
  ) {
    return <div>No plans available</div>;
  }

  const plans = plansList[activeTab];
  if (plans.length === 0) {
    return <div>No plans available</div>;
  }

  // Ensure selectedPlan has a fallback
  const currentSelectedPlan = selectedPlan || {};
  const SelectedDuration = duration.find(
    (d) => d.duration_type === selectedPlan.duration_type
  );
  return (
    <div>
      {loadingPlans ? (
        <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
          {[1, 2, 3].map((el) => (
            <div key={el} className={styles.mSubsCard}>
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
              </aside>
            </div>
          ))}
        </SkeletonTheme>
      ) : (
        <>
          {plans.length > 0 &&
            plans?.map((plan) => {
              if (!plan || !plan.id) return null;

              const isSelected = currentSelectedPlan.id === plan.id;
              const planDiscount =
                discount && typeof discount === "function"
                  ? discount(plan.mrp_price, plan.sell_price)
                  : 0;
              const dailyCost = calculateDailyCost(
                plan.sell_price,
                plan.duration_type
              );
              const dailyCostArray = dailyCost.split("/");
              return (
                <div
                  key={plan.id}
                  className={`${styles.mSubsCard} ${
                    isSelected ? styles.mSelected : ""
                  }`}
                  onClick={() => handlePlanSelection(plan)}
                >
                      {plan.highlight_text_hi && (
                  <div className={styles.mostPopular}>
                    {plan.highlight_text_hi}
                  </div>
                )}
                  <div className={styles.mHeader}>
                    <span className={styles.mTitle}>
                      {plan.subscription_name_hi || "Subscription Plan"}
                    </span>
                    <div
                      className={`${styles.mRadioReplacement} ${
                        isSelected ? styles.mRadioSelected : styles.mRadioCircle
                      }`}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the parent div's onClick
                        handlePlanSelection && handlePlanSelection(plan);
                      }}
                    >
                      {isSelected && "✓"}
                    </div>
                  </div>
                  {plan.free_trial_duration != 0 && (
                    <div className={styles.freeTrial}>
                      <span className={styles.freeTrailday}>
                        {plan.free_trial_duration}{" "}
                        {plan.free_trial_type == "days" ? "दिन " : "महीना "}
                        फ्री पढ़ें
                      </span>
                    </div>
                  )}
                  <div className={styles.mPricing}>
                    <div className={styles.mPriceLine}>
                      <span className={styles.mPrice}>
                        {dailyCostArray[0] && dailyCostArray[0].trim()}
                      </span>
                      <span className={styles.mPerMonth}>
                        / {dailyCostArray[1] && dailyCostArray[1].trim()}
                      </span>
                    </div>
                    <div className={styles.mTotalLine}>
                      <span className={styles.mSave}>Save {planDiscount}%</span>
                      <div className={styles.ntamt}>
                        <span>कुल राशि</span>
                        <span className={styles.priceNet}>
                          <s>
                            {plan.currency === "INR"
                              ? `₹${formatDecimal(plan.mrp_price) || 0}`
                              : `$${formatDecimal(plan.mrp_price) || 0}`}
                          </s>
                          <strong>
                            {plan.currency === "INR"
                              ? `₹${formatDecimal(plan.sell_price) || 0}`
                              : `$${formatDecimal(plan.sell_price) || 0}`}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {isSelected &&
                    plan.features &&
                    Array.isArray(plan.features) && (
                      <>
                        <ul className={styles.mFeatureList}>
                          {plan.features.map((item, index) => {
                            if (!item||!item.is_feature_active ) return null;
                            return (
                              <li
                                key={item.id || index}
                                className={styles.mFeatureItem}
                              >
                                <span
                                  className={
                                    item.is_feature_active
                                      ? styles.mCheck
                                      : styles.mCross
                                  }
                                >
                                  {item.is_feature_active ? "✔" : "✖"}
                                </span>{" "}
                                {item.feature_text_hi || "Feature"}
                              </li>
                            );
                          })}
                        </ul>
                        <div
                          className={styles.whatsnew}
                          onClick={(e) => {
                            e.stopPropagation();
                            scrollToFeatures();
                          }}
                          style={{ cursor: "pointer",textDecoration: "underline" }}
                        >
                          और फ़ायदे जानिए
                        </div>
                      </>
                    )}
                </div>
              );
            })}
        </>
      )}

      {showModal == false && (
        <div className={styles.mContinueFixed}>
          <button
            className={styles.continueBtn}
            onClick={() =>
              currentSelectedPlan && showModalHandler(currentSelectedPlan)
            }
          >
            {selectedPlan.free_trial_duration == 0 ? (
              <div className={styles.continueBtnTxt}>
                <span>
                  {" "}
                  {selectedPlan && selectedPlan?.currency === "INR"
                    ? `₹${formatDecimal(selectedPlan.sell_price) || 0}`
                    : `$${formatDecimal(selectedPlan.sell_price) || 0}`}/ {SelectedDuration.duration}
                </span>
                आगे बढ़ें
              </div>
            ) : (
              <>
                {" "}
                {selectedPlan.free_trial_duration}{" "}
                {selectedPlan.free_trial_type == "days" ? "दिन " : "महीना "}
                फ्री पढ़ें
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlanCard;
