import { useState } from "react";
import Image from "next/image";
import styles from "../../styles/PlanTabs.module.css";
import checkIcon from "/public/images/check.png";
import removeIcon from "/public/images/remove.png";
import diamondIcon from "/public/images/diamondIcon.png";
import { SkeletonTheme } from "../skeleton/SkeletonTheme";
import { Skeleton } from "../skeleton/Skeleton";
import React from "react";
import { formatDecimal } from "@/utils/apiUtils";

export default function TabbedPlans({
  plansList,
  activeTab,
  selectedPlanHandler,
  selectedPlan,
  handlePlanSelection,
  showModalHandler,
  duration,
  loadingPlans,
  calculateDailyCost,
}) {
  return (
    <>
      <div className={styles.planContainer}>
        {duration.map((key) => {
          if (
            !plansList[key.duration_type] ||
            plansList[key.duration_type]?.length === 0
          )
            return null;
          return (
            <div
              key={key.duration_type}
              id={key.duration_type}
              className={
                activeTab === key.duration_type ? styles.activePlan : ""
              }
              onClick={() => selectedPlanHandler(key)}
            >
              {key.duration}
            </div>
          );
        })}
      </div>
      {loadingPlans ? (
        <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
          <div className={styles.skeletonWrapper}>
            {[1, 2, 3].map((el) => {
              return (
                <React.Fragment key={el}>
                  <div className={styles.skeletonWrapperCard}>
                    <aside>
                      <Skeleton
                        width={100}
                        height={35}
                        style={{ marginBottom: "5px" }}
                      />
                      <Skeleton
                        width={200}
                        height={15}
                        style={{ marginBottom: "5px", marginTop: "20px" }}
                      />
                      <Skeleton
                        width={200}
                        height={15}
                        style={{ marginBottom: "5px" }}
                      />
                      <Skeleton
                        width={200}
                        height={15}
                        style={{ marginBottom: "5px" }}
                      />
                      <Skeleton
                        width={200}
                        height={15}
                        style={{ marginBottom: "5px" }}
                      />
                      <Skeleton
                        width={200}
                        height={15}
                        style={{ marginBottom: "5px" }}
                      />
                      <Skeleton
                        width={200}
                        height={15}
                        style={{ marginBottom: "5px" }}
                      />
                      <Skeleton
                        width={200}
                        height={35}
                        style={{ marginBottom: "5px" }}
                      />
                    </aside>
                    {/* <figure>
                    <Skeleton
                      width={120}
                      height={15}
                      style={{
                        postion: "relative",
                      }}
                    />
                  </figure> */}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </SkeletonTheme>
      ) : (
        <div className={`${styles.plansWrapper} ${styles.web}`}>
          {plansList?.[activeTab]?.length > 0 &&
            plansList[activeTab].map((plan, idx) => (
              <div
                key={idx}
                className={`${styles.planCard} ${
                  plan.highlight_text_hi ? styles.featured : ""
                } ${
                  selectedPlan && selectedPlan.id === plan.id
                    ? styles.selectedPlan
                    : ""
                }`}
                onClick={() => handlePlanSelection(plan)}
              >
                {plan.highlight_text_hi && (
                  <div className={styles.mostPopular}>
                    {plan.highlight_text_hi}
                  </div>
                )}
                <div className={styles.planSummary}>
                  <div className={styles.planName}>
                    {plan.subscription_name_hi||"Subscription Plan"}
                  </div>
                  <h3 className={`${styles.planAmount}`}>
                    {plan.currency == "INR"
                      ? "₹" + formatDecimal(plan.sell_price)
                      : "$" + formatDecimal(plan.sell_price)}
                  </h3>

                  {plan.duration_type != "daily" && (
                    <p className={styles.planAmountDay}>
                      ( {calculateDailyCost(plan.sell_price, activeTab)})
                    </p>
                  )}
                </div>
                <ul>
                  {plan.features.map((feature, i) => {
                    const isRemove =
                      typeof feature === "object" && feature.remove;
                    return (
                      <li key={i}>
                        <Image
                          src={
                            feature.is_feature_active ? checkIcon : removeIcon
                          }
                          alt=""
                          width={20}
                          height={20}
                        />
                        <div>{feature?.feature_text_hi}</div>
                        {feature?.feature_text_hi?.includes("मेंबरशिप") && (
                          <Image
                            src={diamondIcon}
                            alt=""
                            width={20}
                            height={20}
                          />
                        )}
                      </li>
                    );
                  })}
                </ul>
                <button
                  className={styles.continueBtn}
                  onClick={() => showModalHandler(plan)}
                >
                आगे बढ़ें

                </button>
                {/* <button className={styles.selectCouponCode}>
                <Image src={discountIcon} alt="" width={20} /> कूपन कोड लगाएं
              </button> */}
              </div>
            ))}
        </div>
      )}
    </>
  );
}
