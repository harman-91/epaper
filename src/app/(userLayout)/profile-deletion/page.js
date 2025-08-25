import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import axios from "axios";
import variable from "@/component/utility/variable";
import { userProfile } from "@/services/userService";
import MyProfileDelete from "@/component/account/profileDelete";

export default async function MyProfilePage({ searchParams }) {
  const cookieStore = await cookies();
  const uid = cookieStore.get(variable.LOGIN_DETAIL)?.value;
  const param = await searchParams;
  let user;
  if (!uid && !param.token) {
    redirect(
      `${process.env.NEXT_PUBLIC_LOGIN_ROUTE}?domain=${process.env.DOMAIN}&url=${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}profile-deletion&action_ref=profile-deletion&lang=en`
    );
  }

  if (uid) {
    user = JSON.parse(atob(uid));
  } else if (param.token) {
    user = JSON.parse(atob(param.token));
    user = user?.userData;
  }
  const profile = await userProfile({ auth_token: user?.auth_token });
  if (!profile || profile.code != 200) {
    redirect(
      `${process.env.NEXT_PUBLIC_LOGIN_ROUTE}?domain=${process.env.DOMAIN}&url=${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}profile-deletion&action_ref=profile-deletion&lang=en`
    );
  }
  const profileData = profile?.data?.profileData;
  return (
    <MyProfileDelete
      profileData={{ ...profileData, auth_token: user?.auth_token }}
      auth={user?.auth_token}
    />
  );
}
