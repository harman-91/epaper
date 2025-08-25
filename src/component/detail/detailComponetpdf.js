"use client";
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import FooterNewsPaper from "@/component/Common/FooterNewspaper";
import EpaperThumbnailSwiper from "@/component/EpaperSwiper/EpaperThumbnailSwiper";
import TimerComponent from "@/component/EpaperSwiper/Epaper/CountdownTimerComponent";
import CitySelection from "@/component/EpaperSwiper/Epaper/CitySelection";
import { formatDateWithMonthAbbr } from "@/utils/dateUtils";
import { useRouter } from "next/navigation";
import { genrateurl } from "../utility/CommonUtils";
import { useSelector } from "react-redux";
import EpaperSubscribe from "../EpaperSwiper/EpaperSubscribe";
import DataLoading from "../Common/DataLoading";
import variable from "../utility/variable";
import Image from "next/image";
import {
  HiChevronLeft,
  HiChevronRight,
  HiMagnifyingGlassPlus,
  HiMagnifyingGlassMinus,
} from "react-icons/hi2";
import { useSwipeable } from "react-swipeable";

// Set up PDF.js worker
import PdfView from "./pdfView";
import { epaperDetail } from "@/services/detailService";

const DetailComponentPDF = ({
  // data = [],
  currentDate,
  eid,
  currentCity,
  pageno,
  slug,
  currentCities = [],
  domainInfo,
}) => {
  const [data, setData] = useState();
  useEffect(async () => {
    try {
      const dat = await epaperDetail({
        type: domainInfo.apiDomainValue,
        date: currentDate,
        ename: currentCity,
        pageno,
      });
      setData(dat);
    } catch (err) {}
  }, []);
  // State management
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCitySelection, setShowCitySelection] = useState(false);
  const [showPages, setShowPages] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [date, setDate] = useState(new Date(currentDate || Date.now()));
  const [currentSlideIndex, setCurrentSlideIndex] = useState(
    Math.max(0, pageno - 1)
  );
  const prevDateRef = useRef(date);
  const prevCityRef = useRef(currentCity);
  const [isZoom, setIsZoom] = useState(false);
  const [showModal, setShowModal] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [starttimer, setStartTimer] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [preloadedNext, setPreloadedNext] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const containerRef = useRef(null);
  const [isVerticalScroll, setIsVerticalScroll] = useState(false);
  const changeVerticalScroll = (value) => {
    setIsVerticalScroll(!isVerticalScroll);
  };
  const router = useRouter();
  const {
    user: userDetail,
    isLoading: userLoading,
    isAuthenticated,
  } = useSelector((state) => state.userData);

  useEffect(() => {
    setCurrentSlideIndex(pageno - 1);
  }, [pageno]);

  // Memoized derived data
  const firstPage = useMemo(() => data?.[0] || {}, [data]);
  const images = useMemo(
    () => data?.map((item) => item.page_pdf) || [],
    [data]
  );
  const imagesList = useMemo(
    () => data?.map((item) => item.page_image) || [],
    [data]
  );
  const cities = useMemo(
    () =>
      currentCities?.flatMap((state) =>
        state.regions?.flatMap((region) =>
          region.cities?.map((city) => ({
            name: city.city_name,
            date: new Date().toLocaleDateString("en-IN"),
            code: city.code,
          }))
        )
      ) || [],
    [currentCities]
  );

  // Map items to DocViewer documents format
  const docs = useMemo(
    () =>
      images.map((item, index) => ({
        uri: item,
        fileName: `Page ${index + 1}`,
      })),
    [images]
  );
  useEffect(() => {
    try {
      const formattedDate = formatDateWithMonthAbbr(date);
      const newUrl = `/epaper/${formattedDate}-${eid}-${currentCity}-edition-${currentCity}-${pageno}.html`;

      if (
        date.getTime() !== prevDateRef.current.getTime() ||
        currentCity !== prevCityRef.current
      ) {
        const resetUrl = `/epaper/${formattedDate}-${eid}-${currentCity}-edition-${currentCity}-1.html`;
        setCurrentUrl(resetUrl);
        window.location.href = resetUrl;
      } else if (currentUrl !== newUrl) {
        setCurrentUrl(newUrl);
        window.location.href = resetUrl;
      }

      prevDateRef.current = date;
      prevCityRef.current = currentCity;
    } catch (error) {
      console.error("Error updating URL:");
    }
  }, [date, eid, currentCity, pageno]);

  useEffect(() => {
    if (!starttimer) return;

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
  }, [timeLeft, starttimer]);

  // Handle user authentication and subscription logic
  useEffect(() => {
    if (userLoading || isAuthenticated == null) return;

    const pageview = parseInt(localStorage.getItem(variable.FIRST_VIEW)) || 60;
    if (userDetail?.is_subscribed) {
      setShowModal(1);
    } else if (!pageview || pageview > 5) {
      setTimeLeft(pageview);
      setShowModal(2);
      setStartTimer(true);
    } else {
      setShowModal(3);
    }
  }, [userDetail, isAuthenticated, userLoading]);

  // useEffect(() => {
  //   if (images.length > 0 && currentSlideIndex >= images.length) {
  //     setCurrentSlideIndex(0);
  //   }
  // }, [images, currentSlideIndex]);

  // Preload the next PDF
  // useEffect(() => {
  //   if (currentSlideIndex < images.length - 1) {
  //     const nextPdfUrl = images[currentSlideIndex + 1];
  //     if (nextPdfUrl) {
  //       setPreloadedNext(nextPdfUrl);
  //     }
  //   } else {
  //     setPreloadedNEXT(null);
  //   }
  // }, [currentSlideIndex, images]);

  // Keyboard event listener for left/right arrow keys

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

  const handleThumbnailClick = useCallback(
    (index) => {
      setCurrentSlideIndex(index);
      const formattedDate = formatDateWithMonthAbbr(currentDate);
      const newUrl = `/epaper/${formattedDate}-${eid}-${currentCity}-edition-${currentCity}-${
        index + 1
      }.html`;
      setCurrentUrl(newUrl);
      router.replace(newUrl, { scroll: false });
    },
    [currentCity, eid, currentDate, router]
  );

  const onCityChange = (city) => {
    try {
      console.log("Selected city:", city);
      const slugParts = slug.split("-");
      const year = slugParts[0];
      const monthAbbr = slugParts[1].toLowerCase();
      const day = slugParts[2];
      const formattedDate = `${year}-${monthAbbr}-${day}`;
      const citySlug = city.name.replace(/\s+/g, "-");
      const cityCode = city.code ?? 1;
      const newUrl = genrateurl({ date: formattedDate, cityCode, citySlug });
      window.location.href = newUrl;
    } catch (error) {
      console.error("Error changing city:", error);
    }
  };

  const toggleZoom = useCallback(() => {
    setIsZoom((prev) => !prev);
  }, []);

  const handleUrlChange = useCallback((newUrl) => {
    setCurrentUrl(newUrl);
  }, []);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => !isVerticalScroll && !isZoom && goToNextSlide(),
    onSwipedRight: () => !isVerticalScroll && !isZoom && goToPreviousSlide(),
    onSwipedUp: () => isVerticalScroll && !isZoom && goToNextSlide(),
    onSwipedDown: () => isVerticalScroll && !isZoom && goToPreviousSlide(),
    delta: 10,
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
    trackMouse: false,
  });

  // Handle next slide
  const goToNextSlide = useCallback(() => {
    if (isTransitioning || currentSlideIndex >= images.length - 1) return;
    setIsTransitioning(true);
    const newIndex = currentSlideIndex + 1;
    setCurrentSlideIndex(newIndex);

    // Update URL
    const formattedDate = formatDateWithMonthAbbr(currentDate);
    const newUrl = `/epaper/${formattedDate}-${eid}-${currentCity}-edition-${currentCity}-${
      newIndex + 1
    }.html`;
    router.replace(newUrl, { scroll: false });
    handleUrlChange(newUrl);
    setIsTransitioning(false);
  }, [
    currentSlideIndex,
    currentDate,
    eid,
    currentCity,
    router,
    handleUrlChange,
  ]);

  // Handle previous slide
  const goToPreviousSlide = useCallback(() => {
    if (isTransitioning || currentSlideIndex <= 0) return;
    setIsTransitioning(true);
    const newIndex = currentSlideIndex - 1;
    setCurrentSlideIndex(newIndex);

    // Update URL
    const formattedDate = formatDateWithMonthAbbr(currentDate);
    const newUrl = `/epaper/${formattedDate}-${eid}-${currentCity}-edition-${currentCity}-${
      newIndex + 1
    }.html`;
    router.replace(newUrl, { scroll: false });
    handleUrlChange(newUrl);
    setIsTransitioning(false);
  }, [
    currentSlideIndex,
    currentDate,
    eid,
    currentCity,
    router,
    handleUrlChange,
  ]);

  // Handle zoom in
  const handleZoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(prev + 1, 3)); // Max zoom 3x
  }, []);

  // Handle zoom out
  const handleZoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(prev - 1, 0.5)); // Min zoom 0.5x
  }, []);

  // Handle document load success
  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages);
  }, []);
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isTransitioning) return;
      if (!isVerticalScroll) {
        if (event.key === "ArrowLeft") {
          goToPreviousSlide();
        } else if (event.key === "ArrowRight") {
          goToNextSlide();
        }
      } else {
        if (event.key === "ArrowUp") {
          goToPreviousSlide();
        } else if (event.key === "ArrowDown") {
          goToNextSlide();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTransitioning, isVerticalScroll]);
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
    <main className="mx-auto">
      {showModal === 2 && <TimerComponent timeLeft={timeLeft} />}

      <div
        className="relative w-full max-w-full overflow-hidden"
        style={isVerticalScroll ? { overflowY: "auto", height: "100vh" } : {}}
        {...swipeHandlers}
      >
        {/* Navigation and Zoom Buttons */}
        <button
          onClick={goToPreviousSlide}
          disabled={currentSlideIndex <= 0 || isTransitioning}
          className="fixed left-5 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2.5 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous slide"
        >
          <HiChevronLeft size={24} />
        </button>

        {/* Next button - middle right */}
        <button
          onClick={goToNextSlide}
          disabled={currentSlideIndex >= images.length - 1 || isTransitioning}
          className="fixed right-5 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2.5 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next slide"
        >
          <HiChevronRight size={24} />
        </button>

        {/* Zoom controls - bottom right */}
        <div className="fixed bottom-[80px] right-[20px] z-10 flex flex-col gap-2">
          <button
            onClick={handleZoomIn}
            disabled={zoomLevel >= 3 || isTransitioning}
            className="bg-black/50 text-white p-1.5 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Zoom in"
          >
            <HiMagnifyingGlassPlus size={24} />
          </button>
          <button
            onClick={handleZoomOut}
            disabled={zoomLevel <= 0.5 || isTransitioning}
            className="bg-black/50 text-white p-1.5 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Zoom out"
          >
            <HiMagnifyingGlassMinus size={24} />
          </button>
        </div>

        {/* Slide Container */}
        <div
          ref={containerRef}
          className="flex items-center justify-center w-full h-full  pb-[100px] sm:pb-[80px]"
          style={isVerticalScroll ? { flexDirection: "column" } : {}}
        >
          <PdfView
            isLoading={isLoading}
            currentSlideIndex={currentSlideIndex}
            docs={docs}
            onDocumentLoadSuccess={onDocumentLoadSuccess}
            zoomLevel={zoomLevel}
          />
        </div>

        {/* Preload Next PDF (Hidden) */}
        {/* {preloadedNext && (
          <div style={{ display: "none" }}>
            <DocViewer
              documents={[{ uri: preloadedNext }]}
              pluginRenderers={DocViewerRenderers}
            />
          </div>
        )} */}

        {/* Pagination Info */}
        <div className="text-center p-2.5 text-base text-gray-800">
          Page {currentSlideIndex + 1} of {images.length}
        </div>
      </div>

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
        toggleZoom={toggleZoom}
        isZoom={isZoom}
        changeVerticalScroll={changeVerticalScroll}
        isVerticalScroll={isVerticalScroll}
      >
        <EpaperThumbnailSwiper
          images={imagesList}
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
