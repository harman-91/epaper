import React from "react";

export default function EpaperZoom({ image, toggleZoom }) {
  if (!image) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center overflow-auto">
      <div className="relative w-[90vw] h-[90vh] overflow-auto">
        <img
          src={image}
          alt="Zoomed e-paper"
          className="w-full h-auto object-contain"
        />
        <button
          onClick={toggleZoom}
          className="absolute top-4 right-4 bg-white text-black rounded-full p-2 hover:bg-gray-200 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}