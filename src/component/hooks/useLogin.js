"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchUserProfile,
  logoutUserProfile,
  nonLoggedIn,
  saveUserData,
} from "@/store/slice/userSlice";
import { setCookie, getCookie, removeCookie } from "@/component/utility/cookie";
import { getDomain } from "../utility/CommonUtils";
import variable from "../utility/variable";

const useLogin = (actionRef = "header_login_btn", data) => {
  const { isGoogleLogin = true, google_action_ref = "one_tap_login" } =
    data || {};
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onClickLogin = () => {
    const domain = window.location.origin;
    const currentUrl = new URL(window.location.href);
    const urlSearchParams = new URLSearchParams(searchParams.toString());

    const utmParams = new URLSearchParams();
    for (const [key, value] of urlSearchParams) {
      if (key.startsWith("utm_")) {
        utmParams.set(key, value);
      }
    }
    const host = window.location.hostname;
    const domainInfo = getDomain(host);
    sessionStorage.setItem("utm_params", utmParams.toString());

    const baseUrl = pathname.split("?")[0];

    window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_ROUTE}?domain=${
      domainInfo.domainId
    }&url=${domain + baseUrl}&action_ref=${actionRef}&lang=hi&utm_source=${
      domain + baseUrl
    }`;
  };

  const onGoogleLogin = (resp) => {
    const domain = window.location.origin;
    const currentUrl = new URL(window.location.href);
    const urlSearchParams = new URLSearchParams(searchParams.toString());

    const utmParams = new URLSearchParams();
    for (const [key, value] of urlSearchParams) {
      if (key.startsWith("utm_")) {
        utmParams.set(key, value);
      }
    }
    sessionStorage.setItem("utm_params", utmParams.toString());

    const baseUrl = pathname.split("?")[0];

    window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_ROUTE}?domain=${
      process.env.NEXT_PUBLIC_PRODUCT_ID
    }&url=${
      domain + baseUrl
    }&action_ref=${google_action_ref}&lang=hi&utm_source=${
      domain + baseUrl
    }&onetap=${resp.credential}`;
  };

  const handleCredentialResponse = async (resp) => {
    const domain = window.location.origin;
    const path = pathname;

    window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_ROUTE}?domain=${
      process.env.NEXT_PUBLIC_PRODUCT_ID
    }&url=${domain + path}&action_ref=one_tap_login&onetap=${
      resp.credential
    }&lang=hi&utm_source=${window.location.href}`;
  };

  const loadOneTapLogin = () => {
    try {
      const nt = getCookie("nt");
      if (nt !== "false") return;

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.onload = () => {
        google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: onGoogleLogin,
        });
        google.accounts.id.prompt();
      };
      document.head.appendChild(script);
    } catch (err) {
    }
  };

  const logoutUser = async (token) => {
    try {
      if (token) await dispatch(logoutUserProfile(token));
      const url = pathname.split("?")[0];

      removeCookie(variable.LOGIN_DETAIL);
      removeCookie(variable.USER_SUB_COOKIE);

      localStorage.setItem("uid_auth", "");
      router.replace(url);
    } catch (err) {
      console.log("logout err", err);
    }
  };

  const getUserData = async () => {
    let token = searchParams.get("token");

    const logout = searchParams.has("logout");
    if (logout) {
      removeCookie(variable.LOGIN_DETAIL);
      removeCookie(variable.USER_SUB_COOKIE);

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
        const utmParams = sessionStorage.getItem("utm_params");
        const filteredParams = new URLSearchParams(utmParams || "");
        filteredParams.set("login", "true");

        const baseUrl = pathname.split("?")[0];
        const newQueryString = filteredParams.toString();
        const newUrl = newQueryString
          ? `${baseUrl}?${newQueryString}`
          : baseUrl;

        sessionStorage.removeItem("utm_params");

        if (window.location.href !== newUrl) {
          window.location.href = newUrl;
        }
      } catch (err) {
        console.log("invalid token", err);
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
      // setTimeout(()=>{
      //   dispatch(nonLoggedIn())
      // },10000)
              dispatch(nonLoggedIn())

      // if (isGoogleLogin !== false)
      //   window.addEventListener("scroll", loadOneTapLogin, { once: true });
    }
  };

  // useEffect(() => {
  //   getUserData();
  // }, [searchParams]);

  return {
    login: onClickLogin,
    logout: logoutUser,
    getUserData,
    onGoogleLogin,
  };
};

export default useLogin;