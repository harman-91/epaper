import React from "react";
import styles from "../../styles/SubscriptionLatest.module.css";


function SubscriptionFooterN() {
  return (
   <section class={styles.footerCta}>
        <div class={styles.container}>
            <h2>अब शुरू करें <br />बिना रुकावट पढ़ना</h2>
            <p>हज़ारों पाठकों की तरह आप भी जुड़ें एड-फ्री अनुभव के साथ।</p>
            <a href="#" class={`${styles.btn} ${styles.btnPrimary}`}>एड-फ्री एक्सेस शुरू करें →</a>
            <div class={styles.footerInfo}>
                <p>🔒 अब पढ़ना शुरू करें – बिना किसी बाधा के! </p>
                <p><a href="https://www.jagran.com/subscription-policy.html" target="_blank">सब्सक्रिप्शन पॉलिसी</a></p>
            </div>
        </div>
    </section>
  );
}

export default SubscriptionFooterN;
