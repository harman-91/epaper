import { useEffect } from 'react';
import styles from '@/styles/CancelSubscriptionModal.module.scss';

export default function ThankYouModal({ isOpen, onClose,userDetail }) {
  useEffect(() => {
    if (isOpen!=1) return;

    const createSparkle = () => {
      const container = document.querySelector(`.${styles.sparkles}`);
      const sparkle = document.createElement('div');
      sparkle.className = styles.sparkle;
      sparkle.style.top = Math.random() * 100 + '%';
      sparkle.style.left = Math.random() * 100 + '%';
      sparkle.style.animationDelay = Math.random() * 3 + 's';
      container.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 3000);
    };

    const interval = setInterval(createSparkle, 1500);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleClick = (e) => {
    e.preventDefault();
    const btn = e.currentTarget;
    const ripple = document.createElement('div');
    ripple.className = styles.ripple;
    ripple.style.left = `${e.nativeEvent.offsetX - 10}px`;
    ripple.style.top = `${e.nativeEvent.offsetY - 10}px`;
    btn.style.position = 'relative';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  if (isOpen!=1) return null;
  return (
    <div className={styles.overlayThanksYou} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <div className={styles.sparkles}>
          <div className={styles.sparkle} style={{ top: '20%', left: '15%', animationDelay: '0s' }}></div>
          <div className={styles.sparkle} style={{ top: '40%', left: '80%', animationDelay: '1s' }}></div>
          <div className={styles.sparkle} style={{ top: '70%', left: '20%', animationDelay: '2s' }}></div>
          <div className={styles.sparkle} style={{ top: '15%', left: '70%', animationDelay: '1.5s' }}></div>
        </div>

        <div className={styles.heartIcon}>❤️</div>
        <h1 className={styles.title}>धन्यवाद!</h1>
        <div className={styles.subtitle}>आप हमारे खास, मूल्यवान सब्सक्राइबर हैं।
</div>

        <p className={styles.message}>
आपका लगातार साथ हमारे लिए बहुत मायने रखता है!
एक एक्टिव सब्सक्राइबर के रूप में, आप उस खास कम्युनिटी का हिस्सा हैं जिसने हमें यहाँ तक पहुँचाया है।
हम आपके लिए बेहतरीन अनुभव और सुविधाएँ देने के लिए पूरी तरह समर्पित हैं।        </p>

        <div className={styles.ctaSection}>
          <a href="#" className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleClick}>
            Explore Premium Features
          </a>
          <a href="/subscription-history" className={`${styles.btn} ${styles.btnSecondary}`} onClick={handleClick}>
            Manage Account
          </a>
        </div>

        <div className={styles.socialProof}>
          {/* Being a subscriber has completely transformed my experience. */}
          <strong> {userDetail.first_name||''}, {userDetail.member_since}</strong>
        </div>
      </div>
    </div>
  );
}
