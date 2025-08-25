'use client'
import React, { useState, useEffect, useRef } from 'react';

const EpaperSubscribe = () => {
  // Dummy newspaper/magazine data with color gradients
  const newspapers = [
    {
      id: 1,
      title: "दैनिक जागरण",
      gradient: "from-red-500 to-orange-600",
      category: "Hindi Daily"
    },
    {
      id: 2,
      title: "The Times",
      gradient: "from-blue-600 to-indigo-700",
      category: "English Daily"
    },
    {
      id: 3,
      title: "Business Weekly",
      gradient: "from-green-600 to-emerald-700",
      category: "Business Magazine"
    },
    {
      id: 4,
      title: "Tech Today",
      gradient: "from-purple-600 to-violet-700",
      category: "Technology"
    },
    {
      id: 5,
      title: "Sports Tribune",
      gradient: "from-yellow-500 to-amber-600",
      category: "Sports"
    }
  ];
 
  const [queue, setQueue] = useState(newspapers);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentItem, setCurrentItem] = useState(newspapers[0]);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const cardRef = useRef(null);

  // Get window width for responsive calculations
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
   
    // Set initial width immediately
    setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-advance slider (paused during drag)
  useEffect(() => {
    if (isDragging) return;
   
    const timer = setInterval(() => {
      nextSlide();
    }, 4000); // Increased time for better visibility
   
    return () => clearInterval(timer);
  }, [queue, isDragging]);

  const nextSlide = () => {
    if (isAnimating || queue.length <= 1) return;
    setIsAnimating(true);
   
    setTimeout(() => {
      const newQueue = [...queue.slice(1), currentItem];
      setQueue(newQueue);
      setCurrentItem(newQueue[0]);
      setIsAnimating(false);
      setDragOffset(0);
    }, 400); // Slightly longer animation for smoother feel
  };

  const prevSlide = () => {
    if (isAnimating || queue.length <= 1) return;
    setIsAnimating(true);
   
    setTimeout(() => {
      const lastItem = queue[queue.length - 1];
      const newQueue = [lastItem, ...queue.slice(0, -1)];
      setQueue(newQueue);
      setCurrentItem(lastItem);
      setIsAnimating(false);
      setDragOffset(0);
    }, 400);
  };

  // Touch and mouse event handlers
  const getPositionX = (event) => {
    return event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
  };

  const handleStart = (event) => {
    if (isAnimating) return;
    setIsDragging(true);
    setStartPos(getPositionX(event));
    event.preventDefault();
  };

  const handleMove = (event) => {
    if (!isDragging || isAnimating) return;
   
    const currentPosition = getPositionX(event);
    const diff = currentPosition - startPos;
    // Limit drag distance for better control
    const maxDrag = windowWidth * 0.3;
    setDragOffset(Math.max(Math.min(diff, maxDrag), -maxDrag));
    event.preventDefault();
  };

  const handleEnd = () => {
    if (!isDragging || isAnimating) return;
    setIsDragging(false);
   
    // Responsive threshold based on screen size
    const threshold = windowWidth < 640 ? 50 : 80;
   
    if (dragOffset < -threshold) {
      nextSlide();
    } else if (dragOffset > threshold) {
      prevSlide();
    } else {
      // Smooth reset animation
      setDragOffset(0);
    }
  };

  // Calculate responsive values
  const isMobile = windowWidth > 0 && windowWidth < 768;
  const cardWidth = isMobile ? 'w-56' : 'w-60';
  const cardHeight = isMobile ? 'h-52' : 'h-72';
  const offsetMultiplier = isMobile ? 30 : 45;
  const fontSize = isMobile ? 'text-lg' : 'text-2xl';
  const categorySize = isMobile ? 'text-sm' : 'text-base';
  const routetoplan=()=>{
    window.location.href = "/subscription/plan";
  }
  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        style={{ height: '100vh' }}
      />
      <div className="w-full py-2 fixed bottom-0 left-0 right-0 z-50" style={{backgroundColor: '#fcf0f0'}}>
        <div className="w-full px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-80">
            
            {/* Left Half - Slider */}
            <div className="flex justify-center">
              <div className="relative select-none w-full max-w-md">
                {/* Main slider container */}
                <div className="relative h-60">
                  <div className="absolute inset-0 flex items-center justify-start z-50">
                    <div
                      ref={cardRef}
                      className={`transform transition-all duration-500 cursor-grab active:cursor-grabbing ${
                        isAnimating ? 'scale-95 opacity-90' : 'scale-100 opacity-100'
                      }`}
                      onMouseDown={handleStart}
                      onMouseMove={handleMove}
                      onMouseUp={handleEnd}
                      onMouseLeave={handleEnd}
                      onTouchStart={handleStart}
                      onTouchMove={handleMove}
                      onTouchEnd={handleEnd}
                      style={{
                        transform: `translateX(${dragOffset}px) ${isAnimating ? 'scale(0.95)' : 'scale(1)'}`,
                        transition: !isDragging ? 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none'
                      }}
                    >
                      <div className="relative group">
                        <div
                          className={`${cardWidth} ${cardHeight} bg-gradient-to-br ${currentItem.gradient} rounded-xl shadow-xl border-4 border-white flex flex-col justify-center items-center text-white`}
                        >
                          <div className="text-center p-4 md:p-6">
                            <h3 className={`font-bold mb-3 md:mb-4 drop-shadow-lg ${fontSize}`}>
                              {currentItem.title}
                            </h3>
                            <div className="w-12 md:w-16 h-1 bg-white/50 mx-auto mb-3 md:mb-4 rounded"></div>
                            <p className={`opacity-90 font-medium ${categorySize}`}>
                              {currentItem.category}
                            </p>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>              
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {queue.slice(1).map((newspaper, index) => {
                      const position = index + 1;
                      const offset = position * offsetMultiplier;
                      const zIndex = queue.length - position;
                      const opacity = Math.max(1 - (position * 0.2), 0.2);
                      const scale = Math.max(1 - (position * 0.08), 0.7);                   
                      return (
                        <div
                          key={newspaper.id}
                          className="absolute transform transition-all duration-500 ease-out"
                          style={{
                            transform: `translateX(${offset}px) scale(${scale})`,
                            zIndex,
                            opacity
                          }}
                        >
                          <div
                            className={`${cardWidth} ${cardHeight} bg-gradient-to-br ${newspaper.gradient} rounded-xl shadow-lg border-4 border-white flex items-center justify-center backdrop-blur-sm`}
                          >
                            <h4 className="text-white font-bold text-center px-4 drop-shadow-md text-base md:text-lg">
                              {newspaper.title}
                            </h4>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Half - Content */}
            <div className="flex flex-col justify-center space-y-8 px-4 md:px-8">
              <div className="text-center md:text-left">
                <p className="text-xl md:text-2xl text-gray-600 mb-2 leading-relaxed">
                  आपका फ्री प्रीव्यू समाप्त हो गया है!
                </p>              
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 leading-tight">
                  ई-पेपर को पढ़ने के लिए सब्सक्राइब करें।
                </h2>
                <button onClick={routetoplan} className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-xl text-md shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out">
                  सब्सक्राइब करें ₹1/दिन में
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EpaperSubscribe;