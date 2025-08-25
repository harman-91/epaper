import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { toggleUserBar } from "@/store/slice/globalSlice";

import {
  BookmarkIcon,
  LockClosedIcon,
  UserIcon,
  UserPlusIcon,
  XMarkIcon,
  ChatBubbleOvalLeftEllipsisIcon
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import GloabalLink from "../global/Link";
const menuItems = [
  {
    href: "/manage-profile",
    label: "माई प्रोफ़ाइल",
    icon: UserIcon,
  },
  {
    href: "/bookmark",
    label: "बुकमार्क्स",
    icon: BookmarkIcon,
  },
  {
    href: "/edit-profile",
    label: "अपडेट प्रोफ़ाइल",
    icon: UserPlusIcon,
  },
  {
    href: "/subscription-history",
    label: "सब्सक्रिप्शन डिटेल्स",
    icon: UserPlusIcon,
  },
  {
    href: "/support",
    label: "सपोर्ट",
    icon: UserPlusIcon,
  },
  {
    label: "लॉग आउट",
    icon: LockClosedIcon,
    isButton: true,
  },
];
const menuItemsPu = [
  {
    href: "/manage-profile",
    label: "My Profile",
    icon: UserIcon,
  },
  {
    href: "/bookmark",
    label: "Bookmarks",
    icon: BookmarkIcon,
  },
  {
    href: "/edit-profile",
    label: "Update Profile",
    icon: UserPlusIcon,
  },
  {
    href: "/subscription-history",
    label: "Subscription Details",
    icon: UserPlusIcon,
  },
  {
    href: "/support",
    label: "Support",
    icon: UserPlusIcon,
  },
  {
    label: "Log Out",
    icon: LockClosedIcon,
    isButton: true,
  },
];
export default function UserSideBar({ toogleShow, userDetail, logout,domainInfo }) {
  const showUserBar = useAppSelector((state) => state.globalData.showUserBar);
  const dispatch = useAppDispatch();
  const menu=domainInfo?.domainId=='epaper.punjabijagran.com'?menuItemsPu:menuItems;
  const toogleUserSidebar = () => {
    dispatch(toggleUserBar());
  };

  return (
    <div
      className={`fixed inset-0 z-[60]   ${
        showUserBar ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`fixed inset-0 bg-gray-900/80  ${
          showUserBar ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toogleShow}
      />
      {/* Sidebar content with slide animation */}
      <div
        className={`fixed right-0 top-0 h-full w-[80%] lg:w-[24rem] bg-white flex flex-col gap-y-2 py-0 transition-transform duration-300 ${
          showUserBar ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="absolute -left-16 top-5 flex justify-center">
          <button
            type="button"
            onClick={toogleShow}
            className="p-2.5 bg-white rounded-full"
          >
            <span className="sr-only">Close sidebar</span>
            <XMarkIcon aria-hidden="true" className="size-6 text-black" />
          </button>
        </div>
        <div className="overflow-y-auto">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white">
            <div className="flex items-center bg-slate-100 py-8 px-8">
              <div className="flex items-center">
                <div>
                  {userDetail.profile_picture ? (
                    <Image
                      height={38}
                      width={38}
                      alt={`${userDetail.first_name} ${userDetail.last_name}`}
                      src={userDetail.profile_picture}
                      className="inline-block size-10  rounded-full"
                    />
                  ) : (
                    <>
                      {userDetail?.first_name ? (
                        <span className="flex w-10 h-10 rounded-full bg-gray-200 items-center justify-center text-gray-500 font-bold">
                          {userDetail?.first_name?.charAt(0)?.toUpperCase()}
                        </span>
                      ) : (
                        <UserIcon
                          aria-hidden="true"
                          className="size-6 mb-1 mr-auto ml-auto"
                        />
                      )}
                    </>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {userDetail.first_name} {userDetail.last_name}
                  </p>
                  <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                    {userDetail.email}
                  </p>
                </div>
              </div>
            </div>
            <div className="">
              <ul className="list-none">
                {menu.map((item, index) => (
                  <li
                    key={item.label}
                    className={`py-4 border-b border-slate-100 px-8 ${
                      item.isButton ? "bg-slate-50" : ""
                    }`}
                  >
                    {item.isButton ? (
                      <button
                        onClick={() => {
                          logout(userDetail.auth_token);
                          toogleUserSidebar();
                        }}
                        className="text-gray-900 hover:text-red-700 text-xs uppercase font-semibold inline-flex items-center"
                      >
                        <item.icon className="size-5 mr-2" />
                        {item.label}
                      </button>
                    ) : (
                      <GloabalLink
                        href={item.href}
                        className="text-gray-900 hover:text-red-700 text-xs uppercase font-semibold inline-flex items-center"
                        onClick={toogleUserSidebar}
                      >
                        <item.icon className="size-5 mr-2" />
                        {item.label}
                      </GloabalLink>
                    )}
                  </li>
                ))}
                {/* <li className="py-4 border-b border-slate-100 px-8">
                  <Link
                    href="/manage-profile"
                    className="text-gray-900 hover:text-red-700  text-xs uppercase font-semibold inline-flex items-center"
                    onClick={toogleShow}
                  >
                    <UserIcon className="size-5 mr-2" />
                    My Account
                  </Link>
                </li>
                <li className="py-4 border-b border-slate-100 px-8">
                  <Link
                    href="/bookmark"
                    className="text-gray-900 hover:text-red-700  text-xs uppercase font-semibold inline-flex items-center"
                    onClick={toogleShow}
                  >
                    <BookmarkIcon className="size-5 mr-2" />
                    Bookmark
                  </Link>
                </li>
                <li className="py-4 border-b border-slate-100 px-8">
                  <Link
                    href="/edit-profile"
                    className="text-gray-900 hover:text-red-700  text-xs uppercase font-semibold inline-flex items-center"
                    onClick={toogleShow}
                  >
                    <UserPlusIcon className="size-5 mr-2" />
                    Edit Profile
                  </Link>
                </li>
                <li className="py-4 border-b border-slate-100 px-8">
                  <Link
                    href="/Support"
                    className="text-gray-900 hover:text-red-700  text-xs uppercase font-semibold inline-flex items-center"
                    onClick={toogleShow}
                  >
                    <ChatBubbleOvalLeftEllipsisIcon className="size-5 mr-2" />
                    Support
                  </Link>
                </li>                
                <li className="py-4 bg-slate-50 px-8">
                  <button
                    onClick={() => {
                      logout(userDetail.auth_token);
                      toogleShow();
                    }}
                    className="text-gray-900 hover:text-red-700  text-xs uppercase font-semibold inline-flex items-center"
                  >
                    <LockClosedIcon className="size-5 mr-2" />
                    Log Out
                  </button>
                </li> */}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
