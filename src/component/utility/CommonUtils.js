//function for header login button
export function logingbuttonHeaderclick(
  eventNavigation,
  selectCtaText,
  setSectionname,
  selectType,
  pageType
) {
  // const loginDetails = getLoginDetails();
  const eventData = {
    event: eventNavigation,
    uid: `na`,
    // usertype: loginDetails != null ? "logged_in" : "guest",
    // registration_status:
    //   loginDetails != null
    //     ? loginDetails?.is_new_user == false
    //       ? "existing_user"
    //       : "new_user"
    //     : "guest",
    // loggeduser_id: loginDetails != null ? loginDetails?.user_id : "guest",
  };

  if (selectCtaText != "") {
    eventData["cta_text"] = selectCtaText;
  }

  if (setSectionname != "") {
    eventData["section_name"] = setSectionname;
  }

  if (selectType != "") {
    eventData["select_type"] = selectType;
  }
  if (selectType != "") {
    eventData["page_type"] = pageType;
  }

  if ("dataLayer" in window) dataLayer.push(eventData);
}
const naidunia = {
  domain: "epaper.naidunia.com",
  name: "Naidunia",
  domainId: "epaper.naidunia.com",
  nameLang: "Naidunia",
  language: "Hindi",
  lang: "hi",
  apiDomainValue: "naidunia",
  url: "https://epaper.naidunia.com",
  return_url: "http://172.31.41.85:3001/subscription/plan",
};
const jagran = {
  domain: "epaper.jagran.com",
  name: "Jagran",
  domainId: "epaper.jagran.com",
  nameLang: "Jagran",
  language: "Hindi",
  lang: "hi",
  apiDomainValue: "jagran",
  url: "https://epaper.jagran.com",
  return_url: "http://172.31.41.85:3001/subscription/plan",
};
const punjabiJagran = {
  domain: "epaper.punjabijagran.com",
  name: "Punjabi Jagran",
  domainId: "epaper.punjabijagran.com",
  nameLang: "Punjabi Jagran",
  language: "Punjabi",
  lang: "pu",
  apiDomainValue: "punjabijagran",
  url: "https://epaper.punjabijagran.com",
  return_url: "http://172.31.41.85:3001/subscription/plan",
};
export function getDomain(host) {
  const h = {
    "paper.naidunia.com:3000": naidunia,
    "epaper-nu.vercel.app": naidunia,
    "localhost:3000": naidunia,
    localhost: naidunia,
    "172.31.41.85:3001": naidunia,
    "172.31.41.85": naidunia,
    "paper.punjabijagran.com:3000": punjabiJagran,
    "paper.punjabijagran.com": punjabiJagran,
  };
  return h[host];
}

export function genrateurl({ date, cityCode, citySlug, editionSlug }) {
  const url = `/epaper/${date}-${cityCode}-${citySlug}-edition-${citySlug}-1.html`;
  return url;
}
export function genratestateurl({ date, cityCode, citySlug, editionSlug }) {
  const url = `/epaper/edition-${date}-${citySlug}-${cityCode}.html`;
  return url;
}
export const withHeaderProps =
  (pageType) => (getServerSidePropsFn) => async (context) => {
    let apiData = {};
    if (pageType === "CommonLayout") {
    }

    const pageProps = await getServerSidePropsFn(context);

    if (pageProps && typeof pageProps === "object") {
      return {
        ...pageProps,
        props: {
          ...pageProps.props,
          ...apiData,
          pageType,
        },
      };
    }

    return {
      props: {
        ...apiData,
      },
      notFound: true,
    };
  };
export const dateBefore = (type, value) => {
  const date = new Date();
  if (type == "day") {
    date.setDate(date.getDate() - value);
  } else {
    date.setMonth(date.getMonth() - value);
  }
  return date;
};
