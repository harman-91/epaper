import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import Image from "next/image";
import Styles from "../../styles/Swiper.module.css";

const EpaperThumbnailSwiper = ({
  images,
  setThumbsSwiper,
  isLoading,
  showPages,
  setShowPages,
  onThumbnailClick,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust breakpoint as needed
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isLoading || !images || images.length === 0) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className={Styles.swiperWrapper}>
      {isMobile ? (
        // Grid layout for mobile - positioned above bottom menu
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="bg-white shadow-lg mx-2 mb-16" style={{ 
            borderTopLeftRadius: '12px', 
            borderTopRightRadius: '12px',
            borderBottomLeftRadius: '0',
            borderBottomRightRadius: '0'
          }}>
            <div className="flex justify-between items-center border-b border-gray-200 px-4 py-3">
              <h2 className="text-lg font-semibold">Pages</h2>
              <button
                className="text-gray-500 hover:text-gray-700 text-xl"
                onClick={() => setShowPages(false)}
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 p-3 overflow-y-auto max-h-[60vh]">
              {images.map((src, index) => (
                <div
                  key={index}
                  className="cursor-pointer aspect-[3/4] overflow-hidden rounded-md"
                  onClick={() => {
                    console.log(`Thumbnail ${index} clicked`);
                    setShowPages(true);
                    onThumbnailClick(index);
                  }}
                >
                  <Image
                    src={src}
                    alt={`Thumbnail ${index}`}
                    width={100}
                    height={150}
                    style={{ width: "100%", height: "auto" }}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Swiper layout for web
        <>
          <div className="swiper-button-prev" />
          <div className="swiper-button-next" />
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={10}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Thumbs, Navigation]}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            className={Styles.thumbSwiper}
          >
            {images.map((src, index) => (
              <SwiperSlide
                key={index}
                className={Styles.thumbnailSlide}
                onClick={() => {
                  setShowPages(true);
                  onThumbnailClick(index);
                }}
              >
                {isLoading ? (
                  <div className={Styles.loadingThumbnail} />
                ) : (
                  <Image
                    src={src}
                    alt={`Thumbnail ${index}`}
                    width={100}
                    height={55}
                    style={{ width: "100%", height: "auto" }}
                    className={Styles.thumbnailImage}
                  />
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </div>
  );
};

export default EpaperThumbnailSwiper;


// import React from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Thumbs, FreeMode } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/thumbs";
// import "swiper/css/free-mode";
// import Image from "next/image";
// import Styles from '../../styles/Swiper.module.css';

// const EpaperThumbnailSwiper = ({ images, setThumbsSwiper, isLoading, showPages, setShowPages, onThumbnailClick }) => {
//   return (
//     <div className={Styles.swiperWrapper}>
      
//       <div className="swiper-button-prev" />
//       <div className="swiper-button-next" />
//     <Swiper
//       onSwiper={setThumbsSwiper}
//       spaceBetween={10}
//       slidesPerView={10}
//       freeMode={true}
//       watchSlidesProgress={true}
//       modules={[FreeMode, Thumbs,Navigation]}
//        navigation={{
//           nextEl: ".swiper-button-next",
//           prevEl: ".swiper-button-prev"
//         }}
//       className={Styles.thumbSwiper}
//     >
//       {images.map((src, index) => (
//         <SwiperSlide
//           key={index}
//           className={Styles.thumbnailSlide}
//           onClick={() => {
//             console.log(`Thumbnail ${index} clicked`);
//             setShowPages(true);
//             onThumbnailClick(index);
//           }}
//         >
//           {isLoading ? (
//             <div className={Styles.loadingThumbnail} />
//           ) : (
//             <Image
//               src={src}
//               alt={`Thumbnail ${index}`}
//               width={100}
//               height={55}
//               style={{ width: "100%", height: "auto" }}
//               className={Styles.thumbnailImage}
//             />
//           )}
//         </SwiperSlide>
//       ))}
//     </Swiper>
//     </div>
//   );
// };

// export default EpaperThumbnailSwiper;