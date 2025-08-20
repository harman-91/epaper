import React from "react";
import styles from "../../styles/SubscriptionLatest.module.css";

function SubscriptionAdsFreeN({ selectedPlan }) {
  return (
    <section className={styles.whyChoose}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>एड-फ्री न्यूज़ क्यों चुनें?</h2>
        <p className={styles.sectionSubtitle}>
          अपना न्यूज़ रीडिंग अनुभव पूरी तरह बदलें
        </p>

        <div className={styles.benefitsGrid}>
          {/* {selectedPlan &&
            selectedPlan?.features?.map((feature, idx) => {
              return (
                <div className={styles.benefitCard} key={feature.id}>
                  <div className={styles.benefitIcon}>
                    {" "}
                    <Image
                      src={feature.web_image}
                      alt="Feature 1"
                      width={550}
                      height={180}
                    />
                  </div>
                  <h3>{feature.feature_text_hi}</h3>
                  <p>{feature.description_hi}</p>
                </div>
              );
            })} */}

          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-focus w-8 h-8 text-white"
                data-lov-id="src/components/Benefits.tsx:46:18"
                data-lov-name="benefit.icon"
                data-component-path="src/components/Benefits.tsx"
                data-component-line="46"
                data-component-file="Benefits.tsx"
                data-component-name="benefit.icon"
                data-component-content="%7B%22className%22%3A%22w-8%20h-8%20text-white%22%7D"
              >
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
                <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
                <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
                <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
              </svg>
            </div>
            <h3>विज्ञापन-मुक्त अनुभव</h3>
            <p>वेब, मोबाइल पर बिना किसी विज्ञापन के आराम से पढ़ें।</p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcondiamond}>
              <svg>
                <use href="/sprite.svg#diamondWhite"></use>
              </svg>{" "}
            </div>
            <h3>प्रीमियम मेंबर बैज</h3>
            <p>
              हर कमेंट और प्रोफ़ाइल पर दिखने वाला ख़ास बैज पाकर अपनी एक्सक्लूसिव
              पहचान दिखाएँ।
            </p>
          </div>

          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-clock w-8 h-8 text-white"
                data-lov-id="src/components/Benefits.tsx:46:18"
                data-lov-name="benefit.icon"
                data-component-path="src/components/Benefits.tsx"
                data-component-line="46"
                data-component-file="Benefits.tsx"
                data-component-name="benefit.icon"
                data-component-content="%7B%22className%22%3A%22w-8%20h-8%20text-white%22%7D"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3>समय की बचत</h3>
            <p>कम समय में ज़्यादा पढ़ें।</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SubscriptionAdsFreeN;
