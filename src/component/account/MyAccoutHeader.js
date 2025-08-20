"use client";
import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import Link from "next/link";
import useLogin from "@/component/hooks/useLogin";
import { removeCookie } from "../utility/cookie";
import variable from "../utility/variable";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { logoutUserProfile } from "@/store/slice/userSlice";

const navigation = [
  { name: "My Account", href: "/manage-profile" },
  { name: "Bookmark", href: "/bookmark" },
  { name: "Edit Profile", href: "/edit-profile" },
  { name: "Subscription History", href: "/subscription-history" },
  { name: "Support", href: "/support" },
];

function MyAccoutHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userDetail = useAppSelector((state) => state.userData.user);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { login, logout, getUserData } = useLogin();
  const loginRef = useRef(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  useEffect(() => {
    if (!loginRef.current || token) {
      loginRef.current = true;
      getUserData();
    }
  }, [searchParams, pathname, token]);
  const logoutUser = async () => {
    try {
      if (userDetail?.auth_token) {
        await dispatch(logoutUserProfile(userDetail?.auth_token)).unwrap();
      }

      removeCookie(variable.LOGIN_DETAIL);
      localStorage.setItem("uid_auth", "");
      router.push("/");
    } catch (err) {
      console.log("logout err", err);
    }
  };

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav
        aria-label="Global"
        className="flex items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only"> Jagran</span>
            {/* <img
                  alt=""
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                  className="h-8 w-auto"
                /> */}
            <svg
              className={`w-[100px] lg:w-[140px] h-[30px] lg:h-[40px] transition-all duration-300 ease-in-ou`}
            >
              <use href="/sprite.svg#tbj"></use>
            </svg>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm/6 font-semibold text-gray-900 uppercase hover:text-red-600"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <button
            onClick={logoutUser}
            className="text-sm/6 font-semibold text-gray-900 hover:text-red-600"
          >
            Log out <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Jagran</span>
              <svg
                className={`w-[100px] lg:w-[140px] h-[30px] lg:h-[40px] transition-all duration-300 ease-in-ou`}
              >
                <use href="/images/logo.svg#logo"></use>
              </svg>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 uppercase"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="py-6">
                <button
                  onClick={logoutUser}
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}

export default MyAccoutHeader;
