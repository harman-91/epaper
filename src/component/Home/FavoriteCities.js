"use client";

import React, { useState } from "react";
import Link from "next/link";
import CityModal from "./CityModal";
import { FaRegEdit, FaHeart, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdContentCopy } from "react-icons/md";
import { IoShareSocialOutline } from "react-icons/io5";
import { TiSocialFacebook } from "react-icons/ti";

export default function FavoriteCities({ favoriteCities }) {
  const [selectedCities, setSelectedCities] = useState(["Jaipur", "Bareily"]);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="flex justify-center relative z-10">
        <div
          className="flex gap-8 bg-no-repeat"
          style={{ backgroundImage: `url('/images/halfCircle.png')` }}
        >
          {selectedCities.map((city, index) => (
            <div key={index} className="flex flex-col">
              <div className="relative bg-white p-1 shadow-lg rounded-lg group">
                <img
                  src="/images/selectEditionimg.png"
                  alt={city}
                  className="w-full h-auto"
                />
                <Link
                  href="#"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden group-hover:block text-white text-base font-medium border-2 border-white rounded-full px-4 py-1.5 w-40 text-center z-10"
                  onClick={() => setShowModal(true)}
                >
                  Select City <FaRegEdit className="inline ml-1" />
                </Link>
                <div className="absolute inset-0 bg-black/70 hidden group-hover:block z-0"></div>
              </div>
              <div className="flex justify-between mt-4">
                <a
                  className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-md text-black hover:bg-gray-100"
                  onClick={() => setShowModal(true)}
                >
                  {city} <FaRegEdit />
                </a>
                <div className="flex items-center justify-center bg-white w-10 h-10 rounded-full shadow-md">
                  <FaHeart className="text-red-500" />
                </div>
                <div className="relative group">
                  <div className="flex items-center justify-center bg-white w-10 h-10 rounded-full shadow-md cursor-pointer animate-pulse">
                    <IoShareSocialOutline className="text-lg" />
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white/90 backdrop-blur-md rounded-xl p-5 shadow-xl opacity-0 group-hover:opacity-100 group-hover:visible group-hover:scale-100 scale-90 transition-all duration-500 invisible z-20">
                    <div className="flex gap-3">
                      <a
                        href="#"
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-green-500 hover:scale-110 hover:shadow-lg transition-all duration-300"
                      >
                        <FaWhatsapp className="text-lg text-gray-700 hover:text-white" />
                      </a>
                      <a
                        href="#"
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-600 hover:scale-110 hover:shadow-lg transition-all duration-300"
                      >
                        <TiSocialFacebook className="text-lg text-gray-700 hover:text-white" />
                      </a>
                      <a
                        href="#"
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-400 hover:scale-110 hover:shadow-lg transition-all duration-300"
                      >
                        <FaXTwitter className="text-lg text-gray-700 hover:text-white" />
                      </a>
                      <a
                        href="#"
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-500 hover:scale-110 hover:shadow-lg transition-all duration-300"
                      >
                        <MdContentCopy className="text-lg text-gray-700 hover:text-white" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CityModal
        show={showModal}
        favoriteCities={favoriteCities}
        handleClose={() => setShowModal(false)}
        selectedCities={selectedCities}
        setSelectedCities={setSelectedCities}
      />
    </>
  );
}