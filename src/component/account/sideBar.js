"use client";

import React from "react";
import css from "../../styles/myAccount.module.scss";
import { removeCookie } from "../utility/cookie";
import variable from "../utility/variable";
import axios from "axios";

function SideBarNav(props) {
  const logoutUser = async () => {
    try {
      removeCookie(variable.LOGIN_DETAIL);
      localStorage.setItem("uid_auth", "");
      await axios.post(
        "/api/middleware/logout",
        {},
        { headers: { token: props?.auth } }
      );

      window.location.href = `/?logout-account`;
    } catch (err) {
      window.location.href = `/?logout-account`;
    }
  };
  return (
    <div className={css.sideBar}>
      <div className={css.bar}>
        <ul>
          <li>
            <a
              href="/manage-profile"
              className={
                props.pagetype === "manage-profile" ? css.active : ""
              }
            >
              My Account
            </a>
          </li>
          <li>
            <a
              href="/bookmark"
              className={props.pagetype === "bookmark" ? css.active : ""}
            >
              Bookmark
            </a>
          </li>
          {/* <li><a href="/my-account/notification" className={css.active}>Notification</a></li> */}
          <li>
            <a
              href="/edit-profile"
              className={
                props.pagetype === "edit-profile" ? css.active : ""
              }
            >
              Edit Profile
            </a>
          </li>
          <li><a href="/support" className={ props.pagetype === "edit-profile" ? css.active : "" }>Support</a></li>
        </ul>
        <hr />
        <ul>
          <li onClick={logoutUser}>
            <a>Log Out</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SideBarNav;
