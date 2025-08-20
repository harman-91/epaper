'use client'
import React, { useState } from "react";
import css from "../../styles/Modal.module.scss";


import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toggleShowLogin } from "../../store/slice/userSlice";
import useLogin from "../hooks/useLogin";
import {logingbuttonHeaderclick} from "../utility/CommonUtils";

const LoginModal = () => {
  const router = useRouter();
  const showLogin = useSelector((state) => state.userData.showLogin);
  const actionRef = useSelector((state) => state.userData.actionRef);
  const message = useSelector((state) => state.userData.message);
  const dispatch = useDispatch();
  const { login } = useLogin(actionRef ? actionRef : "login_btn");

  const pathname = router.asPath;
  const onClickLogin = () => {
    if (message.pageType == "subscription") {
      window.location.href = "/subscription/plan";
    } else {
      logingbuttonHeaderclick(
        "login_signup_interaction",
        `${message?.ctaText}`,
        `${message?.sectionName}`,
        "login popup",
        "na"
      );

      login();
    }
  };
  const closeLoginModel = () => {
    dispatch(toggleShowLogin({ actionRef: "" }));
    logingbuttonHeaderclick(
      "login_signup_interaction",
      `close_click`,
      `${message?.sectionName}`,
      "login popup",
      "na"
    );
  };

  if (showLogin != true) {
    return null;
  }

  let title = message?.title || "Like this article";
  let desc =
    message?.desc || "Log in or register to like your favourite article ";
  let loginBtn = message?.btn || "Login Now";
  return (
    <div className={css.modal}>
      <div className={css.modal__content}>
        <span className={css.modal__close} onClick={closeLoginModel}>
          <svg>
            <use href="/sprite.svg#close"></use>
          </svg>
        </span>
        <h3 className={css.heading}>{title} </h3>
        <p>{desc}</p>
        <a className={`${css.button}`} onClick={onClickLogin}>
          {loginBtn}
        </a>
      </div>
    </div>
  );
};

export default LoginModal;
