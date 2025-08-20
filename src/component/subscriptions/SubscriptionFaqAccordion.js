import React, { useState } from "react";
import styles from "../../styles/SubscriptionLatest.module.css";
import Image from "next/image";

const faqData = [
  {
    question: '1-दिन का प्लान कैसे काम करता है?',
    answer: '₹3 में 24 घंटे के लिए आपको जगरण पर पूरी तरह विज्ञापन-मुक्त अनुभव मिलेगा। पेमेंट के तुरंत बाद प्लान एक्टिव हो जाता है।',
  },
  {
    question: 'कौन-कौन से पेमेंट विकल्प उपलब्ध हैं?',
    answer: 'UPI, डेबिट/क्रेडिट कार्ड, नेट बैंकिंग – सभी मुख्य पेमेंट विकल्प स्वीकार किए जाते हैं।',
  },
  {
    question: 'क्या मंथली प्लान ज़्यादा फायदेमंद है?',
    answer: 'हाँ, ₹59 प्रति माह का प्लान सिर्फ ₹1.96/दिन पड़ता है – डेली प्लान की तुलना में काफी सस्ता।',
  },
  {
    question: 'क्या मैं इसे कई डिवाइस पर चला सकता हूँ?',
    answer: 'बिलकुल! एक बार लॉगिन करने के बाद मोबाइल, टैबलेट और डेस्कटॉप – हर जगह काम करता है।',
  },
  {
    question: 'क्या पेज वाकई में तेज़ लोड होते हैं?',
    answer: 'हाँ, विज्ञापनों के बिना न्यूज़ पेज 2-3 गुना तेज़ खुलते हैं – स्लो इंटरनेट पर भी फर्क महसूस होगा।',
  },
  // {
  //   question: 'क्या मैं मंथली प्लान कभी भी कैंसिल कर सकता हूँ?',
  //   answer: 'हाँ, आप किसी भी समय मंथली सब्सक्रिप्शन कैंसिल कर सकते हैं। मौजूदा बिलिंग पीरियड तक एक्सेस रहेगा।',
  // },
];


function SubscriptionFaqAccordionN() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleIndex = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
 <section className={styles.faq}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>अक्सर पूछे जाने वाले सवाल</h2>
        <div className={styles.faqList}>
          {faqData.map((item, index) => (
            <div key={index} className={styles.faqItem}>
              <div className={styles.faqQuestion} onClick={() => toggleIndex(index)}>
                <span>{item.question} </span>
                 <span className={`${styles.arrow} ${activeIndex === index ? styles.rotated : ''}`}></span>

              </div>
              <div
                className={styles.faqAnswer}
                style={{
                  display: activeIndex === index ? 'block' : 'none',
                }}
              >
                {item.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section> 
  );
}

export default SubscriptionFaqAccordionN;
