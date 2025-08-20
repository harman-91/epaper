import React from "react";
import styles from "../../styles/SubscriptionLatest.module.css";
import Image from "next/image";

function SubscriptionPlanN({
  plansList,
  activeTab,
  selectedPlanHandler,
  selectedPlan,
  handlePlanSelection,
  showModalHandler,
  duration,
}) {
    function calculateCostPerDay(totalCost, durationType) {
    try {
      if (totalCost < 0) {
        return "";
      }
      if (!["monthly", "yearly"].includes(durationType.toLowerCase())) {
        return "";
      }

      const days = durationType.toLowerCase() === "monthly" ? 30 : 365;

      const costPerDay = totalCost / days;

      return "₹" + Number(costPerDay.toFixed(2)) + " /दिन";
    } catch (err) {
      return "";
    }
  }
  return (
    <section className={styles.pricing}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>अपना प्लान चुनें</h2>
        <p className={styles.sectionSubtitle}>
          हर किसी के लिए किफ़ायती, विज्ञापन-मुक्त न्यूज़ रीडिंग
        </p>

        <div className={styles.pricingGrid}>
          {/* <div className={styles.pricingCard}>
                    <h3>विज्ञापनों के साथ</h3>
                    <div className={styles.price}>₹0</div>
                    <div className={styles.pricePeriod}>मौजूदा अनुभव</div>
                    <ul className={styles.featuresListPricing}>
                        <li>
                            <span>
                            <Image src="../images/cross.svg" width={15} height={15} unoptimize />
                            </span> 
                            बार-बार आने वाले विज्ञापन
                        </li>
                        <li>
                            <span>
                            <Image src="../images/cross.svg" width={15} height={15} unoptimize />
                            </span> 
                           धीमी पेज लोडिंग
                        </li>
                        <li>
                            <span>
                            <Image src="../images/cross.svg" width={15} height={15} unoptimize />
                            </span> 
                            डेटा ट्रैकिंग
                        </li>
                        <li>
                             <span>
                            <Image src="../images/cross.svg" width={15} height={15} unoptimize />
                            </span>
                             कम रीडेबिलिटी
                        </li>
                    </ul>
                    <a href="#" className={`${styles.btn} ${styles.btnSecondary}`}>मौजूदा प्लान</a>
                </div> */}
          {/* <div className={`${styles.pricingCard}`}>
            <h3>मौजूदा अनुभव</h3>
            <div className={styles.price}>₹0</div>
            <div className={styles.pricePeriod}>
              मौजूदा रीडिंग अनुभव
            </div>
            <ul className={`${styles.featuresListPricing} ${styles.ticks}`}>
              <li>
                <span>
                  <Image
                    src={"/images/remove.png"}
                    alt=""
                    width={15}
                    height={15}
                  />
                </span>
                बार-बार आने वाले विज्ञापन
              </li>

              <li>
                <span>
                  <Image
                    src={"/images/remove.png"}
                    alt=""
                    width={15}
                    height={15}
                  />
                </span>
                कम रीडेबिलिटी
              </li>
            </ul>
            <button type="button" className={`${styles.btn} `}>
              मौजूदा अनुभव
            </button>
          </div> */}
          {plansList?.[activeTab]?.length &&
            plansList[activeTab].map((plan, idx) => {
              return (
                <div
                  key={idx}
                  className={`${styles.pricingCard} ${selectedPlan.id == plan.id ? styles.popular : ""
                    }`}
                  onClick={() => handlePlanSelection(plan)}
                >
                  {plan.highlight_text_hi && (
                    <div className={styles.popularBadge}>
                      {plan.highlight_text_hi}
                    </div>
                  )}
                  <h3>{plan.subscription_name_hi}</h3>
                  <div className={styles.priceBox}>
                    <div className={styles.oldprice}>
                      {plan.currency == "INR"
                        ? "₹" + Number(plan.mrp_price || 0).toFixed(0)
                        : "$" + plan.mrp_price}
                    </div>
                    <div className={styles.price}>
                      {plan.currency == "INR"
                        ? "₹" + Number(plan.sell_price || 0).toFixed(0)
                        : "$" + plan.sell_price}
                    </div>
                  </div>
                 {plan.duration_type != "daily"&& <div>
                    <span className={styles.perDay}>({calculateCostPerDay(plan.sell_price,plan.duration_type)})</span>
                  </div>}
                  <div className={styles.pricePeriod}>
                    {plan.subscription_description_hi}
                  </div>
                  {/* <ul
                    className={`${styles.featuresListPricing} ${styles.ticks}`}
                  >
                    {plan.features.map((feature, i) => {
                      return (
                        <li key={i}>
                          <span>
                            <Image
                              src={
                                feature.is_feature_active
                                  ? "/images/ticks.svg"
                                  : "/images/remove.png"
                              }
                              alt=""
                              width={15}
                              height={15}
                            />
                          </span>
                          {feature?.feature_text_hi}
                          {feature?.feature_text_hi?.includes("मेंबरशिप") && (
                            <Image
                              src={"/images/diamondIcon.png"}
                              alt=""
                              width={20}
                              height={20}
                            />
                          )}
                        </li>
                      );
                    })}
                  </ul> */}
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.bgRed600}`}
                    onClick={() => showModalHandler(plan)}
                  >
                    आगे बढ़ें
                  </button>
                </div>
              );
            })}

          {/* <div className={styles.pricingCard}>
                    <h3>मंथली प्लान</h3>
                    <div className={styles.price}>₹59</div>
                    <div className={styles.pricePeriod}>प्रति माह</div>
                    <ul className={`${styles.featuresListPricing} ${styles.ticks}`}>
                        <li>
                             <span>
                            <Image src="../images/ticks.svg" width={15} height={15} unoptimize />
                            </span>
                            1-दिन प्लान की सारी सुविधाएँ
                        </li>
                        <li>
                            <span>
                            <Image src="../images/ticks.svg" width={15} height={15} unoptimize />
                            </span>
                             बेहतर वैल्यू (₹1.96/दिन)
                        </li>
                 
                    </ul>
                    <a href="#" className={`${styles.btn} ${styles.btnSecondary}`}>मंथली प्लान चुनें</a>
                </div> */}
        </div>
      </div>
    </section>
  );
}

export default SubscriptionPlanN;
