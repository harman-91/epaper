const { getCookie } = require("@/component/utility/cookie");
const { default: variable } = require("@/component/utility/variable");
const { default: axios } = require("axios");
function getLoginDetails() {
  const cookie = getCookie(variable.LOGIN_DETAIL);
  if (cookie) {
    try {
      const decode = atob(cookie);
      let val = JSON.parse(decode);
      return {
        user_id: val?.user_id,
        is_new_user: val?.is_new_user,
        registration_with: val?.registration_with,
      };
    } catch (err) {
      console.log("Invalid token", err);
    }
  }
  return null;
}
const datalayerClickEvent=(
  eventNavigation,
  selectCtaText,
  setSectionname,
  selectType,
  setContentTitle,
  setTvcPageCat,
  setStoryId,
  setArticleSubcategory,
  selectInteractionType
)=> {
  const loginDetails = getLoginDetails();

  const eventData = {
    event: eventNavigation,
    uid: `na`,
    usertype: loginDetails != null ? "logged_in" : "guest",
    registration_status:
      loginDetails != null
        ? loginDetails?.is_new_user == false
          ? "existing_user"
          : "new_user"
        : "guest",
    loggeduser_id: loginDetails != null ? loginDetails?.user_id : "guest",
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

  if (setContentTitle != "") {
    eventData["content_title"] = setContentTitle;
  }

  if (setTvcPageCat != "") {
    eventData["tvc_page_cat"] = setTvcPageCat;
  }

  if (setStoryId != "") {
    eventData["storyID"] = setStoryId;
  }

  if (setArticleSubcategory != "") {
    eventData["article_subcategory"] = setArticleSubcategory;
  }
  if (selectInteractionType != "") {
    eventData["interaction_type"] = selectInteractionType;
  }
  if ("dataLayer" in window) dataLayer.push(eventData);
}
const getTopComment = async (article_id) => {
  try {
    if (!article_id) {
      return;
    }
    let url = "https://comments-api.jagran.com/";
    let auth = {
      headers: {
        Authorization: "Bearer " + process.env.NEXT_PUBLIC_COMMENT_TOKEN,
      },
      timeout: 3000,
    };
    const { data } = await axios.get(
      url +
        `comments/get-top-comment-count/${article_id}/${process.env.NEXT_PUBLIC_SITE_TOKEN}`,
      auth
    );
    if (data.code == 200 && data) {
      return data?.data[0] ? data.data[0] : {};
    }
    return {};
  } catch (err) {
    return {};
  }
};
const LoadingStatus = {
  LOADING: "loading",
  SHOW: "SHOW",
  HIDE: "hide",
};

const checkdeviceType = (width = 768) => {
  return typeof window !== "undefined" && window.innerWidth < width;
};

function formatDateToMMDDYYYY(date) {
  try {
    const d = new Date(date);

    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();

    return `${month}/${day}/${year}`;
  } catch (err) {
    return null;
  }
}
const getDiscount = (mrp_price, sell_price) => {
  try {
    return Math.round(((mrp_price - sell_price) / mrp_price) * 100);
  } catch (r) {
    return 0;
  }
};
const generateReturnUrl = (domainInfo) => {
  const currentUrl = new URL(window.location.href);
  const searchParams = currentUrl.searchParams;

  const filteredParams = new URLSearchParams();
  const utmParams = {
    utm_source: null,
    utm_campaign: null,
    utm_medium: null,
  };

  for (const [key, value] of searchParams) {
    if (key.startsWith("utm_")) {
      filteredParams.set(key, value);
      if (
        key === "utm_source" ||
        key === "utm_campaign" ||
        key === "utm_medium"
      ) {
        utmParams[key] = value;
      }
    }
  }

  const basePath = currentUrl.pathname.split("?")[0];
  const baseUrl = domainInfo.url?.replace(/\/$/, "");
  const newUrl = `${baseUrl}${basePath}`;

  try {
    new URL(newUrl);
  } catch (error) {
    console.error("Invalid return URL generated:", error);
    return { url: baseUrl, ...utmParams };
  }

  return { url: newUrl, ...utmParams };
};

const formatDecimal = (numStr) => {
  const num = parseFloat(numStr);

  if (isNaN(num)) return "";

  if (num % 1 === 0) {
    return num.toString();
  } else {
    return num.toFixed(2);
  }
};
const contentDatalayer = ({
  eventName,
  title,
  section,
  subcategory,
  pageCat,
  selectType,
  publishDate,
  updateDate,
  author,
  storyId,
}) => {
  window.dataLayer = window.dataLayer || [];
  const eventData = {
    event: eventName,
    content_title: title,
    section_name: section,
    article_subcategory: subcategory,
    tvc_page_cat: pageCat,
    select_type: selectType,
    tvc_publish_date: publishDate,
    tvc_update_date: updateDate,
    tvc_author: author,
    storyID: storyId,
  };

  if (eventData) {
    dataLayer.push(eventData);
  }
};
const sitetoken = {
  "epaper.jagran.com":
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9eyJpc3MiOiJPbmxpbmUgSldUIEJ1a",
  "epaper.naidunia.com":
    "51cefe562be0353d7aae0e7ae565ad111de2e2b5E3NTMyNTQxNzMsImV4cCI6MTc",
  "epaper.punjabijagran.com":
    "6a208384a26ef3213d970a2d3UiOiJlcGFwZXIucHVuamFiaWphZ3Jhbi5jb20ifQ",
};
function convertToCityList(jsonData) {
  if (!jsonData) {
    return [];
  }

  const cityList = [];

  jsonData.forEach(state => {
    const stateName = state.state_name;

    state.regions.forEach(region => {
      const regionName = region.regions_name;
      const regionCode = region.code;

      region.cities.forEach(city => {
        cityList.push({
          city_name: city.city_name?.toLowerCase(),
          city_name_en: city.city_name,
          city_code: city.code,
          region_name: regionName?.toLowerCase(),
          region_code: regionCode,
          state_name: stateName?.toLowerCase()
        });
      });
    });
  });

  return cityList;
}

module.exports = {
  LoadingStatus,
  getTopComment,
  checkdeviceType,
  formatDateToMMDDYYYY,
  getDiscount,
  generateReturnUrl,
  contentDatalayer,
  datalayerClickEvent,
  sitetoken,
  formatDecimal,
  convertToCityList
};
