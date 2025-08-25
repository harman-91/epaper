"use client";
import React, { useState, useEffect, useRef } from "react";

export default function MobileSearchPopup({searchQuery,setSearchQuery,filteredCities}) {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);

  const openSearch = () => {
    setIsOpen(true);
  };

  const closeSearch = () => {
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle your search logic here
      // You can add your search API call or navigation here
      closeSearch();
    }
  };



  return (
    <>
      {/* Search Icon Button - Only visible on mobile */}
      <button
        onClick={openSearch}
        className="md:hidden bg-gray-100 border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center"
        aria-label="Open search"
        type="button"
      >
        <img 
          src="/images/search-icon.svg" 
          alt="Search" 
          className="w-[18px] h-[18px]" 
        />
      </button>

      {/* Search Popup Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-[999] md:hidden">
          <div className="bg-white w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-medium">Search</h2>
              <button
                onClick={closeSearch}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                aria-label="Close search"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            </div>

            {/* Search Form */}
            <div className="p-4">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <svg 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                    />
                  </svg>
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                  />
                </div>
                
                {/* Search Button */}
                <button
                  type="submit"
                  disabled={!searchQuery.trim()}
                  className="w-full mt-4 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Search
                </button>
              </form>

              {/* Recent Searches or Suggestions (Optional) */}
              {/* You can add recent searches or suggestions here */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}