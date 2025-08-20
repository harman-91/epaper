import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { Keyboard, Pagination, Navigation, EffectFade } from "swiper/modules";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Styles from "../../styles/Swiper.module.css";
import { formatDateWithMonthAbbr } from "@/utils/dateUtils";

// Get boxtext by boxid
const getStoryBoxTextFromJson = (jsonData, boxid) => {

  if (!jsonData || !jsonData.story || !boxid) return null;

  try {
    const story = jsonData.story.find((item) => item.boxid === boxid);
    return story?.boxtext || null;
  } catch (error) {
    console.error("Error accessing boxtext from JSON:", error);
    return null;
  }
};

// Modal component with header, view toggle, social sharing, and filtered sidebar
const StoryModal = ({
  isOpen,
  onClose,
  storyImagePath,
  selectedArea,
  stories,
  onSelectStory,
  jsonData,
}) => {
  const [viewMode, setViewMode] = useState("image"); // Default to image view

  if (!isOpen) return null;

  const boxtext = selectedArea?.id
    ? getStoryBoxTextFromJson(jsonData, selectedArea.id)
    : null;

  // Function to handle social sharing
  const handleShare = (platform) => {
    let shareUrl = "";
    const imageUrl = encodeURIComponent(storyImagePath || "");
    const title = encodeURIComponent(
      stories.find((story) => story.boxid === selectedArea?.id)?.head || "Story"
    );

    if (platform === "facebook") {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${imageUrl}`;
    } else if (platform === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?url=${imageUrl}&text=${title}`;
    } else if (platform === "mail") {
      shareUrl = `mailto:?subject=${title}&body=Check out this story: ${imageUrl}`;
    }

    window.open(shareUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white shadow-2xl p-4 w-full h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 px-4">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("image")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                viewMode === "image"
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-800"
              } hover:bg-red-700 hover:text-white transition-colors duration-200`}
            >
              Image View
            </button>
            <button
              onClick={() => setViewMode("text")}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                viewMode === "text"
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-800"
              } hover:bg-red-700 hover:text-white transition-colors duration-200`}
            >
              Text View
            </button>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleShare("facebook")}
              title="Share on Facebook"
            >
              <svg
                className="w-6 h-6 text-blue-600 hover:text-blue-800"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.987h-2.54V12h2.54V9.845c0-2.507 1.493-3.89 3.778-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.772-1.63 1.562V12h2.773l-.443 2.893h-2.33v6.987C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </button>
            <button
              onClick={() => handleShare("twitter")}
              title="Share on Twitter"
            >
              <svg
                className="w-6 h-6 text-blue-400 hover:text-blue-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
              </svg>
            </button>
            <button onClick={() => handleShare("mail")} title="Share via Email">
              <svg
                className="w-6 h-6 text-gray-600 hover:text-gray-800"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </button>
          </div>
        </div>
        {/* Main Content and Sidebar */}
        <div className="flex flex-grow overflow-hidden">
          {/* Main Content */}
          <div className="w-3/4 flex flex-col pl-6">
            <div className="flex-grow overflow-y-auto">
              {viewMode === "image" ? (
                storyImagePath ? (
                  <img
                    src={storyImagePath}
                    alt="Selected Story Image"
                    className="w-full h-auto object-contain rounded-lg"
                  />
                ) : (
                  <p className="text-red-600 text-xl font-semibold text-center py-8">
                    No story image found for this area.
                  </p>
                )
              ) : (
                <div className="text-gray-800 text-base leading-relaxed p-4">
                  {boxtext ? (
                    <div dangerouslySetInnerHTML={{ __html: boxtext }} />
                  ) : (
                    <p className="text-red-600 text-xl font-semibold text-center py-8">
                      No text available for this story.
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="flex justify-end mt-6 gap-4 px-4">
              {selectedArea?.href !== "#" && (
                <a
                  href={selectedArea.href}
                  target={selectedArea.target}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Open Link
                </a>
              )}
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
          {/* Sidebar */}
          <div className="w-1/4 max-w-[300px] bg-white p-4 rounded-r-2xl overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              More From Front Page
            </h3>
            {stories && stories.length > 0 ? (
              stories
                .filter((story) => story.head && story.head.trim() !== "")
                .map((story, index) => (
                  <div
                    key={story.boxid}
                    className="mb-3 cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-2"
                    onClick={() =>
                      onSelectStory(story.story_image_path, {
                        ...selectedArea,
                        id: story.boxid,
                      })
                    }
                  >
                    <img
                      src={
                        story.story_image_path ||
                        (Array.isArray(story.imagepath)
                          ? story.imagepath[0]
                          : story.imagepath)
                      }
                      alt={`Story ${story.boxid}`}
                      className="w-16 h-16 object-cover rounded-md border border-gray-200"
                    />
                    <p className="text-sm text-gray-700 font-medium">
                      {story.head}
                    </p>
                  </div>
                ))
            ) : (
              <p className="text-gray-500 text-sm">No stories available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Function to parse map array and extract area attributes
const parseMapAreasFromMapArray = (mapArray) => {
  if (!mapArray || !Array.isArray(mapArray)) return [];

  let allAreas = [];

  mapArray.forEach((mapString) => {
    try {
      const htmlParser = new DOMParser();
      const htmlDoc = htmlParser.parseFromString(mapString, "text/html");
      const areas = htmlDoc.getElementsByTagName("area");

      const parsedAreas = Array.from(areas)
        .map((area) => {
          const coords =
            area
              .getAttribute("coords")
              ?.split(",")
              .map((coord) => parseFloat(coord.trim()))
              .filter((coord) => !isNaN(coord)) || [];
          if (coords.length < 4 && area.getAttribute("shape") === "rect") {
            return null;
          }
          return {
            shape: area.getAttribute("shape") || "rect",
            coords,
            href: area.getAttribute("href") || "#",
            alt:
              area.getAttribute("alt") ||
              `Clickable area ${area.getAttribute("id") || ""}`,
            target: area.getAttribute("target") || "_blank",
            id: area.getAttribute("id") || "",
          };
        })
        .filter((area) => area !== null);

      allAreas = [...allAreas, ...parsedAreas];
    } catch (error) {
      console.error("Error parsing map string:", error);
    }
  });

  return allAreas;
};

// Function to find the closest area to a point
const findClosestArea = (pointX, pointY, areas, imageSize) => {
  if (!areas.length || !imageSize.naturalWidth || !imageSize.width) return null;

  const scaleX = imageSize.naturalWidth / imageSize.width;
  const scaleY = imageSize.naturalHeight / imageSize.height;
  const scaledX = pointX * scaleX;
  const scaledY = pointY * scaleY;

  let closestArea = null;
  let minDistance = Infinity;
  let smallestAreaSize = Infinity;

  areas.forEach((area, index) => {
    if (area.shape !== "rect" || area.coords.length < 4) return;

    const [x1, y1, x2, y2] = area.coords;
    const left = Math.min(x1, x2);
    const right = Math.max(x1, x2);
    const top = Math.min(y1, y2);
    const bottom = Math.max(y1, y2);
    const areaSize = Math.abs(right - left) * Math.abs(bottom - top);

    let distance = Infinity;
    if (
      scaledX >= left &&
      scaledX <= right &&
      scaledY >= top &&
      scaledY <= bottom
    ) {
      distance = 0;
    } else {
      const dx = Math.max(left - scaledX, 0, scaledX - right);
      const dy = Math.max(top - scaledY, 0, scaledY - bottom);
      distance = Math.sqrt(dx * dx + dy * dy);
    }

    if (
      distance < minDistance ||
      (distance === minDistance && areaSize < smallestAreaSize)
    ) {
      minDistance = distance;
      smallestAreaSize = areaSize;
      closestArea = { ...area, index };
    }
  });

  return closestArea;
};

// Get story_image_path by boxid
const getStoryImagePathFromJson = (jsonData, boxid) => {
  console.log(
    "getStoryImagePathFromJson called with jsonData:",
    jsonData,
    "and boxid:",
    boxid
  );
  if (!jsonData || !jsonData.story || !boxid) return null;

  try {
    const story = jsonData.story.find((item) => item.boxid === boxid);
    return story?.story_image_path || null;
  } catch (error) {
    console.error("Error accessing story_image_path from JSON:", error);
    return null;
  }
};

// Function to preload images
const preloadImages = (imageUrls) => {
  imageUrls.forEach((url) => {
    const img = new window.Image();
    img.src = url;
  });
};

const EpaperLarge = ({
  images,
  isLoading,
  data,
  currentDate,
  eid,
  currentCity,
  pageno,
  thumbsSwiper,
  onSwiperReady,
  onUrlChange,
  currentSlideIndex,
  setCurrentSlideIndex,
}) => {
  const [hoveredArea, setHoveredArea] = useState(null);
  const [imageSize, setImageSize] = useState({
    width: 0,
    height: 0,
    naturalWidth: 0,
    naturalHeight: 0,
  });
  const [selectedArea, setSelectedArea] = useState(null);
  const [currentImageSrc, setCurrentImageSrc] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVertical, setIsVertical] = useState(false);
  const [storyImagePath, setStoryImagePath] = useState(null);
  const [imageMapAreas, setImageMapAreas] = useState([]); // State to store parsed areas
  const swiperRef = useRef(null);
  const imageRef = useRef(null);
  const router = useRouter();

  // Parse map areas in useEffect to ensure it runs on the client side
  useEffect(() => {
    if (data && data.length > currentSlideIndex && data[currentSlideIndex]?.map) {
      const areas = parseMapAreasFromMapArray(data[currentSlideIndex].map);
      setImageMapAreas(areas);
    } else {
      setImageMapAreas([]);
    }
  }, [data, currentSlideIndex]);

  const stories =
    data &&
    data.length > currentSlideIndex &&
    data[currentSlideIndex]?.fullxml_json?.story
      ? data[currentSlideIndex].fullxml_json.story
      : [];

  // Expose the Swiper instance to the parent
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      onSwiperReady(swiperRef.current.swiper);
    }
  }, [onSwiperReady]);

  useEffect(() => {
    const preload = () => {
      const preloadUrls = [];
      if (images[currentSlideIndex]) {
        preloadUrls.push(images[currentSlideIndex]);
      }
      if (currentSlideIndex > 0 && images[currentSlideIndex - 1]) {
        preloadUrls.push(images[currentSlideIndex - 1]);
      }
      if (
        currentSlideIndex < images.length - 1 &&
        images[currentSlideIndex + 1]
      ) {
        preloadUrls.push(images[currentSlideIndex + 1]);
      }
      preloadImages(preloadUrls);
    };
    preload();
  }, [currentSlideIndex, images]);

  const handleAreaHover = (index) => {
    setHoveredArea(index);
  };

  const handleAreaLeave = () => {
    setHoveredArea(null);
  };

  const handleImageLoad = (e) => {
    const { width, height } = e.target.getBoundingClientRect();
    const naturalWidth = e.target.naturalWidth;
    const naturalHeight = e.target.naturalHeight;
    setImageSize({ width, height, naturalWidth, naturalHeight });
  };

  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const pointX = e.clientX - rect.left;
    const pointY = e.clientY - rect.top;
    const closestArea = findClosestArea(
      pointX,
      pointY,
      imageMapAreas,
      imageSize
    );

    if (closestArea) {
      setSelectedArea(closestArea);
      setCurrentImageSrc(images[currentSlideIndex]);
      const imagePath = getStoryImagePathFromJson(
        data[currentSlideIndex]?.fullxml_json,
        closestArea.id
      );
      setStoryImagePath(imagePath);
      setIsModalOpen(true);
    }
  };

  const handleSelectStory = (imagePath, area) => {
    setStoryImagePath(imagePath);
    setSelectedArea(area);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArea(null);
    setStoryImagePath(null);
  };

  const toggleDirection = () => {
    setIsVertical((prev) => {
      const newDirection = !prev;
      if (swiperRef.current && swiperRef.current.swiper) {
        setTimeout(() => {
          swiperRef.current.swiper.slideTo(currentSlideIndex, 0);
        }, 0);
      }
      return newDirection;
    });
  };

  const scaleCoords = (coords) => {
    if (!imageSize.naturalWidth || !imageSize.width) return coords;
    const scaleX = imageSize.width / imageSize.naturalWidth;
    const scaleY = imageSize.height / imageSize.naturalHeight;
    return coords.map((coord, index) => {
      return index % 2 === 0 ? coord * scaleX : coord * scaleY;
    });
  };

  return (
    <>
      {/* <button
        onClick={toggleDirection}
        className="absolute -right-[5px] top-1/4 mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Switch
      </button> */}
      <Swiper
        slidesPerView={1}
        style={{ height: isVertical ? "180vh" : "auto" }}
        spaceBetween={0}
        direction={isVertical ? "vertical" : "horizontal"}
        keyboard={{ enabled: true }}
        pagination={{ clickable: true }}
        navigation={isVertical ? false : true}
        modules={[Keyboard, Pagination, Navigation, EffectFade]}
        className="mySwiper"
        ref={swiperRef}
        initialSlide={pageno - 1}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        runCallbacksOnInit={false}
        speed={300}
        thumbs={
          thumbsSwiper && thumbsSwiper.initialized
            ? { swiper: thumbsSwiper }
            : undefined
        }
        onSlideChange={(swiper) => {
          const newPageNo = swiper.activeIndex + 1;
          setCurrentSlideIndex(swiper.activeIndex);
          setCurrentImageSrc(images[swiper.activeIndex]);
          setSelectedArea(null);
          setIsModalOpen(false);
          setStoryImagePath(null);
          const formattedDate = formatDateWithMonthAbbr(currentDate);
          const newUrl = `/epaper/${formattedDate}-${eid}-${currentCity}-edition-${currentCity}-${newPageNo}.html`;
          router.replace(newUrl, { scroll: false });
          onUrlChange(newUrl);
        }}
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="container flex items-center justify-center">
              {isLoading && images.length === 0 ? (
                <div className={Styles.loadingBox} />
              ) : (
                <div
                  style={{
                    position: "relative",
                    maxWidth: "100%",
                    maxHeight: "100%",
                  }}
                >
                  <Image
                    ref={imageRef}
                    src={src}
                    alt={`Slide ${index}`}
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ display: "block", width: "100%", height: "auto" }}
                    useMap={`#image-map-${index}`}
                    onLoad={handleImageLoad}
                    onClick={handleImageClick}
                    priority={index === pageno - 1}
                  />
                  {imageMapAreas.map((area, areaIndex) => {
                    if (area.shape !== "rect" || area.coords.length < 4) {
                      return null;
                    }
                    const scaledCoords = scaleCoords(area.coords);
                    const [x1, y1, x2, y2] = scaledCoords;
                    const areaSize = Math.abs(x2 - x1) * Math.abs(y2 - y1);
                    const borderColor = `hsl(${areaIndex * 30}, 70%, 50%)`;

                    return (
                      <div
                        key={areaIndex}
                        onMouseEnter={() => handleAreaHover(areaIndex)}
                        onMouseLeave={handleAreaLeave}
                        onClick={() => {
                          setSelectedArea({ ...area, index: areaIndex });
                          setCurrentImageSrc(images[currentSlideIndex]);
                          const imagePath = getStoryImagePathFromJson(
                            data[currentSlideIndex]?.fullxml_json,
                            area.id
                          );
                          setStoryImagePath(imagePath);
                          setIsModalOpen(true);
                        }}
                        style={{
                          position: "absolute",
                          cursor: "pointer",
                          left: `${Math.min(x1, x2)}px`,
                          top: `${Math.min(y1, y2)}px`,
                          width: `${Math.abs(x2 - x1)}px`,
                          height: `${Math.abs(y2 - y1)}px`,
                          zIndex: 1000 - Math.round(areaSize / 1000),
                          border:
                            hoveredArea === areaIndex ||
                            selectedArea?.index === areaIndex
                              ? `2px solid ${borderColor}`
                              : "none",
                          background:
                            hoveredArea === areaIndex ||
                            selectedArea?.index === areaIndex
                              ? "rgba(96, 92, 84, 0.3)"
                              : "transparent",
                        }}
                        title={`${area.alt} (ID: ${area.id})`}
                      />
                    );
                  })}
                  <map name={`image-map-${index}`}>
                    {imageMapAreas.map((area, areaIndex) => (
                      <area
                        key={areaIndex}
                        shape={area.shape}
                        coords={scaleCoords(area.coords)
                          .map((coord) => Math.round(coord))
                          .join(",")}
                        href={area.href}
                        alt={area.alt}
                        target={area.target}
                        onMouseEnter={() => handleAreaHover(areaIndex)}
                        onMouseLeave={handleAreaLeave}
                      />
                    ))}
                  </map>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <StoryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        storyImagePath={storyImagePath}
        selectedArea={selectedArea}
        stories={stories}
        onSelectStory={handleSelectStory}
        jsonData={
          data && data.length > currentSlideIndex
            ? data[currentSlideIndex]?.fullxml_json
            : null
        }
      />
    </>
  );
};

export default EpaperLarge;