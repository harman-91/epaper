"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import CityModal from "./CityModal";
import { FaRegEdit, FaHeart, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdContentCopy } from "react-icons/md";
import { IoShareSocialOutline } from "react-icons/io5";
import { TiSocialFacebook } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { getPersonalizedCategory } from '@/services/personalizeCategoryService';
import { genrateurl } from "@/component/utility/CommonUtils";
import { toggleShowLogin } from "@/store/slice/userSlice";


export default function FavoriteCities({ favoriteCities }) {
  const [selectedCities, setSelectedCities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCityIndex, setEditingCityIndex] = useState(null);
  const [hasPersonalizedData, setHasPersonalizedData] = useState(true);
  const isLoggedIn = useSelector((state) => state.userData?.isAuthenticated);
  const userDetail = useSelector((state) => state.userData.user);
  const dispatch = useDispatch();


  useEffect(() => {
    const fetchPersonalizedCities = async () => {
      try {
        const personalizedData = await getPersonalizedCategory({
          domain_url: "epaper.naidunia.com",
          token: userDetail?.auth_token
        });

        const cityCodesFromApi = personalizedData?.data?.epaperPersonalizationData?.map(item => item.selected_id) || [];


        if (!personalizedData?.data?.epaperPersonalizationData || cityCodesFromApi.length === 0) {
          setHasPersonalizedData(false);
          return;
        }

        setHasPersonalizedData(true);

        // Transform favoriteCities to a flat list of cities for matching
        const citiesList = favoriteCities.flatMap(state =>
          state.regions.flatMap(region =>
            region.cities.map(city => ({
              name: city.city_name,
              code: city.code,
              state: state.state_name
            }))
          )
        );

        // Map API city codes to city names for selectedCities state
        const apiCityNames = cityCodesFromApi
          .map(code => {
            const city = citiesList.find(c => c.code === code);
            return city ? city.name : null;
          })
          .filter(name => name !== null);


        if (apiCityNames.length > 0) {
          setSelectedCities(apiCityNames.slice(0, 2)); // Limit  2 cities
        }


        // cityCodesFromApi.forEach(code => {
        //   const city = citiesList.find(c => c.code === code);
        //   if (city) {
        //     const citySlug = city.name.toLowerCase().replace(/\s+/g, '-');
        //     // const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        //       const today = new Date();
        //     const year = today.getFullYear();
        //     const month = today.toLocaleString("en-US", { month: "short" });
        //     const day = String(today.getDate()).padStart(2, "0");
        //     const formattedDate = `${year}-${month}-${day}`;
        //     const generatedUrl = genrateurl({
        //       date: formattedDate,
        //       cityCode: code,
        //       citySlug: citySlug
        //     });
        //     // window.location.href = generatedUrl;
        //   }
        // });
      } catch (error) {
       
        setHasPersonalizedData(false); // Treat API failure as no personalized data
      }
    };

    if (isLoggedIn && userDetail?.auth_token && favoriteCities?.length > 0) {
      fetchPersonalizedCities();
    }
  }, [isLoggedIn, userDetail, favoriteCities]);


  const openModalForCity = (index) => {
 
    setEditingCityIndex(index);
    

    setShowModal(true);
  };
  const selectCity=()=>{
       if (Object.keys(userDetail).length == 0) {
      dispatch(
        toggleShowLogin({
          actionRef: "select_city_button",
          message: {
            title: "Save City",
            desc: "Log in or register to save your favourite city.",
            btn: "Login Now",
            pageType: "na",
            ctaText: "select_city_button",
            sectionName: "select_city_button",
          },
        })
      );
      return
    }
    setShowModal(true)
  }
  

  return (
    <>
      <div className="flex justify-center">
        <div
          className="flex gap-8 bg-no-repeat"
          style={{ backgroundImage: `url('/images/halfCircle.png')` }}
        >
          {/* removed hasPersonalizedData && from below */}
          {isLoggedIn && (
            // layout for logged-in users with data
            selectedCities.map((city, index) => (
              <div key={index} className="flex flex-col">
                <Link
                  href="#"
                  className="relative bg-white p-1 shadow-lg rounded-lg group"
                 
                >
                  <img
                    src="/images/selectEditionimg.png"
                    alt={city}
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-black/70 hidden group-hover:block z-0"></div>
                </Link>
                <div className="flex justify-between mt-4">
                  <a
                    className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-md text-black hover:bg-gray-100"
                    onClick={() => openModalForCity(index)}
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
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white/90 backdrop-blur-md rounded-xl p-5 shadow-xl opacity-0 group-hover:opacity-100 group-hover:visible group-hover:scale-100 transition-all duration-500 invisible z-20">
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
            ))
          )}
          {(selectedCities.length == 0 || selectedCities.length == 1) && (
            <div className="flex flex-col">
              <div className="relative bg-white p-1 shadow-lg rounded-lg group">
                <img
                  src="/images/selectEditionimg.png"
                  alt="Select City"
                  className="w-full h-auto"
                />
                <Link
                  href="#"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden group-hover:block text-white text-base font-medium border-2 border-white rounded-full px-4 py-1.5 w-40 text-center z-10"
                  onClick={selectCity}
                >
                  Select City <FaRegEdit className="inline ml-1" />
                </Link>
                <div className="absolute inset-0 bg-black/70 hidden group-hover:block z-0"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <CityModal
        show={showModal}
        favoriteCities={favoriteCities}
        handleClose={() => {
          setShowModal(false);
          setEditingCityIndex(null);
        }}
        selectedCities={selectedCities}
        setSelectedCities={setSelectedCities}
        editingCityIndex={editingCityIndex}
      />
    </>
  );
}