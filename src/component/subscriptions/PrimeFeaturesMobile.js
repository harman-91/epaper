import { useState } from "react";
import styles from "../../styles/Subscription.module.css";
import Image from "next/image";
import { SkeletonTheme } from "../skeleton/SkeletonTheme";
import { Skeleton } from "../skeleton/Skeleton";
function FeatureModal({
  isOpen,
  onClose,
  features,
  currentIndex,
  onSlideChange,
}) {
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  if (!isOpen) return null;

  const currentFeature = features[currentIndex];

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : features.length - 1;
    onSlideChange(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentIndex < features.length - 1 ? currentIndex + 1 : 0;
    onSlideChange(newIndex);
  };

  // Touch handlers for swipe functionality
  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;

    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && features.length > 1) {
      handleNext();
    }
    if (isRightSwipe && features.length > 1) {
      handlePrevious();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        {/* Feature Content */}
        <div
          className={styles.modalFeature}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className={styles.modalImageWrap}>
            <Image
              src={currentFeature.web_image}
              alt={`Feature ${currentIndex + 1}`}
              width={190}
              height={80}
            />
          </div>
          <div className={styles.modalFeatureText}>
            <h3>{currentFeature.feature_text_hi}</h3>
            <p>{currentFeature.description_hi}</p>
          </div>
        </div>

        <div className={styles.dotIndicators}>
          {features.map((_, idx) => (
            <button
              key={idx}
              className={`${styles.dot} ${
                idx === currentIndex ? styles.activeDot : ""
              }`}
              onClick={() => onSlideChange(idx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Updated Main Component
export default function PrimeFeaturesMobile({
  selectedPlan,
  plans,
  activeTab,
  handlePlanSelection,
  loadingPlans,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

  const selectedPlans = handlePlanSelection?.plan;

  const handleFeatureClick = (index) => {
    setCurrentFeatureIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSlideChange = (newIndex) => {
    setCurrentFeatureIndex(newIndex);
  };

  return (
    <>
      <div className={styles.primeFeaturesM}>
        {loadingPlans ? (
          <></>
        ) : (
          <>
            {plans?.[activeTab]?.length > 0 && (
              <div className={styles.planTabMobile}>
                {plans?.[activeTab]?.map((plan) => {
                  return (
                    <span
                      onClick={() => handlePlanSelection(plan)}
                      key={plan.id}
                      className={
                        selectedPlan && selectedPlan.id === plan.id
                          ? styles.active
                          : ""
                      }
                    >
                      {plan.subscription_name_hi || "Subscription Plan"}
                    </span>
                  );
                })}
              </div>
            )}
          </>
        )}  
        <h2>{selectedPlans?.subscription_name_hi || "Subscription Plan"} मेंबरशिप में मिलेंगे ये स्पेशल बेनीफिट</h2>
        {loadingPlans ? (
          <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
            {[1, 2, 3].map((el) => (
              <div key={el} className={styles.planTabMobile}>
                <Skeleton
                  width={100}
                  height={100}
                  style={{ marginBottom: "5px" }}
                />
                <div>
                  <Skeleton
                    width={200}
                    height={15}
                    style={{ marginBottom: "5px", marginTop: "20px" }}
                  />
                  <Skeleton
                    width={150}
                    height={15}
                    style={{ marginBottom: "5px" }}
                  />
                  <Skeleton
                    width={150}
                    height={15}
                    style={{ marginBottom: "5px" }}
                  />
                </div>
              </div>
            ))}
          </SkeletonTheme>
        ) : (
          <>
            {selectedPlan?.features?.map((feat, idx) => (
              <div
                className={styles.featureCardM}
                key={idx}
                onClick={() => handleFeatureClick(idx)}
                style={{ cursor: "pointer" }}
              >
                <div className={styles.imageWrapM}>
                  <Image
                    src={feat.web_image}
                    alt={`Feature ${idx + 1}`}
                    width={90}
                    height={60}
                  />
                </div>
                <div className={styles.featureTextM}>
                  <h3>{feat.feature_text_hi}</h3>
                  <p>{feat.description_hi}</p>
                </div>
                <div className={styles.arrowM}>&#8594;</div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Modal */}
    {selectedPlan&&  <FeatureModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        features={selectedPlan?.features}
        currentIndex={currentFeatureIndex}
        onSlideChange={handleSlideChange}
      />}
    </>
  );
}
