import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import axios from "axios";
import variable from "@/component/utility/variable";
import { userProfile } from "@/services/userService";
import EditProfile from "@/component/account/editprofile";
import { getDomain } from "@/component/utility/CommonUtils";
export const dynamic = "force-dynamic";

export default async function MyProfilePage({ searchParams }) {
  const cookieStore = await cookies();
  const uid = cookieStore.get(variable.LOGIN_DETAIL)?.value;
  const param = await searchParams;
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const domainInfo = getDomain(host);
  let user;
  if (!uid && !param.token) {
    redirect(
      `${process.env.NEXT_PUBLIC_LOGIN_ROUTE}?domain=${process.env.DOMAIN}&url=${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}edit-profile&action_ref=user_profile&lang=en`
    );
  }
  if (uid) {
    user = JSON.parse(atob(uid));
  } else if (param.token) {
    user = JSON.parse(atob(param.token));
    user = user?.userData;
  }
  const profile = await userProfile({ auth_token: user?.auth_token });
  if (!profile) {
    redirect(
      `${process.env.NEXT_PUBLIC_LOGIN_ROUTE}?domain=${process.env.DOMAIN}&url=${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}edit-profile&action_ref=user_profile&lang=en`
    );
  }
  const profileData = profile.data.profileData;

  return (
    <EditProfile
      profileData={{ ...profileData, auth_token: user?.auth_token }}
      auth={user?.auth_token}
      domainInfo={domainInfo}
    />
  );
}
