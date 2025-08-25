import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
// import SideBarNav from "@/components/my-account/SideBarNav";
import { userProfile } from "@/services/userService";
import BookmarkList from "@/component/account/bookmarkList";
import { getBookmarkList } from "@/services/commentService";
import variable from "@/component/utility/variable";
import { getDomain } from "@/component/utility/CommonUtils";

export default async function Bookmark({ searchParams }) {
  const cookieStore = await cookies();
  const uid = cookieStore.get(variable.LOGIN_DETAIL)?.value;
  const param = await searchParams;
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const domainInfo = getDomain(host);
  let user;
  if (!uid && !param.token) {
    redirect(
      `${process.env.NEXT_PUBLIC_LOGIN_ROUTE}?domain=${process.env.DOMAIN}&url=${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}bookmark&action_ref=user_profile&lang=en`
    );
  }

  if (uid) {
    user = JSON.parse(atob(uid));
  } else if (param.token) {
    user = JSON.parse(atob(param.token));
    user = user?.userData;
  }
  const profile = await userProfile({ auth_token: user?.auth_token,domainInfo });
  if (!profile && profile.code != 200) {
    redirect(
      `${process.env.NEXT_PUBLIC_LOGIN_ROUTE}?domain=${process.env.DOMAIN}&url=${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}bookmark&action_ref=user_profile&lang=en`
    );
  }
  const profileData = profile?.data?.profileData;
  let data = await getBookmarkList({ user_id: profileData?.user_id,domainInfo });
  data = data?.map((el) => {
    return { ...el, bookmark: true };
  });

  return (
    <div className="relative isolate px-6 pt-14 lg:px-8 overflow-hidden">
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
      <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-32">
        <div className="rounded-2xl bg-white shadow-2xl px-5 md:px-8 py-10">
          <BookmarkList
            profileData={{ ...profileData, auth_token: user?.auth_token }}
            auth={user?.auth_token}
            bookmarkList={data}
          />
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
  );
}
