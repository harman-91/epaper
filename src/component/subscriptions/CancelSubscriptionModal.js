import React from "react";
import styles from "../../styles/CancelSubscriptionModal.module.scss";
import LoadingButton from "../global/LoadingButton";

const reasons = [
  "Too expensive",
  "Poor customer service",
  "I'm not using it enough",
  "I found a better alternative",
  "Missing key features I need",
  "I just need a break",
  "Technical issues",
  "Other"
];

function CancelSubscriptionModal({ onClose, cancelSubscription,loading,setReason,error }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose}>
          ×
        </button>
        <h2>Cancel Your Subscription?</h2>
        <p>
          You&apos;re about to cancel an active subscription. You&apos;ll keep
          full access until June 30,2025, after which your plan will not renew.
        </p>

        <div className={styles.reasons}>
          {reasons.map((reason, idx) => (
            <label key={idx} className={styles.radio}>
              <input
                type="radio"
                name="cancelReason"
                value={reason}
                onClick={(e) => setReason(e.target.value)}
              />
              {reason}
            </label>
          ))}
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onClose} type="button">
            Keep My Subscription
          </button>
          <LoadingButton
            loadingClassName={styles.keep}
            onClick={cancelSubscription}
            loading={loading}
            type="button"
            className={styles.keep}
            dotColor="#ffff"
            size={"8px"}
          >
            Cancel Subscription
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}

export default CancelSubscriptionModal;
