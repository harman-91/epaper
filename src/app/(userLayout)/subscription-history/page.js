import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import variable from "@/component/utility/variable";
import {
  userActiveSubscription,
  userProfile,
  userSubscriptionTxn,
} from "@/services/userService";
import SubscriptionHistory from "@/component/account/subscriptionHistory";
import { getDomain } from "@/component/utility/CommonUtils";

export default async function MyProfilePage({ searchParams }) {
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const domainInfo = getDomain(host);
  const cookieStore = await cookies();
  const uid = cookieStore.get(variable.LOGIN_DETAIL)?.value;
  const param = await searchParams;
  let user;
  let logout = false;

  if (!uid && !param.token) {
    redirect(
      `${process.env.NEXT_PUBLIC_LOGIN_ROUTE}?domain=${domainInfo.domainId}&url=${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}profile-deletion&action_ref=profile-deletion&lang=${domainInfo.lang}`
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
      `${process.env.NEXT_PUBLIC_LOGIN_ROUTE}?domain=${domainInfo.domainId}&url=${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}profile-deletion&action_ref=profile-deletion&lang=${domainInfo.lang}`
    );
  }

  const profileData = profile?.data?.profileData;
  const subscriptionActive = await userActiveSubscription({
    auth_token: user?.auth_token,
    domain: domainInfo.domainId,
  });
  const year = new Date().getFullYear();
  const subscriptionHistory = await userSubscriptionTxn({
    auth_token: user?.auth_token,
    year: year,
    domain: domainInfo.domainId,
  });

  return (
    <SubscriptionHistory
      subscriptionActive={subscriptionActive}
      subscriptionHistory={subscriptionHistory}
      auth={user?.auth_token}
      domainInfo={domainInfo}
    />
  );
}
