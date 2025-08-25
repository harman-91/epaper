"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  IoCalendarOutline,
  IoLocationOutline,
  IoBookmarkOutline,
  IoShareSocialOutline,
  IoGridOutline,
  IoCloseCircle
} from "react-icons/io5";
import { GoArrowSwitch } from "react-icons/go";
import {
  HiOutlineMagnifyingGlassPlus,
  HiOutlineMagnifyingGlassMinus,
} from "react-icons/hi2";
import CustomDatePicker from "../DatePicker";
import CitySelection from "../EpaperSwiper/Epaper/CitySelection";
import CustomDropdown from "./customDropDown";
import Bookmark from "../account/bookmark";
import axios from "axios";
import { MdOutlineSwipe, MdOutlineSwipeVertical } from "react-icons/md";
import { dateBefore } from "../utility/CommonUtils";

const token = {
  "epaper.jagran.com":
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9eyJpc3MiOiJPbmxpbmUgSldUIEJ1a",
  "epaper.naidunia.com":
    "51cefe562be0353d7aae0e7ae565ad111de2e2b5E3NTMyNTQxNzMsImV4cCI6MTc",
  "epaper.punjabijagran.com":
    "6a208384a26ef3213d970a2d3UiOiJlcGFwZXIucHVuamFiaWphZ3Jhbi5jb20ifQ",
};

