"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "@/styles/Bookmark.module.css";
import { usePathname, useRouter } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";
import { toggleShowLogin } from "@/store/slice/userSlice";
import useThrottle from "@/component/hooks/useThrottle";
import { datalayerClickEvent } from "@/utils/apiUtils";

// import { usePathname } from "next/router";
const token = {
  "epaper.jagran.com":
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9eyJpc3MiOiJPbmxpbmUgSldUIEJ1a",
  "epaper.naidunia.com":
    "51cefe562be0353d7aae0e7ae565ad111de2e2b5E3NTMyNTQxNzMsImV4cCI6MTc",
  "epaper.punjabijagran.com":
    "6a208384a26ef3213d970a2d3UiOiJlcGFwZXIucHVuamFiaWphZ3Jhbi5jb20ifQ",
};
const Bookmark = ({
  articledata,
  bookmarkEnable,
  removeHandler,
  bookMarkList,
  userData,
  url,
  language,
  iconsize = 18,
  addBookmark,
  domainInfo,
}) => {
  const [showBookmark, setBookmark] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();

  const userValue = useSelector((state) => state.userData.user);
  const saveBookmark = async (val) => {
    try {
      setBookmark(true);
      const body = {
        email: val.email || null,
        headline: articledata.webTitle,
        url: url ? url : window?.location?.href,
        imgurl: articledata?.bigImage?.includes("epaperapi.jagran.com")
          ? articledata?.bigImage
          : process.env.NEXT_PUBLIC_IMAGE_DOMAIN_URL +
            "images/" +
            articledata?.bigImage,
        summary: articledata.summary,
        siteName: token[domainInfo.domainId],
        ssouid: val.user_id,
        domainOrigin: `https://${process.env.DOMAIN}`,
        artid: articledata.artid,
        language: document?.documentElement?.lang,
        domain: domainInfo.domainId,
      };

      //console.log("body", body);
      //https://imgeng.jagran.com/images/2025/04/30/article/image/PM-MODI-PUTIN-1746004137267.jpg
      axios.post("/api/comment/bookmark-add", body);
      if (addBookmark)
        addBookmark({
          email: val.email,
          headline: articledata.webTitle,
          url: url ? url : `https://${process.env.DOMAIN}` + router.asPath,
          imgurl: articledata?.bigImage?.includes("imgeng.jagran.com")
            ? articledata?.bigImage
            : process.env.NEXT_PUBLIC_IMAGE_DOMAIN_URL +
              "images/" +
              articledata?.bigImage,
          summary: articledata.summary,
          siteName: process.env.NEXT_PUBLIC_SITE_TOKEN,
          categoryUrl: "",
          projectid: 1003,
          ssouid: "",
          domainOrigin: `https://${process.env.DOMAIN}`,
          artid: articledata.artid,
          language: document?.documentElement?.lang,
          bookmark: true,
        });
    } catch (err) {
    }
  };
  const deleteBookmark = async (val) => {
    try {
      const body = {
        articleid: articledata.artid,
        productname: process.env.NEXT_PUBLIC_SITE_TOKEN,
        userid: val.user_id,
      };
      if (removeHandler) {
        removeHandler(articledata.artid, articledata.url);
      }
      setBookmark(false);

      const { data } = await axios.post("/api/comment/bookmark-delete", body);
    } catch (err) {
      // console.log("delete", err);
    }
  };
  const bookmarkClick = () => {
    if (showBookmark == false) {
      if (Object.keys(userValue).length == 0) {
        dispatch(
          toggleShowLogin({
            actionRef: "bookmark_btn",
            message: {
              title: "Bookmark this article",
              desc: "Log in or register to save your favourite articles.",
              btn: "Login Now",
              pageType: "na",
              ctaText: "bookmark",
              sectionName: "bookmark_this_article",
            },
          })
        );
      } else {
        datalayerClickEvent(
          "content_icon_interaction",
          "bookmark_add",
          "",
          "article",
          articledata.webTitle
        );
        saveBookmark(userValue);
      }
    } else {
      datalayerClickEvent(
        "content_icon_interaction",
        "bookmark_delete",
        "",
        "article",

        articledata.webTitle
      );
      deleteBookmark(userValue);
    }
  };
  useEffect(() => {
    if (bookmarkEnable == true) {
      setBookmark(true);
    } else {
      if (articledata) setBookmark(articledata?.bookmark ? true : false);
      // getBookmark();
    }
  }, [articledata.bookmark]);
  const handleThrottledLike = useThrottle(() => {
    bookmarkClick();
  }, 1000);

  return (
    <>
      <label
        className={`${styles.uiBookmark} flex items-center justify-center cursor-pointer`}
      >
        <input
          type="checkbox"
          id="bookmark-button"
          checked={showBookmark}
          onChange={handleThrottledLike}
        />
        <div className={styles.bookmark}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={iconsize}
            height={iconsize}
            x="0"
            y="0"
            viewBox="0 0 32 32"
          >
            <g>
              <path d="M25.8,5.3v24.1c0,.5-.4.9-.9.9-.2,0-.4,0-.6-.2l-8.4-6.7-8.4,6.7c-.4.3-.9.2-1.3-.1-.1-.2-.2-.4-.2-.6V5.3c0-2,1.6-3.6,3.6-3.6h12.5c2,0,3.6,1.6,3.6,3.6Z" />
            </g>
          </svg>
        </div>
      </label>
    </>
  );
};

export default React.memo(Bookmark);
