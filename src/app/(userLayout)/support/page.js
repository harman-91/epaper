import { cookies, headers } from "next/headers";
import axios from "axios";
import ClientSupportPage from "./ClientSupportPage";
import { redirect } from "next/navigation";
import variable from "@/component/utility/variable";
import { getDomain } from "@/component/utility/CommonUtils";

// Utility to decode cookie
const decodeCookie = (cookie) => {
  if (!cookie) return null;
  try {
    const decoded = Buffer.from(cookie, "base64").toString();
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

async function fetchData(authToken, domain) {
  try {
    const [profileResponse, ticketsResponse, categoriesResponse] =
      await Promise.all([
        axios.post(
          `${process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL}api/v1/customer/get-profile`,
          { domain_url: domain },
          { headers: { Authorization: `Bearer ${authToken}` } }
        ),
        axios.post(
          `${process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL}api/v1/support/user/tickets`,
          { domain_url: domain },
          { headers: { Authorization: `Bearer ${authToken}` } }
        ),
        axios.get(
          `${process.env.NEXT_PUBLIC_MODE_WMS_BASE_URL}api/v1/support/categories/subscription`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        ),
      ]);

    return {
      profileData: profileResponse.data.data.profileData || {},
      supportList: ticketsResponse.data.data || [],
      categories: categoriesResponse.data.data || [],
    };
  } catch (err) {
    if (err?.response?.data?.code === 401) {
      return { redirect: "/?logout" };
    }
    return { profileData: {}, supportList: [], categories: [] };
  }
}

export default async function SupportPage({ searchParams }) {
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const domainInfo = getDomain(host);
  const cookieStore = await cookies();
  const uid = cookieStore.get(variable.LOGIN_DETAIL)?.value;
  const param = await searchParams;
  const token = param.token;
  const domain = process.env.DOMAIN || "";

  let authToken = "";
  let profileData = {};
  let supportList = [];
  let categories = [];

  if (!uid && !token) {
    redirect(
      `${process.env.NEXT_PUBLIC_LOGIN_ROUTE}?domain=${domainInfo.domainId}&url=${process.env.NEXT_PUBLIC_BASE_URL}support&action_ref=support&lang=${domainInfo.lang}&utm_source=support`
    );
  }

  if (uid) {
    const decoded = decodeCookie(uid);
    authToken = decoded?.auth_token || "";
  } else if (token) {
    const decoded = decodeCookie(token);
    authToken = decoded?.userData?.auth_token || "";
  }

  const data = await fetchData(authToken, "jagran.com");
  if (data.redirect) {
    redirect(data.redirect);
  }

  profileData = data.profileData;
  supportList = data.supportList;
  categories = data.categories;

  return (
    <ClientSupportPage
      profileData={profileData}
      supportList={supportList}
      categories={categories}
      auth={authToken}
      query={searchParams}
      domainInfo={domainInfo}
    />
  );
}
