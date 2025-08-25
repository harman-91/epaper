"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useInfiniteScroll } from "@/component/hooks/useInfiniteScroll";
import Bookmark from "./bookmark";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { saveUserData } from "@/store/slice/userSlice";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import variable from "@/component/utility/variable";
import { setCookie } from "@/component/utility/cookie";
import { useAppDispatch } from "@/store/reduxHooks";
import GlobalLink from "../global/GlobalLink";
function BookmarkList(props) {
  const [list, setList] = useState(props?.bookmarkList);
  const [page, setPage] = useState(1);
  const [isLoadMore, setIsLoadMore] = useState(
    props?.bookmarkList?.length === 20
  );
  const dispatch = useAppDispatch();
  const searchParams = new useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const removeHandler = (id, url) => {
    const updateList = list.filter((el) => {
      if (el.artid == id && el.artid) {
        return false;
      } else {
        return true;
      }
    });
    setList(updateList);
  };

  const loadMoreHandler = async () => {
    const body = {
      type: "article",
      productname: process.env.NEXT_PUBLIC_SITE_TOKEN,
      userid: props.profileData?.user_id,
      start: page * 20,
      limit: 20,
    };
    setLoading(true);

    try {
      const response = await axios.post("/api/comment/bookmark-all", body);

      const newData = response.data.data.map((el) => ({
        ...el,
        bookmark: true,
      }));

      setList((prevList) => [...prevList, ...newData]);

      setIsLoadMore(newData?.length === 20);
      setLoading(false);

      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error loading more bookmarks:", error);
      setLoading(false);
    }
  };
  const { loadMoreRef, style } = useInfiniteScroll({
    loadMore: loadMoreHandler,
    hasMore: isLoadMore,
    loading,
    threshold: 0.1,
    bottomOffset: 200,
    rateLimit: 1000, // 1 second rate limit
  });
  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      if (window.location.href !== pathname + "?login=true") {
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
        router.push(pathname + "?login=true", undefined, { shallow: true });
      }
    }
  }, []);
  return (
    <>
      <div id="modal-root"></div>
      <script
        id="datalayer"
        dangerouslySetInnerHTML={{
          __html: `var dataLayer = window.dataLayer || []; dataLayer.push({'event':'pageview','tvc_page_type':'bookmark_page','language':'hindi','uid': 'na',
            'usertype': 'na',
            'registration_status': 'na}',
            'loggeduser_id': 'na'});`,
        }}
      ></script>
      {/* <MyPageHeader
        logoUrl="/"
        query={props.query}
        profile={props.profileData}
        auth={props.auth}
        ProfileDropdownWeb={false}
        ProfileDropdownMobile={true}
      /> */}
      <h1 className="text-xl lg:text-3xl mb-6">Bookmark</h1>
      <ul className="">
        {list?.length != 0 ? (
          list?.map((el) => {
            return (
              <li
                className="pb-6 mb-6 border-b border-gray-100 last:border-b-0 last:mb-0 last:pb-0"
                key={el.artid}
              >
                <div className="flex  space-x-4 rtl:space-x-reverse">
                  <div className="w-28 md:w-auto shrink-0">
                    <GlobalLink href={el.url}>
                      <Image
                        width={1200}
                        height={675}
                        alt="bookmark"
                        src={el.imgurl}
                        className="rounded-lg w-48"
                      />
                    </GlobalLink>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm md:text-xl text-gray-900 hover:underline">
                      <GlobalLink href={el.url}>{el.headline}</GlobalLink>
                    </h3>
                  </div>
                  <div className="inline-flex text-base font-semibold text-gray-900 w-4 md:w-16">
                    <Bookmark
                      articledata={{
                        webTitle: el.headline,
                        bigImage: el?.imgurl,
                        summary: el.summary,
                        bookmark: el.bookmark,
                        url: el.url,
                        artid: el.artid,
                      }}
                      removeHandler={removeHandler}
                      iconsize={32}
                    />
                  </div>
                </div>
              </li>
            );
          })
        ) : (
          <div className="h-52 flex justify-center items-center">
            <div className="text-center">
              <ExclamationTriangleIcon className="size-24 mr-auto ml-auto" />
              <div className="text-2xl font-bold">No Posts</div>
              <p>There have been no posts in this section yet</p>
            </div>
          </div>
        )}
      </ul>
      {isLoadMore && <div ref={loadMoreRef} style={style} />}

      {/* <div className={css.myAccount}>
        <SideBarNav query={'bookmark'} auth={props.auth} />
        <div className={css.mainContent}>
          <ul className={css.bookmark}>
            {list.length != 0 ? (
              list.map((el) => {
                return (
                  <li key={el.artid}>
                    <button className={css.mark}>
                      <Bookmark
                        articledata={{
                          webTitle: el.headline,
                          bigImage: el?.imgurl,
                          summary: el.summary,
                          bookmark: el.bookmark,
                          url: el.url,
                          artid: el.artid,
                        }}
                        removeHandler={removeHandler}
                      />
                    </button>
                    <figure>
                      <a href={el.url}>
                        <img src={el.imgurl} />
                      </a>
                    </figure>
                    <aside>
                      <h3>
                        <a href={el.url}>{el.headline}</a>
                      </h3>
                    </aside>
                  </li>
                );
              })
            ) : (
              <div className="nodata">
                <div className="data">
                  <figure>
                    <svg>
                      <use href={`/sprite.svg#datanotfound`}></use>
                    </svg>
                  </figure>
                  <h3>No Posts</h3>
                  <p>There have been no posts in this section yet</p>
                </div>
              </div>
            )}
          </ul>
          {isLoadMore && <div ref={loadMoreRef} style={style} />}
        </div>
      </div> */}
    </>
  );
}

export default BookmarkList;
