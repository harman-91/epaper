"use client";

import React, { useState, useEffect, useRef } from "react";
import useLogin from "../hooks/useLogin";
import { useAppSelector } from "@/store/reduxHooks";
import UserSideBar from "./userSideBar";
import { toggleUserBar } from "@/store/slice/globalSlice";
import { useDispatch } from "react-redux";
import GloabalLink from "../global/Link";
import { genratestateurl } from "../utility/CommonUtils";

export default function Header({ cities }) {
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const userDetail = useAppSelector((state) => state.userData.user);
  const isAuthenticated = useAppSelector(
    (state) => state.userData.isAuthenticated
  );
  const { login, logout, getUserData } = useLogin();
  const loginRef = useRef(false);
  const dispatch = useDispatch();
  const searchContainerRef = useRef(null);

  const toggleOffcanvas = () => {
    setIsOffcanvasOpen(!isOffcanvasOpen);
    dispatch(toggleUserBar());
  };

  const closeOffcanvas = () => {
    setIsOffcanvasOpen(false);
  };

  useEffect(() => {
    if (!loginRef.current) {
      loginRef.current = true;
      console.log("Fetching user data on initial render");
      getUserData();
    }
  }, []);

  useEffect(() => {
    if (isOffcanvasOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOffcanvasOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOffcanvasOpen(false);
        setSearchQuery("");
        setFilteredCities([]);
      }
    };
    if (isOffcanvasOpen || searchQuery) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOffcanvasOpen, searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setSearchQuery("");
        setFilteredCities([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchQuery && cities.length > 0) {
      const filtered = cities.filter((city) =>
        city.city_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  }, [searchQuery, cities]);
  const searchCity = (cityName) => {
    setSearchQuery("");
    setFilteredCities([]);
    const today = new Date();
    const year = today.getFullYear();
    const month = today.toLocaleString("en-US", { month: "short" });
    const day = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    const citySlug = cityName.city_name.replace(/\s+/g, "-");
    const cityCode = cityName.city_code ?? 1;

    const url = genratestateurl({ date: "today", cityCode, citySlug });
    window.location.href = url;
  };
  return (
    <>
      <header className="relative z-10 bg-white py-2.5 shadow-[0_10px_10px_-10px_rgba(33,35,38,0.1)]">
        <div className="container mx-auto px-4">
          <nav className="flex justify-between items-center">
            <div className="navLeft">
              <GloabalLink className="block max-w-[150px]" href="/">
                <img
                  src="/images/jagran-epaper-logo.png"
                  alt="Logo Jagran Epaper"
                  className="w-full h-auto"
                />
              </GloabalLink>
              <div className="date-container">
                <span className="text-xs text-gray-600">
                  Tuesday, 19 Aug 2025 | Delhi
                </span>
              </div>
            </div>
            <div className="navRight flex items-center gap-4">
              {cities.length > 0 && (
                <div className="relative" ref={searchContainerRef}>
                  <div className="relative">
                    <svg
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search cities..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  {filteredCities.length > 0 && (
                    <div className="absolute z-20 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {filteredCities.map((city) => (
                        <GloabalLink
                          key={city.city_name}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => searchCity(city)}
                        >
                          {city.city_name}
                        </GloabalLink>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {userDetail && Object.keys(userDetail).length > 0 ? (
                <div className="login-container">
                  <button
                    className="bg-gray-100 border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center"
                    onClick={toggleOffcanvas}
                    aria-label="Open user menu"
                    type="button"
                  >
                    {userDetail.profile_picture ? (
                      <img
                        src={userDetail.profile_picture}
                        alt="User profile"
                        className="w-[18px] h-[18px] rounded-full"
                      />
                    ) : (
                      <img
                        src="/images/login-icon.svg"
                        alt="User profile"
                        className="w-[18px] h-[18px]"
                      />
                    )}
                  </button>
                </div>
              ) : (
                <div className="login-container">
                  <button
                    className="bg-gray-100 border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center"
                    onClick={login}
                    aria-label="Open user menu"
                    type="button"
                  >
                    <img
                      src="/images/login-icon.svg"
                      alt="User profile"
                      className="w-[18px] h-[18px]"
                    />
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>
      {userDetail && Object.keys(userDetail).length > 0 && (
        <UserSideBar
          toogleShow={toggleOffcanvas}
          userDetail={userDetail}
          logout={logout}
        />
      )}
    </>
  );
}
