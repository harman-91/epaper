"use client";
import axios from "axios";
import dynamic from "next/dynamic";
import { useAppSelector, useAppDispatch } from "@/store/reduxHooks";
import React, { useRef, useState, useEffect, Fragment } from "react";
const Bookmark = dynamic(() => import("../account/bookmark"));
const LikeButton = dynamic(() => import("../account/likeButton"));
import { datalayerClickEvent } from "../anayltics/contentDatalayer";
import { toggleComment as toggleModal } from "@/store/slice/globalSlice";
import { ShareIcon } from "@heroicons/react/24/outline";
import { datalayerClickSocial } from "@/components/utility/siteConfig";
//import GloabalLinkMenu from "../global/MenuLink";
// import LikeButton from "../account/likeButton";
//import CommentIcon from "../comments/commenticon";
// import Bookmark from "../account/bookmark";
const token = {
  "epaper.jagran.com":
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9eyJpc3MiOiJPbmxpbmUgSldUIEJ1a",
  "epaper.naidunia.com":
    "51cefe562be0353d7aae0e7ae565ad111de2e2b5E3NTMyNTQxNzMsImV4cCI6MTc",
  "epaper.punjabijagran.com":
    "6a208384a26ef3213d970a2d3UiOiJlcGFwZXIucHVuamFiaWphZ3Jhbi5jb20ifQ",
};
const SocialIcons = ({ url, id, bookmarkData, comment, data }) => {
  //const encodedUrl = process.env.NEXT_PUBLIC_BASE_URL_DOMAIN+url;
  // const showModal = useAppSelector((state) => state.globalData.showModal);

  const [detail, setDetail] = useState({});
  const [commentDot, setCommnetDot] = useState(false);
  const dispatch = useAppDispatch();
  //const [showComment, setComment] = useState(false);
  const toggleComment = () => {
    if (comment == false) {
      datalayerClickEvent(
        "content_icon_interaction",
        "comment",
        ""
        // `${dada.type}`,
        // `${articledetaildata.webTitle}`
      );
    }
    if (commentDot) {
      sessionStorage.setItem("commentClick", true);
      setCommnetDot(false);
    }
    dispatch(toggleModal());
    setComment((prev) => !prev);
  };
  const userData = useAppSelector((state) => state.userData.user);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "The Daily Jagran", url: url });
        datalayerClickSocial(
          "social_share_icon",
          "na",
          "guest",
          "share",
          "article",
          data.headline.toLowerCase()
        );
      } catch (error) {
        console.error("Sharing failed", error);
      }
    } else {
      alert("Share not supported on this browser.");
    }
  };
  const likeArticle = async (val) => {
    const body = {
      articleid: id,
      userid: val.user_id,
      productname: token[domainInfo.domainId],
    };
    try {
      const response = await axios.post("/api/comment/bookmark-like", body);

      setDetail((prev) => {
        return {
          like: response.data.data.likes,
          bookmark: response.data.data.bookmarks,
        };
      });
    } catch (err) {
      console.error("Error liking the article:", err);
    }
  };
  const likeArticleRef = useRef(false);
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      userData &&
      Object.keys(userData).length > 0 &&
      likeArticleRef.current === false
    ) {
      likeArticleRef.current = true;
      likeArticle(userData);
    }
  }, [userData]);

  return (
    <Fragment>
      <ul className="flex  gap-1 lg:gap-1 mt-0 lg:mt-4 justify-start">
        {/* <li onClick={() => datalayerClickSocial('social_share_icon', 'na', 'guest', 'facebook', 'article', articledata.headline.toLowerCase())}><a href={`https://www.facebook.com/sharer.php?u=${DomainPrefixes.UrlPrifix}${router.asPath}`} target="_blank" rel="noreferrer" title="Facebook"></a> */}
        <li>
          <button
            className="share-btn flex items-center justify-center w-8 lg:w-10 h-8 lg:h-10 border border-gray-500/20 hover:border-gray-700/60 cursor-pointer"
            aria-label="Share Article"
            onClick={handleNativeShare}
          >
            {/* <GloabalLinkMenu eventName={'social_share_icon'} data={{
                                  uid: 'na',
                                  usertype: 'guest',
                                  cta_text: `share`,
                                  select_type: 'header',
                                  section_name: `explore`,
                                }}> */}
            <ShareIcon aria-hidden="true" className="size-5 mr-1" />
            {/* </GloabalLinkMenu> */}
          </button>
        </li>
        <li className="flex items-center justify-center w-8 lg:w-10 h-8 lg:h-10 border border-gray-500/20 hover:border-gray-700/60 cursor-pointer">
          <LikeButton
            id={id}
            isLike={detail.like}
            language={"en_US"}
            totalCount={detail?.totalLikes}
          />
        </li>
        <li className="flex items-center justify-center w-8 lg:w-10 h-8 lg:h-10 border border-gray-500/20 hover:border-gray-700/60 cursor-pointer">
          <Bookmark
            language={"en"}
            articledata={{
              webTitle: "headline",
              bigImage: bookmarkData?.imgName,
              // summary: bookmarkData?.summary,
              bookmark: detail?.bookmark || false,
              artid: id,
            }}
          />
        </li>
        {/* <li className="flex items-center justify-center w-8 lg:w-10 h-8 lg:h-10 border border-gray-500/20 hover:border-gray-700/60 cursor-pointer" onClick={toggleComment}>
          <CommentIcon
            toggleComment={toggleComment}
            totalCount={comment?.totalComment}
            commentDot={commentDot}
          />
        </li> */}
      </ul>
    </Fragment>
  );
};

export default React.memo(SocialIcons);