export default function FooterNewsPaper({
  children,
  showCitySelection,
  toggleCitySelection,
  setShowCitySelection,
  toggleAllPages,
  currentUrl,
  onDateChange,
  bookmarkData,
  onCityChange,
  cities,
  domainInfo,
  userDetail,
  isZoom,
  toogleZoom,
  changeVerticalScroll,
  isVerticalScroll,
}) {
  const [detail, setDetail] = useState({ bookmark: false });
  const [isThumbnailsVisible, setThumbnailsVisible] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Handle social sharing
  const handleShare = (platform) => {
    if (!currentUrl) {
      console.warn("No URL available to share");
      return;
    }

    let shareUrl = "";
    const encodedUrl = encodeURIComponent(currentUrl);
    const title = encodeURIComponent("Check out this e-paper page");

    if (platform === "facebook") {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    } else if (platform === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${title}`;
    } else if (platform === "mail") {
      shareUrl = `mailto:?subject=${title}&body=Check out this e-paper page: ${encodedUrl}`;
    }

    window.open(shareUrl, "_blank");
  };

  const likeArticle = async (val) => {
    const body = {
      articleid: bookmarkData?.slug,
      userid: val.user_id,
      productname: token[domainInfo.domainId],
    };
    try {
      const response = await axios.post("/api/comment/bookmark-like", body);

      setDetail((prev) => {
        return {
          like: response.data.data.likes,
          bookmark: response.data.data.bookmarks,
        };
      });
    } catch (err) {
      console.error("Error liking the article:", err);
    }
  };

  const likeArticleRef = useRef(false);
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      userDetail &&
      Object.keys(userDetail).length > 0 &&
      likeArticleRef.current === false
    ) {
      likeArticleRef.current = true;
      likeArticle(userDetail);
    }
  }, [userDetail]);

  return (
    <>
      {/* <style jsx>{`
        @media (max-width: 767px) {
          .desktop-only {
            display: none !important;
          }
          .mobile-only {
            display: block !important;
          }
        }
        @media (min-width: 768px) {
          .desktop-only {
            display: block !important;
          }
          .mobile-only {
            display: none !important;
          }
        }
      `}</style> */}
      <footer className="footer z-40">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              {isThumbnailsVisible && (
                <div id="thumbnailContainer" className="thumbnail-container">
                  <button
                    className="close-btn"
                    onClick={() => setThumbnailsVisible(false)}
                  >
                    <IoCloseCircle style={{ width: 24, height: 24 }} />
                  </button>
                  {children}
                </div>
              )}
            </div>
          </div>
          <nav className="footer-nav flex flex-wrap justify-center md:justify-start">
            {/* Date */}
            <div className="footer-nav-item">
              <CustomDatePicker
                onDateChange={onDateChange}
                minDate={dateBefore(
                  userDetail?.subscription?.subscription_archive
                    ?.feature_value_type,
                  userDetail?.subscription?.subscription_archive?.feature_value
                )}
                maxDate={new Date()}
              />
            </div>

            {/* All Pages */}
            <div className="footer-nav-item">
              <div
                id="allPages"
                onClick={() => {
                  setThumbnailsVisible(true);
                  toggleAllPages();
                }}
                className="cursor-pointer"
              >
                <IoGridOutline />
                <div>All Pages</div>
              </div>
            </div>

            {/* Location */}
            <div
              className={`footer-nav-item ${showCitySelection ? "active" : ""}`}
            >
              <div id="locationButton" className="flex flex-col items-center">
                <IoLocationOutline />
                <div>
                  <CustomDropdown options={cities} onSelect={onCityChange} />
                </div>
              </div>
            </div>

            {/* Zoom */}
            {/* <div className="footer-nav-item">
              <a onClick={() => toogleZoom()} className="cursor-pointer">
                {!isZoom ? (
                  <HiOutlineMagnifyingGlassPlus />
                ) : (
                  <HiOutlineMagnifyingGlassMinus />
                )}
                <div>Zoom</div>
              </a>
            </div> */}

            {/* Share - Desktop Only */}
            <div className="footer-nav-item desktop-only">
              <div
                onClick={() => handleShare("facebook")}
                className="cursor-pointer"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <IoShareSocialOutline />
                <div>Share</div>
              </div>
            </div>

            {/* Bookmark - Desktop Only */}
            <div className="footer-nav-item desktop-only">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Bookmark
                  language={"en"}
                  articledata={{
                    webTitle: bookmarkData?.headline || "headline",
                    bigImage: bookmarkData?.imgName,
                    bookmark: detail?.bookmark || false,
                    artid: bookmarkData?.slug,
                  }}
                  domainInfo={domainInfo}
                />
                <div>Bookmark</div>
              </div>
            </div>

            {/* Switch - Desktop Only */}
            <div className="footer-nav-item desktop-only">
              <a
                onClick={changeVerticalScroll}
                className="cursor-pointer"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {isVerticalScroll ? (
                  <MdOutlineSwipeVertical />
                ) : (
                  <MdOutlineSwipe />
                )}
                <div>Switch</div>
              </a>
            </div>

            {/* 3-dot More menu - Mobile Only */}
            <div className="footer-nav-item mobile-only relative">
              <div
                className="cursor-pointer"
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <span className="text-xl">⋮</span>
                <div>More</div>
              </div>
              {isMoreOpen && (
                <div
                  className="absolute bottom-full mb-2 w-40 bg-white shadow-lg rounded-md py-2 border z-10"
                  style={{
                    position: "absolute",
                    bottom: "100%",
                    marginBottom: "0",
                    width: "160px",
                    height: "150px",
                    backgroundColor: "white",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    borderRadius: "6px",
                    paddingTop: "8px",
                    paddingBottom: "8px",
                    border: "1px solid #e5e7eb",
                    zIndex: 10,
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    onClick={() => {
                      handleShare("facebook");
                      setIsMoreOpen(false);
                    }}
                    className="cursor-pointer"
                    style={{
                      padding: "8px 16px",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#f3f4f6")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
                  >
                    <IoShareSocialOutline style={{ marginRight: "8px" }} />
                    <span>Share</span>
                  </div>
                  <div
                    className="cursor-pointer"
                    style={{
                      padding: "8px 16px",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#f3f4f6")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
                  >
                    <Bookmark
                      language={"en"}
                      articledata={{
                        webTitle: bookmarkData?.headline || "headline",
                        bigImage: bookmarkData?.imgName,
                        bookmark: detail?.bookmark || false,
                        artid: bookmarkData?.slug,
                      }}
                      domainInfo={domainInfo}
                    />
                    <span style={{ marginLeft: "4px" }}>Bookmark</span>
                  </div>
                  <div
                    onClick={() => {
                      changeVerticalScroll();
                      setIsMoreOpen(false);
                    }}
                    className="cursor-pointer"
                    style={{
                      padding: "8px 16px",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#f3f4f6")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
                  >
                    {isVerticalScroll ? (
                      <MdOutlineSwipeVertical />
                    ) : (
                      <MdOutlineSwipe />
                    )}
                    <span>Switch</span>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>
        <CitySelection
          showCitySelection={showCitySelection}
          setShowCitySelection={setShowCitySelection}
        />
      </footer>
    </>
  );
}

// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import {
//   IoCalendarOutline,
//   IoLocationOutline,
//   IoBookmarkOutline,
//   IoShareSocialOutline,
//   IoGridOutline,
// } from "react-icons/io5";
// import { BsBookmark } from "react-icons/bs";
// import { GoArrowSwitch } from "react-icons/go";

// import {
//   HiOutlineMagnifyingGlassPlus,
//   HiOutlineMagnifyingGlassMinus,
// } from "react-icons/hi2";

// import CustomDatePicker from "../DatePicker";
// import CitySelection from "../EpaperSwiper/Epaper/CitySelection";
// import CustomDropdown from "./customDropDown";
// import Bookmark from "../account/bookmark";
// import axios from "axios";
// const token = {
//   "epaper.jagran.com":
//     "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9eyJpc3MiOiJPbmxpbmUgSldUIEJ1a",
//   "epaper.naidunia.com":
//     "51cefe562be0353d7aae0e7ae565ad111de2e2b5E3NTMyNTQxNzMsImV4cCI6MTc",
//   "epaper.punjabijagran.com":
//     "6a208384a26ef3213d970a2d3UiOiJlcGFwZXIucHVuamFiaWphZ3Jhbi5jb20ifQ",
// };
// export default function FooterNewsPaper({
//   children,
//   showCitySelection,
//   toggleCitySelection,
//   setShowCitySelection,
//   toggleAllPages,
//   currentUrl,
//   onDateChange,
//   bookmarkData,
//   onCityChange,
//   cities,
//   domainInfo,
//   userDetail,
//   isZoom,
//   toogleZoom,
// }) {
//   const [detail, setDetail] = useState({ bookmark: false });
//   const [isThumbnailsVisible, setThumbnailsVisible] = useState(false);

//   //  handle social sharing
//   const handleShare = (platform) => {
//     if (!currentUrl) {
//       console.warn("No URL available to share");
//       return;
//     }

//     let shareUrl = "";
//     const encodedUrl = encodeURIComponent(currentUrl);
//     const title = encodeURIComponent("Check out this e-paper page");

//     if (platform === "facebook") {
//       shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
//     } else if (platform === "twitter") {
//       shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${title}`;
//     } else if (platform === "mail") {
//       shareUrl = `mailto:?subject=${title}&body=Check out this e-paper page: ${encodedUrl}`;
//     }

//     window.open(shareUrl, "_blank");
//   };
//   const likeArticle = async (val) => {
//     const body = {
//       articleid: bookmarkData?.slug,
//       userid: val.user_id,
//       productname: token[domainInfo.domainId],
//     };
//     try {
//       const response = await axios.post("/api/comment/bookmark-like", body);

//       setDetail((prev) => {
//         return {
//           like: response.data.data.likes,
//           bookmark: response.data.data.bookmarks,
//         };
//       });
//     } catch (err) {
//       console.error("Error liking the article:", err);
//     }
//   };
//   const likeArticleRef = useRef(false);
//   useEffect(() => {
//     console.log("--id--", bookmarkData?.slug);
//     if (
//       typeof window !== "undefined" &&
//       userDetail &&
//       Object.keys(userDetail).length > 0 &&
//       likeArticleRef.current === false
//     ) {
//       likeArticleRef.current = true;
//       likeArticle(userDetail);
//     }
//   }, [userDetail]);
//   return (
//     <footer className="footer">
//       <div className="container">
//         <div className="row">
//           <div className="col-lg-12">
//             {isThumbnailsVisible && (
//               <div id="thumbnailContainer" className="thumbnail-container">
//                 <button
//                   className="close-btn"
//                   onClick={() => setThumbnailsVisible(false)}
//                 >
//                   Close
//                 </button>
//                 {children}
//               </div>
//             )}
//           </div>
//         </div>
//         <nav className="footer-nav">
//           <div className="footer-nav-item">
//             <CustomDatePicker onDateChange={onDateChange} />
//           </div>
//           <div className="footer-nav-item">
//             <div
//               id="allPages"
//               onClick={() => {
//                 setThumbnailsVisible(true);
//                 toggleAllPages();
//               }}
//               style={{ cursor: "pointer" }}
//             >
//               <IoGridOutline />
//               <div>All Pages</div>
//             </div>
//           </div>
//           <div
//             className={`footer-nav-item ${showCitySelection ? "active" : ""}`}
//           >
//             <div id="locationButton " className=" flex flex-col align-middle">
//               <IoLocationOutline />
//               <div className="">
//                 <CustomDropdown options={cities} onSelect={onCityChange} />{" "}
//               </div>
//             </div>
//           </div>
//           <div className="footer-nav-item">
//             <BsBookmark
//               language={"en"}
//               articledata={{
//                 webTitle: bookmarkData?.headline || "headline",
//                 bigImage: bookmarkData?.imgName,
//                 // summary: bookmarkData?.summary,
//                 bookmark: detail?.bookmark || false,
//                 artid: bookmarkData?.slug,
//               }}
//               domainInfo={domainInfo}
//             />
//             <p>Bookmark</p>
//           </div>
//           <div className="footer-nav-item">
//             <a
//               onClick={() => handleShare("facebook")}
//               style={{ cursor: "pointer" }}
//             >
//               <IoShareSocialOutline />
//               <div>Share</div>
//             </a>
//           </div>
//           <div className="footer-nav-item">
//             <a
//               onClick={() => toogleZoom()}
//               style={{ cursor: "pointer" }}
//             >
//               {!isZoom ? (
//                 <HiOutlineMagnifyingGlassPlus />
//               ) : (
//                 <HiOutlineMagnifyingGlassMinus />
//               )}
//               <div>Zoom</div>
//             </a>
//           </div>
//           <div className="footer-nav-item">
//             <a
//               onClick={() => handleShare("facebook")}
//               style={{ cursor: "pointer" }}
//             >
//               <IoShareSocialOutline />
//               <div>Share</div>
//             </a>
//           </div>
//         </nav>
//       </div>
//       <CitySelection
//         showCitySelection={showCitySelection}
//         setShowCitySelection={setShowCitySelection}
//       />
//     </footer>
//   );
// }
