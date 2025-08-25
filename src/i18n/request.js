import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";

export default getRequestConfig(async ({ request }) => {
  const headersList = await headers();
  const host = headersList.get("host") || "localhost";
  const domainLocaleMap = {
    "paper.naidunia.com": "hi",
    "epaper.naidunia.com": "hi",
    "epaper.punjabijagran.com": "pu",
    "paper.punjabijagran.com": "pu",
    "epaper.jagran.com": "hi",
    localhost: "en",
  };

  const locale = domainLocaleMap[host.replace(/:\d+$/, "")] || "en";
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return {
    locale,
    messages,
  };
});
