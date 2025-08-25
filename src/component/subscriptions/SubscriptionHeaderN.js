import React from "react";
import styles from "../../styles/SubscriptionLatest.module.css";
import GlobalLink from "../global/GlobalLink";

function SubscriptionHeaderN() {
  return (
    <section className={styles.header}>
      <div className={styles.container}>
        {/* <div className={styles.premiumBadge}>🔥 प्रीमियम न्यूज़ अनुभव</div> */}
        {/* <span             style={{height: "50px", width: "50px", display: "inline-block", marginBottom: "20px"}}
>
           <a
            title="Dainik Jagran Hindi News"
            href="/"
          >
            <svg>
              <use href="/sprite.svg#jagran_logo"></use>
            </svg>
          </a>
          </span> */}

          <div className={styles.logoSection}>
            <GlobalLink title="Dainik Jagran Hindi News" href="/">
              <svg><use href="/sprite.svg#jagran"></use></svg>
            </GlobalLink>
          </div>
        <h1>विज्ञापन मुक्त न्यूज़ अनुभव</h1>
        <div className={styles.subtitle}>सिर्फ जागरण पर</div>
        
        {/* <p>बिना किसी रुकावट के खबरें पढ़ें - अब कोई विज्ञापन नहीं।</p>
            <p>ज़रूरी बातों पर ध्यान दें - जानकार बनें, बिना किसी डिस्टर्बेंस के।</p> */}
        {/*            
            <div className={styles.ctaButtons}>
                <a href="#" className={`${styles.btn} ${styles.btnPrimary}`}>सिर्फ ₹3 में, 1 दिन के लिए शुरू करें</a>                
            </div>           */}
      </div>
    </section>
  );
}

export default SubscriptionHeaderN;
