"use client";

import React, { useEffect, useRef, useState } from "react";

import { useAppDispatch } from "@/store/reduxHooks";
import { logoutUserProfile } from "@/store/slice/userSlice";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const DeviceDetect = (setIsMobile) => {
  const userAgent = navigator.userAgent;
  const isMobileRegex = /mobile/i;
  setIsMobile(isMobileRegex.test(userAgent));
};

function MyAccountDropdown(props) {
  const userDetail = useSelector((state) => state.userData.user);
  const [showLanguage, setShowLanguage] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useAppDispatch();

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (e) => {
    e.preventDefault();
    setShowDropdown(!showLanguage);
  };

  const fullName = userDetail.first_name;
  const displayname = fullName ? fullName.split(" ") : [];

  const logoutUser = async () => {
    try {
      if (userDetail?.auth_token) {
        await dispatch(logoutUserProfile(userDetail.auth_token));
      }

      // Optionally navigate to homepage or refresh current path
      router.replace(pathname); // or router.refresh();

      const logoutUrl = props.logoUrl || pathname;
      router.replace(logoutUrl); // Use `replace` instead of `window.location.href`
    } catch (err) {
      console.log("logout err", err);
    }
  };

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    DeviceDetect(setIsMobile);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex items-center cursor-pointer"
        onClick={toggleDropdown}
      >
        {userDetail.profile_picture ? (
          <figure className="mb-0 rounded-full ">
            <img
              src={userDetail.profile_picture}
              className="w-10 h-10 rounded-full max-[768px]:w-8 max-[768px]:h-8"
              alt="User"
            />
          </figure>
        ) : userDetail.first_name ? (
          <span className="w-10 h-10 flex justify-center items-center text-white bg-black rounded-full text-lg max-[768px]:w-8 max-[768px]:h-8">
            {userDetail.first_name.charAt(0).toUpperCase()}
          </span>
        ) : (
          <img
            src="/dummy-user.png"
            alt="Dummy"
            className="w-10 h-10 rounded-full max-[768px]:w-8 max-[768px]:h-8"
          />
        )}
      </div>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-56 bg-white shadow-md rounded-md border z-50">
          {/* Header */}
          <div className="p-4">
            <h3 className="text-base font-bold">
              Hello, {userDetail.first_name || "User"}
            </h3>
          </div>

          <ul className="text-sm">
            <li>
              <a
                href="/manage-profile"
                className="block px-4 py-3 font-medium hover:bg-gray-100"
              >
                My Account
              </a>
            </li>
            <li>
              <a href="/bookmark" className="block px-4 py-3 hover:bg-gray-100">
                Bookmark
              </a>
            </li>
            <li>
              <a
                href="/edit-profile"
                className="block px-4 py-3 hover:bg-gray-100"
              >
                Edit Profile
              </a>
            </li>
          </ul>

          <div
            className="px-4 py-3 bg-[#ededed] cursor-pointer hover:bg-gray-200 text-center"
            onClick={logoutUser}
          >
            <span className="text-sm font-medium self-center">Log Out</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyAccountDropdown;
