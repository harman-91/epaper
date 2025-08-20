import React, { useState } from 'react';
import styles from '../../styles/FAQSection.module.css';        

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [activeFilter, setActiveFilter] = useState('सभी');

  const faqData = [
    {
      id: 0,
      category: 'Subscription',
      question: 'जागरण डिजिटल सब्सक्रिप्शन क्या है?',
      answer: 'यह एक डिजिटल सब्सक्रिप्शन है, जिसमें यूज़र अपनी सुविधा के अनुसार डेली, मंथली, क्वार्टरली या ईयरली प्लान के लिए भुगतान करते हैं और जुड़े हुए फ़ीचर्स का लाभ लेते हैं।'
    },
    {
      id: 1,
      category: 'Subscription',
      question: 'हम सब्सक्राइब कैसे करें?',
      answer: (
        <div>
          <ul className="faq-list">
            <li>उपलब्ध प्लान की समीक्षा करें और अपने लिए उचित प्लान को चुनें।</li>
            <li>अपनी पसंद के प्लान के साथ दिए गए &apos;Buy Now&apos; बटन पर क्लिक करें।</li>
            <li>अपने ऑर्डर सारांश का समीक्षा करें, पेमेंट मोड का चुनाव कर &apos;Pay Now&apos; पर क्लिक करें।</li>
            <li>पेमेंट गेटवे पेज पर जरूरी विवरण भरकर लेनदेन का कार्य पूर्ण करें।</li>
          </ul>
          <p>पेमेंट हो जाने के पश्चात आपको एसएमएस या ई-मेल द्वारा इनवॉयस के साथ पुष्टीकरण संदेश प्राप्त होगा। अगर आपका लेन-देन असफल हो जाता है तो आप शीघ्र दोबारा प्रयास करें।</p>
        </div>
      )
    },
    {
      id: 2,
      category: 'Subscription',
      question: 'मैं सब्सक्राइब नहीं करना चाहता तो क्या मैं तब भी जागरण साइट नि:शुल्क पढ़ सकता हूं?',
      answer: 'हाँ, लेकिन आपको प्रीमियम लेख, विज्ञापन-मुक्त अनुभव और अन्य विशेष सुविधाएं नहीं मिलेंगी।'
    },
    {
      id: 3,
      category: 'Subscription',
      question: 'क्या जागरण मोबाइल एप पर ये सभी सब्सक्रिप्शन उपलब्ध हैं?',
      answer: 'यह प्लान मोबाइल, वेब और ऐप — सभी प्लेटफॉर्म पर काम करेगा।'
    },
    {
      id: 4,
      category: 'Payment',
      question: 'डिजिटल सब्सक्रिप्शन का भुगतान कैसे होता है?',
      answer: 'डिजिटल सब्सक्राइबर के रूप में आप डेबिट/क्रेडिट कार्ड, नेट बैंकिंग, ई-वॉलेट और यूपीआई द्वारा भुगतान कर सकते हैं।'
    },
    {
      id: 5,
      category: 'Discount',
      question: 'क्या मैं सब्सक्रिप्शन पर रिफंड पा सकता हूं?',
      answer: 'नहीं, आप अपने सब्सक्रिप्शन को रद्द नहीं कर सकते क्योंकि लेन-देन के मामले में हमारी कोई रिफंड पॉलिसी नहीं है।'
    },
    {
      id: 6,
      category: 'Discount',
      question: 'मैंने भुगतान कर दिया परंतु मेरा प्लान शुरू/एक्टिव नहीं हुआ तो?',
      answer: (
        <p>अगर आपका प्लान भुगतान के बाद भी शुरू नहीं हुआ है, तो कृपया अपनी प्रोफ़ाइल सेक्शन से एक सपोर्ट टिकट दर्ज करें या <a href="jagran.com/support " className="faq-link">jagran.com/support </a> पर जाएं।</p>
      )
    },
    {
      id: 7,
      category: 'Subscription',
      question: 'क्या मैं अपने डिजिटल सब्सक्रिप्शन को प्रिंट सब्सक्रिप्शन में बदल सकता हूं?',
      answer: 'डिजिटल सब्सक्रिप्शन से प्रिंट सब्सक्रिप्शन में बदलाव संभव नहीं है। यह केवल डिजिटल सेवा है, और इसके सभी फ़ायदे — जैसे ई-पेपर, विज्ञापन-मुक्त अनुभव आदि — सिर्फ डिजिटल प्लेटफॉर्म पर ही मिलेंगे।'
    },
    {
      id: 8,
      category: 'Subscription',
      question: 'मैं ई-पेपर कहां से एक्सेस कर सकता हूं?',
      answer: (
        <p>जागरण ई-पेपर को <a href="https://epaper.jagran.com/epaper" className="faq-link">https://epaper.jagran.com/epaper/</a> से एक्सेस कर सकते हैं, या ऐप इंस्टॉल करके भी पढ़ सकते हैं।</p>
      )
    },
    {
      id: 9,
      category: 'Subscription',
      question: 'मै जागरण ई-पेपर को कैसे एक्सेस कर सकता हूं?',
      answer: 'आप उसी मोबाइल नंबर या ईमेल से लॉगिन करें जिससे आपने सब्सक्रिप्शन लिया था। किसी भी जागरण प्लेटफ़ॉर्म से लॉगिन करने पर आप ई-पेपर एक्सेस कर सकते हैं।'
    },
    {
      id: 10,
      category: 'Payment',
      question: 'मैं अपने सब्सक्रिप्शन की इनवॉयस देखना चाहता हूं?',
      answer: 'सफल भुगतान के बाद आपके पास ई-मेल के माध्यम से इनवॉयस भेज दिया जाता है। इसे आप अपने प्रोफाइल पेज में भी देख सकते हैं।'
    },
    {
      id: 11,
      category: 'Subscription',
      question: 'मेरे पास और सवाल है, कहां संपर्क करूं?',
      answer: (
        <p>आप हमें <a href="mailto:support.jagran@jagrannewmedia.com" className="faq-link">support.jagran@jagrannewmedia.com</a> पर लिख सकते हैं।</p>
      )
    },
    {
      id: 12,
      category: 'Payment',
      question: 'मेरा प्लान ऑटो-रिन्यू होता है क्या?',
      answer: 'हां, अगर आपने ऑटो-रिन्यू वाला प्लान चुना है तो अगली अवधि की फीस अपने आप कटेगी। आप कभी भी अपनी प्रोफ़ाइल से इसे कैंसल कर सकते हैं।'
    },
    {
      id: 13,
      category: 'Payment',
      question: 'मैं ऑटो-रिन्यू कैसे बंद कर सकता/सकती हूं?',
      answer: 'अपनी प्रोफ़ाइल या अकाउंट सेटिंग में जाकर “सब्सक्रिप्शन” सेक्शन में जाएं और “ऑटो-रिन्यू बंद करें” विकल्प चुनें।'
    },
    {
      id: 14,
      category: 'Discount',
      question: 'फ्री ट्रायल कैसे काम करता है?',
      answer: 'फ्री ट्रायल शुरू होते ही आपको सभी डिजिटल फ़ायदे मिलते हैं। ट्रायल खत्म होते ही चुने गए प्लान के अनुसार शुल्क लगेगा, जब तक आप इसे ट्रायल अवधि के भीतर कैंसल न करें।'
    },
    {
      id: 15,
      category: 'Discount',
      question: 'क्या फ्री ट्रायल के बाद पैसा अपने आप कटेगा?',
      answer: 'हां, फ्री ट्रायल खत्म होने पर आपका सब्सक्रिप्शन ऑटोमेटिकली रिन्यू हो जाएगा और शुल्क लगाया जाएगा, जब तक आप इसे अपनी प्रोफ़ाइल से रद्द नहीं करते।'
    },
    {
      id: 16,
      category: 'Discount',
      question: 'फ्री ट्रायल को कैसे रद्द करूं?',
      answer: 'आप अपनी प्रोफ़ाइल में जाकर “सब्सक्रिप्शन” सेक्शन से ट्रायल को कभी भी रद्द कर सकते हैं। ट्रायल पीरियड खत्म होने से पहले रद्द करने पर कोई चार्ज नहीं लगेगा।'
    },
    {
      id: 17,
      category: 'Discount',
      question: 'कूपन कोड कहां डालें?',
      answer: 'कूपन कोड आप पेमेंट पेज पर "कूपन कोड लिखें" या "Apply Coupon" वाले बॉक्स में डाल सकते हैं।'
    },
    {
      id: 18,
      category: 'Discount',
      question: 'मेरा कूपन कोड काम नहीं कर रहा, क्या करूं?',
      answer: (
        <p>कृपया सुनिश्चित करें कि आपने कोड सही लिखा है और उसकी वैधता समाप्त नहीं हुई है। फिर भी दिक्कत हो तो <a href="https://www.jagran.com/support" className="faq-link"> jagran.com/support</a> पर संपर्क करें।</p>
      )
    },
    {
      id: 19,
      category: 'Discount',
      question: 'क्या एक से ज़्यादा कूपन कोड इस्तेमाल कर सकते हैं?',
      answer: 'नहीं, एक बार में केवल एक ही कूपन कोड लागू किया जा सकता है।'
    },
    {
      id: 20,
      category: 'Discount',
      question: 'कूपन कोड से मुझे क्या फायदा मिलेगा?',
      answer: 'कूपन कोड से आपको डिस्काउंट, फ्री ट्रायल या कुछ अतिरिक्त फ़ीचर्स मिल सकते हैं — ये कोड पर निर्भर करता है।'
    },
    {
      id: 21,
      category: 'Discount',
      question: 'मुझे कूपन कोड कहां मिलेगा?',
      answer: 'कूपन कोड आपको प्रमोशनल ऑफर्स, ईमेल, ऐप नोटिफिकेशन या विशेष अभियानों के दौरान मिल सकते हैं।'
    }     
  ];

  // Category mapping: Hindi display name -> English category values
  const categoryMapping = {
    'सभी': 'All',
    'सब्सक्रिप्शन & फ़ायदे': ['Subscription'],
    'पेमेंट & बिलिंग': ['Payment'],
    'ऑफ़र & कूपन': ['Discount']
  };

  const categories = ['सभी', 'सब्सक्रिप्शन & फ़ायदे', 'पेमेंट & बिलिंग', 'ऑफ़र & कूपन'];

  const filteredFAQs = activeFilter === 'सभी' 
    ? faqData 
    : faqData.filter(faq => {
        const mappedCategories = categoryMapping[activeFilter];
        return Array.isArray(mappedCategories) 
          ? mappedCategories.includes(faq.category)
          : faq.category === mappedCategories;
      });

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.faqSection}>
      <h2 className={styles.faqTitle}>अक्सर पूछे जाने वाले सवाल</h2>
      
      <div className={styles.faqFilters}>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`${styles.filterBtn} ${activeFilter === category ? styles.active : ''}`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className={styles.faqContainer}>
        {filteredFAQs.map((faq, index) => (
          <div key={faq.id} className={styles.faqItem}>
            <button
              onClick={() => toggleFAQ(index)}
              className={styles.faqQuestion}
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${faq.id}`}
            >
              <h4>{faq.question}</h4>
              <span className="faq-toggle-icon">
                {openIndex === index ? '-' : '+'}
              </span>
            </button>
            
            <div
              id={`faq-answer-${faq.id}`}
              className={`${styles.faqAnswer} ${openIndex === index ? styles.open : ''}`}
            >
              {typeof faq.answer === 'string' ? (
                <p>{faq.answer}</p>
              ) : (
                faq.answer
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredFAQs.length === 0 && (
        <div className="no-results">
          No FAQs found for the selected category.
        </div>
      )}
    </section>
  );
};

export default FAQSection;