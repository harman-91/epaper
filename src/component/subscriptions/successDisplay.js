import styles from "../../styles/BottomLoginModal.module.css";
import { useEffect, useRef } from "react";
import Image from "next/image";

const StatusDisplay = ({
  userDetail,
  onCloseModal,
  onClose,
  status = "success",
}) => {
  const circleRef = useRef(null);
  const tickRef = useRef(null);
  const crossRef = useRef(null);

  useEffect(() => {
    const circle = circleRef.current;
    const tick = tickRef.current;
    const cross = crossRef.current;

    if (circle && (tick || cross)) {
      // Get the lengths
      const circleLength = circle.getTotalLength();
      const tickLength = tick?.getTotalLength();
      const crossLength1 = cross?.children[0]?.getTotalLength();
      const crossLength2 = cross?.children[1]?.getTotalLength();

      // Set initial state - hide all
      circle.style.strokeDasharray = circleLength;
      circle.style.strokeDashoffset = circleLength;

      if (status === "success" && tick) {
        tick.style.strokeDasharray = tickLength;
        tick.style.strokeDashoffset = tickLength;
      } else if (status === "failure" && cross) {
        cross.children[0].style.strokeDasharray = crossLength1;
        cross.children[0].style.strokeDashoffset = crossLength1;
        cross.children[1].style.strokeDasharray = crossLength2;
        cross.children[1].style.strokeDashoffset = crossLength2;
      }

      // Force a reflow
      circle.getBoundingClientRect();
      if (tick) tick.getBoundingClientRect();
      if (cross) {
        cross.children[0].getBoundingClientRect();
        cross.children[1].getBoundingClientRect();
      }

      // Animate circle first
      setTimeout(() => {
        circle.style.transition = "stroke-dashoffset 1s ease-in-out";
        circle.style.strokeDashoffset = "0";
      }, 100);

      // Animate tick or cross after circle completes
      setTimeout(() => {
        if (status === "success" && tick) {
          tick.style.transition = "stroke-dashoffset 0.6s ease-out";
          tick.style.strokeDashoffset = "0";
        } else if (status === "failure" && cross) {
          cross.children[0].style.transition =
            "stroke-dashoffset 0.3s ease-out";
          cross.children[0].style.strokeDashoffset = "0";
          cross.children[1].style.transition =
            "stroke-dashoffset 0.3s ease-out 0.3s";
          cross.children[1].style.strokeDashoffset = "0";
        }
      }, 1200);
    }
  }, [status]);

  return (
    <div className={`${styles.modalContainer} ${styles.show}`}>
      <div className={styles.modalBody}>
        {status != "success" && (
          <button className={styles.closeBtn} onClick={onClose}>
            <Image
              src="/images/close_icon.png"
              width={18}
              height={18}
              alt="Close"
            />
          </button>
        )}
        <div>
          <div className={styles.fullWidthCenterBox}>
            <svg width="90" height="90" viewBox="0 0 90 90">
              <circle
                ref={circleRef}
                cx="45"
                cy="45"
                r="42.75"
                fill="none"
                stroke={status === "success" ? "#68E534" : "#FF4D4D"}
                strokeWidth="4.5"
                strokeLinecap="round"
                transform="rotate(-90 45 45)"
              />
              {status === "success" ? (
                <polyline
                  ref={tickRef}
                  points="19.8,48.15 38.925,63.9 68.4,31.05"
                  fill="none"
                  stroke="#68E534"
                  strokeWidth="5.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <g ref={crossRef}>
                  <line
                    x1="30"
                    y1="30"
                    x2="60"
                    y2="60"
                    fill="none"
                    stroke="#FF4D4D"
                    strokeWidth="5.4"
                    strokeLinecap="round"
                  />
                  <line
                    x1="60"
                    y1="30"
                    x2="30"
                    y2="60"
                    fill="none"
                    stroke="#FF4D4D"
                    strokeWidth="5.4"
                    strokeLinecap="round"
                  />
                </g>
              )}
            </svg>

            <h3 className={styles.thankYouText}>
              {status === "success" ? "धन्यवाद" : "क्षमा करें"}
            </h3>
            <p className={styles.infoText}>
              {status === "success"
                ? `${
                    userDetail?.subscription?.subscription_name_hi || ""
                  } प्लान शुरू हो गया है।`
                : "ट्रांजैक्शन असफल रहा। यदि कोई राशि डेबिट हुई है, तो वह 7 दिनों के भीतर स्वतः वापस हो जाएगी।"}
            </p>
            <button
              className={`${styles.okButton} ${
                status != "success" ? styles.failure : ""
              }`}
              onClick={status === "success" ? onCloseModal : onClose}
            >
              {status === "success"
                ? "खबरें पढ़ना शुरू करें"
                : "दोबारा प्रयास करें"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusDisplay;
