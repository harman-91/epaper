// import { useState } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import axios from "axios";
import variable from "@/component/utility/variable";
import { userProfile } from "@/services/userService";
import Link from "next/link";
export const dynamic = "force-dynamic";

export default async function MyProfilePage({ searchParams }) {
  const cookieStore = await cookies();
  const uid = cookieStore.get(variable.LOGIN_DETAIL)?.value;
  const param = await searchParams;

  let user;
  if (!uid && !param.token) {
    redirect(
      `${process.env.NEXT_PUBLIC_LOGIN_ROUTE}?domain=${process.env.DOMAIN}&url=${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}manage-profile&action_ref=user_profile&lang=en`
    );
  }

  if (uid) {
    user = JSON.parse(atob(uid));
  } else if (param.token) {
    user = JSON.parse(atob(param.token));
    user = user?.userData;
  }
  const profile = await userProfile({ auth_token: user?.auth_token });

  if (!profile || profile?.code != 200) {
    redirect(
      `${process.env.NEXT_PUBLIC_LOGIN_ROUTE}?domain=${process.env.DOMAIN}&url=${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}manage-profile&action_ref=user_profile&lang=en`
    );
  }
  const profileData = profile?.data?.profileData;

  const options = { year: "numeric", month: "long" };

  return (
    <>
      <div className="bg-white overflow-hidden">
        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            {" "}
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            />{" "}
          </div>
          <div className="mx-auto max-w-md py-32 sm:py-48 lg:py-32">
            <div className="rounded-2xl bg-white shadow-2xl px-8 py-10">
              {profileData.profile_picture ? (
                <img
                  src={profileData.profile_picture}
                  className="mx-auto size-48 rounded-full md:size-44"
                />
              ) : (
                <img src="/dummy-user.png" className="size-16 rounded-full" />
              )}
              <h3 className="mt-6 text-4xl text-center mb-2">
                Hi! {profileData.first_name} {profileData.last_name}
              </h3>
              <p className="text-sm/6 text-gray-600 text-center mb-2">
                {profileData.email}
              </p>
              <p className="text-xs text-gray-500 mb-2 text-center">
                {profileData.member_since && (
                  <small>
                    Joined since{" "}
                    {new Date(profileData.member_since).toLocaleDateString(
                      "en-Us",
                      options
                    )}
                  </small>
                )}
              </p>
              <div className="flex justify-center mt-4">
                <Link
                  href="/edit-profile"
                  className="text-gray-100 bg-gray-600 border border-gray-600 focus:outline-none hover:bg-gray-700 focus:ring-4 focus:ring-gray-100 font-medium rounded-md text-xs px-5 py-2.5 me-2 uppercase"
                >
                  Edit Profile
                </Link>
                {/* <Link
                  href="/profile-deletion"
                  className="text-red-500 bg-red-50 border border-red-300 focus:outline-none hover:bg-red-100 focus:ring-4 focus:ring-red-100 font-medium rounded-md text-xs px-5 py-2.5 me-2 uppercase"
                >
                  Delete Profile
                </Link> */}
              </div>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          >
            {" "}
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            />{" "}
          </div>
        </div>
      </div>
      {/* <div className={css.myAccount}>
        <SideBarNav query={searchParams} auth={user.auth} />
        <div className={css.mainContent}>
          <div className={css.info}>
            <div className={css.userinfo}>
              <div className={css.profileCol}>
                <div className={css.img}>
                  <figure>
                    {user.profile_picture ? (
                      <img src={user.profile_picture} />
                    ) : (
                      <img src="/dummy-user.png" />
                    )}
                  </figure>
                </div>
                <aside>
                  <p>Hello,</p>
                  <h3 className={css.name}>
                    {user.first_name} {user.last_name}
                  </h3>
                  <p className={css.email}>{user.email}</p>
                  {user.member_since && (
                    <small className={css.join}>
                      Joined since{" "}
                      {new Date(user.member_since).toLocaleDateString(
                        "en-Us",
                        options
                      )}
                    </small>
                  )}
                </aside>
              </div>

              
            </div>
          </div>
        </div>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
        <symbol id="edit" viewBox="0 0 98 98">
          <path d="m 72.1,22.8 a 8.7,8.7 0 0 0 -2.5,-6.2 v 0 A 9,9 0 0 0 63.4,14 v 0 a 8.6,8.6 0 0 0 -6.1,2.5 l 12.3,12.4 a 8.2,8.2 0 0 0 2.5,-6.1 z M 66.8,31.7 54.5,19.4 26,47.9 38.3,60.2 Z M 24.4,51.9 21.6,64.6 34.3,61.8 Z M 82.5,80 h -67 a 2,2 0 0 0 0,4 h 67 a 2,2 0 0 0 0,-4 z"></path>
        </symbol>
      </svg> */}
    </>
  );
}
