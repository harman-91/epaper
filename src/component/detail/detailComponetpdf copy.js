"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import FooterNewsPaper from "@/component/Common/FooterNewspaper";
import EpaperLarge from "@/component/EpaperSwiper/EpaperLargeSwiper";
import EpaperThumbnailSwiper from "@/component/EpaperSwiper/EpaperThumbnailSwiper";
import TimerComponent from "@/component/EpaperSwiper/Epaper/CountdownTimerComponent";
import CitySelection from "@/component/EpaperSwiper/Epaper/CitySelection";
import { formatDateWithMonthAbbr } from "@/utils/dateUtils";
import { useRouter } from "next/navigation";
import { genrateurl } from "../utility/CommonUtils";
import { useSelector } from "react-redux";
import EpaperZoom from "../EpaperSwiper/EpaperZoom";
import EpaperSubscribe from "../EpaperSwiper/EpaperSubscribe";
import DataLoading from "../Common/DataLoading";
import variable from "../utility/variable";
import Image from "next/image";
import dynamic from "next/dynamic";
const PdfView = dynamic(() => import("./pdfView"), {
    ssr: false
});
// Define prop types for type checking


const DetailComponentPDF = ({
  data = [],
  currentDate,
  eid,
  currentCity,
  pageno,
  slug,
  currentCities = [],
  domainInfo,
}) => {
  // State management
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [largeSwiper, setLargeSwiper] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCitySelection, setShowCitySelection] = useState(false);
  const [showPages, setShowPages] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [date, setDate] = useState(new Date(currentDate || Date.now()));
  const [currentSlideIndex, setCurrentSlideIndex] = useState(Math.max(0, pageno - 1));
  const [isZoom, setIsZoom] = useState(false);
  const [showModal, setShowModal] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [starttimer, setStartTimer] = useState(false);

  const router = useRouter();
  const { user: userDetail, isLoading: userLoading, isAuthenticated } = useSelector(
    (state) => state.userData
  );

  // Memoized derived data
  const firstPage = useMemo(() => data?.[0] || {}, [data]);
  const images = useMemo(() => data?.map((item) => item.page_image) || [], [data]);
  const cities = useMemo(() => 
    currentCities?.flatMap((state) =>
      state.regions?.flatMap((region) =>
        region.cities?.map((city) => ({
          name: city.city_name,
          date: new Date().toLocaleDateString("en-IN"),
          code: city.code,
        }))
      )
    ) || [], [currentCities]);

  // Handle countdown timer
  useEffect(() => {
    if(starttimer==false) return

    if (timeLeft <= 0) {
      setStartTimer(false);
      setShowModal(3);
      return;
    }

    const countdown = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          clearInterval(countdown);
          return 0;
        }
        localStorage.setItem(variable.FIRST_VIEW, newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [timeLeft]);
  useEffect(() => {
    if (userLoading || isAuthenticated == null) return;

    const pageview = parseInt(localStorage.getItem(variable.FIRST_VIEW)) || 60;
      setShowModal(1);
    // if (userDetail?.is_subscribed) {
    //   setShowModal(1);
    // } else if (!pageview || pageview > 5) {
    //   setTimeLeft(pageview);
    //   setShowModal(2);
    //   setStartTimer(true);
    // } else {
    //   setShowModal(3);
    // }
  }, [userLoading, userDetail, isAuthenticated]);

  // Handle URL updates
//   useEffect(() => {
//     try {
//       const formattedDate = formatDateWithMonthAbbr(date);
//       const newUrl = `/epaper/${formattedDate}-${eid}-${currentCity}-edition-${currentCity}-${pageno}.html`;
//       setCurrentUrl(newUrl);
//       router.replace(newUrl, { scroll: false });
//     } catch (error) {
//       console.error("Error updating URL:", error);
//     }
//   }, [date, eid, currentCity, pageno, router]);

  // Handlers
  const handleDateChange = useCallback((newDate) => {
    setDate(newDate);
  }, []);

  const toggleCitySelection = useCallback(() => {
    setShowCitySelection((prev) => !prev);
  }, []);

  const toggleAllPages = useCallback(() => {
    setShowPages((prev) => !prev);
  }, []);

  const handleThumbnailClick = useCallback((index) => {
    if (largeSwiper) {
      largeSwiper.slideTo(index, 300);
    }
  }, [largeSwiper]);


  const onCityChange = useCallback((city) => {
    try {
      const slugParts = slug.split("-");
      const year = slugParts[0];
      const monthAbbr = slugParts[1].toLowerCase();
      const day = slugParts[2];
      const formattedDate = `${year}-${monthAbbr}-${day}`;
      const citySlug = city.name.replace(/\s+/g, "-");
      const cityCode = city.code ?? 1;
      const newUrl = genrateurl({ date: formattedDate, cityCode, citySlug });
      router.replace(newUrl, { scroll: false });
    } catch (error) {
      console.error("Error changing city:", error);
    }
  }, [slug, router]);

  const toggleZoom = useCallback(() => {
    setIsZoom((prev) => !prev);
  }, []);
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
 //const pdfUrl = 'https://www.antennahouse.com/hubfs/xsl-fo-sample/pdf/basic-link-1.pdf';
 const  pdfUrl = 'https://epaperapi.jagran.com/naiduniaEpaper/20082025/indore/19uja-pg5-0234416433.pdf';

  const goToPreviousPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };
  // Loading state
  if (userLoading || isAuthenticated == null) {
    return <DataLoading />;
  }

  // Subscription modal
  if (showModal === 3) {
    return (
      <main className="container">
        <div className="flex items-center justify-center min-h-screen">
          <div className="relative max-w-full max-h-full">
            {firstPage?.page_image ? (
              <Image
                src={firstPage.page_image}
                alt="First page preview"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "100%", height: "auto" }}
                priority
              />
            ) : (
              <div>No preview available</div>
            )}
            <EpaperSubscribe />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto">
      {showModal === 2 && <TimerComponent timeLeft={timeLeft} />}
      
      {isZoom ? (
        <EpaperZoom
          isZoom={isZoom}
          toggleZoom={toggleZoom}
          image={data[currentSlideIndex]?.page_largeimage}
        />
      ) : (
      <PdfView
        numPages={numPages}
        pageNumber={pageNumber}
        pdfUrl={pdfUrl}
        onDocumentLoadSuccess={onDocumentLoadSuccess}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
      />
      )}
      
      <CitySelection
        showCitySelection={showCitySelection}
        setShowCitySelection={setShowCitySelection}
      />
      
      <FooterNewsPaper
        showCitySelection={showCitySelection}
        onDateChange={handleDateChange}
        toggleCitySelection={toggleCitySelection}
        setShowCitySelection={setShowCitySelection}
        toggleAllPages={toggleAllPages}
        currentUrl={currentUrl}
        bookmarkData={{ slug, imgName: images?.[currentSlideIndex] }}
        onCityChange={onCityChange}
        cities={cities}
        domainInfo={domainInfo}
        userDetail={userDetail}
        toogleZoom={toggleZoom}
        isZoom={isZoom}
      >
        <EpaperThumbnailSwiper
          images={images}
          thumbsSwiper={thumbsSwiper}
          setThumbsSwiper={setThumbsSwiper}
          isLoading={isLoading}
          showPages={showPages}
          setShowPages={setShowPages}
          onThumbnailClick={handleThumbnailClick}
        />
      </FooterNewsPaper>
    </main>
  );
};


export default DetailComponentPDF;