"use client";

import React, { useEffect } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation"; // ✅ From next/navigation
import { setCookie, getCookie, removeCookie } from "../utility/cookie";
import variable from "../utility/variable";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProfile,
  logoutUserProfile,
  saveUserData,
} from "../../store/slice/userSlice";
import Image from "next/image";
import MyAccountDropdown from "./accountDropdown";

export default function LoginBtn(props) {
  const isMobile = useSelector((state) => state.globalData.isMobile);
  const userDetail = useSelector((state) => state.userData.user);

  const router = useRouter();
  const pathname = usePathname(); 
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const onClickLogin = () => {
    const loc = window.location.href;
    const domain = window.location.origin;
    const path = pathname;

    window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_ROUTE}?domain=${
      process.env.NEXT_PUBLIC_PRODUCT_ID
    }&url=${domain + path}&action_ref=header_login_btn&lang=en`;
  };

  const handleCredentialResponse = async (resp) => {
    const domain = window.location.origin;
    const path = pathname;

    window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_ROUTE}?domain=${
      process.env.NEXT_PUBLIC_PRODUCT_ID
    }&url=${domain + path}&action_ref=one_tap_login&onetap=${
      resp.credential
    }&lang=en`;
  };

  const loadOneTapLogin = () => {
    try {
      const nt = getCookie("nt");
      if (nt !== "false") return;

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.onload = () => {
        google.accounts.id.initialize({
          client_id:
            "247545486737-0f0plg20qounrs8k1qjbkdp0bd57trrb.apps.googleusercontent.com",
          callback: handleCredentialResponse,
        });
        google.accounts.id.prompt();
      };
      document.head.appendChild(script);
    } catch (err) {
      console.log("one tap err pod err---", err);
    }
  };

  // useEffect(() => {
  //   getUserData();
  // }, []);

  const getUserData = async () => {
    const token = searchParams.get("token");
    const logout = searchParams.has("logout");

    if (logout === true) {
      removeCookie(variable.LOGIN_DETAIL);
      localStorage.setItem("uid_auth", "");
      router.replace(pathname); 

      return;
    }

    if (token) {
      try {
        const decode = atob(token);
        let val = JSON.parse(decode);
        const obj = {
          first_name: val?.userData?.first_name,
          last_name: val.userData.last_name,
          profile_picture: val.userData.profile_picture,
          mobile_no: val?.userData?.mobile_no,
          user_id: val?.userData?.user_id,
          auth_token: val?.userData?.auth_token,
          email: val?.userData?.email,
          is_new_user: val?.userData?.is_new_user,
          registration_with: val?.userData?.registration_with,
        };

        dispatch(saveUserData(obj));
        setCookie(variable.LOGIN_DETAIL, btoa(JSON.stringify(obj)), 365);

        if (window.location.href !== pathname + "?login=true") {
          window.location.href = pathname + "?login=true";
        }
      } catch (err) {
        console.log("invalid token");
      }
    } else if (getCookie(variable.LOGIN_DETAIL)) {
      try {
        const decode = atob(getCookie(variable.LOGIN_DETAIL));
        let val = JSON.parse(decode);

        dispatch(saveUserData(val));
        const resp = await dispatch(fetchUserProfile(val?.auth_token));

        if (resp?.payload?.code == 401) {
          logoutUser(val?.auth_token);
        } else if (resp?.payload?.code != 200) {
          dispatch(saveUserData({}));
        }
      } catch (err) {
        console.log("invalid token", err);
      }
    } else if (localStorage.getItem("uid_auth")) {
      const resp = await dispatch(
        fetchUserProfile(localStorage.getItem("uid_auth"))
      );

      if (resp?.payload?.code == 401) {
        logoutUser(localStorage.getItem("uid_auth"));
      } else if (resp?.payload?.code != 200) {
        dispatch(saveUserData({}));
      }
    } else {
      window.addEventListener("scroll", loadOneTapLogin, { once: true });
    }
  };

  const logoutUser = async (token) => {
    try {
      if (token) await dispatch(logoutUserProfile(token));

      router.replace(pathname);

      let logoutUrl = props.logoUrl ? props.logoUrl : pathname;
      window.location.href = `${logoutUrl}`;
    } catch (err) {
      console.log("logout err", err);
    }
  };

  return (
    <>

    </>
  );
}
